import makeLogger from '@natfaulk/supersimplelogger'
import * as Objects from './objects'
import * as CONSTS from './constants'
import * as THREE from 'three'

const lg = makeLogger('Floor')

export class Floor {
  constructor(scene) {
    this.scene = scene
    this.objs = []

    this.addSection()
    this.addSection()
    this.addSection()
  }
  
  addSection() {
    let pos = 0
    if (this.objs.length > 0) {
      pos = this.objs[this.objs.length - 1].position.z - CONSTS.FLOOR_DEPTH
    }

    const fp = this.makeSection()
    this.objs.push(fp)
    fp.position.z = pos
    lg('Floor panel added')
  }

  makeSection() {
    const tempWidth = CONSTS.FLOOR_WIDTH + 2 * CONSTS.FLOOR_OVERHANG
    // geometry of previous floor piece so edges can align
    let prevVertices = null
    if (this.objs.length > 0) {
      prevVertices = this.objs[this.objs.length - 1].geometry.attributes.position.array
    }
  
    const nVxWide = Math.floor(tempWidth / CONSTS.FLOOR_SQ_SIZE) + 1
    const nVxLong = Math.floor(CONSTS.FLOOR_DEPTH / CONSTS.FLOOR_SQ_SIZE) + 1
    const lastRowVxNum = nVxWide * (nVxLong - 1)

    const geometry = new THREE.PlaneGeometry(
      tempWidth,
      CONSTS.FLOOR_DEPTH,
      tempWidth / CONSTS.FLOOR_SQ_SIZE,
      CONSTS.FLOOR_DEPTH / CONSTS.FLOOR_SQ_SIZE
    )
    const vertices = geometry.attributes.position.array
    for (let i = 0; i < vertices.length; i ++) {
      const zindex = i*3 + 2

      if (prevVertices === null || i < lastRowVxNum) {
        vertices[zindex] = Math.random() * 0.2
      } else {
        vertices[zindex] = prevVertices[zindex - lastRowVxNum*3]
      }
    }
  
    geometry.computeVertexNormals()
  
    const plane = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        color: 0x419653,
        // wireframe: true,
      })
    )
  
    this.scene.add(plane)
    plane.lookAt(new THREE.Vector3(0, 1, 0))
  
    return plane
  }

  removeSection(index) {
    const [removed] = this.objs.splice(index, 1)
    Objects.remove(removed, this.scene)
    lg('Floor panel removed')
  }

  tick(deltaTime, birdSpeed) {
    // should never be more than 1...
    let toremove = null
    for (let i = 0; i < this.objs.length; i++) {
      this.objs[i].position.z += birdSpeed * (deltaTime / 1000)
      
      if (this.objs[i].position.z > CONSTS.FLOOR_DEPTH) {
        toremove = i
      }
    }

    if (toremove !== null) {
      this.removeSection(toremove)
      this.addSection()
    }
  }

  reset() {
    // doesn't need anything doing to it as it should go forever...
  }
}
