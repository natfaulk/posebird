import makeLogger from '@natfaulk/supersimplelogger'

import * as THREE from 'three'
import * as CONSTS from './constants'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

const lg = makeLogger('Objects')

const addTreeBox = (w, h, d, col) => {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshPhongMaterial({
      color: col
    })
  )

  return box
}

export const addTreeWoodBox = (w, h, d) => {
  return addTreeBox(w, h, d, CONSTS.PILLAR_COLOR)
}

export const addTreeLeafBox = (w, h, d) => {
  return addTreeBox(w, h, d, CONSTS.LEAF_COLOR)
}

export const addBird = async scene => {
  const bird = await loadGltf('public/models/bird3.glb')

  scene.add(bird)
  bird.position.set(
    CONSTS.BIRD_INIT_POS_X,
    CONSTS.BIRD_INIT_POS_Y,
    CONSTS.BIRD_INIT_POS_Z
  )

  return bird
}

export const remove = (obj, scene) => {
  // group objects don't have geometry or material
  if (obj.geometry !== undefined) obj.geometry.dispose()
  if (obj.material !== undefined) obj.material.dispose()
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
