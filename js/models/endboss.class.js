/**
 * Represents the final boss in the game.
 * The Endboss has a pattern that switches between walking and attacking,
 * follows the character, and reacts to camera activation.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /** @type {World} Reference to the game world. */
    world;
    /** @type {boolean} Indicates if the boss has spotted the player and is active. */
    isActivated = false;
    /** @type {number|null} ID of the interval handling horizontal movement. */
    walkInterval = null;
    /** @type {number|null} ID of the interval handling image animation changes. */
    animationInterval = null;
    /** @type {number|null} ID of the interval for the initial alert animation. */
    alertInterval = null;
    /** @type {number|null} ID of the interval that switches between walking and attacking phases. */
    phaseInterval = null;
    /** @type {string} Current state of the boss ("walk", "attack", "hurt", "dead"). */
    animationState = "walk";

    /** @type {number} Vertical position of the boss. */
    y = 190;

    /** @type {Object} Collision offsets for the boss. */
    offset = {
        top: 40,
        left: 15,
        right: 10,
        bottom: 10
    };

    /** @type {number} Health points of the endboss. */
    energy = 1000;

    /** @type {string[]} Images for the walking animation. */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** @type {string[]} Images for the alert/spotting animation. */
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    /** @type {string[]} Images for the attack animation. */
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    /** @type {string[]} Images for the hurt animation. */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} Images for the death animation. */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /** @type {number} Height of the boss. */
    height = 240;
    /** @type {number} Width of the boss. */
    width = 240;

    /**
     * Initializes the Endboss, loads all animation images and starts the camera observer.
     */
    constructor() {
        super();
        this.loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.x = 2600;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 10;
        this.watchForCameraContact();
    }

    /**
     * Continuously checks if the boss is within the camera's view to activate it.
     */
    watchForCameraContact() {
        setInterval(() => {
            if (!this.world || this.isActivated) return;

            const cameraLeft = -this.world.camera_x;
            const cameraRight = cameraLeft + this.world.canvas.width;

            if (this.x < cameraRight - 100) {
                this.activate();
            }
        }, 1000 / 20);
    }

    /**
     * Activates the boss, shows the health bar and starts the intro sequence.
     */
    activate() {
        this.isActivated = true;
        this.world.endbossHealthBar.isVisible = true;
        this.alertAnimation();

        setTimeout(() => {
            this.startPattern();
        }, 2000);
    }

    /**
     * Plays the alert animation when the boss is first triggered.
     */
    alertAnimation() {
        if (this.alertInterval) return;
        this.playEndbossDialogue();
        this.alertInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 1000 / 6);
    }

    /**
     * Clears all running intervals to stop current movements and animations.
     */
    clearAllIntervals() {
        clearInterval(this.animationInterval);
        clearInterval(this.walkInterval);
        clearInterval(this.phaseInterval);
        clearInterval(this.alertInterval);
    }

    /**
     * Starts the main AI pattern (walking, attacking, following).
     */
    startPattern() {
        this.clearAllIntervals();
        this.alertInterval = null;

        this.animationState = "walk";
        this.currentImage = 0;

        this.setAnimationInterval();
        this.setWalkInterval();
        this.setPhaseInterval();
    }

    /**
     * Sets the interval for switching between walking and attacking animations.
     * @returns {number} The interval ID.
     */
    setAnimationInterval() {
        return this.animationInterval = setInterval(() => {
            if (this.animationState === "walk") {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_ATTACK);
            }
        }, 1000 / 6);
    }

    /**
     * Sets the movement interval. The boss follows the character outside of a deadzone.
     * Speed depends on the current animation state (sprinting during attack).
     */
    setWalkInterval() {
        this.walkInterval = setInterval(() => {
            if (this.isDead() || !this.isActivated || this.animationState === "hurt") return;
            const distance = Math.abs(this.x - this.world.character.x);
            const deadzone = 50;
            if (distance > deadzone) {
                if (this.world.character.x < this.x) {
                    this.otherDirection = false;
                    this.moveBossLeft();
                } else {
                    this.otherDirection = true;
                    this.moveBossRight();
                }
            }
        }, 1000 / 60);
    }

    /**
     * Moves the boss to the left.
     */
    moveBossLeft() {
        let speed = this.animationState === "attack" ? 12 : 2;
        this.x -= speed;
    }

    /**
     * Moves the boss to the right.
     */
    moveBossRight() {
        let speed = this.animationState === "attack" ? 12 : 2;
        this.x += speed;
    }

    /**
     * Handles the switching of phases between 'walk' and 'attack' at dynamic intervals.
     */
    setPhaseInterval() {
        this.phaseInterval = setInterval(() => {
            if (this.isDead()) return;
            this.animationState = this.animationState === "walk" ? "attack" : "walk";
            this.currentImage = 0;
            clearInterval(this.phaseInterval);
            let nextPhaseTime = this.animationState === "attack" ? 300 : 500;
            setTimeout(() => this.setPhaseInterval(), nextPhaseTime);
        }, 1500);
    }

    /**
     * Plays the hurt animation and resets the AI pattern after a short delay.
     */
    hurtAnimation() {
        this.clearAllIntervals();
        this.animationState = "hurt";
        this.currentImage = 0;
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_HURT);
        }, 1000 / 6);
        setTimeout(() => {
            if (this.energy > 0) {
                this.startPattern();
            }
        }, 1000);
    }

    /**
     * Triggers the death sequence of the boss.
     */
    dieAnimation() {
        this.clearAllIntervals();
        this.alertInterval = null;
        this.animationState = "dead";
        this.currentImage = 0;
        this.deadAnimationPlayed = false;
        this.deadFrameIndex = 0;
        this.setDeadAnimationInterval();
    }

    /**
     * Sets the interval to play the death animation frames once.
     * @returns {number} The interval ID.
     */
    setDeadAnimationInterval() {
        return this.animationInterval = setInterval(() => {
            this.playDeadAnimationOnce();

            if (this.deadAnimationPlayed) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
        }, 1000 / 6);
    }

    /**
     * Reduces the boss's energy and triggers either hurt or death animations.
     */
    hit() {
        if (this.isDead()) return;
        this.energy -= 100;
        if (this.energy < 0) this.energy = 0;
        if (this.energy > 0) {
            this.hurtAnimation();
            this.world.audio.playEndbossHitSound();
        } else {
            this.dieAnimation();
        }
    }

    /**
     * Manages the audio intro sequence for the boss, including dialogue and music.
     */
    playEndbossDialogue() {
        if (this.world.endbossDialoguePlayed) return;
        this.world.audio.gameMusic.pause();
        this.world.audio.gameMusic.currentTime = 0;
        this.world.audio.gameMusicPlayed = false;
        this.world.audio.endbossSound.play();
        this.world.audio.endbossMusic.play();
        this.world.audio.endbossDialoguePlayed = true;
        this.world.audio.endbossMusic.onended = () => {
            this.world.audio.gameMusic.play();
        };
    }
}