import { Vector2D } from './Vector2D.js'
import { Body2D } from './Body2D.js'
import { LinearMotionIntent } from './LinearMotionIntent.js'
import { RenderBody2D } from './RenderBody2D.js'
import { GameToolbarComponent } from './GameToolbarComponent.js'

const turtleSvg = document.getElementById('turtle')
const gameContainer = document.querySelector('.game-container')

// start at the center
const containerWidth = gameContainer.clientWidth
const containerHeight = gameContainer.clientHeight

const turtle = new Body2D({
    rotation: 0,
    shape: turtleSvg
})

const { width, height } = turtleSvg.getBoundingClientRect()
const startingPosition = new Vector2D(
    (containerWidth / 2) - (width / 2),
    (containerHeight / 2) - (height / 2)
)

turtle.position = startingPosition

const renderer = RenderBody2D(turtle)
renderer.renderPosition()
renderer.renderRotation()

const offsetForClickEvent = width / 2

const turtleProxy = new Proxy(turtle, {
    set(target, key, value) {
        switch (key) {
            case 'position': {
                target.position = value
                renderer.renderPosition()
                return true
            }
            case 'rotation': {
                target.rotation = value
                renderer.renderRotation()
                return true
            }
        }
        return Reflect.set(...arguments)
    }
})

const linearMotionIntent = new LinearMotionIntent(turtleProxy)
// linearMotionIntent.forward(10)

customElements.define('game-toolbar', GameToolbarComponent)
const gameToolbar = document.querySelector('game-toolbar')
gameToolbar.linearMotionIntent = linearMotionIntent

// Note: this example is *not* meant to demonstrate the best or most performant way
// to do animations in the browser. It's just a proof-of-concept.
gameContainer.addEventListener('click', (event) => {
    // interpret mouse click as where the user wants the *center* of the turtle to go
    const destinationPosition = new Vector2D(event.clientX - offsetForClickEvent, event.clientY - offsetForClickEvent)

    linearMotionIntent.rotateAndMoveToDestination(destinationPosition)
})
