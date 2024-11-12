export class GameToolbarComponent extends HTMLElement {
    /**
     * @type HTMLFormElement
     */
    #form

    /**
     * Instance of LinearMotionIntent context
     * @type LinearMotionIntent
     */
    linearMotionIntent

    connectedCallback() {
        const form = this.firstElementChild
        form.forwardBtn.addEventListener('click', this.#forwardClicked)
        form.backwardBtn.addEventListener('click', this.#backwardClicked)
        form.rotateBtn.addEventListener('click', this.#rotateClicked)
        form.distance.addEventListener('change', this.#distanceChanged)
        form.rotation.addEventListener('keyup', this.#rotationKeyUp)
        this.#form = form
    }

    #forwardClicked = () => {
        const distance = this.#form.distance.value
        if (distance != '') {
            this.linearMotionIntent.forward(distance)
        }
    }

    #backwardClicked = () => {
        const distance = this.#form.distance.value
        if (distance != '') {
            this.linearMotionIntent.backward(distance)
        }
    }

    #rotateClicked = () => {
        const rotation = this.#form.rotation.value
        if (rotation != '') {
            this.linearMotionIntent.rotateClockwise(rotation)
        }
    }

    #distanceChanged = ({ target }) => {
        // no negative numbers
        if (parseInt(target.value) < 0) {
            target.value = 0
        }
    }

    #rotationKeyUp = (e) => {
        if (e.key === 'Enter') {
            this.#rotateClicked()
        }
    }
}
