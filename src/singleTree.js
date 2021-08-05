import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'
import {newPt, randBetween} from './utils'
import * as THREE from 'three'

const lg = makeLogger('Tree')

class TreeSubpart {
  constructor(scene, obj) {
    this.scene = scene
    this.obj = obj
    this.scene.add(this.obj)
    
    this.setupBoundingBox()
  }

  setupBoundingBox() {
    this.bbHelper = new THREE.BoxHelper(this.obj, CONSTS.BOUNDING_BOX_COLOR)
    this.scene.add(this.bbHelper)
    this.bbHelper.visible = CONSTS.SHOW_BOUNDING_BOXES

    this.bb = new THREE.Box3()
    this.bb.setFromObject(this.bbHelper)
  }

  cleanup() {
    this.scene.remove(this.bbHelper)
    Objects.remove(this.obj, this.scene)
  }

  fixBB() {
    this.bbHelper.update()
    // seems to be a bug in the three js library where the bounding sphere
    // is updated instead of the bounding box, so call it manually
    this.bbHelper.geometry.computeBoundingBox()
    this.bb.setFromObject(this.bbHelper)
  }
}

export class Tree {
  constructor(scene) {
    this.scene = scene
    this.group = new TreeSubpart(this.scene, new THREE.Group())
    
    this.objs = []
    this.position = newPt()

    this.makeTree()

    lg('Added tree')
  }

  moveBy(xshift, yshift) {
    this.group.obj.position.x += xshift
    this.group.obj.position.z += yshift

    this.group.fixBB()

    this.position.x = this.group.obj.position.x
    this.position.y = this.group.obj.position.z
  }

  setPosition(x, y) {
    this.group.obj.position.x = x
    this.group.obj.position.z = y

    this.group.fixBB()

    this.position.x = this.group.obj.position.x
    this.position.y = this.group.obj.position.z
  }

  makeTree() {
    const trunk = Objects.addTreeWoodBox(
      CONSTS.PILLAR_WIDTH,
      CONSTS.PILLAR_HEIGHT,
      CONSTS.PILLAR_WIDTH
    )
    trunk.position.y = CONSTS.PILLAR_HEIGHT / 2
    this.objs.push(new TreeSubpart(this.group.obj, trunk))
    
    // leaf blob on top of trunk
    const leaf = Objects.addTreeLeafBox(
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE,
      CONSTS.LEAF_CUBE_SIZE
    )
    // zero point is halfway up trunk
    leaf.position.y = CONSTS.PILLAR_HEIGHT
    this.objs.push(new TreeSubpart(this.group.obj, leaf))
  
    for (let i = 0; i < 10; i++) {
      const height = CONSTS.PILLAR_HEIGHT * randBetween(
        CONSTS.BRANCH_MIN_HEIGHT,
        CONSTS.BRANCH_MAX_HEIGHT
      )
      const len = randBetween(CONSTS.BRANCH_MIN_LENGTH, CONSTS.BRANCH_MAX_LENGTH)
      // limit to 90 degree increments for now
      // so can use AABB collisions
      const ang = Math.floor(randBetween(0, 4)) * Math.PI / 2
      
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
  
    this.objs.push(new TreeSubpart(this.group.obj, leaf))
    this.objs.push(new TreeSubpart(this.group.obj, branch))

    this.group.obj.add(leaf)
    this.group.obj.add(branch)
  }

  cleanup() {
    // remove leaves and branches
    this.objs.forEach(obj => {
      obj.cleanup()        
    })
    this.group.cleanup()
    lg('Tree removed')
  }

  checkCollision(bb) {
    // broad phase tree AABB collision detection
    if (!this.group.bb.intersectsBox(bb)) return false

    // the sub bounding boxes are realtive to the tree position
    // make a cloned bird bb and adjust it so its origin is relative to the tree.
    const bbAdj = bb.clone()
    bbAdj.min.sub(this.group.obj.position)
    bbAdj.max.sub(this.group.obj.position)

    // narrower phase AABB collsiion of each part of the tree
    for (let i = 0; i < this.objs.length; i++) {
      if (this.objs[i].bb.intersectsBox(bbAdj)) {
        this.objs[i].obj.material.color.setHex(0x00FF00)
        return true
      }
    }

    return false
  }
}
