export function setupMouseControl(canvas, entity, camera) { 
    let lastEvent
    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if (event.buttons === 1) {
                entity.velocity.set(0,0)
                entity.position.set(
                    event.offsetX + camera.position.x, 
                    event.offsetY + camera.position.y
                )
            } else if (event.buttons === 2
                && lastEvent && lastEvent.buttons === 2
                && lastEvent.type === 'mousemove') {
                    camera.position.x -= event.offsetX - lastEvent.offsetX
            }
            lastEvent = event
        })  
    })

    canvas.addEventListener('contextmenu', e => e.preventDefault())
}