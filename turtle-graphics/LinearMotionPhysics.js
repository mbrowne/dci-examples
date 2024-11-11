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
         * @param {number} speed
         */
        goToDestination(destinationPos, speed) {
            destinationPosition = Object.assign(destinationPos, roleMethods.destinationPosition)
            currentPosition.moveToDestination(speed)
        }
    }

    function roles() {
        return {
            /**
             * @contract {{
             *     add(vector: Vector2D): Vector2D
             *     get x(): number
             *     get y(): number
             * }}
             */
            currentPosition: {
                /**
                 * @param {number} speed 
                 */
                moveToDestination(speed) {
                    // Kudos to this article for an intro to the math used in this method:
                    // https://www.gamedev.net/tutorials/programming/math-and-physics/vector-maths-for-game-dev-beginners-r5442/

                    const vectorBetweenPositions = destinationPosition.subtractVector(currentPosition)
                    const totalDistanceToMove = vectorBetweenPositions.magnitude

                    const movementDirectionVector = vectorBetweenPositions.normalize()
                    
                    function angleBetween(v1, v2) {
                        const dotProduct = v1.x * v2.x + v1.y * v2.y;                      
                        const cosTheta = dotProduct / (v1.magnitude * v2.magnitude);
                        return Math.acos(cosTheta);
                    }

                    // TODO
                    // if we in fact need to call this.normalize(), it should be added
                    // to the role contract
                    // const angle = angleBetween(this.normalize(), movementDirectionVector)
                    const angle = movementDirectionVector.angle + (Math.PI / 2)
                    console.log('angle: ', angle);
                    body.changeAngle(angle)

                    let prevTimestamp = 0
                    let distanceMoved = 0

                    const animate = (timestamp) => {
                        const timeDelta = prevTimestamp === 0 ? 0: timestamp - prevTimestamp

                        const remainingDistance = totalDistanceToMove - distanceMoved
                        const distanceToMove = Math.min((timeDelta / 1000) * speed, remainingDistance)

                        body.changePosition( currentPosition.add(movementDirectionVector.multiply(distanceToMove)) )

                        distanceMoved += distanceToMove

                        if (distanceMoved < totalDistanceToMove) {
                            prevTimestamp = timestamp
                            window.requestAnimationFrame(animate)
                        }
                    }

                    window.requestAnimationFrame(animate)
                }
            },
            
            /**
             * @contract {{
             *     subtract(vector: Vector2D): Vector2D
             *     get x(): number
             *     get y(): number
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
                changeAngle(angleInRadians) {
                    this.angle = angleInRadians
                },

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