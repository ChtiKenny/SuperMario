import Timer from './Timer.js'
import { createLevelLoader } from './loaders/level.js'
import { loadFont } from './loaders/font.js'
import { loadEntities } from './entities.js'
import {setupKeyboard} from './input.js'
import { createCollisionLayer } from './layers/collision.js'
import { createDashboardLayer } from './layers/dashboard.js'
import { createPlayer, createPlayerEnv } from './player.js'
import SceneRunner from './SceneRunner.js'
import { createPlayerProgressLayer } from './layers/player-progress.js'

async function main(canvas) {
    const videoContext = canvas.getContext('2d')
    videoContext.imageSmoothingEnabled = false

    const audioContext = new AudioContext()

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
    ])

    const loadLevel = await createLevelLoader(entityFactory)

    const sceneRunner = new SceneRunner()
    
    const level = await loadLevel('debug-coin')

    const playerProgressLayer = createPlayerProgressLayer(font, level)
    const dashboardLayer = createDashboardLayer(font, level)

    const mario = createPlayer(entityFactory.mario())
    mario.player.name = "CKENNY"

    level.entities.add(mario)

    const playerEnv = createPlayerEnv(mario)
    level.entities.add(playerEnv)

    level.compositor.layers.push(createCollisionLayer(level))
    level.compositor.layers.push(dashboardLayer)
    level.compositor.layers.push(playerProgressLayer)

    const inputRouter = setupKeyboard(window)
    inputRouter.addReceiver(mario)

    sceneRunner.addScene(level)

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime : null,
    }

    const timer = new Timer(1/60)

    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime
        sceneRunner.update(gameContext)
    }

    timer.start()

    sceneRunner.runNext()
}

const canvas = document.getElementById('screen')

const start = () => {
    window.removeEventListener('click', start)
    main(canvas)
}
window.addEventListener('click', start)
