'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'accum',

  gen() {
    let code,
        inputs = gen.getInputs( this ),
        genName = 'gen.' + this.name,
        functionBody = this.callback( genName, inputs[0], inputs[1] )

    gen.closures.add({ [ this.name ]: this }) 

    gen.memo[ this.name ] = this.name + '_value'
    
    return [ this.name + '_value', functionBody ]
  },

  callback( _name, _incr, _reset ) {
    let diff = this.max - this.min,
        out = '',
        wrap
    
    /* three different methods of wrapping, third is most expensive:
     *
     * 1: range {0,1}: y = x - (x | 0)
     * 2: log2(this.max) == integer: y = x & (this.max - 1)
     * 3: all others: if( x >= this.max ) y = this.max -x
     *
     */

    // must check for reset before storing value for output
    if( !(typeof this.inputs[1] === 'number' && this.inputs[1] < 1) ) { 
      out += '  if( '+_reset+'>=1 ) '+_name+'.value = ' + this.min + '\n'
    }

    out += `  let ${this.name}_value = ${_name}.value;\n  ${_name}.value += ${_incr}\n` // store output value before accumulating  
    
    if( this.min === 0 && this.max === 1 ) { 
      wrap =  `  ${_name}.value = ${_name}.value - (${_name}.value | 0)\n\n`
    } else if( this.min === 0 && ( Math.log2( this.max ) | 0 ) === Math.log2( this.max ) ) {
      wrap =  `  ${_name}.value = ${_name}.value & (${this.max} - 1)\n\n`
    } else {
      wrap = `  if( ${_name}.value >= ${this.max} ) ${_name}.value -= ${diff}\n\n`
    }

    out = out + wrap

    return out
  }
}

module.exports = ( incr, reset=0, properties ) => {
  let ugen = Object.create( proto ),
      defaults = { min:0, max:1 }

  if( properties !== undefined ) Object.assign( defaults, properties )

  if( defaults.initialValue === undefined ) defaults.initialValue = defaults.min

  Object.assign( ugen, { 
    min: defaults.min, 
    max: defaults.max,
    value:  defaults.initialValue,
    uid:    gen.getUID(),
    inputs: [ incr, reset ],
  },
  defaults )

  ugen.name = `${ugen.basename}${ugen.uid}`

  return ugen
}
