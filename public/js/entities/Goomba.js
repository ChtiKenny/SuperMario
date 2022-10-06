import Entity, { Trait } from '../Entity.js'
import { loadSpriteSheet } from '../loaders.js'
import PendulumMove from '../traits/PendulumMove.js'
import Killable from '../traits/Killable.js'

export function loadGoomba() {
    return loadSpriteSheet('goomba')
    .then(createGoombaFactory)
}

class Behavior extends Trait {
    constructor() {
        super('behavior')
    }

    collides(us, them) {
        if (us.killable.dead) return

        if (!them.stomper) return
        if (them.velocity.y <= us.velocity.y) return them.killable.kill()
        
        us.pendulumMove.speed = 0
        us.killable.kill()
        us.velocity.set(0, -200)
        us.canCollide = false
    }
}

function createGoombaFactory(sprite) {

    const walkAnim = sprite.animations.get('walk')

    function routeAnim(goomba) {
        if (goomba.killable.dead) return 'flat'

        return walkAnim(goomba.lifetime)
    }

    function drawGoomba(context) {
        sprite.draw(routeAnim(this), context, 0, 0)
    }

    return function createGoomba() {
        const goomba = new Entity()
        goomba.size.set(16, 16)

        goomba.addTrait(new PendulumMove())
        goomba.addTrait(new Behavior())
        goomba.addTrait(new Killable())

        goomba.draw = drawGoomba

        return goomba
    }
}