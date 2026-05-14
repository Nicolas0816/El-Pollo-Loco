/**
 * Represents a single parallax background layer tile.
 * Positioned so its bottom edge aligns with the canvas floor.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    /** @type {number} Fixed render width covering one screen segment. */
    width = 720;
    /** @type {number} Fixed render height covering the full canvas height. */
    height = 480;

    /**
     * @param {string} imagePath - Path to the background layer image.
     * @param {number} x - Horizontal position in world coordinates.
     */
    constructor(imagePath, x){
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
