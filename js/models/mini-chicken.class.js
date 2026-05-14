/**
 * A smaller, faster variant of the Chicken enemy.
 * Can be stomped by the player jumping on top of it.
 * @extends MovableObject
 */
class MiniChicken extends MovableObject {
    /** @type {number} Vertical position on the ground row. */
    y = 360;
    /** @type {number} Render height in pixels. */
    height = 60;
    /** @type {number} Render width in pixels. */
    width = 60;
    /** @type {number} Health points; reduced to 0 in a single hit. */
    energy = 100;
    /** @type {boolean} Ensures the dead sprite is set only once. */
    deadShown = false;

    /** @type {string[]} Walking animation frames. */
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];

    /** @type {string} Single dead sprite path. */
    IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

    constructor() {
        super();
        this.loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);
        this.speed = 0.15 + Math.random() * 0.25;
        this.x = 500 + Math.random() * 2100;
        this.y = 360;
        this.width = 60;
        this.height = 60;
        this.energy = 100;
        this.deadShown = false;
        this.animate();
    }

    /**
     * Starts the movement loop (60 fps) and the death/walk animation loop (12 fps).
     */
    animate() {
        this.animateDeath();

        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft("enemies");
            }
        }, 1000 / 60);
    }

    /**
     * Plays the walking animation each tick, or freezes on the dead sprite once killed.
     */
    animateDeath() {
        setInterval(() => {
            if (this.isDead()) {
                if (!this.deadShown) {
                    this.img = this.imageCache[this.IMAGE_DEAD];
                    this.deadShown = true;
                }
                return;
            }
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000 / 12);
    }

    /**
     * Instantly kills the mini-chicken (one-hit kill by stomp or bottle).
     */
    hit() {
        this.energy -= 100;
    }
}
