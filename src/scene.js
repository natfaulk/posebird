import makeLogger from '@natfaulk/supersimplelogger'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const lg = makeLogger('Scene')

const CAMERA_FOV = 75
const CAMERA_NEAR = 0.1
const CAMERA_FAR = 1000

const CLEAR_COLOR = 0xb8c6db

export const setup = (orbitControls = false) => {
  lg('Began setup')

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR)
  const renderer = new THREE.WebGLRenderer()
  const stats = Stats()
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(CLEAR_COLOR)
  
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
