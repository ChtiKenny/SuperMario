/** 
 * @module Vector 
 */
export default class Vector {
    /**
     * Create a new Vector with the given coordinates
     * @param {number|Vector|number[]} x - a number for the x value, or a Vector Object, or an array of numbers
     * @param {number} y - a number for the y value
     */
    constructor(x, y){
        this.set(x, y)
    }

    /**
     * Set the Vector coordinates
     * @method
     * @param {number|Vector|number[]} x - a number for the x value, or a Vector Object, or an array of numbers
     * @param {number} y - a number for the y value
     * @returns {Vector}
     */
    set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x || 0
            this.y = x.y || 0
            return this
        }
        if (x instanceof Array) {
            this.x = x[0] || 0
            this.y = x[1] || 0
            return this
        }
        this.x = x || 0
        this.y = y || 0
        return this
    }

    /**
     * Returns a copy of the Vector in a new Vector object
     * @method
     * @returns {Vector}
     */
    copy() {
        return new Vector(this)
    }

    /**
     * Add another vector to the vector
     * @method
     * @param {number|Vector|number[]} x - a number for the x value, or a Vector Object, or an array of numbers
     * @param {number} y - a number for the y value
     * @returns {Vector}
     */
    add(x,y) {
        if (x instanceof Vector) {
            this.x += x.x || 0
            this.y += x.y || 0
            return this
        }
        if (x instanceof Array) {
            this.x += x[0] || 0
            this.y += x[1] || 0
            return this
        }
        this.x += x || 0
        this.y += y || 0
        return this
    }

    /**
     * Subtract another vector to the vector
     * @method
     * @param {number|Vector|number[]} x - a number for the x value, or a Vector Object, or an array of numbers
     * @param {number} y - a number for the y value
     * @returns {Vector}
     */
    subtract(x,y) {
        if (x instanceof Vector) {
            this.x -= x.x || 0
            this.y -= x.y || 0
            return this
        }
        if (x instanceof Array) {
            this.x -= x[0] || 0
            this.y -= x[1] || 0
            return this
        }
        this.x -= x || 0
        this.y -= y || 0
        return this
    }

    /**
     * Multiply the Vector by a number
     * @method
     * @param {number} scaler
     * @returns {Vector}
     */
    multiply(scaler) {
        if (!(typeof scaler === 'number' && isFinite(scaler))) {
            console.warn(
                'Vector.multiply:',
                'scaler is undefined or not a finite number'
            );
            return this;
        }
        this.x *= scaler;
        this.y *= scaler;
        return this;
    }

    /**
     * Divide the vector by a number
     * @method
     * @param {number} scaler 
     * @returns {Vector}
     */
    divide(scaler) {
        if (!(typeof scaler === 'number' && isFinite(scaler))) {
            console.warn(
                'Vector.divide:',
                'scaler is undefined or not a finite number'
            );
        return this;
        }
        if (scaler === 0) {
            console.warn('Vector.divide:', 'divide by 0');
        return this;
        }
        this.x /= scaler;
        this.y /= scaler;
        return this;
    }

    /**
     * Normalize the vector
     * @method
     * @returns {Vector}
     */
    normalize() {
        let length = this.magnitude();
        if (length !== 0) this.multiply(1/length);
        return this;
    }

    /**
     * Set the vector magnitude
     * @method
     * @param {number} magnitude 
     * @returns {vector}
     */
    setMagnitude( magnitude) {
        return this.normalize().multiply(magnitude)
    }

    /**
     * Return the magnitude of the vector
     * @method
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt(this.magnitudeSquared())
    }

    /**
     * Return the squared magnitude of the vector
     * @method
     * @returns {number}
     */
    magnitudeSquared() {
        return (this.x * this.x + this.y * this.y)
    }

    /**
     * Return the dot product between this vector and another
     * @method
     * @param {number|Vector|number[]} x - a number for the x value, or a Vector Object, or an array of numbers
     * @param {number} y - a number for the y value
     * @returns {Vector}
     */
    dotProduct(x,y) {
        if (x instanceof Vector) {
            return this.dotProduct(x.x, x.y);
        }
        return this.x * (x || 0) + this.y * (y || 0);
    }

    /**
     * Return the distance between the vector and another vector
     * @method
     * @param {Vector} vector 
     * @returns {vector}
     */
    distance(vector) {
        return vector.copy().subtract(this).magnitude()
    }

    /**
     * Limit the magnitude of the vector by a maximum value
     * @method
     * @param {number} maximum 
     * @returns {Vector}
     */
    limit(maximum) {
        let magnitudeSquared = this.magnitudeSquared()
        if (magnitudeSquared > maximum*maximum) {
            this.divide(Math.sqrt(magnitudeSquared)).multiply(maximum)
        }
        return this
    }

    /**
     * Return the angle of the vector (in radians)
     * @method
     * @returns {number}
     */
    heading() {
        return Math.atan2(this.y, this.x)
    }
    
    /**
     * Set the new angle of the Vector
     * @method
     * @param {number} angle - angle to rotate the vector by (in radians)
     * @returns {Vector}
     */
    setAngle(angle) {
        let magnitude  = this.magnitude
        this.x = Math.cos(angle) * magnitude
        this.y = Math.sin(angle) * magnitude
        return this
    }

    /**
     * Rotate the vector
     * @method
     * @param {number} angle - angle to rotate the vector by (in radians)
     * @returns {Vector}
     */
    rotate(angle) {
        return this.setAngle(this.heading + angle)
    }

    /**
     * Return the angle between the vector and another vector
     * @method
     * @param {Vector} vector 
     * @returns {Vector}
     */
    angleBetween(vector) {
        let angle = Math.acos(
            Math.min(1,
                Math.max(-1, 
                    this.dotProduct(vector) / (this.magnitude() * vector.magnitude())
                )
            )
        )
        return angle;
    }

    /**
     * Return the Linear Interpolation between the vector and another vector by a given percentage
     * @method
     * @param {number|Vector} x - vector or x coordinate of a vector
     * @param {number} y - y coordinate of a vector
     * @param {number} percentage - percentage of the interpolation
     * @returns {Vector}
     */
    lerp (x, y, percentage) {
        if (x instanceof Vector) return this.lerp(x.x, x.y, y)

        this.x += (x - this.x) * percentage || 0
        this.y += (y - this.y) * percentage || 0
        return this
    }

    /**
     * Return a string representation of the vector
     * @method
     * @returns {string}
     */
    toString() {
        return `Vector Object : [${this.x}, ${this.y}]`
    }

    /**
     * Return an array representation of the vector
     * @method
     * @returns {number[]}
     */
    toArray() {
        return [this.x || 0, this.y || 0]
    }

    /**
     * Return a boolean if the vector is equal to another
     * @method
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    isEqual(x, y) {
        var a, b
        if (x instanceof Vector) {
            a = x.x || 0
            b = x.y || 0
        } else if (x instanceof Array) {
            a = x[0] || 0
            b = x[1] || 0
        } else {
            a = x || 0
            b = y || 0
        }
        return this.x === a && this.y === b;
    }

  // Static Methods

    /**
     * Create a new vector from a given angle
     * @method
     * @param {number} angle 
     * @param {number} magnitude 
     * @returns {Vector}
     */
    static fromAngle = (angle, magnitude) => {
        if (typeof magnitude === 'undefined') magnitude = 1
        return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle))
    }

    /**
     * Create a random 2D vector
     * @method
     * @returns {Vector}
     */
    static random2D = () => this.fromAngle(Math.random() * Math.PI * 2)

    /**
     * Add 2 vectors together and return the sum in a 3rd vector
     * @method
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @param {Vector=} target - optional vector to receive the sum
     * @returns {Vector}
     */
    static add = (vector1, vector2, target) => {
        if (!target) target = vector1.copy()
        return target.set(vector1).add(vector2)
    }

    /**
     * Subtract 2 vectors together and return the difference in a 3rd vector
     * @method
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @param {Vector=} target - optional vector to receive the difference
     * @returns {Vector}
     */
    static subtract = (vector1, vector2, target) => {
        if (!target) target = vector1.copy()
        return target.set(vector1).subtract(vector2)
    }

    /**
     * Multiply 2 vectors together and return the product in a 2nd vector
     * @method
     * @param {Vector} vector 
     * @param {number} scaler 
     * @param {Vector=} target - optional vector to receive the product
     * @returns {Vector}
     */
    static multiply = (vector, scaler, target) => {
        if (!target) target = vector.copy()
        return target.set(vector).multiply(scaler)
    }

    /**
     * Divide 2 vectors together and return the quotient in a 2nd vector
     * @method
     * @param {Vector} vector 
     * @param {number} scaler 
     * @param {Vector=} target - optional vector to receive the quotient
     * @returns {Vector}
     */
    static divide = (vector, scaler, target) => {
        if (!target) target = vector.copy()
        return target.set(vector).divide(scaler)
    }

    /**
     * Return the dot product between 2 vectors
     * @method
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @returns {number}
     */
    static dotProduct = (vector1, vector2) => vector1.dotProduct(vector2)

    /**
     * Return the distance between 2 vectors
     * @method
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @returns {number}
     */
    static distance = (vector1, vector2) => vector1.distance(vector2)

    /**
     * Return the Linear Interpolation between 2 vectors by a given percentage into a 3rd vector
     * @method
     * @static
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @param {number} percentage 
     * @param {Vector=} target 
     * @returns {Vector}
     */
    static lerp = (vector1, vector2, percentage, target) => {
        if (!target) target = vector1.copy()
        return target.set(vector1).lerp(vector2, percentage)
    }
  static mag(vec) {
    var x = vec.x,
        y = vec.y;
    var magSq = x * x + y * y;
    return Math.sqrt(magSq);
  }

    /**
     * Return the magnitude of a Vector
     * @param {Vector} vector 
     * @returns {number}
     */
    static magnitude = vector => Math.sqrt(vector.x * vector.x + vector.y *vector.y)
}
