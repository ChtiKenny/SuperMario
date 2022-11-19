import Vector from './Vector.js';

export default class Camera {
    constructor() {
        this.position = new Vector(0,0)
        this.size = new Vector(256,224)

        this.min = new Vector(0, 0)
        this.max = new Vector(Infinity, Infinity)
    }
}