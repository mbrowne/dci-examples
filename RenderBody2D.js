import * as dci from './dci.js'

/**
 * Context: Render the Body in the UI
 * 
 * @param {Body2D} body
 */
export function RenderBody2D(body) {
    const bindRole = dci.makeRoleBinder(roles())
    
    const shape = bindRole(body.shape, 'shape')
    bindRole(body, 'body')

    return {
        renderPosition() {
            shape.renderPosition()
        },

        renderRotation() {
            shape.renderRotation()
        }
    }

    function roles() {
        return {
            /**
             * @contract {{
             *     set style(styles: CSSStyleDeclaration): void
             * }}
             */
            shape: {
                renderPosition() {
                    this.style.left = body.position.x + 'px'
                    this.style.top = body.position.y + 'px'
                },

                renderRotation() {
                    this.style.rotate = body.rotation + 'rad'
                }
            },

            /**
             * @contract {{
             *     get position(): Vector2D
             *     get rotation(): number
             * }}
             */
            body: {
                /**
                 * forward `body.position` getter to the role player
                 */
                position: dci.forward,
                /**
                 * forward `body.rotation` getter to the role player
                 */
                rotation: dci.forward,
            }
        }
    }
}
