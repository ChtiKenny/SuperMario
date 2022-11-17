import Scene from './Scene.js'


export default class TimedScene extends Scene {
    constructor() {
        super ()
        this.countdown = 2
    }

    update(gameContext) {
        this.countdown -= gameContext.deltaTime

        if (this.countdown <= 0) {
            this.events.emit(Scene.EVENT_COMPLETE)
        }
    }
}