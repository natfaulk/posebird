import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'
import {newPt, randBetween} from './utils'
import * as THREE from 'three'

const lg = makeLogger('Tree')

export class Tree {
  constructor(scene) {
    this.scene = scene
    this.trunk = null
    this.objs = []
    this.position = newPt()

    this.makeTree()
    this.setupBoundingBox()

    lg('Added tree')
  }

  moveBy(xshift, yshift) {
    this.trunk.position.x += xshift
    this.trunk.position.z += yshift

    this.fixBB()

    this.position.x = this.trunk.position.x
    this.position.y = this.trunk.position.z
  }

  setPosition(x, y) {
    this.trunk.position.x = x
    this.trunk.position.z = y

    this.fixBB()

    this.position.x = this.trunk.position.x
    this.position.y = this.trunk.position.z
  }

  makeTree() {
    const trunk = Objects.addTreeWoodBox(
      CONSTS.PILLAR_WIDTH,
      CONSTS.PILLAR_HEIGHT,
      CONSTS.PILLAR_WIDTH
    )
    trunk.position.y = CONSTS.PILLAR_HEIGHT / 2
    this.trunk = trunk
    this.scene.add(trunk)
    
    // leaf blob on top of trunk
    const leaf = Objects.addTreeLeafBox(
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE
    )
    // zero point is halfway up trunk
    leaf.position.y = CONSTS.PILLAR_HEIGHT / 2
    trunk.add(leaf)
    this.objs.push(leaf)
  
    for (let i = 0; i < 10; i++) {
      const height = CONSTS.PILLAR_HEIGHT * randBetween(
        CONSTS.BRANCH_MIN_HEIGHT,
        CONSTS.BRANCH_MAX_HEIGHT
      // zero point is halfway up trunk
      ) - CONSTS.PILLAR_HEIGHT / 2
      const len = randBetween(CONSTS.BRANCH_MIN_LENGTH, CONSTS.BRANCH_MAX_LENGTH)
      const ang = randBetween(0, 2 * Math.PI)
      
      this.makeBranch(len, ang, height)
    }
  }

  makeBranch(len, angle, height) {
    // everything is origin at centre of mass, so need to shift branches and leaf block out from trunk
    const xshift = -Math.cos(angle) * len
    const yshift = Math.sin(angle) * len
  
    const branch = Objects.addTreeWoodBox(
      len,
      CONSTS.PILLAR_WIDTH / 2,
      CONSTS.PILLAR_WIDTH / 2,
    )
  
    branch.position.x = xshift / 2
    branch.position.y = height
    branch.position.z = yshift / 2
    branch.rotation.y = angle
  
    const leaf = Objects.addTreeLeafBox(
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE
    )
  
    leaf.position.x = xshift
    leaf.position.y = height
    leaf.position.z = yshift
    leaf.rotation.y = angle
  
    this.objs.push(leaf)
    this.objs.push(branch)

    this.trunk.add(leaf)
    this.trunk.add(branch)
  }

  setupBoundingBox() {
    this.bbHelper = new THREE.BoxHelper(this.trunk, CONSTS.BOUNDING_BOX_COLOR)
    this.scene.add(this.bbHelper)
    this.bbHelper.visible = CONSTS.SHOW_BOUNDING_BOXES

    this.bb = new THREE.Box3()
    this.bb.setFromObject(this.bbHelper)
  }

  fixBB() {
    this.bbHelper.update()
    // seems to be a bug in the three js library where the bounding sphere
    // is updated instead of the bounding box, so call it manually
    this.bbHelper.geometry.computeBoundingBox()
    this.bb.setFromObject(this.bbHelper)
  }

  cleanup() {
    this.scene.remove(this.bbHelper)
    // remove leaves and branches
    this.objs.forEach(obj => {
      Objects.remove(obj, this.trunk)
    })
    // remove trunk
    Objects.remove(this.trunk, this.scene)
    lg('Tree removed')
  }

  checkCollision(bb) {
    return this.bb.intersectsBox(bb)
  }
}