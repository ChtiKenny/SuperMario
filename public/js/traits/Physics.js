import { Trait, Sides } from '../Entity.js'

export default class Physics extends Trait {
    constructor() {
        super('physics')
    }
    
    update(entity, gameContext, level) {
        const {deltaTime} = gameContext
        entity.position.x += entity.velocity.x * deltaTime
        level.tileCollider.checkX(entity, gameContext, level)

        entity.position.y += entity.velocity.y * deltaTime
        level.tileCollider.checkY(entity, gameContext, level)

        entity.velocity.y += level.gravity * deltaTime
    }
}
