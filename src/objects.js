import * as THREE from 'three'
import * as CONSTS from './constants'

export const addFloor = scene => {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
      CONSTS.FLOOR_WIDTH,
      CONSTS.FLOOR_DEPTH,
      CONSTS.FLOOR_WIDTH / CONSTS.FLOOR_SQ_SIZE,
      CONSTS.FLOOR_DEPTH / CONSTS.FLOOR_SQ_SIZE
    ),
    new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
    })
  )
  scene.add(plane)
  plane.lookAt(new THREE.Vector3(0, 1, 0))

  return plane
}

export const addPillar = scene => {
  const pillar = new THREE.Mesh(
    new THREE.BoxGeometry(
      CONSTS.PILLAR_WIDTH,
      CONSTS.PILLAR_HEIGHT,
      CONSTS.PILLAR_WIDTH
    ),
    new THREE.MeshBasicMaterial({
      color: CONSTS.PILLAR_COLOR
    })
  )

  scene.add(pillar)
  pillar.position.setX((Math.random() - 0.5) * CONSTS.FLOOR_WIDTH)
  pillar.position.setY(CONSTS.PILLAR_HEIGHT / 2)
  pillar.position.setZ(CONSTS.FLOOR_DEPTH / 2)

  return pillar
}

export const remove = (obj, scene) => {
  obj.geometry.dispose()
  obj.material.dispose()
  scene.remove(obj)
}