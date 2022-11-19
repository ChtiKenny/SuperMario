import Entity from '../Entity.js'
import Pipe from '../traits/Pipe.js'
import { loadAudioBoard } from '../loaders/audio.js'
import Vector from '../Vector.js'

const Direction = {
    UP: new Vector(0, -1),
    DOWN: new Vector(0, 1),
    RIGHT: new Vector(1, 0),
    LEFT: new Vector(-1, 0),
}

export function loadPipePortal(audioContext) {
    return Promise.all([
        loadAudioBoard('pipe-portal', audioContext),
    ])
    .then(([audio]) => {
        return createFactory(audio)
    })
}

function createFactory(audio) {
    return function createPipePortal(props) {
        const pipe = new Pipe()
        pipe.direction.set(Direction[props.direction])
        const entity = new Entity()
        entity.audio = audio
        entity.size.set(24, 24)
        entity.addTrait(pipe)

        return entity
    }
}