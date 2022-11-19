import Entity from '../Entity.js'
import Jump from '../traits/Jump.js'
import Stomper from '../traits/Stomper.js'
import Go from '../traits/Go.js'
import Killable from '../traits/Killable.js'
import Solid from '../traits/Solid.js'
import Physics from '../traits/Physics.js'
import PipeTraveler from '../traits/PipeTraveler.js'
import { loadAudioBoard } from '../loaders/audio.js'
import { loadSpriteSheet } from '../loaders/sprite.js'

const SLOW_DRAG = 1/1000
const FAST_DRAG = 1/5000

export function loadMario(audioContext) {
    return Promise.all([
        loadSpriteSheet('mario'),
        loadAudioBoard('mario', audioContext)
    ])
    .then(([sprite, audio]) =>{
        return createMarioFactory(sprite, audio)
    })
}

function createMarioFactory(sprite, audio) {

    const runAnim = sprite.animations.get('run')
    function routeFrame(mario) {
        if (mario.traits.get(Jump).falling) return 'jump'

        const pipeTraveler = mario.traits.get(PipeTraveler)
        if (pipeTraveler.movement.x != 0) {
            return runAnim(pipeTraveler.distance.x * 2)
        }
        
        const go = mario.traits.get(Go);
        if (go.distance > 0) {
            if ((mario.velocity.x > 0 && go.dir < 0) || (mario.velocity.x < 0 && go.dir > 0)) {
                return 'break'
            }
            return runAnim(mario.traits.get(Go).distance)
        }
        return 'idle'
    }

    function setTurboState(turboOn) {
        this.traits.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG
    }

    function drawMario(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.traits.get(Go).heading < 0)
    }

    return function createMario() {
        const mario = new Entity()
        mario.audio = audio
        mario.size.set(14, 16)

        mario.addTrait(new Jump())
        mario.addTrait(new Go())
        mario.addTrait(new Stomper())
        mario.addTrait(new Killable())
        mario.addTrait(new Solid())
        mario.addTrait(new Physics())
        mario.addTrait(new PipeTraveler())

        mario.traits.get(Killable).removeAfter = Infinity
        mario.traits.get(Jump).velocity = 175

        mario.turbo = setTurboState
        mario.draw = drawMario

        mario.turbo(false)

        return mario
    }
}