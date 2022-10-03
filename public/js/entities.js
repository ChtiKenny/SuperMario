import Entity from './Entity.js'
import Velocity from './traits/Velocity.js'
import Jump from './traits/Jump.js'
import { loadMarioSprite } from './sprites.js'


export function createMario() {
    return loadMarioSprite()
    .then((sprite) => {  
        const mario = new Entity()

        mario.addTrait(new Velocity())
        mario.addTrait(new Jump())
        
        mario.draw = context => sprite.draw('idle', context, mario.position.x, mario.position.y)

        return mario
    })
}