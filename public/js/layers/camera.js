export function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(context, fromCamera) {
        context.strokeStyle = 'purple'
        context.beginPath()
        context.rect(
            cameraToDraw.position.x - fromCamera.position.x, 
            cameraToDraw.position.y - fromCamera.position.y, 
            cameraToDraw.size.x, cameraToDraw.size.y
            )
        context.stroke()
    }
}