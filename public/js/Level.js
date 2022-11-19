import Camera from './Camera.js'
import TileCollider from './TileCollider.js'
import EntityCollider from './EntityCollider.js'
import MusicController from './MusicController.js'
import { findPlayers } from './player.js'
import Scene from './Scene.js'
import clamp from './Clamp.js'

function focusPlayer(level) {
    for (const player of findPlayers(level.entities)) {
        level.camera.position.x = clamp(
            player.position.x - 100,
            level.camera.min.x,
            level.camera.max.x - level.camera.size.x)
    }
}

export default class Level extends Scene {
    static EVENT_TRIGGER = Symbol('trigger')

    constructor() {
        super()

        this.name = ''
        this.checkpoints = []
        this.gravity = 1500
        this.totalTime = 0

        this.camera = new Camera()

        this.music = new MusicController()

        this.entities = new Set()

        this.entityCollider = new EntityCollider(this.entities)
        this.tileCollider = new TileCollider()
    }

    draw(gameContext) {
        this.compositor.draw(gameContext.videoContext, this.camera)
    }

    update(gameContext) {
        this.entities.forEach(entity => {
            entity.update(gameContext, this)
        })

        this.entities.forEach(entity => {
            this.entityCollider.check(entity)
        })


        this.entities.forEach(entity => entity.finalize())

        focusPlayer(this)

        this.totalTime += gameContext.deltaTime
    }

    pause() {
        this.music.pause()
    }
}