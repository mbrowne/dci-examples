export class Body2D {
    /**
     * @type {Vector2D}
     */
    position
    /**
     * bearing relative to up/north (AKA absolute bearing) as an angle in radians
     * @type {number}
     */
    bearing
    /**
     * @type {HTMLTemplateElement}
     */
    #shape

    /**
     * @param {{ position: Vector2D, bearing: number, shape: HTMLTemplateElement }} args
     */
    constructor({ position, bearing, shape }) {
        this.position = position
        this.bearing = bearing
        this.#shape = shape
    }
    
    get shape() {
        return this.#shape
    }
}
