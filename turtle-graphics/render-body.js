/**
 * @param {Body2D} body
 * @param {HTMLElement} gameContainer
 * @returns HTMLImageElement  An <img> that renders an SVG graphic
 */
export function createAndAttachSvgElem({ shape }, gameContainer) {
    const svg = shape.content.cloneNode(true).firstElementChild
    return gameContainer.appendChild(svg)
}

/**
 * @param {Body2D} body
 * @param {HTMLElement} svg
 * @param {HTMLElement} gameContainer
 */
export function initialRender({ position, rotation }, svg, gameContainer) {
    updatePosition({ position }, svg)
    rotate({ rotation }, svg)
}

/**
 * @param {Body2D} body
 * @param {HTMLElement} svg
 */
export function updatePosition({ position }, svg) {
    svg.style.left = position.x + 'px'
    svg.style.top = position.y + 'px'
}

/**
 * @param {Body2D} body
 * @param {HTMLElement} svg
 */
export function rotate({ rotation }, svg) {
    svg.style.rotate = rotation + 'rad'
}
