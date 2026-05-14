/**
 * A salsa bottle thrown by the player.
 * Travels horizontally while gravity pulls it down; plays a splash animation on impact.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /** @type {boolean} True once the bottle has hit something and is splashing. */
    isSplashing = false;
    /** @type {number} Interval ID for the horizontal movement loop. */
    throwInterval;
    /** @type {number} Interval ID for the rotation animation loop. */
    rotateInterval;

    /** @type {string[]} Rotation animation frames played while the bottle is in flight. */
    IMAGES_THROWING = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    /** @type {string[]} Splash animation frames played on impact. */
    IMAGES_HIT = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];

    /** @type {{top: number, left: number, right: number, bottom: number}} Collision hitbox offsets. */
    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
    };

    /**
     * @param {number} x - Starting horizontal position.
     * @param {number} y - Starting vertical position.
     * @param {boolean} direction - True to throw left, false to throw right.
     */
    constructor(x, y, direction) {
        super();
        this.loadImage(this.IMAGES_THROWING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_HIT);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.throw(direction);
    }

    /**
     * Gives the bottle its initial upward velocity, applies gravity, starts rotation animation,
     * and moves it horizontally each tick until it splashes.
     * @param {boolean} direction - True moves left, false moves right.
     */
    throw(direction) {
        this.speedY = 10;
        this.applyGravity();
        this.throwAnimation();
        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                if (direction) {
                    this.x -= 15;
                } else {
                    this.x += 15;
                }
            }
        }, 1000 / 40);
    }

    /**
     * Cycles through the rotation frames at 25 fps while the bottle is in flight.
     */
    throwAnimation() {
        this.rotateInterval = setInterval(() => {
            if (!this.isSplashing) this.playAnimation(this.IMAGES_THROWING);
        }, 1000 / 25);
    }

    /**
     * Halts all movement and physics when the bottle hits a target or the ground.
     */
    stopBottle() {
        this.isSplashing = true;
        this.speedY = 0;
        this.acceleration = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.rotateInterval);
    }

    /**
     * Plays the splash frames at 25 fps after the bottle has stopped.
     */
    splashAnimation(onDone) {
        this.currentImage = 0;
        const interval = setInterval(() => {
            this.playAnimation(this.IMAGES_HIT);
            if (this.currentImage >= this.IMAGES_HIT.length) {
                clearInterval(interval);
                if (onDone) onDone();
            }
        }, 1000 / 25);
    }
}
