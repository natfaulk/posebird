import makeLogger from '@natfaulk/supersimplelogger'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as Scene from './scene'
import * as Objects from './objects'
import {Pillars} from './pillars'

const lg = makeLogger('App')

const ORBIT_CAM = true

;(() => {
  lg('Started...')
  const {scene, camera, renderer, stats} = Scene.setup(ORBIT_CAM)
  
  const floor  = Objects.addFloor(scene)
  const pillars = new Pillars(scene)
  pillars.add()

  setInterval(() => {
    pillars.add()
  }, 3000)

  camera.position.set(0, 2, -8)
  camera.lookAt(new THREE.Vector3(0, 2, 0))
  
  // let prevtime = 0
  const animate = () => {
    // lg(time-prevtime)
    // prevtime = time

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    floor.position.z -= 0.01
    if (floor.position.z < 1) floor.position.z += 1
    pillars.tick()

    requestAnimationFrame(animate)
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
  }
  animate()

})()
