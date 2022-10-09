import { Trait, Sides } from '../Entity.js'

export default class Velocity extends Trait {
    constructor() {
        super('velocityTrait')
    }
    
    update(entity, {deltaTime}, level) {
        entity.position.x += entity.velocity.x * deltaTime
        entity.position.y += entity.velocity.y * deltaTime
    }
}
