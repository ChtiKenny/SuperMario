import Vector from './Vector.js'
import BoundingBox from './BoundingBox.js'
import AudioBoard from './AudioBoard.js'

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM : Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT : Symbol('right'),
}

export class Trait {
    constructor(name) {
        this.NAME = name

        this.sounds = new Set()
        this.tasks = []
    }

    finalize() {
        this.tasks.forEach(task => task())
        this.tasks.length = 0
    }

    obstruct(){
        
    }

    queue(task) {
        this.tasks.push(task)
    }

    collides(us, them){

    }

    playSounds(audioBoard, audioContext) {
        this.sounds.forEach(name => {
            audioBoard.playAudio(name, audioContext)
        })

        this.sounds.clear()
    }

    update() {

    }
}
export default class Entity {
    constructor() {
        this.audio = new AudioBoard()
        this.position = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.size = new Vector(0, 0)
        this.offset = new Vector(0, 0)
        this.bounds = new BoundingBox(this.position, this.size, this.offset)
        this.lifetime = 0

        this.traits = []
    }

    addTrait(trait) {
        this.traits.push(trait)
        this[trait.NAME] = trait
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

    draw() {}

    finalize() {
        this.traits.forEach(trait => trait.finalize())
    }

    update(gameContext, level) {
        this.traits.forEach(trait => {
            trait.update(this, gameContext, level)
            trait.playSounds(this.audio, gameContext.audioContext)
        })

        this.lifetime += gameContext.deltaTime
    }
}