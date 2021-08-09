import * as CONSTS from './constants'
import {Tree} from './singleTree'
import {randBetween} from './utils'

const TREE_ADD_POINT = -CONSTS.FLOOR_DEPTH

const l_edge = -CONSTS.FLOOR_WIDTH / 2
const r_edge = CONSTS.FLOOR_WIDTH / 2

export class TreeManager {
  constructor(scene) {
    this.scene = scene
    this.trees = []
    this.lastTreeTime = 0

    this.addInitialTrees()
  }

  addInitialTrees() {
    for (let i = -3; i > TREE_ADD_POINT; i -= CONSTS.TREE_SPACING * 2) {
      this.add(i)
      this.add(i, l_edge - CONSTS.FLOOR_OVERHANG, l_edge)
      this.add(i, r_edge, r_edge + CONSTS.FLOOR_OVERHANG)
    }
  }

  reset() {
    this.lastTreeTime = 0

    while (this.trees.length) {
      const removed = this.trees.pop()
      removed.cleanup()
    }

    this.addInitialTrees()
  }

  // assumes xmax > xmin
  add(zposition, xmin, xmax) {
    if (xmin === undefined) xmin = -CONSTS.FLOOR_WIDTH / 2
    if (xmax === undefined) xmax = CONSTS.FLOOR_WIDTH / 2

    if (zposition === undefined) zposition = TREE_ADD_POINT

    const t = new Tree(this.scene)
    this.trees.push(t)

    const xpos = randBetween(xmin, xmax)
    t.setPosition(xpos, zposition)
  }

  // moves trees forward and removes them once they exit the scene
  moveForward(deltaTime, birdSpeed) {
    const toremove = []
    this.trees.forEach((t, i) => {
      t.moveBy(0, birdSpeed * (deltaTime / 1000))

      if (t.position.y > CONSTS.FLOOR_DEPTH) {
        toremove.push(i)
      }
    })

    while (toremove.length) {
      const [removed] = this.trees.splice(toremove.pop(), 1)
      removed.cleanup()
    }
  }

  tick(time, deltaTime, birdSpeed) {
    this.moveForward(deltaTime, birdSpeed)

    let addTree = false
    if (this.trees.length > 0) {
      const lastTreePosition = this.trees[this.trees.length - 1].position.y
      const treeSpacing = TREE_ADD_POINT + CONSTS.TREE_SPACING

      if (lastTreePosition > treeSpacing) {
        addTree = true
      }
    } else {
      addTree = true
    }

    if (addTree) {
      this.add()
      // hacky way to limit when trees added on the sides
      // ~ 1 / 3 of the time will be added on one side, 1/3 the other and 1/3 neither side
      if (Math.random() < 1/3) this.add(undefined, l_edge - CONSTS.FLOOR_OVERHANG, l_edge)
      else if (Math.random() < 0.5) this.add(undefined, r_edge, r_edge + CONSTS.FLOOR_OVERHANG)
      this.lastTreeTime = time
    }
  }
}
