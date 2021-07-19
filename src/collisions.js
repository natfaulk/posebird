export class Collisions {
  constructor(bird, pillars) {
    this.bird = bird
    this.pillars = pillars.pillars
  }

  tick() {
    let collision = false

    this.pillars.forEach(p => {
      if (p.bb.intersectsBox(this.bird.bb)) {
        collision = true
        p.obj.material.color.setHex(0x00FF00)
      }
    })

    return collision
  }
}
