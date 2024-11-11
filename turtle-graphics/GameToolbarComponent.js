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
        this.#form = form
    }

    #forwardClicked = () => {
        this.linearMotionIntent.forward(this.#form.distance.value)
    }

    #backwardClicked = () => {
        this.linearMotionIntent.backward(this.#form.distance.value)
    }

    #rotateClicked = () => {
        this.linearMotionIntent.rotateClockwise(this.#form.rotation.value)
    }
}
