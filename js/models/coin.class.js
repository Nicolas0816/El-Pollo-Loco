/**
 * A collectable coin that flips between two frames to create a shine animation.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    /** @type {number} Render width in pixels. */
    width = 100;
    /** @type {number} Render height in pixels. */
    height = 100;
    /** @type {number} Default vertical position. */
    y = 300;

    /** @type {{top: number, left: number, right: number, bottom: number}} Tight hitbox to require precise overlap. */
    offset = {
        top: 35,
        left: 35,
        right: 35,
        bottom: 35
    };

    /** @type {string[]} Two-frame idle/shine animation. */
    IMAGES_IDLE = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ]

    /**
     * @param {number} x - Horizontal world position of the coin.
     */
    constructor(x){
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.animate();
        this.x = x;
    }

    /**
     * Cycles through the idle frames at 6 fps to create the coin flip effect.
     */
    animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_IDLE);
        }, 1000 / 6);
    }
}
