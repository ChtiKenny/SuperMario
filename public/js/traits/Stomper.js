import { Trait, Sides } from '../Entity.js'

export default class Stomper extends Trait {
    constructor() {
        super('stomper')
        this.bounceSpeed = 400

    }

    bounce(us, them) {
        us.bounds.bottom = them.bounds.top
        us.velocity.y = -this.bounceSpeed
    }

    collides(us, them) {
        if (!them.killable || them.killable.dead) return
        if (us.velocity.y > them.velocity.y) {
            this.queue(() => this.bounce(us, them))
            us.sounds.add('stomp')
            this.events.emit('stomp', us, them)
        }
    }
}
