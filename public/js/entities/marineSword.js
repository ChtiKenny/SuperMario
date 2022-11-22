import Entity from '../Entity.js'
import Trait from '../Trait.js'
import { loadSpriteSheet } from '../loaders/sprite.js'
import PendulumMove from '../traits/PendulumMove.js'
import Killable from '../traits/Killable.js'
import Solid from '../traits/Solid.js'
import Physics from '../traits/Physics.js'
import Stomper from '../traits/Stomper.js'

export function loadMarineSword() {
    return loadSpriteSheet('marineSword')
    .then(createMarineSwordFactory)
}

export function loadMarineSwordBlue() {
    return loadSpriteSheet('marineSwordBlue')
    .then(createMarineSwordFactory)
}

class Behavior extends Trait {
    constructor(status) {
        super()
        this.walk = status == 'walk' ? 1 : 0
        this.run = status == 'run' ? 1 : 0
        this.attack = status == 'attack' ? 1 : 0
        this.die = status == 'die' ? 1 : 0
        this.damage = status == 'damage' ? 1 : 0
        this.dead = status == 'dead' ? 1 : 0
        this.flipped = 1
    }
    collides(us, them) {
        if (us.traits.get(Killable).dead) return

        if (!them.traits.has(Stomper)) return
        if (them.velocity.y <= us.velocity.y) return them.traits.get(Killable).kill()
        
        // us.traits.get(PendulumMove).speed = 0
        us.traits.get(Killable).kill()
        us.velocity.set(0, -200)
        us.canCollide = false
    }
}

function createMarineSwordFactory(sprite) {

    const idleAnim   = sprite.animations.get('idle')
    const walkAnim   = sprite.animations.get('walk')
    const runAnim    = sprite.animations.get('run')
    const attackAnim = sprite.animations.get('attack')
    const damageAnim = sprite.animations.get('damage')
    const dieAnim    = sprite.animations.get('die')

    function routeAnim(marine) {
        marine.offset.set(16, 10)
        if (marine.traits.get(Killable).dead) {
            return dieAnim(marine.lifetime)
        }
        if (marine.traits.get(Behavior).walk) {
            return walkAnim(marine.lifetime)
        }
        if (marine.traits.get(Behavior).run) {
            return runAnim(marine.lifetime)
        }
        if (marine.traits.get(Behavior).attack) {
            return attackAnim(marine.lifetime)
        }
        if (marine.traits.get(Behavior).damage) {
            marine.offset.y = 8
            return damageAnim(marine.lifetime)
        }
        if (marine.traits.get(Behavior).die) {
            return dieAnim(marine.lifetime)
        }
        if (marine.traits.get(Behavior).dead) {
            return "dead"
        }

        return idleAnim(marine.lifetime)
    }

    function drawMarine(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.traits.get(Behavior).flipped)
    }

    return function createMarine(props) {
        const marine = new Entity()
        marine.size.set(24, 48)
        marine.offset.set(16, 10)

        // marine.addTrait(new PendulumMove())
        marine.addTrait(new Behavior(props.status))
        marine.addTrait(new Killable())
        marine.addTrait(new Solid())
        marine.addTrait(new Physics())

        marine.draw = drawMarine

        return marine
    }
}