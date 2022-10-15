import Entity, { Trait } from '../Entity.js'
import Gravity from '../traits/Gravity.js'
import Killable from '../traits/Killable.js'
import Velocity from '../traits/Velocity.js'
import { loadSpriteSheet } from '../loaders/sprite.js'

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
        if (us.killable.dead) return

        if (!them.stomper) return
        if (them.velocity.y <= us.velocity.y) return them.killable.kill()
        
        us.killable.kill()
        us.velocity.set(100, -200)
    }

    update(entity, gameContext, level) {
        if (entity.killable.dead) {
            this.gravity.update(entity, gameContext, level)
        }
    }
}

function createBulletFactory(sprite) {

    function drawBullet(context) {
        sprite.draw('bullet', context, 0, 0, this.velocity.x < 0)
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