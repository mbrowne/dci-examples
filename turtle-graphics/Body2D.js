export class Body2D {
    /**
     * @type {Vector2D}
     */
    position
    /**
     * rotation applied to the shape (relative to up/north), as an angle in radians
     * @type {number}
     */
    rotation
    /**
     * @type {HTMLImageElement} An <img> that renders an SVG graphic
     */
    #shape

    /**
     * @param {{ position: Vector2D, bearing: number, shape: HTMLTemplateElement }} args
     */
    constructor({ position, rotation, shape }) {
        this.position = position
        this.rotation = rotation
        this.#shape = shape
    }
    
    get shape() {
        return this.#shape
    }
}
