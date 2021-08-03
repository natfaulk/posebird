import * as THREE from 'three'
import * as Objects from './objects'
import * as CONSTS from './constants'
import {clamp} from './utils'
import {MAX_INERTIA, GRAVITY, MAX_UPWARD_SPEED} from './constants'

// Bird's roll is set from th eshoulder angle of the person,
// wing angle is set from the angle from the persons hand to shoulder, 
// or failing that their elbow to their shoulder
// If both arms are visible the average fo the two angles is taken, if not,
// only the visible arms angle is used. 0 is wings out flat, -ve wings pointing down, +ve wings up

// When someone flaps, and their arm angle decreases, an upwards force is applied to the bird
// however to discourage really small movements - and noise causing micro flapping - there
// is an inertia factor, which builds up. When the inertia factor is low, the force applied is low
// the inertia factor increases each time the angle decreases and is reset to 0 if it increases

class Bird {
  constructor () {
    // these all need setting - are set in the factory function (newBird)
    /**
     * @type {THREE.Mesh}
     */
    this.obj = null
    /**
     * @type {THREE.BoxHelper} 
     */
    this.bbHelper = null
    /**
     * @type {THREE.Box3} 
     */
    this.bb = null

    this.velocity = {x: 0, y: GRAVITY}
    this.flapping = {previousArmAngle: 0, inertia: 0, deltaTime: 0}
    this.lastPoseId = -1
  }

  tick(deltaTime, controls) {
    const {shoulderAngle, armAngle, poseId} = controls

    // apply gravity
    this.obj.position.y += this.velocity.y * (deltaTime / 1000)
    this.applyControls(deltaTime, shoulderAngle, armAngle, poseId)    

    this.limitPosition()
    this.boundingBoxUpdate()
  }

  applyControls(deltaTime, shoulderAngle, armAngle, poseId) {
    shoulderAngle = clamp(shoulderAngle, -0.3, 0.3)
    armAngle = clamp(armAngle, -0.5, 0.5)
    armAngle = -armAngle

    // Handle roll
    const xspeed = (shoulderAngle / 0.3) * CONSTS.BIRD_MAX_SPEED_X * (deltaTime / 1000)
    this.obj.position.x += xspeed
    this.obj.rotation.z = -2*shoulderAngle

    // wings mirror arm angle
    this.bones.r_wing.rotation.x = armAngle
    this.bones.l_wing.rotation.x = armAngle

    // apply force from wings

    // only apply controls if new controls to apply
    if (poseId != this.lastPoseId) {
      if (armAngle < this.flapping.previousArmAngle) this.flapping.inertia += (deltaTime + this.flapping.deltaTime)
      if (armAngle >= this.flapping.previousArmAngle) {
        this.flapping.inertia = 0
        this.flapping.deltaTime = 0
      }
      
      if (this.flapping.inertia > MAX_INERTIA) this.flapping.inertia = MAX_INERTIA
      this.flapping.previousArmAngle = armAngle
      this.lastPoseId = poseId
      this.flapping.deltaTime = 0
    } else {
      this.flapping.deltaTime += deltaTime
    } 

    const inertiaScaled = this.flapping.inertia / MAX_INERTIA
    this.obj.position.y += MAX_UPWARD_SPEED * inertiaScaled * (deltaTime / 1000) 
  }

  limitPosition() {
    this.obj.position.x = clamp(this.obj.position.x, -CONSTS.FLOOR_WIDTH / 2, CONSTS.FLOOR_WIDTH / 2)
    this.obj.position.y = clamp(this.obj.position.y, 0, CONSTS.PILLAR_HEIGHT)
  }
  
  boundingBoxUpdate() {
    // Update Bounding Box for collisions
    this.bbHelper.update()
    // seems to be a bug in the three js library where the bounding sphere
    // is updated instead of the bounding box, so call it manually
    this.bbHelper.geometry.computeBoundingBox()
    this.bb.setFromObject(this.bbHelper)
  }

  findBones() {
    this.bones = {}
    this.obj.traverse(node => {
      if (node.isBone) {
        if (node.name === 'bboneR') this.bones.r_wing = node
        if (node.name === 'bboneL') this.bones.l_wing = node
        if (node.name === 'CTRL_outR') this.bones.r_wingtip = node
        if (node.name === 'CTRL_outL') this.bones.l_wingtip = node
      }
    })
  }
}

// newBird is a factory function to create a new bird class.
// A constructor cannot be async, so need to add the object model immediately
// after creation. There is no checking to make sure that the obj exists
// so one should always use the factory function (hence the class is unexported)
export const newBird = async scene => {
  const bird = new Bird()

  bird.obj = await Objects.addBird(scene)
  bird.bbHelper = new THREE.BoxHelper(bird.obj, CONSTS.BOUNDING_BOX_COLOR)
  scene.add(bird.bbHelper)
  bird.bbHelper.visible = CONSTS.SHOW_BOUNDING_BOXES
  bird.bb = new THREE.Box3()
  bird.bb.setFromObject(bird.bbHelper)

  bird.findBones()

  return bird
}
