
import { loadMario } from './entities/Mario.js'
import { loadGoomba } from './entities/Goomba.js'
import { loadKoopa } from './entities/Koopa.js'
import { loadMarineSword } from './entities/marineSword.js'

export function loadEntities(audioContext) {
    const entitiesFactories = {}

    function addAs(name) {
        return factory => entitiesFactories[name] = factory
    }

    return Promise.all([
        loadMario(audioContext) .then(addAs('mario' )),
        loadGoomba(audioContext).then(addAs('goomba')),
        loadMarineSword(audioContext).then(addAs('marineSword')),
        loadKoopa(audioContext) .then(addAs('koopa' )),
    ])
    .then(() => entitiesFactories)
}