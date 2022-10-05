import Camera from './Camera.js'
import Timer from './Timer.js'
import { loadLevel } from './loaders/level.js'
import { loadEntities } from './entities.js'
import {setupKeyboard} from './input.js'
import { createCollisionLayer } from './layers.js'

const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')

Promise.all([
    loadEntities(),
    loadLevel('1-1'),
])
.then(([entity, level]) => {
    const camera = new Camera()
    window.camera = camera

    const mario = entity.mario()
    mario.position.set(64, 64)

    const goomba = entity.goomba()
    goomba.position.set(220, 0)
    level.entities.add(goomba)

    const koopa = entity.koopa()
    koopa.position.set(260, 0)
    level.entities.add(koopa)

    level.entities.add(mario)

    level.compositor.layers.push(createCollisionLayer(level))

    const input = setupKeyboard(mario)
    input.listenTo(window)

    const timer = new Timer(1/60)

    timer.update = function update(deltaTime) {
        level.update(deltaTime)

        if (mario.position.x > 100) camera.position.x = mario.position.x - 100

        level.compositor.draw(context, camera)
    }

    timer.start()
})

