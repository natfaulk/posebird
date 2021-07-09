import makeLogger from '@natfaulk/supersimplelogger'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as Scene from './scene'
import * as Objects from './objects'
import {Pillars} from './pillars'
import {CAMERA_POS_X, CAMERA_POS_Y, CAMERA_POS_Z} from './constants'
import * as Keyboard from './keyboard'
import {newBird} from './bird'

const lg = makeLogger('App')

const ORBIT_CAM = true

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

  camera.position.set(CAMERA_POS_X, CAMERA_POS_Y, CAMERA_POS_Z)
  camera.lookAt(new THREE.Vector3(0, 2, 0))

  // let prevtime = 0
  const animate = () => {
    // lg(time-prevtime)
    // prevtime = time

    floor.position.z += 0.01
    if (floor.position.z > 0) floor.position.z -= 1
    pillars.tick()

    bird.tick(Keyboard)

    requestAnimationFrame(animate)
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
  }
  animate()

})()
