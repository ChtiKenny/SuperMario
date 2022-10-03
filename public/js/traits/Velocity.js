import { Trait } from '../Entity.js'

export default class Velocity extends Trait {
    constructor() {
        super('Velocity')
    }

    update = (entity, deltaTime) => entity.position.add(entity.velocity.copy().multiply(deltaTime))
}
