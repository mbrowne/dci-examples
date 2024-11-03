import { Vector2D } from './Vector2D.js'
import { Body2D } from './Body2D.js'
import { LinearMotionIntent } from './LinearMotionIntent.js'

const turtleElem = document.getElementById('turtle')

const windowHeight = window.innerHeight
const windowWidth = window.innerWidth

// start at the center
const { width, height } = turtleElem.getBoundingClientRect()
const startingPosition = new Vector2D((windowWidth / 2) - width, (windowHeight / 2) - height)

turtleElem.style.left = startingPosition.x + 'px';
turtleElem.style.top = startingPosition.y + 'px';

const offsetForClickEvent = width / 2

const turtle = new Body2D({
    position: startingPosition,
    angle: Math.PI,
    shape: turtleElem
})

const turtleView = new Proxy(turtle, {
    set(target, key, value) {
        switch (key) {
            case 'position': {
                turtle.position = value
                target.shape.style.left = value.x + 'px'
                target.shape.style.top = value.y + 'px'
                return true
            }
            case 'angle': {
                turtle.angle = value
                target.shape.style.transform = `rotate(${value}rad)`
                return true
            }
        }
        return Reflect.set(...arguments)
    }
})

const linearMotionIntent = new LinearMotionIntent(turtleView)
// linearMotionIntent.forward(10)

// Note: this example is *not* meant to demonstrate the best or most performant way
// to do animations in the browser. It's just a proof-of-concept.
document.body.addEventListener('click', (event) => {
    // interpret mouse click as where the user wants the *center* of the turtle to go
    const destinationPosition = new Vector2D(event.clientX - offsetForClickEvent, event.clientY - offsetForClickEvent)

    linearMotionIntent.rotateAndMoveToDestination(destinationPosition)
})

