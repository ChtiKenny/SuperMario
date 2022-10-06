import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'
import EntityCollider from './EntityCollider.js'

export default class Level {
    constructor() {
        this.gravity = 1500
        this.totalTime = 0

        this.compositor = new Compositor()
        this.entities = new Set()

        this.entityCollider = new EntityCollider(this.entities)
        this.tileCollider = null
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix)
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime, this)

            entity.position.x += entity.velocity.x * deltaTime
            if (entity.canCollide) this.tileCollider.checkX(entity)

            entity.position.y += entity.velocity.y * deltaTime
            if (entity.canCollide) this.tileCollider.checkY(entity)

            entity.velocity.y += this.gravity * deltaTime
        })

        this.entities.forEach(entity => {
            if (entity.canCollide) this.entityCollider.check(entity)
        })


        this.totalTime += deltaTime
    }
}