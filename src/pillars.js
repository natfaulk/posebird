import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'

const lg = makeLogger('Pillars')

export class Pillars {
  constructor(scene) {
    this.scene = scene
    this.pillars = []
  }

  add() {
    const p = Objects.addPillar(this.scene)
    this.pillars.push(p)
  }

  tick() {
    // indices will be added to toremove in ascending order as foreach loops through
    // therefore they need to be removed from the list in reverse order so as not to change the indexes
    // of indexes to be removed after
    const toremove = []
    this.pillars.forEach((p, i) => {
      p.position.z -= 0.01

      if (p.position.z < -CONSTS.FLOOR_DEPTH / 2) {
        toremove.push(i)
      }
    })

    while (toremove.length) {
      const [removed] = this.pillars.splice(toremove.pop(), 1)
      Objects.remove(removed, this.scene)
      lg('Pillar removed')
    }
  }
}
