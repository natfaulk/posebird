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
  pillar.position.set((Math.random() - 0.5) * CONSTS.FLOOR_WIDTH,
    CONSTS.PILLAR_HEIGHT / 2,
    -CONSTS.FLOOR_DEPTH / 2
  )

  return pillar
}

export const addBird = scene => {
  const bird = new THREE.Mesh(
    new THREE.BoxGeometry(
      CONSTS.BIRD_WIDTH,
      CONSTS.BIRD_HEIGHT,
      CONSTS.BIRD_DEPTH
    ),
    new THREE.MeshBasicMaterial({
      color: CONSTS.BIRD_COLOR
    })
  )

  scene.add(bird)
  bird.position.set(
    CONSTS.CAMERA_POS_X,
    CONSTS.CAMERA_POS_Y - 0.75,
    CONSTS.CAMERA_POS_Z - 2
  )

  return bird
}

export const remove = (obj, scene) => {
  obj.geometry.dispose()
  obj.material.dispose()
  scene.remove(obj)
}