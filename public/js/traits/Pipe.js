import Vector from '../Vector.js'
import Trait from '../Trait.js'
import PipeTraveler from './PipeTraveler.js'

export default class Pipe extends Trait {
    constructor() {
        super()
        this.activated = false
        this.direction = new Vector(0, 0)
    }

    collides(us, them) {
        if (this.activated) return

        const pipeTraveler = them.traits.get(PipeTraveler)
        if (pipeTraveler) {
            console.log(pipeTraveler.direction)
            if (pipeTraveler.direction.isEqual(this.direction)) {
                us.sounds.add('pipe')
                this.activated = true
            }
        }
    }
}