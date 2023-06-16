const maxComputerSpeed = 0.015; // makes the AI beatable

export default class Paddle {
    constructor(paddleElement) {
        this.paddleElement = paddleElement;
        this.reset();
    }

    get position() {
        return parseFloat(getComputedStyle(this.paddleElement).getPropertyValue('--position'));

    }

    set position(value) {
        this.paddleElement.style.setProperty('--position', value);
    }

    rect () {
        return this.paddleElement.getBoundingClientRect(); // gets our paddles rectangles
    }

    reset () {
        this.position = 50;
    }

    update(delta, ballHeight) {
        // updates AI's paddle position to match with the balls position as fast as the maxComputerSpeed allows it to
        if ( (this.position + maxComputerSpeed * delta * (ballHeight - this.position)) <= 11) { // stops AI's paddle from going above screen
            this.position = 11;
        } else if ( (this.position + maxComputerSpeed * delta * (ballHeight - this.position)) >= 95) { // stops AI's paddle from going  below screen
            this.position = 95;
        } else {  
            this.position += maxComputerSpeed * delta * (ballHeight - this.position);
        }
    }
s
}