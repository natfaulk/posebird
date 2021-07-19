import * as THREE from 'three'
import * as Objects from './objects'
import * as CONSTS from './constants'

class Bird {
  constructor () {
    // these all need setting - are set in the factory function (newBird)
    this.obj = null
    this.bbHelper = null
    this.bb = null
  }

  tick(keyboard) {
    if (keyboard.up()) {
      this.obj.position.y += 0.1
    }
    
    if (keyboard.down()) {
      this.obj.position.y -= 0.1
    }

    if (keyboard.left()) {
      this.obj.position.x -= 0.1
    }

    if (keyboard.right()) {
      this.obj.position.x += 0.1
    }

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
