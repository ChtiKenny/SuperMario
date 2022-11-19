import Matrix from '../Matrix.js';
import Level from '../Level.js';
import { createBackgroundLayer } from '../layers/background.js';
import { createSpriteLayer } from '../layers/sprites.js';
import { loadMusicSheet } from './music.js';
import { loadSpriteSheet } from './sprite.js';
import { loadJSON } from '../loaders.js'
import Entity from '../Entity.js';
import Trait from '../Trait.js';
import LevelTimer from '../traits/LevelTimer.js';
import Trigger from '../traits/Trigger.js';
import Vector from '../Vector.js';

function createSpawner() {
    class Spawner extends Trait {
        constructor() {
            super()
            this.entities = []
            this.offsetX = 64
        }

        addEntity(entity) {
            this.entities.push(entity)
            this.entities.sort((a, b) => a.position.x < b.position.x ? -1 : 1)
        }

        update(entity, gameContext, level) {
            const cameraMaxX = level.camera.position.x + level.camera.size.x + this.offsetX
            while (this.entities[0]) {
                if (cameraMaxX > this.entities[0].position.x) {
                    level.entities.add(this.entities.shift())
                } else {
                    break
                }
            }
        }
    }
    return new Spawner()
}

function loadPattern(name) {
    return loadJSON(`./sprites/patterns/${name}.json`)
}

function setupBehavior(level) {
    level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
        level.music.playTheme()
    })
    level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
        level.music.playHurryTheme()
    })
}

function setupBackgrounds(levelSpec, level, backgroundSprites, patterns) {
    levelSpec.layers.forEach(layer => {
        const grid = createGrid(layer.tiles, patterns)
        const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites)
        level.compositor.layers.push(backgroundLayer)
        level.tileCollider.addGrid(grid)
    })
}

function setupCamera(level) {
    let maxX = 0;
    let maxTileSize = 0;
    for (const resolver of level.tileCollider.resolvers) {
        if (resolver.tileSize > maxTileSize) {
            maxTileSize = resolver.tileSize;
        }
        resolver.matrix.forEach((tile, x, y) => {
            if (x > maxX) {
                maxX = x;
            }
        });
    }
    level.camera.max.x = maxX * maxTileSize;
}

function setupCheckpoints(levelSpec, level) {
    levelSpec.checkpoints.forEach(([x, y]) => {
        level.checkpoints.push(new Vector(x, y))
    })
}

function setupEntities(levelSpec, level, entityFactory) {
    const spawner = createSpawner()
    levelSpec.entities.forEach(entitySpec => {
        const {name, pos: [x, y], props} = entitySpec
        const createEntity = entityFactory[name]

        if (!createEntity) throw new Error(`No entity ${name}`)

        const entity = createEntity(props)
        entity.position.set(x, y)

        spawner.addEntity(entity)
    })

    const entityProxy = new Entity()
    entityProxy.addTrait(spawner)
    level.entities.add(entityProxy)

    const spriteLayer = createSpriteLayer(level.entities)
    level.compositor.layers.push(spriteLayer)
}

function setupTriggers(levelSpec, level) {
    if (!levelSpec.triggers) return

    for (const triggerSpec of levelSpec.triggers) {
        const trigger = new Trigger()

        trigger.conditions.push((entity, touches, gc, level) => {
            level.events.emit(Level.EVENT_TRIGGER, triggerSpec, entity, touches)
        })

        const entity = new Entity()
        entity.addTrait(trigger)
        entity.position.set(triggerSpec.pos)
        entity.size.set(64, 64)
        level.entities.add(entity)
    }
}

export function createLevelLoader(entityFactory) {
    return function loadLevel(name) {
        return loadJSON(`./levels/${name}.json`)
        .then(levelSpec => Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet),
            loadMusicSheet(levelSpec.musicSheet),
            loadPattern(levelSpec.patternSheet),
        ]))
        .then(([levelSpec, backgroundSprites, musicPlayer, patterns]) => {
            const level = new Level()
            level.name = name
            level.music.setPlayer(musicPlayer)

            setupBackgrounds(levelSpec, level, backgroundSprites, patterns)
            setupEntities(levelSpec, level, entityFactory)
            setupTriggers(levelSpec, level)
            setupCheckpoints(levelSpec, level)
            setupBehavior(level)
            setupCamera(level)

            return level
        })
    }
}

function createGrid(tiles, patterns) {
    const grid = new Matrix()
    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, tile)
    }
    return grid
}

function* expandSpan(xStart, xLength, yStart, yLength) {
    const xEnd = xStart + xLength
    const yEnd = yStart + yLength
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            yield {x, y}
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLength, yStart, yLength] = range
        return expandSpan(xStart, xLength, yStart, yLength)

    } else if (range.length === 3) {
        const [xStart, xLength, yStart] = range
        return expandSpan(xStart, xLength, yStart, 1)

    } else if (range.length === 2) {
        const [xStart, yStart] = range
        return expandSpan(xStart, 1, yStart, 1)
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        yield* expandRange(range)
    }
}

function* expandTiles(tiles, patterns,) {
    function* walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX
                const derivedY = y + offsetY

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles
                    yield* walkTiles(tiles, derivedX, derivedY)
                } else {
                    yield {
                        tile,
                        x: derivedX,
                        y: derivedY,
                    }
                }
            }
        }
    }

    yield* walkTiles(tiles, 0, 0)
}
