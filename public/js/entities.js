import Entity from './Entity.js'
import { loadMarioSprite } from './sprites.js'


export function createMario() {
    return loadMarioSprite()
    .then((sprite) => {  
        const mario = new Entity()

        mario.update = (time) => {
            mario.position.add(mario.velocity.copy().multiply(time))
        }

        mario.draw = context => {
            sprite.draw('idle', context, mario.position.x, mario.position.y)
        }

        return mario
    })
}