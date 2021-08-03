import makeLogger from '@natfaulk/supersimplelogger'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as CONSTS from './constants'

const lg = makeLogger('Scene')

export const setup = (orbitControls = false) => {
  lg('Began setup')

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(CONSTS.CAMERA_FOV, window.innerWidth / window.innerHeight, CONSTS.CAMERA_NEAR, CONSTS.CAMERA_FAR)
  const renderer = new THREE.WebGLRenderer()
  const stats = Stats()
  
  scene.fog = new THREE.Fog(CONSTS.CAMERA_CLEAR_COLOR, 14, 16)
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(CONSTS.CAMERA_CLEAR_COLOR)
  
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)

  if (orbitControls) new OrbitControls(camera, renderer.domElement)
  
  // Handle window resize
  window.addEventListener('resize', makeResize(renderer, camera), {
    passive: true
  })

  return {scene, camera, renderer, stats}
}

const makeResize = (renderer, camera) => {
  return () => {
    renderer.height = window.innerHeight
    renderer.width = window.innerWidth
    renderer.setSize(renderer.width, renderer.height)
    camera.aspect = renderer.width / renderer.height
    camera.updateProjectionMatrix()
  }
}
