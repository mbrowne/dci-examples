import { LinearMotionPhysics } from './LinearMotionPhysics.js'
import { Body2D } from './Body2D.js'
import { degreesToRadians } from './utils.js'

const DEFAULT_SPEED = 200

/**
 * @type {{
 *     move(angleInRadians: number, distance: number, speed: number): void
 *     goToDestination(destinationPosition: Vector2D): void
 * }}
 */
let RolePlayerContract_linearMotionPhysics

/**
 * Context: Linear Motion Intent
 * How the user or animator intends to move the Body
 * 
 * @param {Body2D} body
 * @param {(body: Body2D) => RolePlayerContract_linearMotionPhysics} physicsContextDeclaration 
 */
export function LinearMotionIntent(body, physicsContextDeclaration = LinearMotionPhysics, speed = DEFAULT_SPEED) {
    const physicsContext = new physicsContextDeclaration(body)

    const roleMethods = roles()
    body = Object.assign(body, roleMethods.body)
    const linearMotionPhysics = Object.assign(physicsContext, roleMethods.linearMotionPhysics)

    return {
        /**
         * @param {Vector} destination 
         */
        rotateAndMoveToDestination(destinationPosition) {
            linearMotionPhysics.rotateTowardDestination(destinationPosition)
            linearMotionPhysics.moveToDestination(destinationPosition, speed)
        },

        forward(distance) {
            linearMotionPhysics.moveForward(distance, speed)
        },

        backward(distance) {
            linearMotionPhysics.moveBackward(distance, speed)
        },
    
        rotateClockwise(angleInDegrees) {
            body.rotate(angleInDegrees)
        },
    
        rotateCounterClockwise(angleInDegrees) {
            body.rotate(-angleInDegrees)
        }
    }

    function roles() {
        return {
            /**
             * @contract {{
             *     get rotation: number
             *     set rotation(angleInRadians: number): void
             * }}
             */
            body: {
                getRotation() {
                    return this.rotation
                },
                
                rotate(angleInDegrees) {
                    this.rotation += degreesToRadians(angleInDegrees)
                },
            },

            /**
             * @contract {RolePlayerContract_linearMotionPhysics}
             */
            linearMotionPhysics: {
                moveForward(distance, speed) {
                    const bearing = body.getRotation() - (Math.PI / 2)
                    linearMotionPhysics.move(bearing, distance, speed)
                },

                moveBackward(distance, speed) {
                    const bearing = body.getRotation() + (Math.PI / 2)
                    linearMotionPhysics.move(bearing, distance, speed)
                },

                moveToDestination(destinationPosition, speed) {
                    this.goToDestination(destinationPosition, speed)
                }
            },
        }
    }
}
