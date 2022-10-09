import { Trait, Sides } from '../Entity.js'
import Vector from '../Vector.js'

export default class PlayerController extends Trait {
    constructor() {
        super('playerController')
        this.checkpoint = new Vector(0 ,0)
        this.player = null
        this.time = 300
        this.score = 0
    }

    setPlayer(entity) {
        this.player = entity

        this.player.stomper.events.listen('stomp', () => this.score += 100)
    }

    update(entity, {deltaTime}, level) {
        if (!level.entities.has(this.player)) {

            this.player.killable.revive()
            this.player.position.set(this.checkpoint)
            level.entities.add(this.player)
        } else {
            this.time -= deltaTime * 2
        }
    }
}
