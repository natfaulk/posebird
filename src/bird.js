import * as Objects from './objects'

export class Bird {
  constructor (scene) {
    this.obj = Objects.addBird(scene) 
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
