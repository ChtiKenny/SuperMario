import Entity, { Trait } from '../Entity.js'
import { loadSpriteSheet } from '../loaders/sprite.js'
import PendulumMove from '../traits/PendulumMove.js'
import Killable from '../traits/Killable.js'
import Solid from '../traits/Solid.js'
import Physics from '../traits/Physics.js'

export function loadMarineSword() {
    return loadSpriteSheet('marineSword')
    .then(createMarineSwordFactory)
}

class Behavior extends Trait {
    constructor() {
        super('behavior')
    }

    collides(us, them) {
        if (us.killable.dead) return

        if (!them.stomper) return
        if (them.velocity.y <= us.velocity.y) return them.killable.kill()
        
        // us.pendulumMove.speed = 0
        us.killable.kill()
        us.velocity.set(0, -200)
        us.canCollide = false
    }
}

function createMarineSwordFactory(sprite) {

    const idleAnim = sprite.animations.get('idle')
    const dieAnim = sprite.animations.get('die')

    function routeAnim(marine) {
         if (marine.killable.dead) return dieAnim(marine.lifetime)

        return idleAnim(marine.lifetime)
    }

    function drawMarine(context) {
        sprite.draw(routeAnim(this), context, 0, 0)
    }

    return function createMarine() {
        const marine = new Entity()
        marine.size.set(24, 45)
        marine.offset.set(16, 3)

        // marine.addTrait(new PendulumMove())
        marine.addTrait(new Behavior())
        marine.addTrait(new Killable())
        marine.addTrait(new Solid())
        marine.addTrait(new Physics())

        marine.draw = drawMarine

        return marine
    }
}