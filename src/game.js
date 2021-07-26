import * as Scene from './scene'
import * as Objects from './objects'
import {Pillars} from './pillars'
import {newBird} from './bird'
import {Collisions} from './collisions'
import * as Lighting from './lighting'
import * as Camera from './camera'
import * as CONSTS from './constants'
import * as Keyboard from './keyboard'

import makeLogger from '@natfaulk/supersimplelogger'
const lg = makeLogger('Game')

// only use for debugging as is broken...
const ORBIT_CAM = false

class Game {
  constructor() {
    this.score = 0

    ;({
      scene: this.scene, 
      camera: this.camera, 
      renderer: this.renderer,
      stats: this.stats
    } = Scene.setup(ORBIT_CAM))
    
    Lighting.setup(this.scene)
  }

  async setup() {
    this.floor = Objects.addFloor(this.scene)
    this.bird = await newBird(this.scene)
    this.pillars = new Pillars(this.scene)
    this.collisions = new Collisions(this.bird, this.pillars)

    // performs setup and adds custom tick method to camera
    Camera.setup(this.camera, this.bird.obj)
  }

  tick(time, deltaTime) {
    this.floor.position.z += CONSTS.PILLAR_SPEED * (deltaTime / 1000)
    while (this.floor.position.z > 0) this.floor.position.z -= 1
    this.pillars.tick(time, deltaTime)

    this.bird.tick(Keyboard)
    this.camera.tick()

    if (this.collisions.tick()) {
      lg('Crashed!!')
      this.score += 1
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}

export const newGame = async () => {
  const g = new Game
  await g.setup()

  return g
}
