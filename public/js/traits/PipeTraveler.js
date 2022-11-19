import Vector from '../Vector.js'
import Trait from '../Trait.js'

export default class PipeTraveler extends Trait {
    constructor() {
        super()
        this.direction = new Vector(0, 0)
    }
}