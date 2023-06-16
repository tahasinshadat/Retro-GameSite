export default class Ball {
    constructor(ballElement) {
        this.ballElement = ballElement;
        this.gravity = 0.06;
        this.reset();
        this.onPlatform = false;
    }

    get x() {
        // Gets x value of ball 
        return parseFloat(getComputedStyle(this.ballElement).getPropertyValue('--x'));
    }

    set x(value) {
        // Changes the x value of ball
        this.ballElement.style.setProperty('--x', value);
    }

    get y() {
        return parseFloat(getComputedStyle(this.ballElement).getPropertyValue('--y'));
    }

    set y(value) {
        this.ballElement.style.setProperty('--y', value);
    }

    rect() {
        // Gets the edges of the ball element
        return this.ballElement.getBoundingClientRect(); 
    }

    reset () {
        this.x = 50;
        this.y = 10;
        this.velocity = 0;
    }

    update(right, left) {
        
        // console.log(this.velocity)
        if (!this.onPlatform) this.velocity += this.gravity;

        this.y += this.velocity;

        // movement of ball
        if (right) this.x += 1;
        if (left) this.x -= 1;

        // Keep the ball in the screen
        if (this.x < 0) this.x += 1;
        if (this.x > 100) this.x -= 1;
        if (this.y > 101) this.y -= this.velocity;
        if (this.y < 4) this.y += 1;
    }

    death () {
        // Check Death
        if (this.y <= 2) {
            console.log('death'); 
            this.reset();
            return true
        }
    }
}