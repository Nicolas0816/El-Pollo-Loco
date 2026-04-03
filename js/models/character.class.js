class Character extends MovableObject {

    walkingSound = new Audio('audio/freesound_community-sand-walk-106366.mp3');

    y = 0;

    offset = {
        top: 130,
        left: 25,
        right: 35,
        bottom: 15
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ]

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    world;

    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.x = 120;
        this.animate();
        this.applyGravity();
    }

    animate(){
        //Character movement direction
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft('character');
                this.otherDirection = true;
            }

            if(this.world.keyboard.UP && !this.isAboveGround()){
                this.jump();
            }
            this.world.camera_x = -this.x + 100;

        },1000 / 60);

        //Walk animation
        setInterval(() => {

            if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            }else{
                if (this.world.keyboard.RIGHT ||this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }
        },1000 / 8);
    }

    animateIdle(){
        let i = this.currentImage % this.IMAGES_IDLE.length;
        let path = this.IMAGES_IDLE[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}