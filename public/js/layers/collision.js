function createEntityLayers(entities) {
    return function drawBoundingBox(context, camera) {
        context.strokeStyle = 'red'
        entities.forEach(entity => {
            context.beginPath()
            context.rect(
                entity.bounds.left - camera.position.x, 
                entity.bounds.top - camera.position.y, 
                entity.size.x, entity.size.y
                )
            context.stroke()
        })
    }
}

function createTileCandidateLayers(tileCollider) {
    const resolvedTiles = []

    const tileResolver = tileCollider.tiles
    const tileSize = tileResolver.tileSize

    const getByIndexOriginal = tileResolver.getByIndex
    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedTiles.push({x, y})
        return getByIndexOriginal.call(tileResolver, x, y)
    }

    return function drawTileCandidate(context, camera) {
        context.strokeStyle = 'blue'
        resolvedTiles.forEach(({x,y}) => {
            context.beginPath()
            context.rect(
                x * tileSize - camera.position.x,
                y * tileSize - camera.position.y, 
                tileSize, tileSize
                )
            context.stroke()
        })
        resolvedTiles.length = 0
    }
}

export function createCollisionLayer(level) {
    const drawTileCandidates = createTileCandidateLayers(level.tileCollider)
    const drawBoundingBoxes = createEntityLayers(level.entities)

    return function drawCollision(context, camera) {
        drawTileCandidates(context, camera)
        drawBoundingBoxes(context, camera)
    }
}