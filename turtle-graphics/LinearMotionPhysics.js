import { Vector2D } from './Vector2D.js'
import { Body2D } from './Body2D.js'
import * as dci from './dci.js'

/**
 * Context: Linear Motion Physics
 * The implementation of linear motion
 * 
 * @param {Body2D} body
 */
export function LinearMotionPhysics(body) {
    const bindRole = dci.makeRoleBinder(roles())
    
    body = bindRole(body, 'body')
    let currentPosition = bindRole(body.position, 'currentPosition')

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
        move(angleInRadians, distance, speed) {
            movementDirection = currentPosition.changeAngle(angleInRadians).normalize()
            bindRole(movementDirection, 'movementDirection')

            currentPosition.animateLinearly(distance, speed)
        },

        /**
         * Change the rotation of the Body to point to the destination
         * @param {Vector2D} destinationPos 
         */
        rotateTowardDestination(destinationPos) {
            destinationPosition = bindRole(destinationPos, 'destinationPosition')
            body.rotateTowardDestination()
        },

        /**
         * @param {Vector2D} destinationPos
         * @param {number} speed
         */
        moveToDestination(destinationPos, speed) {
            destinationPosition = bindRole(destinationPos, 'destinationPosition')
            movementDirection = destinationPosition.vectorToDestination().normalize()
            bindRole(movementDirection, 'movementDirection')

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
             *     changeAngle(angleInRadians: number): void
             * }}
             */
            currentPosition: {
                /**
                 * @param {number} speed 
                 */
                moveToDestination(speed) {
                    this.animateLinearly( destinationPosition.totalDistanceToMove(), speed )
                },

                animateLinearly(totalDistanceToMove, speed) {
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
                },

                addDistance(distance) {
                    return movementDirection.calculateNextPosition(distance)
                },

                /**
                 * forward to add() on the role player
                 * @type {(vector: Vector2D) => Vector2D}
                 */
                add: dci.forward,
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
             *     set rotation(rotationInRadians: number): void
             * }}
             */
            body: {
                rotateTowardDestination() {
                    const vectorAngle = destinationPosition.vectorToDestination().angle
                    this.rotation = vectorAngle + (Math.PI / 2)
                },

                changePosition(newPosition) {
                    this.position = newPosition
                    
                    // re-bind currentPosition role
                    currentPosition = bindRole(newPosition, 'currentPosition')
                },
            },
        }
    }
}
