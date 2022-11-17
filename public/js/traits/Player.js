import Trait from '../Trait.js'
import Stomper from './Stomper.js'

const CONST_LIFE_THRESHOLD = 100

export default class Player extends Trait {
    constructor() {
        super()
        this.coins = 0
        this.lives = 3
        this.score = 0
        this.name = 'UNNAMED'

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100
        })
    }

    addCoins(count) {
        this.coins += count
        this.queue(entity => entity.sounds.add('coin'))
        while (this.coins >= CONST_LIFE_THRESHOLD) {
            this.addLives(1)
            this.coins -= CONST_LIFE_THRESHOLD
        }
    }

    addLives(count) {
        this.lives += count
    }
}
