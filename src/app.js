import makeLogger from '@natfaulk/supersimplelogger'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as Scene from './scene'
import * as Objects from './objects'
import {Pillars} from './pillars'
import * as Keyboard from './keyboard'
import {newBird} from './bird'
import * as Camera from './camera'
import * as Lighting from './lighting'
import * as CONSTS from './constants'
import {Collisions} from './collisions'

const lg = makeLogger('App')

const ORBIT_CAM = false

;(async () => {
  lg('Started...')
  const {scene, camera, renderer, stats} = Scene.setup(ORBIT_CAM)
  
  Keyboard.setup()
  
  const floor = Objects.addFloor(scene)
  const bird = await newBird(scene)
  const pillars = new Pillars(scene)
  const collisions = new Collisions(bird, pillars)
  
  Lighting.setup(scene)

  // performs setup and adds custom tick method to camera
  Camera.setup(camera, bird.obj)

  let prevtime = 0
  const animate = time => {
    const deltaTime = time-prevtime
    prevtime = time
    // lg(`Time: ${time}, Delta time: ${deltaTime}`)
    if (isNaN(deltaTime)) {
      requestAnimationFrame(animate)
      return
    }

    
    floor.position.z += CONSTS.PILLAR_SPEED * (deltaTime / 1000)
    while (floor.position.z > 0) floor.position.z -= 1
    pillars.tick(time, deltaTime)

    bird.tick(Keyboard)
    camera.tick()

    if (collisions.tick()) lg('Crashed!!')

    requestAnimationFrame(animate)
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
  }
  animate()

})()
