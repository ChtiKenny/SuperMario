import { Trait, Sides } from '../Entity.js'

export default class Gravity extends Trait {
    constructor() {
        super('gravity')
    }
    
    update(entity, {deltaTime}, level) {
        entity.velocity.y += level.gravity * deltaTime
    }
}
