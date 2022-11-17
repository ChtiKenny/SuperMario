import Trait from '../Trait.js'

export default class Go extends Trait {
    constructor() {
        super()
        this.direction = 0
        this.acceleration = 400
        this.deceleration = 300
        this.dragFactor = 1/5000

        this.distance = 0
        this.heading = 1
    }

    update(entity, {deltaTime}) {
        const absX = Math.abs(entity.velocity.x)
        if (this.direction) {
            entity.velocity.x += this.acceleration * deltaTime * this.direction 
            
            if (entity.jump) {
                if (entity.jump.falling === false) {
                    this.heading = this.direction
                }
            } else {
                this.heading = this.direction
            }
        } else if (entity.velocity.x !== 0) {
            const deceleration = Math.min(absX, this.deceleration * deltaTime)
            entity.velocity.x += entity.velocity.x > 0 ? -deceleration : deceleration
        } else {
            this.distance = 0
        }

        const drag = this.dragFactor * entity.velocity.x * absX
        entity.velocity.x -= drag
        
        this.distance += absX * deltaTime
    }
}
