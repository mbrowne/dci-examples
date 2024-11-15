import { LinearMotionPhysics } from './LinearMotionPhysics.js'
import { Body2D } from './Body2D.js'
import { degreesToRadians } from './utils.js'
import * as dci from './dci.js'

const DEFAULT_SPEED = 200

/**
 * @typedef {Object} RolePlayerContract_linearMotionPhysics {{
 * @property {(angleInRadians: number, distance: number, speed: number) => void} move
 * @property {(destinationPosition: Vector2D, speed: number) => void)} moveToDestination
 */

/**
 * Context: Linear Motion Intent
 * How the user or animator intends to move the Body
 *
 * @param {Body2D} body
 * @param {(body: Body2D) => RolePlayerContract_linearMotionPhysics} physicsContextDeclaration
 * @param {number} speed (distance per second)
 */
export function LinearMotionIntent(
    body,
    physicsContextDeclaration = LinearMotionPhysics,
    speed = DEFAULT_SPEED
) {
    const physicsContext = new physicsContextDeclaration(body)
    const bindRole = dci.makeRoleBinder(roles())
    body = bindRole(body, 'body')
    const linearMotionPhysics = bindRole(physicsContext, 'linearMotionPhysics')

    return {
        /**
         * @param {Vector2D} destination
         */
        rotateAndMoveToDestination(destinationPosition) {
            linearMotionPhysics.rotateTowardDestination(destinationPosition)
            linearMotionPhysics.moveToDestination(destinationPosition, speed)
        },

        /**
         * @param {number} distance in pixels
         */
        forward(distance) {
            linearMotionPhysics.moveForward(distance, speed)
        },

        /**
         * @param {number} distance in pixels
         */
        backward(distance) {
            linearMotionPhysics.moveBackward(distance, speed)
        },

        /**
         * @param {number} angleInDegrees
         */
        rotateClockwise(angleInDegrees) {
            body.rotate(angleInDegrees)
        },

        /**
         * @param {number} angleInDegrees
         */
        rotateCounterClockwise(angleInDegrees) {
            body.rotate(-angleInDegrees)
        },
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
                rotate(angleInDegrees) {
                    this.rotation += degreesToRadians(angleInDegrees)
                },

                /**
                 * forward to `rotation` getter and setter on the role player
                 */
                rotation: dci.forward,
            },

            /**
             * @contract {RolePlayerContract_linearMotionPhysics}
             */
            linearMotionPhysics: {
                moveForward(distance, speed) {
                    const bearing = body.rotation - (Math.PI / 2)
                    this.move(bearing, distance, speed)
                },

                moveBackward(distance, speed) {
                    const bearing = body.rotation + (Math.PI / 2)
                    this.move(bearing, distance, speed)
                },

                /**
                 * forward to moveToDestination() on the role player
                 * @type {(destinationPosition: Vector2D, speed: number) => void}
                 */
                moveToDestination: dci.forward,
            },
        }
    }
}
