import * as THREE from 'three'

export const setup = scene => {
  const color = 0xFFFFFF
  const ambientIntensity = 0.1
  const directionalIntensity = 1


  const ambientLight = new THREE.AmbientLight(color, ambientIntensity)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(color, directionalIntensity)
  directionalLight.position.set(5, 10, 10)
  directionalLight.target.position.set(0, 0, 0)
  scene.add(directionalLight)
  // target needs adding to scene - see three js docs
  scene.add(directionalLight.target)
}
