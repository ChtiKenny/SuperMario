import Trait from './Trait.js'
import Vector from './Vector.js'
import BoundingBox from './BoundingBox.js'
import AudioBoard from './AudioBoard.js'
import EventBuffer from './EventBuffer.js'

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM : Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT : Symbol('right'),
}

export default class Entity {
    constructor() {
        this.audio = new AudioBoard()
        this.sounds = new Set()
        
        this.events = new EventBuffer()

        this.position = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.size = new Vector(0, 0)
        this.offset = new Vector(0, 0)
        this.bounds = new BoundingBox(this.position, this.size, this.offset)
        this.lifetime = 0

        this.traits = new Map()
    }

    addTrait(trait) {
        this.traits.set(trait.constructor, trait)
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match)
        })
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate)
        })
    }

    finalize() {
        this.events.emit(Trait.EVENT_TASK, this)

        this.traits.forEach(trait => trait.finalize(this))
        this.events.clear()
    }

    playSounds(audioBoard, audioContext) {
        this.sounds.forEach(name => {
            audioBoard.playAudio(name, audioContext)
        })

        this.sounds.clear()
    }

    update(gameContext, level) {
        this.traits.forEach(trait => {
            trait.update(this, gameContext, level)
        })
        
        this.playSounds(this.audio, gameContext.audioContext)

        this.lifetime += gameContext.deltaTime
    }
}