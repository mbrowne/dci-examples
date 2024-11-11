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

    /**
     * @type {typeof roleMethods.movementDirection}
     */
    let movementDirection

    const localCache = {
        prevDestination: null,
        vectorToDestination: null
    }

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
         * Change the bearing of the Body to point to the destination
         * @param {Vector2D} destinationPos 
         * @returns 
         */
        rotateTowardDestination(destinationPos) {
            // bind role
            destinationPosition = Object.assign(destinationPos, roleMethods.destinationPosition)
            
            const vectorAngle = destinationPosition.vectorToDestination().angle
            body.changeBearing(vectorAngle + (Math.PI / 2))
        },

        /**
         * @param {Vector2D} destinationPos
         * @param {number} speed
         */
        goToDestination(destinationPos, speed) {
            // bind roles
            destinationPosition = Object.assign(destinationPos, roleMethods.destinationPosition)
            movementDirection = destinationPosition.vectorToDestination().normalize()
            Object.assign(movementDirection, roleMethods.movementDirection)

            currentPosition.moveToDestination(speed)
        },
    }

    // Kudos to this article for an intro to the math used here
    // https://www.gamedev.net/tutorials/programming/math-and-physics/vector-maths-for-game-dev-beginners-r5442/
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
                    const totalDistanceToMove = destinationPosition.totalDistanceToMove()

                    let prevTimestamp = 0
                    let distanceMoved = 0

                    const animate = (timestamp) => {
                        const timeDelta = prevTimestamp === 0 ? 0: timestamp - prevTimestamp

                        const remainingDistance = totalDistanceToMove - distanceMoved
                        const distanceToMove = Math.min((timeDelta / 1000) * speed, remainingDistance)

                        body.changePosition( movementDirection.calculateNextPosition(distanceToMove) )

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
             * }}
             */
            destinationPosition: {
                vectorToDestination() {
                    if (this === localCache.prevDestinationPosition) {
                        return localCache.vectorToDestination
                    }
        
                    const vectorToDest = this.subtract(currentPosition)

                    localCache.prevDestinationPosition = this
                    localCache.vectorToDestination = vectorToDest

                    return vectorToDest
                },

                totalDistanceToMove() {
                    return this.vectorToDestination().magnitude
                },
            },

            /**
             * @contract {{
             *     get angle(): number
             *     multiply(vec: Vector2D): Vector2D
             * }}
             */
            movementDirection: {
                /**
                 * @param {number} distanceToMove 
                 * @returns Vector2D
                 */
                calculateNextPosition(distanceToMove) {
                    return currentPosition.add( this.multiply(distanceToMove) )
                }
            },

            /**
             * @contract {{
             *     set position(pos: Vector2D): void
             *     set bearing(bearingInRadians: number): void
             * }}
             */
            body: {
                changeBearing(bearingInRadians) {
                    this.bearing = bearingInRadians
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