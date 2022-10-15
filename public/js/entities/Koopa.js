import Entity, { Trait } from '../Entity.js'
import { loadSpriteSheet } from '../loaders/sprite.js'
import Killable from '../traits/Killable.js'
import PendulumMove from '../traits/PendulumMove.js'
import Physics from '../traits/Physics.js'
import Solid from '../traits/Solid.js'

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory)
}

const STATE_WALKING = Symbol('walking')
const STATE_HIDING = Symbol('hiding')
const STATE_PANIC = Symbol('panic')

class Behavior extends Trait {
    constructor() {
        super('behavior')

        this.hideTime = 0
        this.hideDuration = 5

        this.walkSpeed = null
        this.panicSpeed = 300

        this.state = STATE_WALKING
    }

    collides(us, them) {
        if (us.killable.dead) return

        if (!them.stomper) return
        if (them.velocity.y > us.velocity.y) return this.handleStomp(us, them)
        
        this.handleNudge(us, them)
    }

    handleNudge(us, them) {
        if (this.state === STATE_WALKING) return them.killable.kill()

        if (this.state === STATE_HIDING) return this.panic(us, them)

        if (this.state === STATE_PANIC) {
            const travelDir = Math.sign(us.velocity.x)
            const impactDir = Math.sign(us.position.x - them.position.x)
            if (travelDir !== 0 && travelDir !== impactDir) them.killable.kill()
        }
    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) return this.hide(us)
        if (this.state === STATE_HIDING) {
            us.killable.kill()
            us.velocity.set(100, -200)
            us.solid.obstructs = false
        } else if (this.state === STATE_PANIC) {
            this.hide(us)
        }
    }

    hide(us) {
        us.velocity.x = 0
        us.pendulumMove.enabled = false
        if (this.walkSpeed === null) this.walkSpeed = us.pendulumMove.speed
        this.hideTime = 0
        this.state = STATE_HIDING
    }

    unhide(us) {
        us.pendulumMove.enabled = true
        us.pendulumMove.speed = this.walkSpeed
        this.state = STATE_WALKING
    }

    panic(us, them) {
        us.pendulumMove.enabled = true
        us.pendulumMove.speed = this.panicSpeed * Math.sign(them.velocity.x)
        this.state = STATE_PANIC
    }

    update(us, deltaTime) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime
            if (this.hideTime > this.hideDuration) {
                this.unhide(us)
            }
        }
    }
}

function createKoopaFactory(sprite) {
    const walkAnim = sprite.animations.get('walk')
    const wakeAnim = sprite.animations.get('wake')

    function routeAnim(koopa) {
        if (koopa.behavior.state === STATE_HIDING && koopa.behavior.hideTime > 3) return wakeAnim(koopa.behavior.hideTime)
        if (koopa.behavior.state === STATE_PANIC || koopa.behavior.state === STATE_HIDING) return 'hiding'
        return walkAnim(koopa.lifetime)
    }

    function drawKoopa(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.velocity.x < 0)
    }

    return function createKoopa() {
        const koopa = new Entity()
        koopa.size.set(16, 16)
        koopa.offset.set(0, 8)

        koopa.addTrait(new PendulumMove())
        koopa.addTrait(new Killable())
        koopa.addTrait(new Behavior())
        koopa.addTrait(new Solid())
        koopa.addTrait(new Physics())

        koopa.draw = drawKoopa

        return koopa
    }
}