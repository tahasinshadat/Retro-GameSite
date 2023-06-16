const initialVelocity = 0.025;
const velocityIncrease = 0.000005;
let sound = 0;

export default class Ball {
    constructor (ballElement) {
        this.ballElement = ballElement;
        this.reset();
    }

    get x() {
        // Gets x value of ball from CSS and converts it into a JS value (a float)
        return parseFloat(getComputedStyle(this.ballElement).getPropertyValue('--x'));
    }

    set x(value) {
        // Changes the x value of the ball element to a JS value we determine
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
        this.y = 50;
        /*
        Used to create a unit vector:
        - helps to make sure our velocity is the only thing 
        that determines how fast we go and our direction is 
        the only thing that determines what direction we are 
        going and not the actual velocity (the actual velocities
        is the hypotenuse of the x and the y values, which make
        a direction) 
        */
        this.direction = { x: 0 };

        // Makes sure that the ball doesnt just go to vertical or too horizontal
        while (
            Math.abs(this.direction.x) <= .2 || 
            Math.abs(this.direction.x) >= .9
        ) {
            const heading = randomNumberBetween(0, 2 * Math.PI); // Gives us a random number between 0 and 260 dgrees in radians
            // Take our direction ^ and turn it into an X and Y value
            // This creates our Unit Vector
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) } 
        }
        // console.log(this.direction);
        this.velocity = initialVelocity;
    }

    update (delta, paddleRects) {
        this.x += this.direction.x * this.velocity * delta;
        this.y += this.direction.y * this.velocity * delta;
        this.velocity += velocityIncrease * delta; // Increases speed slowly
        const rect = this.rect();

        if (
            rect.bottom >= window.innerHeight || // Gone past the bottom of the screen
            rect.top <= 58  // Gone above the top of the screen
        ) {
            this.direction.y = this.direction.y * -1;
            playSound('audio/ding.mp3');
        }

        if (paddleRects.some( (r) => isCollision(r, rect)) ) {
            this.direction.x = this.direction.x * -1;
            playSound('audio/ding.mp3');
        }
    }
}

function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function isCollision(paddle, ball) {
    return (
        paddle.left <= ball.right && 
        paddle.right >= ball.left && 
        paddle.top <= ball.bottom && 
        paddle.bottom >= ball.top   
    )
}

function playSound(audio) {
    let sound = new Audio(audio);
    sound.play();
}