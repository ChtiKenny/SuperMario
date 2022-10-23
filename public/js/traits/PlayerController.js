import { Trait } from '../Entity.js'
import Vector from '../Vector.js'

export default class PlayerController extends Trait {
    constructor() {
        super('playerController')
        this.checkpoint = new Vector(0 ,0)
        this.player = null
    }

    setPlayer(entity) {
        this.player = entity
    }

    update(entity, {deltaTime}, level) {
        if (!level.entities.has(this.player)) {

            this.player.killable.revive()
            this.player.position.set(this.checkpoint)
            level.entities.add(this.player)
        }
    }
}
