/**
 * Extends DrawableObject with physics, movement, animation cycling, collision detection,
 * and health logic. All interactive game entities extend this class.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {

    /** @type {number} Horizontal movement speed (pixels per tick for enemies). */
    speed = 0.15;
    /** @type {boolean} When true the sprite is flipped horizontally before drawing. */
    otherDirection = false;
    /** @type {number} Vertical velocity; positive moves the object upward. */
    speedY = 0;
    /** @type {number} Gravity deceleration applied each physics tick. */
    acceleration = 1;
    /** @type {{top: number, left: number, right: number, bottom: number}} Hitbox inset offsets. */
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    /** @type {number} Current health; reaching 0 marks the object as dead. */
    energy = 100;
    /** @type {number} Timestamp (ms) of the last received hit for isHurt() calculation. */
    lastHit = 0;
    /** @type {boolean} Set to true once the full death animation has played through. */
    deadAnimationPlayed = false;
    /** @type {number} Current frame index within IMAGES_DEAD during the death sequence. */
    deadFrameIndex = 0;

    /**
     * Applies gravity by reducing speedY each tick and moving the object downward.
     * Runs at 40 fps; stops when the object is on the ground and not jumping.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        },1000 / 40);
    }

    /**
     * Returns true if the object is currently airborne.
     * ThrowableObjects are always considered airborne so gravity always acts on them.
     * @returns {boolean}
     */
    isAboveGround() {
        if(this instanceof ThrowableObject){
            return true;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Moves the object 5 px to the right and resets the flip flag.
     */
    moveRight() {
        this.x += 5;
        this.otherDirection = false;
    }

    /**
     * Moves the object left. Enemies use their own speed value; the character moves 5 px.
     * @param {'enemies'|'character'} object - Determines how many pixels to move.
     */
    moveLeft(object){
        if(object === 'enemies'){
            this.x -= this.speed;
        }

        if(object === 'character'){
            this.x -= 5;
        }
    }

    /**
     * Advances to the next frame of an animation array in a loop.
     * @param {string[]} images - The animation frame paths to cycle through.
     */
    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Steps through IMAGES_DEAD once and freezes on the last frame when complete.
     */
    playDeadAnimationOnce() {
        if (this.deadAnimationPlayed) {
            const last = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
            this.img = this.imageCache[last];
            return;
        }
        const path = this.IMAGES_DEAD[this.deadFrameIndex];
        this.img = this.imageCache[path];
        this.deadFrameIndex++;
        if (this.deadFrameIndex >= this.IMAGES_DEAD.length) {
            this.deadAnimationPlayed = true;
        }
    }

    /**
     * Launches the object upward by setting its vertical velocity.
     */
    jump() {
        this.speedY = 22;
    }

    /**
     * AABB collision test that accounts for each object's hitbox offsets.
     * @param {MovableObject} mo - The other object to test against.
     * @returns {boolean}
     */
    isColliding(mo){
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Stricter top-only collision used for stomp detection.
     * Requires the bottom of this object to be within 25 px of the top of the target.
     * @param {MovableObject} mo - The object being stomped.
     * @returns {boolean}
     */
    isCollidingOnTop(mo){
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom &&
               (this.y + this.height - this.offset.bottom) - (mo.y + mo.offset.top) < 25;
    }

    /**
     * Reduces energy by 10 and records the hit timestamp for isHurt().
     */
    hit(){
        this.energy -= 10;
        if(this.energy < 0){
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }

    /**
     * @returns {boolean} True when energy has reached zero.
     */
    isDead(){
        return this.energy == 0;
    }

    /**
     * @returns {boolean} True when a hit occurred less than 1 second ago.
     */
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }
}
