export class Collisions {
  constructor(bird, trees) {
    this.bird = bird
    this.trees = trees.trees
  }

  tick() {
    let collision = false

    this.trees.forEach(t => {
      if (t.checkCollision(this.bird.bb)) {
        collision = true
        t.objs[0].material.color.setHex(0x00FF00)
      }
    })

    return collision
  }
}
