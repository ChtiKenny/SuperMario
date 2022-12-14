import Entity from '../Entity.js'
import Trait from '../Trait.js'
import { loadSpriteSheet } from '../loaders/sprite.js'
import PendulumMove from '../traits/PendulumMove.js'
import Killable from '../traits/Killable.js'
import Solid from '../traits/Solid.js'
import Physics from '../traits/Physics.js'
import Stomper from '../traits/Stomper.js'

export function loadGoombaBrown() {
    return loadSpriteSheet('goomba-brown')
    .then(createGoombaFactory)
}

export function loadGoombaBlue() {
    return loadSpriteSheet('goomba-blue')
    .then(createGoombaFactory)
}

class Behavior extends Trait {
    collides(us, them) {
        if (us.traits.get(Killable).dead) return

        if (!them.traits.has(Stomper)) return

        if (them.velocity.y <= us.velocity.y) return them.traits.get(Killable).kill()
        
        us.traits.get(PendulumMove).speed = 0
        us.traits.get(Killable).kill()
    }
}

function createGoombaFactory(sprite) {

    const walkAnim = sprite.animations.get('walk')

    function routeAnim(goomba) {
        if (goomba.traits.get(Killable).dead) return 'flat'

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
        goomba.addTrait(new Solid())
        goomba.addTrait(new Physics())

        goomba.draw = drawGoomba

        return goomba
    }
}