import * as CONSTS from './constants'
import {Tree} from './singleTree'

const TREE_ADD_POINT = -CONSTS.FLOOR_DEPTH

export class TreeManager {
  constructor(scene) {
    this.scene = scene
    this.trees = []
    this.lastTreeTime = 0

    this.addInitialTrees()
  }

  addInitialTrees() {
    for (let i = 0; i > TREE_ADD_POINT; i -= CONSTS.PILLAR_SPACING) {
      this.add(i)
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

  add(position=null) {
    if (position === null) position = TREE_ADD_POINT

    const t = new Tree(this.scene)
    this.trees.push(t)

    t.setPosition(
      (Math.random() - 0.5) * CONSTS.FLOOR_WIDTH,
      position
    )
  }

  // moves trees forward and removes them once they exit the scene
  moveForward(deltaTime) {
    const toremove = []
    this.trees.forEach((t, i) => {
      t.moveBy(0, CONSTS.PILLAR_SPEED * (deltaTime / 1000))

      if (t.position.y > CONSTS.FLOOR_DEPTH) {
        toremove.push(i)
      }
    })

    while (toremove.length) {
      const [removed] = this.trees.splice(toremove.pop(), 1)
      removed.cleanup()
    }
  }

  tick(time, deltaTime) {
    this.moveForward(deltaTime)

    let addTree = false
    if (this.trees.length > 0) {
      const lastTreePosition = this.trees[this.trees.length - 1].position.y
      const treeSpacing = TREE_ADD_POINT + CONSTS.PILLAR_SPACING

      if (lastTreePosition > treeSpacing) {
        addTree = true
      }
    } else {
      addTree = true
    }

    if (addTree) {
      this.add()
      this.lastTreeTime = time
    }
  }
}
