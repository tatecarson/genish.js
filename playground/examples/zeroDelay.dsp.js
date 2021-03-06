/* zero-delay (implicit) two-pole filter

based off Csound code by Steven Yi: https://github.com/kunstmusik/libsyi/blob/master/zdf.udo
in turn based off code by Will Pirkle: http://www.willpirkle.com/app-notes/
*/

d = data( './resources/audiofiles/amen.wav' ).then( ()=> {
  'use jsdsp'

  iT = 1 / gen.samplerate
  z1 = ssd(0)
  z2 = ssd(0)
  
  freq = param( 'frequency', 550 )
  mode = param( 'mode', 0 )
  Q    = param( 'Q', .5 )
  
  input = peek( d, accum( 1, 0, { min: 0, max:d.dim }), { mode:'samples' } )

  kwd = Math.PI * 2 * freq
  kwa = memo( (2/iT) * tan( kwd * (iT/2) ) )
  kG  = memo( kwa * (iT/2) )
  kR  = memo( 1 / ( 2 * Q ) )

  hp = memo( 
    (( input - ( ( 2 * kR) + kG ) * z1.out ) - z2.out ) /
    ( 1 + ( 2 * kR * kG ) + ( kG * kG ))
  )
  
  bp = memo( ( kG * hp ) + z1.out )
  lp = memo( ( kG * bp ) + z2.out )
  notch = memo( input - ( ( 2 * kR) * bp ) )

  z1.in( mul( kG * hp ) + bp )
  z2.in( mul( kG * bp ) + lp )
  
  outSignal = selector( mode, lp, hp, bp, notch )
  
  cb = play( outSignal, true )

  gui = new dat.GUI({ width: 400 }) 
  gui.add( cb, 'frequency', 80, 15000 )
  gui.add( cb, 'Q', .5, 20 )
  gui.add( cb, 'mode', { LowPass:0, HighPass:1, BandPass:2, Notch:3 } )
})

