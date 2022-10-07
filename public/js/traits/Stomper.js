import { Trait, Sides } from '../Entity.js'

export default class Stomper extends Trait {
    constructor() {
        super('stomper')
        this.bounceSpeed = 400

        this.onStomp = function() {
        }
    }

    bounce(us, them) {
        us.bounds.bottom = them.bounds.top
        us.velocity.y = -this.bounceSpeed
    }

    collides(us, them) {
        if (!them.killable || them.killable.dead) return
        if (us.velocity.y > them.velocity.y) {
            this.bounce(us, them)
            this.onStomp(us, them)
        }
    }
}
