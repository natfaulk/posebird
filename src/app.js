import makeLogger from '@natfaulk/supersimplelogger'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as Keyboard from './keyboard'
import {UI} from './ui'
import {newWebcamPoseWrapper} from './webcamPoseWrapper'
import {newGame} from './game'
import {setVersion} from './version'

const lg = makeLogger('App')

;(async () => {
  lg('Started...')
  setVersion()

  // just hide menu for now...
  const ui = new UI
  ui.hideMenu()
  
  const webcamPoseWrapper = await newWebcamPoseWrapper(ui.stats)
  Keyboard.setup()
  
  const game = await newGame()
  ui.hideloadingScreen()
  lg('Setup done')
    
  let prevtime = 0
  const animate = time => {
    game.stats.begin()
    const deltaTime = time-prevtime
    prevtime = time
    
    // if delta time nan then do nothing and go to next draw cycle
    if (isNaN(deltaTime)) {
      requestAnimationFrame(animate)
      return
    }
    
    const data = {
      time,
      deltaTime,
      shoulderAngle: webcamPoseWrapper.getShoulderAngle(),
      armAngle: webcamPoseWrapper.getArmAngle()
    }

    game.tick(data)
    
    ui.stats.setStat('score', game.score)
    ui.stats.setStat('FPS', 1000/(deltaTime))

    // ideally this should be offloaded to a web worker
    webcamPoseWrapper.update()
    
    ui.update()
    
    game.render()
    game.stats.end()
    
    requestAnimationFrame(animate)
  }
  animate()

})()
