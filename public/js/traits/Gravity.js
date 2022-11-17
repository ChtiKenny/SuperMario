import Trait from '../Trait.js'

export default class Gravity extends Trait {    
    update(entity, {deltaTime}, level) {
        entity.velocity.y += level.gravity * deltaTime
    }
}
