import * as dci from './dci.js'

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
            shape: {
                renderPosition() {
                    this.style.left = body.position.x + 'px'
                    this.style.top = body.position.y + 'px'
                },

                renderRotation() {
                    this.style.rotate = body.rotation + 'rad'
                }
            },

            body: {
                /**
                 * forward `body.position` getter to the role player
                 * @type {{
                 *     get position(): Vector2D
                 * }}
                 */
                position: dci.forward,
                /**
                 * forward `body.rotation` getter to the role player
                 * @type {{
                *     get rotation(): number
                * }}
                */
                rotation: dci.forward,
            }
        }
    }
}
