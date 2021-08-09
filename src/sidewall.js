import * as THREE from 'three'
import * as CONSTS from './constants'

const PLANE_SIZE = 50

const makeSideWall = scene => {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
    new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    })
  )

  scene.add(plane)

  plane.rotation.y = Math.PI / 2
  plane.position.y = PLANE_SIZE / 2
  return plane
}

export const addSideWalls = scene => {
  const w1 = makeSideWall(scene)
  const w2 = makeSideWall(scene)

  w1.position.x = -CONSTS.FLOOR_WIDTH / 2 - 0.5
  w2.position.x = CONSTS.FLOOR_WIDTH / 2 + 0.5
}
