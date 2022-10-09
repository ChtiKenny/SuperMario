
import { loadMario } from './entities/Mario.js'
import { loadGoomba } from './entities/Goomba.js'
import { loadKoopa } from './entities/Koopa.js'
import { loadBullet } from './entities/Bullet.js'
import { loadCannon } from './entities/Cannon.js'

import { loadMarineSword } from './entities/marineSword.js'

export function loadEntities(audioContext) {
    const entitiesFactories = {}

    function addAs(name) {
        return factory => entitiesFactories[name] = factory
    }

    return Promise.all([
        loadMario(audioContext) .then(addAs('mario' )),
        loadGoomba(audioContext).then(addAs('goomba')),
        loadKoopa(audioContext) .then(addAs('koopa')),
        loadBullet(audioContext).then(addAs('bullet')),
        loadCannon(audioContext, entitiesFactories) .then(addAs('cannon')),

        loadMarineSword(audioContext).then(addAs('marineSword')),
    ])
    .then(() => entitiesFactories)
}