
import { loadMario } from './entities/Mario.js'
import { loadGoombaBrown, loadGoombaBlue } from './entities/Goomba.js'
import { loadKoopaGreen, loadKoopaBlue } from './entities/Koopa.js'
import { loadBullet } from './entities/Bullet.js'
import { loadCannon } from './entities/Cannon.js'

import { loadMarineSword } from './entities/marineSword.js'

export async function loadEntities(audioContext) {
    const entitiesFactories = {}
    
    async function setup (loader, name) {
        entitiesFactories[name] = await loader(audioContext)
    }

    await Promise.all([
        setup(loadMario, 'mario' ),
        setup(loadGoombaBrown, 'goomba-brown'),
        setup(loadGoombaBlue, 'goomba-blue'),
        setup(loadKoopaGreen, 'koopa-green'),
        setup(loadKoopaBlue, 'koopa-blue'),
        setup(loadBullet, 'bullet'),
        setup(loadCannon, 'cannon'),

        setup(loadMarineSword, 'marineSword'),
    ])

    return entitiesFactories
}