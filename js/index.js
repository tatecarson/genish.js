'use strict'

let library = {
  export( destination ) {
    Object.assign( destination, library )
    destination.ssd = library.history // history is window object property, so use ssd as alias
  },

  gen:    require( './gen.js' ),
  
  abs:    require('./abs.js'),
  round:  require('./round.js'),
  param:  require('./param.js'),
  add:    require('./add.js'),
  sub:    require('./sub.js'),
  mul:    require('./mul.js'),
  div:    require('./div.js'),
  accum:  require('./accum.js'),
  sin:    require('./sin.js'),
  phasor: require('./phasor.js'),
  data:   require('./data.js'),
  peek:   require('./peek.js'),
  cycle:  require('./cycle.js'),
  history:require('./history.js'),
  delta:  require('./delta.js'),
}

library.gen.lib = library

module.exports = library
