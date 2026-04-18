class Endboss extends MovableObject {
    
    world;
    isActivated = false;
    walkInterval = null;
    animationInterval = null;
    alertInterval = null;
    walkInterval = null;
    animationInterval = null;
    phaseInterval = null;
    animationState = "walk";

    y = 190;

    offset = {
        top: 40,
        left: 15,
        right: 10,
        bottom: 10
    };

    energy = 500;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

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

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

     IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    height = 240;
    width = 240;

    constructor(){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 2600
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 0.10;
        this.watchForCameraContact();
    }

    watchForCameraContact() {
        setInterval(() => {
            if (!this.world || this.isActivated) return;

            const cameraLeft = -this.world.camera_x;
            const cameraRight = cameraLeft + this.world.canvas.width;

            if (this.x < cameraRight + 100) {
            this.activate();
            }
        }, 1000 / 20);
    }

    activate() {
        this.isActivated = true;
        this.world.endbossHealthBar.isVisible = true;
        this.alertAnimation();

        setTimeout(() => {
            this.startPattern();
        }, 2000);
    }

   alertAnimation() {
        if (this.alertInterval) return;

        this.alertInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 1000 / 6);
    }

    startPattern() {
        clearInterval(this.animationInterval);
        clearInterval(this.walkInterval);
        clearInterval(this.phaseInterval);
        clearInterval(this.alertInterval);
        this.alertInterval = null;

        this.animationState = "walk";
        this.currentImage = 0;

        this.animationInterval = setInterval(() => {
            if (this.animationState === "walk") {
            this.playAnimation(this.IMAGES_WALKING);
            } else {
            this.playAnimation(this.IMAGES_ATTACK);
            }
        }, 1000 / 6);

        this.walkInterval = setInterval(() => {
            if (this.animationState === "walk") {
            this.moveLeft("enemies");
            }
        }, 1000 / 60);

        this.phaseInterval = setInterval(() => {
            this.animationState = this.animationState === "walk" ? "attack" : "walk";
            this.currentImage = 0;
        }, 1200);
    }

    hurtAnimation() {
        clearInterval(this.animationInterval);
        clearInterval(this.walkInterval);
        clearInterval(this.phaseInterval);

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

    dieAnimation() {
        clearInterval(this.animationInterval);
        clearInterval(this.walkInterval);
        clearInterval(this.phaseInterval);
        clearInterval(this.alertInterval);
        this.alertInterval = null;

        this.animationState = "dead";
        this.currentImage = 0;
        this.deadAnimationPlayed = false;
        this.deadFrameIndex = 0;

        this.animationInterval = setInterval(() => {
            this.playDeadAnimationOnce();

            if (this.deadAnimationPlayed) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
        }, 1000 / 6);
    }

    hit(){
        if (this.isDead()) return;
        this.energy -= 100;
        if (this.energy < 0) this.energy = 0;
        if (this.energy > 0) {
            this.hurtAnimation();
        } else {
            this.dieAnimation();
        }
    }
}