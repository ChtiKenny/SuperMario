import Trait from '../Trait.js'

export default class Velocity extends Trait {    
    update(entity, {deltaTime}, level) {
        entity.position.x += entity.velocity.x * deltaTime
        entity.position.y += entity.velocity.y * deltaTime
    }
}
