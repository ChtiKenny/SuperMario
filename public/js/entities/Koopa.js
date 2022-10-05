import Entity from '../Entity.js'
import { loadSpriteSheet } from '../loaders.js'
import PendulumWalk from '../traits/PendulumWalk.js'

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory)
}

function createKoopaFactory(sprite) {

    const walkAnim = sprite.animations.get('walk')

    function drawKoopa(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.velocity.x < 0)
    }

    return function createKoopa() {
        const koopa = new Entity()
        koopa.size.set(16, 16)
        koopa.offset.set(0, 8)

        koopa.addTrait(new PendulumWalk())

        koopa.draw = drawKoopa

        return koopa
    }
}