export class Body2D {
    /**
     * @type {Vector2D}
     */
    position
    /**
     * Angle in radians
     * @type {number}
     */
    angle
    /**
     * @type {HTMLTemplateElement}
     */
    #shape

    /**
     * @param {{ position: Vector2D, angle: number, shape: HTMLTemplateElement }} args
     */
    constructor({ position, angle, shape }) {
        this.position = position
        this.angle = angle
        this.#shape = shape
    }
    
    get shape() {
        return this.#shape
    }
}
