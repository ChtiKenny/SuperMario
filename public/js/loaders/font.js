import { loadImage } from '../loaders.js'
import SpriteSheet from '../SpriteSheet.js'

const CHARS = ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.'

class Font {
    constructor(sprites, size) {
        this.sprites = sprites
        this.size = size
    }

    print(text, context, x, y) {
        [...text.toUpperCase()].forEach((char, position) => {
            this.sprites.draw(char, context, x + position * this.size, y)
        })
    }
}

export function loadFont() {
    return loadImage('./img/font.png')
    .then(image => {
        const fontSprite = new SpriteSheet(image)

        const size = 8
        const rowLength = image.width

        for (let [index, char] of [...CHARS].entries()) {
            const x = index * size % rowLength
            const y = Math.floor(index * size / rowLength) * size

            fontSprite.define(char, x, y, size, size)
        }

        return new Font(fontSprite, size)
    })
}