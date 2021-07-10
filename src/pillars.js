import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'

const lg = makeLogger('Pillars')

export class Pillars {
  constructor(scene) {
    this.scene = scene
    this.pillars = []
    this.lastPillarTime = 0

    for (let i = 0; i < CONSTS.FLOOR_DEPTH / 2; i += CONSTS.PILLAR_SPACING) {
      this.add(-i)
    }
  }

  add(zposition=null) {
    const p = Objects.addPillar(this.scene, zposition)
    this.pillars.push(p)
  }

  // moves pillars forward and removes them once they exit the scene
  moveForward(deltaTime) {
    // indices will be added to toremove in ascending order as foreach loops through
    // therefore they need to be removed from the list in reverse order so as not to change the indexes
    // of indexes to be removed after
    const toremove = []
    this.pillars.forEach((p, i) => {
      p.position.z += CONSTS.PILLAR_SPEED * (deltaTime / 1000)

      if (p.position.z > CONSTS.FLOOR_DEPTH / 2) {
        toremove.push(i)
      }
    })

    while (toremove.length) {
      const [removed] = this.pillars.splice(toremove.pop(), 1)
      Objects.remove(removed, this.scene)
      lg('Pillar removed')
    }
  }

  tick(time, deltaTime) {
    this.moveForward(deltaTime)

    if (this.pillars.length > 0) {
      const lastPillarPosition = this.pillars[this.pillars.length - 1].position.z
      const pillarSpacing = (-CONSTS.FLOOR_DEPTH / 2) + CONSTS.PILLAR_SPACING 

      if (lastPillarPosition > pillarSpacing) {
        this.add()
        this.lastPillarTime = time
      }
    }
  }
}
