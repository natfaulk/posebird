import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'
import * as THREE from 'three'

const lg = makeLogger('Pillars')

// The Pillar class functions as a wrapper to hold both the pillar
// threejs object and its bounding box
class Pillar {
  constructor(scene, p) {
    this.scene = scene
    this.obj = p
    this.bbHelper = new THREE.BoxHelper(p, CONSTS.BOUNDING_BOX_COLOR)
    scene.add(this.bbHelper)
    this.bbHelper.visible = CONSTS.SHOW_BOUNDING_BOXES

    this.bb = new THREE.Box3()
    this.bb.setFromObject(this.bbHelper)
  }

  tick() {
    this.bbHelper.update()
    // seems to be a bug in the three js library where the bounding sphere
    // is updated instead of the bounding box, so call it manually
    this.bbHelper.geometry.computeBoundingBox()
    this.bb.setFromObject(this.bbHelper)
  }

  cleanup() {
    this.scene.remove(this.bbHelper)
    Objects.remove(this.obj, this.scene)
    lg('Pillar removed')
  }
}

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
    const newPillar = new Pillar(this.scene, p)
    this.pillars.push(newPillar)
  }

  // moves pillars forward and removes them once they exit the scene
  moveForward(deltaTime) {
    // indices will be added to toremove in ascending order as foreach loops through
    // therefore they need to be removed from the list in reverse order so as not to change the indexes
    // of indexes to be removed after
    const toremove = []
    this.pillars.forEach((p, i) => {
      p.obj.position.z += CONSTS.PILLAR_SPEED * (deltaTime / 1000)
      
      if (p.obj.position.z > CONSTS.FLOOR_DEPTH / 2) {
        toremove.push(i)
      }

      p.tick()
    })

    while (toremove.length) {
      const [removed] = this.pillars.splice(toremove.pop(), 1)
      removed.cleanup()
    }
  }

  tick(time, deltaTime) {
    this.moveForward(deltaTime)

    let addPillar = false
    if (this.pillars.length > 0) {
      const lastPillarPosition = this.pillars[this.pillars.length - 1].obj.position.z
      const pillarSpacing = (-CONSTS.FLOOR_DEPTH / 2) + CONSTS.PILLAR_SPACING 

      if (lastPillarPosition > pillarSpacing) {
        addPillar = true
      }
    } else {
      addPillar = true
    }

    if (addPillar) {
      this.add()
      this.lastPillarTime = time
    }
  }
}
