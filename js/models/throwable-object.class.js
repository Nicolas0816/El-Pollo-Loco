class ThrowableObject extends MovableObject {
    
    isSplashing = false;
    throwInterval;
    rotateInterval;
    
    IMAGES_THROWING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_HIT = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    constructor(x, y){
        super();
        this.loadImage(this.IMAGES_THROWING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_HIT);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.throw();
    }

    throw() {
        this.speedY = 10;
        this.applyGravity();
        this.throwAnimation();

        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) this.x += 15;
        }, 1000 / 40);
    }

    throwAnimation() {
        this.rotateInterval = setInterval(() => {
            if (!this.isSplashing) this.playAnimation(this.IMAGES_THROWING);
        }, 1000 / 25);
    }

    stopBottle() {
        this.isSplashing = true;
        this.speedY = 0;
        this.acceleration = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.rotateInterval);
    }

    splashAnimation(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_HIT);
        }, 1000 / 25);
    }
}