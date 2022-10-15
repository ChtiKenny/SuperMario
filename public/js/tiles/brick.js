import {Sides} from '../Entity.js'


function handleX({entity, match}) {
    if (entity.velocity.x > 0) {
        if (entity.bounds.right > match.x1) {
            entity.obstruct(Sides.RIGHT, match)
        }
    } else if (entity.velocity.x < 0) {
        if (entity.bounds.left < match.x2) {
            entity.obstruct(Sides.LEFT, match)
        }
    }
}

function handleY({entity, match, resolver, gameContext, level}) {
    if (entity.velocity.y > 0) {
        if (entity.bounds.bottom > match.y1) {
            entity.obstruct(Sides.BOTTOM, match)
        }
    } else if (entity.velocity.y < 0) {
        if (entity.player) {
            const grid = resolver.matrix
            grid.delete(match.indexX, match.indexY)

            const goomba = gameContext.entityFactory.goomba()
            goomba.velocity.set(50, -400)
            goomba.position.set(entity.position.x, match.y1)
            level.entities.add(goomba)
        }

        if (entity.bounds.top < match.y2) {
            entity.bounds.top = match.y2
            entity.velocity.y = 0

            entity.obstruct(Sides.TOP, match)
        }
    }
}

export const brick = [handleX, handleY]