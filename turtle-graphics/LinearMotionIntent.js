import { LinearMotionPhysics } from './LinearMotionPhysics.js'
import { Body2D } from './Body2D.js'

const DEFAULT_SPEED = 1

/**
 * @type {{
 *     goToward(angleInRadians: number, distance: number, speed: number): void
 *     goToDestination(destinationPosition: Vector2D): void
 * }}
 */
let RolePlayerContract_linearMotionPhysics

/**
 * Context: Linear Motion Intent
 * How the user or animator intends to move the Body
 * 
 * @param {Body2D} body
 * @param {(body: Body2D) => RolePlayerContract_linearMotionPhysics} PhysicsContextDeclaration 
 */
export function LinearMotionIntent(body, PhysicsContextDeclaration = LinearMotionPhysics) {
    const physicsContext = new PhysicsContextDeclaration(body)

    const roleMethods = roles()
    body = Object.assign(body, roleMethods.body)
    const linearMotionPhysics = Object.assign(physicsContext, roleMethods.linearMotionPhysics)

    return {
        /**
         * @param {Vector} destination 
         */
        rotateAndMoveToDestination(destinationPosition) {
            // TODO rotate
            linearMotionPhysics.moveToDestination(destinationPosition)
        },

        forward(distance) {
            body.moveAtCurrentAngle(distance)
        },

        backward(distance) {
            linearMotionPhysics.move(body.rotation + Math.PI, distance)
        },
    
        // backward(distance) {
        //     body.reverseDirection()
        //     body.move(distance)
        // },
    
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
                moveAtCurrentAngle(distance) {
                    linearMotionPhysics.move(this.rotation, distance)
                },

                rotate(angleInDegrees) {
                    this.rotation += convertToRadians(angleInDegrees)
                },

                // reverseDirection() {
                //     this.rotation += Math.PI
                // }
            },

            /**
             * @contract {RolePlayerContract_linearMotionPhysics}
             */
            linearMotionPhysics: {
                move(angleInRadians, distance, speed = DEFAULT_SPEED) {
                    this.goToward(angleInRadians, distance, speed)
                },

                moveToDestination(destinationPosition) {
                    this.goToDestination(destinationPosition)
                }
            },
        }
    }
}
