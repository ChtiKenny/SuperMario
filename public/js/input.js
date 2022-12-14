import InputRouter from './InputRouter.js'
import Keyboard from './KeyboardState.js'
import Jump from './traits/Jump.js'
import PipeTraveler from './traits/PipeTraveler.js'
import Go from './traits/Go.js'

const KEYMAP = {
    UP: 'KeyW',
    DOWN: 'KeyS',
    LEFT: 'KeyA',
    RIGHT: 'KeyD',
    A: "KeyP",
    B: "KeyO",
}

export function setupKeyboard(window){
    const input = new Keyboard()
    const router = new InputRouter()

    input.listenTo(window)

    input.addMapping(KEYMAP.A, keyState => {
        if (keyState) {
            router.route(entity => entity.traits.get(Jump).start())
        } else {
            router.route(entity => entity.traits.get(Jump).cancel())
        }
    })

    input.addMapping(KEYMAP.B, keyState => {
        router.route(entity => entity.turbo(keyState))
    })

    input.addMapping(KEYMAP.UP, keyState => {
        router.route(entity => entity.traits.get(PipeTraveler).direction.y += keyState ? -1 : 1)
    })

    input.addMapping(KEYMAP.DOWN, keyState => {
        router.route(entity => entity.traits.get(PipeTraveler).direction.y += keyState ? 1 : -1)
    })

    input.addMapping(KEYMAP.RIGHT, keyState => {
        router.route(entity => {
            entity.traits.get(Go).direction += keyState ? 1 : -1
            entity.traits.get(PipeTraveler).direction.x += keyState ? 1 : -1
        })
    })

    input.addMapping(KEYMAP.LEFT, keyState => {
        router.route(entity => {
            entity.traits.get(Go).direction += keyState ? -1 : 1
            entity.traits.get(PipeTraveler).direction.x += keyState ? -1 : 1
        })
    })

    return router
}