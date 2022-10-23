import { Trait } from '../Entity.js'
import Stomper from './Stomper.js'

const CONST_LIFE_THRESHOLD = 100

export default class Player extends Trait {
    constructor() {
        super('player')
        this.coins = 0
        this.lives = 3
        this.score = 0
        this.name = "UNNAMED"

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100
        })
    }

    addCoins(count) {
        this.coins += count
        this.queue(entity => entity.sounds.add('coin'))
        if (this.coins >= CONST_LIFE_THRESHOLD) {
            const lifeCount = Math.floor(this.coins / CONST_LIFE_THRESHOLD)
            this.addLives(lifeCount)
            this.coins = this.coins % CONST_LIFE_THRESHOLD
        }
    }

    addLives(count) {
        this.lives += count
    }
}
