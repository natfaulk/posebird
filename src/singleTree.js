import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'
import {newPt, randBetween} from './utils'
import * as THREE from 'three'

const lg = makeLogger('Tree')

export class Tree {
  constructor(scene) {
    this.scene = scene
    this.objs = []
    this.position = newPt()

    this.makeTree()
    this.setupBoundingBox()

    lg('Added tree')
  }

  moveBy(xshift, yshift) {
    this.objs.forEach(obj => {
      obj.position.x += xshift
      obj.position.z += yshift
    })

    this.position.x += xshift
    this.position.y += yshift

    this.fixBB()
  }

  setPosition(x, y) {
    const xshift = x - this.position.x
    const yshift = y - this.position.y

    this.moveBy(xshift, yshift)
  }

  makeTree() {
    const trunk = Objects.addTreeWoodBox(
      this.scene,
      CONSTS.PILLAR_WIDTH,
      CONSTS.PILLAR_HEIGHT,
      CONSTS.PILLAR_WIDTH
    )
    trunk.position.y = CONSTS.PILLAR_HEIGHT / 2
    
    this.objs.push(trunk)
    
    // leaf blob on top of trunk
    const leaf = Objects.addTreeLeafBox(
      this.scene,
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE
    )
    leaf.position.y = CONSTS.PILLAR_HEIGHT
    this.objs.push(leaf)
  
    for (let i = 0; i < 10; i++) {
      const height = CONSTS.PILLAR_HEIGHT * randBetween(
        CONSTS.BRANCH_MIN_HEIGHT,
        CONSTS.BRANCH_MAX_HEIGHT
      )
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
      this.scene,
      len,
      CONSTS.PILLAR_WIDTH / 2,
      CONSTS.PILLAR_WIDTH / 2,
    )
  
    branch.position.x = xshift / 2
    branch.position.y = height
    branch.position.z = yshift / 2
    branch.rotation.y = angle
  
    const leaf = Objects.addTreeLeafBox(
      this.scene,
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
  }

  setupBoundingBox() {
    this.bbHelper = new THREE.BoxHelper(this.objs[0], CONSTS.BOUNDING_BOX_COLOR)
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
    this.objs.forEach(obj => {
      Objects.remove(obj, this.scene)
    })
    lg('Tree removed')
  }

  checkCollision(bb) {
    return this.bb.intersectsBox(bb)
  }
}