import { createBackgroundLayer, createSpriteLayer } from './layers.js'
import { loadBackgroundSprites } from './sprites.js'
import Level from "./Level.js";

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image()
        image.addEventListener('load', () => {
            resolve(image)
        });
        image.src = url
    })
}

function createTiles(level, backgrounds) {
    backgrounds.forEach(background => {
        background.ranges.forEach(([x1, x2, y1, y2]) => {
            for (let x = x1; x < x2; x++) {
                for (let y = y1; y < y2; y++) {
                    level.tiles.set(x, y, {
                        name: background.tile,
                    })
                }
            }
        })
    })
}


export function loadLevel(name) {
    return Promise.all([
        fetch(`/levels/${name}.json`)
        .then(r => r.json()),

        loadBackgroundSprites(),

    ])
    .then(([levelSpecifications, backgroundSprites]) => {
        const level = new Level()

        createTiles(level, levelSpecifications.backgrounds)

        const backgroundLayer = createBackgroundLayer(level, backgroundSprites)
        level.compositor.layers.push(backgroundLayer)

        const spriteLayer = createSpriteLayer(level.entities)
        level.compositor.layers.push(spriteLayer)

        return level
    })
}