import Entity from '../Entity.js'
import Emitter from '../traits/Emitter.js'
import { loadAudioBoard } from '../loaders/audio.js'
import { findPlayers } from '../player.js'

const HOLD_FIRE_THRESHOLD = 30

export function loadCannon(audioContext, entitiesFactories) {
    return loadAudioBoard('cannon', audioContext)
    .then(audio =>{
        return createCannonFactory(audio, entitiesFactories)
    })
}

function createCannonFactory(audio, entitiesFactories) {

    function emitBullet(cannon, level) {
        let direction = 1
        for (const player of findPlayers(level)) {
            if (player.position.x > cannon.position.x - HOLD_FIRE_THRESHOLD &&
                player.position.x < cannon.position.x + HOLD_FIRE_THRESHOLD) {
                return
            }

            if (player.position.x < cannon.position.x) {
                direction = -1
            }
        }
        const bullet = entitiesFactories.bullet()

        bullet.position.set(cannon.position)
        bullet.velocity.set(80 * direction, 0)

        cannon.sounds.add('shoot')
        level.entities.add(bullet)
    }
    return function createCannon() {
        const cannon = new Entity()
        cannon.audio = audio

        const emitter = new Emitter()
        emitter.interval = 4
        emitter.emitters.push(emitBullet)
        
        cannon.addTrait(emitter)

        return cannon
    }
}