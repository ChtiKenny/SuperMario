import Timer from './Timer.js'
import { createLevelLoader } from './loaders/level.js'
import { loadFont } from './loaders/font.js'
import { loadEntities } from './entities.js'
import {setupKeyboard} from './input.js'
import { createCollisionLayer } from './layers/collision.js'
import { createDashboardLayer } from './layers/dashboard.js'
import { makePlayer, bootstrap, findPlayers } from './player.js'
import SceneRunner from './SceneRunner.js'
import { createPlayerProgressLayer } from './layers/player-progress.js'
import TimedScene from './TimedScene.js'
import { createColorLayer } from './layers/color.js'
import Level from './Level.js'
import Scene from './Scene.js'
import { createTextLayer } from './layers/text.js'

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

    const mario = entityFactory.mario()
    makePlayer(mario, 'CKENNY')

    const inputRouter = setupKeyboard(window)
    inputRouter.addReceiver(mario)

    async function runLevel(name) {        
        const loadScreen = new Scene()
        loadScreen.compositor.layers.push(createColorLayer('#000'))
        loadScreen.compositor.layers.push(createTextLayer(font, `Loading ${name} ...`))
        sceneRunner.addScene(loadScreen)
        sceneRunner.runNext()

        const level = await loadLevel(name)
        bootstrap(mario, level)

        level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches)=> {
            if (spec.type === 'goto') {
                for (const _ of findPlayers(touches)) {
                    runLevel(spec.name)
                    return
                }
            }
        })

        const playerProgressLayer = createPlayerProgressLayer(font, level)
        const dashboardLayer = createDashboardLayer(font, level)
        
        const waitScreen = new TimedScene()
        waitScreen.compositor.layers.push(createColorLayer('#000'))
        waitScreen.compositor.layers.push(dashboardLayer)
        waitScreen.compositor.layers.push(playerProgressLayer)
        sceneRunner.addScene(waitScreen)


        level.compositor.layers.push(createCollisionLayer(level))
        level.compositor.layers.push(dashboardLayer)
        sceneRunner.addScene(level)
    
        sceneRunner.runNext()
    }

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime : null,
        tick: 0,
    }

    const timer = new Timer(1/60)

    timer.update = function update(deltaTime) {
        gameContext.tick++
        gameContext.deltaTime = deltaTime
        sceneRunner.update(gameContext)
    }

    timer.start()

    runLevel('debug-progression')
}

const canvas = document.getElementById('screen')

const start = () => {
    window.removeEventListener('click', start)
    main(canvas)
}
window.addEventListener('click', start)
