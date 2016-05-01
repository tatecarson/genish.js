/* gen.tests.js
 *
 * This file is for testing the functionality of the gen.js library.
 *
 * To run: mocha gen.tests.js
 *
 * ... after installing all necessary dependencies by running npm install in the
 * top level of the genish.js repo.
 *
 */


'use strict'

let assert = require('assert'),
    genlib = require( '../dist/index.js' ), 
    abs = genlib.abs,
    gen = genlib.gen,
    mul = genlib.mul,
    add = genlib.add,
    sub = genlib.sub,
    div = genlib.div,
    param = genlib.param,
    accum = genlib.accum,
    sin   = genlib.sin,
    phasor= genlib.phasor,
    data  = genlib.data,
    peek  = genlib.peek,
    cycle = genlib.cycle,
    history = genlib.history,
    delta   = genlib.delta,
    round   = genlib.round,
    floor   = genlib.floor,
    ceil    = genlib.ceil,
    max     = genlib.max,
    min     = genlib.min,
    sign    = genlib.sign,
    dcblock = genlib.dcblock,
    memo    = genlib.memo,
    wrap    = genlib.wrap

//gen.debug = true

describe( 'gen', ()=> {
  it( 'should get back two numbers when fetching the arguments from an add ugen', ()=> {
    let answer = [5,3],
        graph  = add(5,3),
        result = gen.getInputs( graph )

    assert.deepEqual( result, answer )
  })
  it( 'should generate unique ids', ()=> {
    let answer = gen.getUID(),
        result = gen.getUID()

    assert.notEqual( result, answer )
  })
})

