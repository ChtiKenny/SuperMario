import Vector from '../Vector.js'
import Trait from '../Trait.js'
import PipeTraveler from './PipeTraveler.js'

export default class Pipe extends Trait {
    constructor() {
        super()
        this.travelers = new Set()
        this.direction = new Vector(0, 0)
    }

    collides(pipe, traveler) {
        if (!traveler.traits.has(PipeTraveler)) return

        if (this.travelers.has(traveler)) return

        const pipeTraveler = traveler.traits.get(PipeTraveler)
        console.log(pipeTraveler.direction)
        if (pipeTraveler.direction.isEqual(this.direction)) {
            console.log('Entering Pipe')
            pipe.sounds.add('pipe')
            this.travelers.add(traveler)
        }
    }

    update(pipe, gameContext, level) {
        for (const traveler of this.travelers) {
            if (!traveler.bounds.overlaps(pipe.bounds)) {
                console.log('Leaving Pipe')
                this.travelers.delete(traveler)
            }
        }
    }
}