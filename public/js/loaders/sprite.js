import SpriteSheet from '../SpriteSheet.js';
import { createAnim } from '../anim.js'
import { loadJSON, loadImage } from '../loaders.js'


export function loadSpriteSheet(name) {
    return loadJSON(`./sprites/${name}.json`)
    .then(sheetSpec => Promise.all([
        sheetSpec,
        loadImage(sheetSpec.imageUrl),
    ]))
    .then(([sheetSpec, image]) => {
        const sprites = new SpriteSheet(
            image, 
            sheetSpec.tileW, 
            sheetSpec.tileH
        )

        if (sheetSpec.tiles) {
            sheetSpec.tiles.forEach(tileSpec => {
                sprites.defineTile(
                    tileSpec.name, 
                    tileSpec.index[0], 
                    tileSpec.index[1]
                )
            })
        }

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(frameSpec => {
                sprites.define(frameSpec.name, ...frameSpec.rect)
            })
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach(animSpec => {
                const animation = createAnim(animSpec.frames, animSpec.frameLength)
                sprites.defineAnim(animSpec.name, animation)
            })
        }

        return sprites
    })
}