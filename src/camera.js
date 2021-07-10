import * as CONSTS from './constants'
import * as THREE from 'three'

// function to add custom tick method to camera
export const setup = (camera, tofollow) => {
  camera.position.set(CONSTS.CAMERA_POS_X, CONSTS.CAMERA_POS_Y, CONSTS.CAMERA_POS_Z)
  camera.lookAt(new THREE.Vector3(0, 2, 0))

  camera.tick = function() {
    this.position.setX(tofollow.position.x - CONSTS.CAMERA_BIRD_OFFSET_X)
    this.position.setY(tofollow.position.y - CONSTS.CAMERA_BIRD_OFFSET_Y)
  }
}
