import * as Objects from './objects'

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
  }
}

// newBird is a factory function to create a new bird class.
// A constructor cannot be async, so need to add the object model immediately
// after creation. There is no checking to make sure that the obj exists
// so one should always use the factory function (hence the class is unexported)
export const newBird = async scene => {
  const bird = new Bird(scene)

  bird.obj = await Objects.addBird(scene)
  return bird
}
