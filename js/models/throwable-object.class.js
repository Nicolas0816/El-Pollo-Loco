class ThrowableObject extends MovableObject {
    IMAGES_THROWING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y){
        super();
        this.loadImage(this.IMAGES_THROWING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.throw();
    }

    throw(){
        this.speedY = 10;
        this.applyGravity();
        this.throwAnimation();
        setInterval(() => {
            this.x += 15;
        }, 1000 / 40);
    }

    throwAnimation(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_THROWING);
        }, 1000 / 25);
    }
}