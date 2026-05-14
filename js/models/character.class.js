/**
 * The player-controlled character (Pepe).
 * Handles movement, animations, jump sound, idle/sleep detection, and coin/bottle collection.
 * @extends MovableObject
 */
class Character extends MovableObject {
    /** @type {number} Initial vertical position. */
    y = 0;
    /** @type {{top: number, left: number, right: number, bottom: number}} Collision hitbox offsets. */
    offset = { top: 130, left: 25, right: 35, bottom: 15 };
    /** @type {number} Current health points. */
    energy = 100;
    /** @type {number} Number of collected coins. */
    coins = 0;
    /** @type {number} Number of throwable bottles in inventory (max 5). */
    bottlesInInventory = 5;
    /** @type {boolean} Whether the walking sound is currently playing. */
    isWalking = false;
    /** @type {boolean} Prevents the jump sound from firing multiple times per jump. */
    jumpSoundPlayed = false;
    /** @type {Keyboard} Local keyboard reference (overridden by world.keyboard at runtime). */
    keyboard = new Keyboard();
    /** @type {number} Timestamp of the last player input, used for idle/sleep detection. */
    lastActivityTime = Date.now();

    /** @type {string[]} Walking animation frames. */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png', 'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png', 'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png', 'img/2_character_pepe/2_walk/W-26.png'
    ];
    /** @type {string[]} Short idle animation frames. */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png', 'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png', 'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png', 'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png', 'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png', 'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    /** @type {string[]} Jump animation frames. */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png', 'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png', 'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png', 'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png', 'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    /** @type {string[]} Death animation frames. */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png', 'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png', 'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png', 'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    /** @type {string[]} Hurt animation frames. */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png', 'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    /** @type {string[]} Long-idle (sleeping) animation frames, shown after 7 s of inactivity. */
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** @type {World} Reference to the game world, assigned by World.setWorld(). */
    world;

    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = 120;
        this.animate();
        this.applyGravity();
    }

    /**
     * Starts the two animation loops: movement+camera (60 fps) and sprite switching (8 fps).
     */
    animate() {
        setInterval(() => {
            this.cameraMovementAnimationAndSound();
            this.jumpingMovementAnimationWithSound();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.world && this.world.gameEnded && !this.isDead()) return;
            this.characterAnimation();
        }, 1000 / 8);
    }

    /**
     * Moves the character left/right based on keyboard input and records activity time.
     * Skipped when the character is dead or the game has ended.
     */
    cameraMovementAnimationAndSound() {
        if (this.isDead() || (this.world && this.world.gameEnded)) return;
            const anyKey = this.world.keyboard.RIGHT || this.world.keyboard.LEFT ||
                           this.world.keyboard.UP || this.world.keyboard.DOWN || this.world.keyboard.SPACE;
            if (anyKey) this.lastActivityTime = Date.now();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { this.moveRight(); this.otherDirection = false; }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft('character');
                this.otherDirection = true;
            }
    }

    /**
     * Triggers a jump and its sound when UP is pressed and the character is on the ground.
     */
    jumpingMovementAnimationWithSound() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            this.playJumpSound();
            this.world.audio.stopSleepingSound();
        }
    }

    /**
     * Plays the death animation once if the character is dead. Returns early otherwise.
     */
    deathAnimation() {
            if (this.isDead()) {
                this.playDeadAnimationOnce();
                return;
            }
    }

    /**
     * Selects the correct animation frame based on the current character state
     * (dead → hurt → airborne → walking/sleeping/idle).
     */
    characterAnimation() {
        if (this.isDead()) { this.deathAnimation(); return; }
            if (this.isHurt()) {
                this.lastActivityTime = Date.now();
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                this.jumpSoundPlayed = false;
                this.walkSleepIdleAnimationAndSound();
            }
    }

    /**
     * Chooses between walking, sleeping, and idle animations based on keyboard input
     * and time since last activity. Also manages walking/sleeping sounds.
     */
    walkSleepIdleAnimationAndSound() {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.world.audio.stopSleepingSound();
                    this.startWalkingSound();
                } else if (Date.now() - this.lastActivityTime >= 7000 && !this.isDead()) {
                    this.playAnimation(this.IMAGES_SLEEPING);
                    this.stopWalkingSound();
                    this.world.audio.playSleepingSound();
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                    this.stopWalkingSound();
                }
    }

    /**
     * Starts the walking sound if it is not already playing.
     */
    startWalkingSound() {
        if (!this.isWalking && this.world && this.world.audio) {
            this.isWalking = true;
            this.world.audio.walkingSound.play();
        }
    }

    /**
     * Pauses and rewinds the walking sound if it is currently playing.
     */
    stopWalkingSound() {
        if (this.isWalking && this.world && this.world.audio) {
            this.isWalking = false;
            this.world.audio.walkingSound.pause();
            this.world.audio.walkingSound.currentTime = 0;
        }
    }

    /**
     * Plays the jump sound once per jump, stopping the walking sound first.
     */
    playJumpSound() {
        this.stopWalkingSound();
        this.world.audio.jumpingSound.currentTime = 0;
        if (!this.jumpSoundPlayed && this.world && this.world.audio) {
            this.jumpSoundPlayed = true;
            this.world.audio.jumpingSound.play();
        }
    }

    /** Increments the coin counter by one. */
    collectCoin() { this.coins += 1; }

    /** Refills bottle inventory to maximum when a bottle pickup occurs. */
    collectBottle() { if (this.bottlesInInventory < 5) { this.bottlesInInventory = 5; } }
}
