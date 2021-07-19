import * as THREE from 'three'
import * as Objects from './objects'
import * as CONSTS from './constants'

class Bird {
  constructor () {
    this.obj = null
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

    if (CONSTS.SHOW_BOUNDING_BOXES) this.bbHelper.update()
  }
}

// newBird is a factory function to create a new bird class.
// A constructor cannot be async, so need to add the object model immediately
// after creation. There is no checking to make sure that the obj exists
// so one should always use the factory function (hence the class is unexported)
export const newBird = async scene => {
  const bird = new Bird(scene)

  bird.obj = await Objects.addBird(scene)

  if (CONSTS.SHOW_BOUNDING_BOXES) {
    const bbHelper = new THREE.BoxHelper(bird.obj, 0xff0000)
    scene.add(bbHelper)
    bird.bbHelper = bbHelper
    // const birdBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    
    // birdBB.setFromObject(bird.obj)
    // bird.bbMesh = Objects.addVisibleBB(scene, birdBB)
  }
  
  return bird
}
