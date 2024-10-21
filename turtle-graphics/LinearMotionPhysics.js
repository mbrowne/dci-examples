import { Vector2D } from './Vector2D.js'
import { Body2D } from './Body2D.js'

/**
 * Context: Linear Motion Physics
 * The implementation of linear motion
 * 
 * @param {Body2D} body 
 */
export function LinearMotionPhysics(body) {
    const roleMethods = roles()
    
    body = Object.assign(body, roleMethods.body)
    let currentPosition = Object.assign(body.position, roleMethods.currentPosition)

    /**
     * @type {typeof roleMethods.destinationPosition}
     */
    let destinationPosition

    return {
        /**
         * @param {number} angleInRadians
         * @param {number} distance
         * @param {number} speed
         */
        //
        // TODO rename this method
        //
        goToward(angleInRadians, distance, speed) {
            
        },

        /**
         * @param {Vector2D} destinationPos 
         */
        goToDestination(destinationPos) {
            destinationPosition = Object.assign(destinationPos, roleMethods.destinationPosition)
            currentPosition.moveToDestination()
        }
    }

    function roles() {
        return {
            currentPosition: {
                moveToDestination() {
                    // Kudos to this article for an intro to the math used here:
                    // https://www.gamedev.net/tutorials/programming/math-and-physics/vector-maths-for-game-dev-beginners-r5442/
                    const movementDirectionVector = destinationPosition.subtractVector(this).normalize()
                    body.changePosition( this.add(movementDirectionVector.multiply(100)) )
                }
            },
            
            /**
             * @contract {{
             *     subtract(vector: Vector2D): Vector2D
             * }}
             */
            destinationPosition: {
                /**
                 * @param {Vector2D} vec 
                 * @returns Vector2D
                 */
                subtractVector(vec) {
                    return this.subtract(vec)
                }
            },

            /**
             * @contract {{
             *     set position(pos: Vector2D): void
             * }}
             */
            body: {
                changePosition(newPosition) {
                    this.position = newPosition
                    
                    // re-bind currentPosition role
                    currentPosition = newPosition
                    Object.assign(currentPosition, roleMethods.currentPosition)
                },
            },
        }
    }
}