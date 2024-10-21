export class Vector2D {
    /**
     * @type {number}
     */
    #x

    /**
     * @type {number}
     */
    #y

    /**
     * Instantiate a new 2-dimensional vector that can be used for anything.
     * If it's a position vector, the xDifference and yDifference are typically relative
     * to the origin (0, 0).
     * 
     * @param {number} xDifference  horizontal difference
     * @param {number} yDifference  vertical difference
     */
    constructor(xDifference, yDifference) {
        this.#x = xDifference
        this.#y = yDifference
    }

    get x() { return this.#x }

    get y() { return this.#y }

    /**
     * @returns {number} angle in radians
     */
    get angle() {
        return Math.atan2(this.#y, this.#x)
    }

    get magnitude() {
        return Math.sqrt(this.#x * this.#x + this.#y * this.#y)
    }

    /**
     * @param {number} angleInRadians 
     * @returns Vector2D
     */
    changeAngle(angleInRadians) {
        const magnitude = this.magnitude
        return new Vector2D(Math.cos(angleInRadians) * magnitude, Math.sin(angleInRadians) * magnitude)
    }

    changeMagnitude(magnitude) {
        const angle = this.angle
        return new Vector2D(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude)
    }

    add(vector) {
        return new Vector2D(this.#x + vector.x, this.#y + vector.y)
    }

    subtract(vector) {
        return new Vector2D(this.#x - vector.x, this.#y - vector.y)
    }

    /**
     * @param {number} scalar 
     * @returns Vector
     */
    multiply(scalar) {
        return new Vector2D(this.#x * scalar, this.#y * scalar)
    }

    divide(scalar) {
        return new Vector2D(this.#x / scalar, this.#y / scalar)
    }

    normalize() {
        const magnitude = this.magnitude
        return new Vector2D(this.#x / magnitude, this.#y / magnitude)
    }
}
