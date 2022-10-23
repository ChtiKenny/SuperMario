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

export class Trait {
    static EVENT_TASK = Symbol('task')
    constructor(name) {
        this.NAME = name
        this.listeners = []
    }

    listen(name, callback, count = Infinity) {
        const listener = {name, callback, count}
        this.listeners.push(listener)
    }

    finalize(entity) {
        this.listeners = this.listeners.filter(listener => {
            entity.events.process(listener.name, listener.callback)
            return --listener.count
        })
    }

    obstruct(){
        
    }

    queue(task) {
        this.listen(Trait.EVENT_TASK, task, 1)
    }

    collides(us, them){

    }

    update() {

    }
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
        this.events.emit(Trait.EVENT_TASK)

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