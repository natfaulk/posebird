import makeLogger from '@natfaulk/supersimplelogger'

import * as THREE from 'three'
import * as CONSTS from './constants'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

const lg = makeLogger('App')

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

export const addPillar = (scene, zposition=null) => {
  if (zposition === null) {
    zposition = -CONSTS.FLOOR_DEPTH / 2
  }
  
  const pillar = new THREE.Mesh(
    new THREE.BoxGeometry(
      CONSTS.PILLAR_WIDTH,
      CONSTS.PILLAR_HEIGHT,
      CONSTS.PILLAR_WIDTH
    ),
    new THREE.MeshPhongMaterial({
      color: CONSTS.PILLAR_COLOR
    })
  )

  scene.add(pillar)
  pillar.position.set((Math.random() - 0.5) * CONSTS.FLOOR_WIDTH,
    CONSTS.PILLAR_HEIGHT / 2,
    zposition
  )

  return pillar
}

export const addVisibleBB = (scene, bb) => {
  const x = (bb.max.x + bb.min.x) / 2
  const y = (bb.max.y + bb.min.y) / 2
  const z = (bb.max.z + bb.min.z) / 2
  
  const w = bb.max.x - bb.min.x
  const h = bb.max.y - bb.min.y
  const d = bb.max.z - bb.min.z

  const bbMesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    })
  )
  
  scene.add(bbMesh)
  bbMesh.position.set(x, y, z)

  return bbMesh
}


export const addBird = async scene => {
  // const bird = new THREE.Mesh(
  //   new THREE.BoxGeometry(
  //     CONSTS.BIRD_WIDTH,
  //     CONSTS.BIRD_HEIGHT,
  //     CONSTS.BIRD_DEPTH
  //   ),
  //   new THREE.MeshBasicMaterial({
  //     color: CONSTS.BIRD_COLOR
  //   })
  // )

  const bird = await loadGltf('public/models/bird.glb')

  scene.add(bird)
  bird.position.set(
    CONSTS.BIRD_INIT_POS_X,
    CONSTS.BIRD_INIT_POS_Y,
    CONSTS.BIRD_INIT_POS_Z
  )

  return bird
}

export const remove = (obj, scene) => {
  obj.geometry.dispose()
  obj.material.dispose()
  scene.remove(obj)
}

const loadGltf = path => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(path, gltf => {
      resolve(gltf.scene)
    }, undefined,  error => {
      lg('GLTF model failed to load...', error)
      reject(error)
    })
  })
}
