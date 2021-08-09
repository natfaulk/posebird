export class Collisions {
  constructor(bird, trees) {
    this.bird = bird
    this.trees = trees.trees
  }

  tick() {
    let collision = false

    if (this.bird.obj.position.y < 0.1) return true

    this.trees.forEach(t => {
      if (t.checkCollision(this.bird.bb)) {
        collision = true
      }
    })

    return collision
  }
}
