import makeLogger from '@natfaulk/supersimplelogger'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as Scene from './scene'
import * as Objects from './objects'
import {Pillars} from './pillars'
import * as Keyboard from './keyboard'
import {newBird} from './bird'
import * as Camera from './camera'
import * as Lighting from './lighting'

const lg = makeLogger('App')

const ORBIT_CAM = false

;(async () => {
  lg('Started...')
  const {scene, camera, renderer, stats} = Scene.setup(ORBIT_CAM)
  
  Keyboard.setup()
  
  const floor = Objects.addFloor(scene)
  const bird = await newBird(scene)
  const pillars = new Pillars(scene)
  pillars.add()

  setInterval(() => {
    pillars.add()
  }, 3000)

  Lighting.setup(scene)

  // performs setup and adds custom tick method to camera
  Camera.setup(camera, bird.obj)

  // let prevtime = 0
  const animate = () => {
    // lg(time-prevtime)
    // prevtime = time

    floor.position.z += 0.01
    if (floor.position.z > 0) floor.position.z -= 1
    pillars.tick()

    bird.tick(Keyboard)
    camera.tick()

    requestAnimationFrame(animate)
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
  }
  animate()

})()
