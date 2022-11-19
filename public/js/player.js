import LevelTimer from './traits/LevelTimer.js'
import Player from './traits/Player.js'

export function makePlayer(entity, name) {
    const player = new Player()
    player.name = name

    entity.addTrait(player)

    const timer = new LevelTimer()
    entity.addTrait(timer)
}

export function bootstrap(entity, level) {
    entity.traits.get(LevelTimer).reset()
    entity.velocity.set(0, 0)
    entity.position.set(level.checkpoints[0])
    level.entities.add(entity)
}

export function* findPlayers(entities) {
    for (const entity of entities) {
        if (entity.traits.has(Player)) {
            yield entity
        }
    }
}