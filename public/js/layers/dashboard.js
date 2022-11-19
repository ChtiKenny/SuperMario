import { findPlayers } from '../player.js'
import Player from '../traits/Player.js'
import LevelTimer from '../traits/LevelTimer.js'

function getPlayerTraits(entities) {
    for (const entity of findPlayers(entities)) {
        return entity.traits.get(Player)
    }
}
function getTimerTrait(level) {
    for (const entity of level.entities) {
        if (entity.traits.has(LevelTimer)) {
            return entity.traits.get(LevelTimer)
        }
    }
}

export function createDashboardLayer(font, level) {
    const LINE1 = font.size * 2
    const LINE2 = font.size * 3
    
    const timerTrait = getTimerTrait(level)

    return function drawDashboard(context) {
        const playerTraits = getPlayerTraits(level.entities)
        
        font.print(playerTraits.name, context, 24, LINE1)
        font.print(playerTraits.score.toString().padStart(6, '0'), context, 24, LINE2)

        font.print('@x' + playerTraits.coins.toString().padStart(2, '0'), context, 96, LINE2)

        font.print('WORLD', context, 152, LINE1)
        font.print(level.name.toUpperCase(), context, 160, LINE2)

        font.print('TIME', context, 200, LINE1)
        font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), context, 208, LINE2)
    }
}

