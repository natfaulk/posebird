import * as Scene from './scene'
import {TreeManager} from './treeManager'
import {newBird} from './bird'
import {Collisions} from './collisions'
import * as Lighting from './lighting'
import * as Camera from './camera'

import makeLogger from '@natfaulk/supersimplelogger'
import {Floor} from './floor'
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
    this.floor = new Floor(this.scene)
    this.bird = await newBird(this.scene)
    this.trees = new TreeManager(this.scene)
    this.collisions = new Collisions(this.bird, this.trees)

    // performs setup and adds custom tick method to camera
    Camera.setup(this.camera, this.bird.obj)
  }

  tick(data) {
    const {time, deltaTime, controls} = data

    this.floor.tick(deltaTime)
    this.trees.tick(time, deltaTime)

    this.bird.tick(deltaTime, controls)
    if (!ORBIT_CAM) this.camera.tick()

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
