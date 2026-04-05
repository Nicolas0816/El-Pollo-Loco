class Endboss extends MovableObject {
    
    y = 190;

    offset = {
        top: 40,
        left: 15,
        right: 10,
        bottom: 10
    };

    energy = 300;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    height = 240;
    width = 240;

    constructor(){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 400 + Math.random() * 400;
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.15;
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000 / 6);
        
        setInterval(() => {
            this.moveLeft('enemies');
        }, 1000 / 60);
    }

    hit(){
        this.energy -= 100;
    }
}