describe( 'monops', ()=> {
  it( 'should generate the absolute value of -.5 as .5', ()=> {
    let answer = .5,
        graph = abs( -.5 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })
  
  it( 'should round .75 to 1', ()=> {
    let answer = 1,
        graph = round( .75 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should floor .75 to 0', ()=> {
    let answer = 0,
        graph = floor( .75 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should ceil .25 to 1', ()=> {
    let answer = 1,
        graph = ceil( .25 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should return -1 for sign(-1000)', ()=> {
    let answer = -1,
        graph = sign( -1000 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })
  it( 'should return 1 for sign(1000)', ()=> {
    let answer = 1,
        graph = sign( 1000 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })
  it( 'should generate a value of 0 for sin(0)', ()=> {
    let answer = 0,
        graph = sin( 0 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should generate a value of 1 for sin( PI/2 )', ()=> {
    let answer = 1,
        graph = sin( Math.PI * .5 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })
})

describe( 'binops', ()=> {
  it( 'should add 4 and 7 to get 11', ()=> {
    let answer = 11,
        graph = add( 4,7 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should sub 4 and 7 to get -3', ()=> {
    let answer = -3,
        graph = sub( 4,7 ),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should multiply 4 and 7 to get 28', ()=> {
    let answer = 28,
      graph = mul( 4,7 ),
      out = gen.createCallback( graph ),
      result = out()

    assert.equal( result, answer )
  })

  it( 'should divide 49 and 7 to get 7', ()=> {
    let answer = 7,
      graph = div( 49,7 ),
      out = gen.createCallback( graph ),
      result = out()

    assert.equal( result, answer )
  })
  
  it( 'should return 4 for max(2,4)', ()=> {
    let answer = 4,
        graph = max(2,4),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should return 2 for min(2,4)', ()=> {
    let answer = 2,
        graph = min(2,4),
        out = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })


})

describe( 'params', ()=> {
  it( 'should return the first argument of 42', ()=> {
    let answer = 42,
        graph = param(),
        out   = gen.createCallback( graph ),
        result = out( 42 )
    
    assert.equal( result, answer )
  })
})

describe( 'memo', ()=> {
  it( 'should store a value after calculating, and subsequently return calculated value', ()=> {
    let answer = 26,
        m = memo( add( 5, 8 ) ),
        graph = add( m, m ),
        out   = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })
})

describe( 'accum', ()=>{
  it( 'should ramp to .5 with an increment of .1 after five executions', ()=> {
    let answer = .5,
        graph  = accum(.1),
        out    = gen.createCallback( graph ),
        result = 0
    
    for( let i = 0; i < 4; i++ ) out()
    
    result = out()
    
    assert.equal( result, answer )
  })

  //it( 'should return to its min value of 0 on the 10th execution with an increment of .1', ()=> {
  //  let answer = 0,
  //      graph  = accum(.1),
  //      out    = gen.createCallback( graph ),
  //      result = 0
    
  //  for( let i = 0; i < 9; i++ ) out()

  //  result = out()
  //  assert.equal( result, answer )
  //})

  it( 'should return to its min value of 0 when the inputs[1] = true', ()=> {
    let answer = .0,
        graph  = accum( .1, param() ),
        out    = gen.createCallback( graph ),
        result = 0

    out(); out(); out();

    result = out( 1 )
    
    assert.equal( result, answer )

  })
})

describe( 'wrap', () => {
  it( 'should not let an accum with a max of 1000 travel past 1', ()=> {
    let max = 1,
        storage = [],
        acc = accum( .5, 0, 0, 100 ),
        graph = wrap( acc, 0, max ),
        out = gen.createCallback( graph ),
        result

    for( let i = 0; i < 20; i++ ) storage[ i ] = out()

    result = Math.max.apply( null, storage )

    assert( result < max )

  })
})

describe( 'phasor', ()=>{
  it( 'should ramp to .5 with an frequency of 4410 after five executions', ()=> {
    let answer = .5,
        graph  = phasor( 4410 ),
        out    = gen.createCallback( graph ),
        result = 0
    
    for( let i = 0; i < 4; i++ ) out()
    
    result = out()
    
    assert.equal( result, answer )
  })
})

describe( 'data + peek', ()=>{
  it( 'should return the value of index data[2] (49) when requesting it via peek', ()=> {
    let answer = 49,
        d = data( [0,0,49] ),
        p = peek( d, 2, { mode:'samples' }),
        out = gen.createCallback( p ),
        result
    
    result = out()
    
    assert.equal( result, answer )
  })

  it( 'should return the value of 49 when indexing uisng phase w/ peek', ()=> {
    let answer = 49,
        d = data( 512 ),
        p = peek( d, .00390625, { mode:'phase', interp:'none' } ), //.00390625 is phase for index[2] if 512 data length
        out = gen.createCallback( p ),
        result
    
    d[2] = 49

    result = out()
    
    assert.equal( result, answer )
  })
})

describe( 'cycle', ()=> {
  it( 'should be at 0 after four outputs at 11025 hz', ()=> {
    let answer = 0,
        c = cycle( 11025 ),
        out = gen.createCallback( c ),
        result = 0

    for( let i = 0; i < 4; i++ ) result = out()
    
    assert.equal( result, answer )
  })

  it( 'should generate values in the range {-1,1} over 2000 samples', ()=> {
    let storage = [],
        c = cycle( 440 ),
        out = gen.createCallback( c ),
        outputMin, outputMax

    for( let i = 0; i < 2000; i++ ) storage[i] = out()
    
    outputMin = Math.min.apply( null, storage )
    outputMax = Math.max.apply( null, storage )
    
    //console.log( '  ', outputMin, outputMax )
    assert( (outputMin <= -.99 && outputMin >= -1.0001) && (outputMax >= .99 && outputMax <= 1.0001) )
  }) 
})

describe( 'history', ()=> {
  it( 'should return 7 after recording an accum with an increment of 1 + history for three samples', ()=> {
    let answer = 7,
        h1 = history(),
        h1input = h1.record( accum( add(1, h1 ), 0, 0, 10 ) ), // incr, reset, min, max
        out = gen.createCallback( h1input ),
        result = 0
    
    // 1 + 0 = 1, 1 + 1 = 2, 1 + 2 = 3
    for( let i = 0; i < 3; i++ ) result = out()

    assert.equal( result, answer )
  })
})

describe( 'delta', ()=> {
  it( 'should return .1 when tracking accum(.1) for first 10 samples, -.9 for 11th (after accum wraps)' , ()=> {
    let answer = [.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,-.9],
        d1 = delta( accum(.1) ),
        out = gen.createCallback( d1 ), 
        result = []

    for( let i = 0; i < 11; i++ ) result.push( parseFloat( out().toFixed( 6 ) ) )

    assert.deepEqual( result, answer )
  })
})

//describe( 'rate', ()=> {
//  it( 'should cycle 4 times over  given a phasor with a frequency of 1 and a scaling value of .25' , ()=> {
//    let answer = [.1,.1,.1,.1,.1,.1,.1,.1,.1,.1,-.9],
//    d1 = delta( accum(.1) ),
//    out = gen.createCallback( d1 ), 
//    result = []

//    for( let i = 0; i < 11; i++ ) result.push( parseFloat( out().toFixed( 6 ) ) )

//    assert.deepEqual( result, answer )
//  })
//})

describe( 'dcblock', ()=>{
  it( 'should filter offset of .5 to make signal range {-1,1} after >20000 samples', ()=> {
    let storage = [],
        graph  = dcblock( add( .5, cycle( 440 ) ) ),
        out    = gen.createCallback( graph ),
        outputMax, outputMin

    // let filter run for a bit
    for( let i = 0; i < 20000; i++ ) out()

    for( let i = 0; i < 1000; i++ ) storage[ i ] = out()
    
    outputMax = Math.max.apply( null, storage )
    outputMin = Math.min.apply( null, storage )

    assert( outputMax <=1.1 && outputMin >= -1.1 )
  })
})

describe( 'complex', ()=> {
  it( 'should add 5 and 2, multiply that by -7, and calculate the absolute value (49)', ()=> {
    let answer = 49,
        graph  = abs( mul( add(5,2), -7 ) ),
        out    = gen.createCallback( graph ),
        result = out()

    assert.equal( result, answer )
  })

  it( 'should create a sine wave', ()=> {
    let frequency = param(),
        phasor    = accum( mul( frequency, 1/44100 ) ),
        oscgraph  = sin( mul( phasor, Math.PI * 2 ) ), 
        osc       = gen.createCallback( oscgraph ),
        answer = [
          0.3353173459027643,
          0.6318084552474613,
          0.8551427630053461,
          0.9794604955306667,
          0.9903669614948382,
          0.8865993063730001,
          0.6801727377709197,
          0.3949892902309387,
          0.06407021998071323,
          -0.27426751067492994
       ],
       result = []
    
    for( let i = 0; i < 10; i++ ) result[i] = osc(2400) 
    
    assert.deepEqual( result, answer )
  })
})
