import * as THREE from 'three'
import * as Objects from './objects'
import * as CONSTS from './constants'
import * as Keyboard from './keyboard'
import {clamp} from './utils'

class Bird {
  constructor () {
    // these all need setting - are set in the factory function (newBird)
    /**
     * @type {THREE.Mesh}
     */
    this.obj = null
    /**
     * @type {THREE.BoxHelper} 
     */
    this.bbHelper = null
    /**
     * @type {THREE.Box3} 
     */
    this.bb = null
  }

  tick(deltaTime, shoulderAngle) {
    // do nothing if both keys pressed
    if (Keyboard.up() && !Keyboard.down()) {
      this.obj.position.y += 0.1
      this.obj.rotation.x = THREE.MathUtils.degToRad(20)
    }
    
    else if (Keyboard.down() && !Keyboard.up()) {
      this.obj.position.y -= 0.1
      this.obj.rotation.x = THREE.MathUtils.degToRad(-20)
    }

    else {
      this.obj.rotation.x = 0
    }

    shoulderAngle = clamp(shoulderAngle, -0.3, 0.3)
    const xspeed = (shoulderAngle / 0.3) * CONSTS.BIRD_MAX_SPEED_X * (deltaTime / 1000)
    this.obj.position.x += xspeed
    this.obj.rotation.z = -2*shoulderAngle
    
    // Update Bounding Box for collisions
    this.bbHelper.update()
    // seems to be a bug in the three js library where the bounding sphere
    // is updated instead of the bounding box, so call it manually
    this.bbHelper.geometry.computeBoundingBox()
    this.bb.setFromObject(this.bbHelper)
  }
}

// newBird is a factory function to create a new bird class.
// A constructor cannot be async, so need to add the object model immediately
// after creation. There is no checking to make sure that the obj exists
// so one should always use the factory function (hence the class is unexported)
export const newBird = async scene => {
  const bird = new Bird()

  bird.obj = await Objects.addBird(scene)
  bird.bbHelper = new THREE.BoxHelper(bird.obj, CONSTS.BOUNDING_BOX_COLOR)
  scene.add(bird.bbHelper)
  bird.bbHelper.visible = CONSTS.SHOW_BOUNDING_BOXES
  bird.bb = new THREE.Box3()
  bird.bb.setFromObject(bird.bbHelper)

  return bird
}
