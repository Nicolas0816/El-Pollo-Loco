class Character extends MovableObject {
    y = 0;
    offset = { top: 130, left: 25, right: 35, bottom: 15 };
    energy = 100;
    coins = 0;
    bottlesInInventory = 5;
    isWalking = false;
    jumpSoundPlayed = false;
    keyboard = new Keyboard();

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png', 'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png', 'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png', 'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png', 'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png', 'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png', 'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png', 'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png', 'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png', 'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png', 'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png', 'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png', 'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png', 'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png', 'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png', 'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png', 'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    world;

    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = 120;
        this.animate();
        this.applyGravity();
    }

    animate() {
        setInterval(() => {
            if (this.isDead() || (this.world && this.world.gameEnded)) return;
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { this.moveRight(); this.otherDirection = false; }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft('character');
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
                this.playJumpSound();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.world && this.world.gameEnded && !this.isDead()) return;
            if (this.isDead()) {
                this.playDeadAnimationOnce();
                return;
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                
            } else {
                this.jumpSoundPlayed = false;
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.startWalkingSound();
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                    this.stopWalkingSound();
                }
            }
        }, 1000 / 8);
    }

    startWalkingSound() {
        if (!this.isWalking && this.world && this.world.audio) {
            this.isWalking = true;
            this.world.audio.walkingSound.play();
        }
    }

    stopWalkingSound() {
        if (this.isWalking && this.world && this.world.audio) {
            this.isWalking = false;
            this.world.audio.walkingSound.pause();
            this.world.audio.walkingSound.currentTime = 0;
        }
    }

    playJumpSound() {
        this.stopWalkingSound();
        this.world.audio.jumpingSound.currentTime = 0;
        if (!this.jumpSoundPlayed && this.world && this.world.audio) {
            this.jumpSoundPlayed = true;
            this.world.audio.jumpingSound.play();
        }
    }

    collectCoin() { this.coins += 1; }
    collectBottle() { if (this.bottlesInInventory < 5) { this.bottlesInInventory = 5; } }
}