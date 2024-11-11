import { Vector2D } from './Vector2D.js'
import { Body2D } from './Body2D.js'
import { LinearMotionIntent } from './LinearMotionIntent.js'
import * as renderFunctions from './render-body.js'

const turtleSvgTemplate = document.getElementById('turtle-svg-template')
const gameContainer = document.querySelector('.game-container')

// start at the center
const containerWidth = gameContainer.clientWidth
const containerHeight = gameContainer.clientHeight

const turtle = new Body2D({
    bearing: 0,
    shape: turtleSvgTemplate
})

const turtleSvg = renderFunctions.createAndAttachSvgElem(turtle, gameContainer)
const { width, height } = turtleSvg.getBoundingClientRect()

const startingPosition = new Vector2D(
    (containerWidth / 2) - (width / 2),
    (containerHeight / 2) - (height / 2)
)

turtle.position = startingPosition

renderFunctions.initialRender(turtle, turtleSvg, gameContainer)

const offsetForClickEvent = width / 2

const turtleProxy = new Proxy(turtle, {
    set(target, key, value) {
        switch (key) {
            case 'position': {
                target.position = value
                renderFunctions.updatePosition(turtle, turtleSvg)
                return true
            }
            case 'bearing': {
                target.bearing = value
                renderFunctions.updateBearing(turtle, turtleSvg)
                return true
            }
        }
        return Reflect.set(...arguments)
    }
})

const linearMotionIntent = new LinearMotionIntent(turtleProxy)
// linearMotionIntent.forward(10)

// Note: this example is *not* meant to demonstrate the best or most performant way
// to do animations in the browser. It's just a proof-of-concept.
gameContainer.addEventListener('click', (event) => {
    // interpret mouse click as where the user wants the *center* of the turtle to go
    const destinationPosition = new Vector2D(event.clientX - offsetForClickEvent, event.clientY - offsetForClickEvent)

    // const destinationPosition = new Vector2D(event.clientX, event.clientY)

    linearMotionIntent.rotateAndMoveToDestination(destinationPosition)
})

