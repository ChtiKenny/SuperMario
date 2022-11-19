import Vector from '../Vector.js'
import Trait from '../Trait.js'
import PipeTraveler from './PipeTraveler.js'

function createTravelerState() {
    return {
        time : 0,
        start: new Vector(),
        end: new Vector(),
    }
}

export default class Pipe extends Trait {
    constructor() {
        super()
        this.duration = 1
        this.travelers = new Map()
        this.direction = new Vector(0, 0)
    }

    collides(pipe, traveler) {
        if (!traveler.traits.has(PipeTraveler)) return

        if (this.travelers.has(traveler)) return

        const pipeTraveler = traveler.traits.get(PipeTraveler)
        if (pipeTraveler.direction.isEqual(this.direction)) {
            pipe.sounds.add('pipe')
            
            const state = createTravelerState()
            state.start.set(traveler.position)
            state.end.set(traveler.position)
            state.end.x += this.direction.x * pipe.size.x
            state.end.y += this.direction.y * pipe.size.y
            this.travelers.set(traveler, state)
        }
    }

    update(pipe, gameContext, level) {
        const {deltaTime} = gameContext
        for (const [traveler, state] of this.travelers.entries()) {
            state.time += deltaTime
            const progress = state.time / this.duration
            traveler.position.x = state.start.x + (state.end.x - state.start.x) * progress
            traveler.position.y = state.start.y + (state.end.y - state.start.y) * progress
            if (state.time > this.duration) {
                this.travelers.delete(traveler)
            }
        }
    }
}