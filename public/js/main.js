import Camera from './Camera.js'
import Timer from './Timer.js'
import { createLevelLoader } from './loaders/level.js'
import { loadFont } from './loaders/font.js'
import { loadEntities } from './entities.js'
import {setupKeyboard} from './input.js'
import { createCollisionLayer } from './layers/collision.js'
import { createDashboardLayer } from './layers/dashboard.js'
import PlayerController from './traits/PlayerController.js'
import Entity from './Entity.js'
import Solid from './traits/Solid.js'

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity()
    const playerControl = new PlayerController()
    playerControl.checkpoint.set(64, 64)
    playerControl.setPlayer(playerEntity)
    playerEnv.addTrait(playerControl)
    playerEnv.addTrait(new Solid())

    return playerEnv
}

async function main(canvas) {
    const context = canvas.getContext('2d')
    context.imageSmoothingEnabled = false

    const [entityFactory, font] = await Promise.all([
        loadEntities(),
        loadFont(),
    ])
    const level = await createLevelLoader(entityFactory)('1-1')

    const camera = new Camera()

    const mario = entityFactory.mario()

    const playerEnv = createPlayerEnv(mario)
    level.entities.add(playerEnv)

    level.compositor.layers.push(createCollisionLayer(level))
    level.compositor.layers.push(createDashboardLayer(font, playerEnv))

    const input = setupKeyboard(mario)
    input.listenTo(window)

    const timer = new Timer(1/60)

    timer.update = function update(deltaTime) {
        level.update(deltaTime)

        camera.position.x = Math.max(0, mario.position.x - 100)

        level.compositor.draw(context, camera)
    }

    timer.start()
}

const canvas = document.getElementById('screen')

main(canvas)