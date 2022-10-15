import Camera from './Camera.js'
import Timer from './Timer.js'
import { createLevelLoader } from './loaders/level.js'
import { loadFont } from './loaders/font.js'
import { loadEntities } from './entities.js'
import {setupKeyboard} from './input.js'
import { createCollisionLayer } from './layers/collision.js'
import { createDashboardLayer } from './layers/dashboard.js'
import { createPlayer, createPlayerEnv } from './player.js'

async function main(canvas) {
    const context = canvas.getContext('2d')
    context.imageSmoothingEnabled = false

    const audioContext = new AudioContext()

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
    ])

    const level = await createLevelLoader(entityFactory)('1-1')

    const camera = new Camera()

    const mario = createPlayer(entityFactory.mario())

    const playerEnv = createPlayerEnv(mario)
    level.entities.add(playerEnv)

    level.compositor.layers.push(createCollisionLayer(level))
    level.compositor.layers.push(createDashboardLayer(font, playerEnv))

    const input = setupKeyboard(mario)
    input.listenTo(window)

    const gameContext = {
        audioContext,
        entityFactory,
        deltaTime : null,
    }

    const timer = new Timer(1/60)

    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime
        level.update(gameContext)

        camera.position.x = Math.max(0, mario.position.x - 100)

        level.compositor.draw(context, camera)
    }

    timer.start()
    level.music.player.playTrack('main')
}

const canvas = document.getElementById('screen')

const start = () => {
    window.removeEventListener('click', start)
    main(canvas)
}
window.addEventListener('click', start)
