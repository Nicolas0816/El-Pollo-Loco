class Coin extends MovableObject {
    width = 100;
    height = 100;
    y = 300;

    offset = {
        top: 35,
        left: 35,
        right: 35,
        bottom: 35
    };

    IMAGES_IDLE = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ]

    constructor(x){
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.animate();
        this.x = x;
    }

    animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_IDLE);
        }, 1000 / 6);
    }
}