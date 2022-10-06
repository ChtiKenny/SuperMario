import Camera from './Camera.js'
import Timer from './Timer.js'
import { createLevelLoader } from './loaders/level.js'
import { loadEntities } from './entities.js'
import {setupKeyboard} from './input.js'
import { createCollisionLayer } from './layers.js'
import PlayerController from './traits/PlayerController.js'
import Entity from './Entity.js'

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity()
    const playerControl = new PlayerController()
    playerControl.checkpoint.set(64, 64)
    playerControl.setPlayer(playerEntity)
    playerEnv.addTrait(playerControl)

    return playerEnv
}

async function main(canvas) {
    const context = canvas.getContext('2d')

    const entityFactory = await loadEntities()
    const level = await createLevelLoader(entityFactory)('1-1')

    const camera = new Camera()

    const mario = entityFactory.mario()

    const playerEnv = createPlayerEnv(mario)
    level.entities.add(playerEnv)

    level.compositor.layers.push(createCollisionLayer(level))

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