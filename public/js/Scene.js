import Compositor from './Compositor.js'
import EventEmitter from './EventEmitter.js'


export default class Scene {
    static EVENT_COMPLETE = Symbol('scene complete')

    constructor() {
        this.events = new EventEmitter()
        this.compositor = new Compositor()
    }

    draw(gameContext) {
        this.compositor.draw(gameContext.videoContext)
    }

    update() {

    }

    pause() {
        
    }
}