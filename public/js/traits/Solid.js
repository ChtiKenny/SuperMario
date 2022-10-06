import { Trait, Sides } from '../Entity.js'

export default class Solid extends Trait {
    constructor() {
        super('solid')
        this.obstructs = true
    }

    obstruct(entity, side, match) {
        if (!this.obstructs) return
        if (side === Sides.BOTTOM) {
            entity.bounds.bottom = match.y1
            entity.velocity.y = 0
        }
        if (side === Sides.TOP) {
            entity.bounds.top = match.y2
            entity.velocity.y = 0
        }
        if (side === Sides.RIGHT) {
            entity.bounds.right = match.x1
            entity.velocity.x = 0
        }
        if (side === Sides.LEFT) {
            entity.bounds.left = match.x2
            entity.velocity.x = 0
        }

    }
}
