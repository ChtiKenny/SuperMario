import { loadSpriteSheet } from '../loaders/sprite.js'
import Entity from '../Entity.js'
import Trait from '../Trait.js'
import Gravity from '../traits/Gravity.js'
import Killable from '../traits/Killable.js'
import Velocity from '../traits/Velocity.js'
import Stomper from '../traits/Stomper.js'

export function loadBullet() {
    return loadSpriteSheet('bullet')
    .then(createBulletFactory)
}

class Behavior extends Trait {
    constructor() {
        super('behavior')
        this.gravity = new Gravity()
    }

    collides(us, them) {
        if (us.traits.get(Killable).dead) return

        if (!them.traits.get(Stomper)) return
        if (them.velocity.y <= us.velocity.y) return them.traits.get(Killable).kill()
        
        us.traits.get(Killable).kill()
        us.velocity.set(100, -200)
    }

    update(entity, gameContext, level) {
        if (entity.traits.get(Killable).dead) {
            this.gravity.update(entity, gameContext, level)
        }
    }
}

function createBulletFactory(sprite) {

    function drawBullet(context) {
        sprite.draw('bullet', context, 0, 0, this.velocity.x > 0)
    }

    return function createBullet() {
        const bullet = new Entity()
        bullet.size.set(16, 14)

        bullet.addTrait(new Behavior())
        bullet.addTrait(new Killable())
        bullet.addTrait(new Velocity())

        bullet.draw = drawBullet

        return bullet
    }
}