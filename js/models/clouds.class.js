/**
 * A decorative cloud that drifts continuously to the left across the sky.
 * @extends MovableObject
 */
class Clouds extends MovableObject{
    /** @type {number} Vertical position near the top of the canvas. */
    y = 20;
    /** @type {number} Render width in pixels. */
    width = 500;
    /** @type {number} Render height in pixels. */
    height = 300;

    constructor(){
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the leftward drift using the default speed from MovableObject.
     */
    animate(){
        this.moveLeft();
    }
}
