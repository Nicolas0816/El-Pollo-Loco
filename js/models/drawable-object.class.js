/**
 * Base class for every visible game object.
 * Provides image loading, frame caching, drawing, and debug hitbox rendering.
 */
class DrawableObject {
    /** @type {number} Horizontal world position. */
    x = 120;
    /** @type {number} Vertical world position. */
    y = 150;
    /** @type {HTMLImageElement} Currently active image element. */
    img;
    /** @type {number} Render height in pixels. */
    height = 280;
    /** @type {number} Render width in pixels. */
    width = 120;
    /** @type {Object.<string, HTMLImageElement>} Cache mapping image paths to loaded Image elements. */
    imageCache = {};
    /** @type {number} Index of the current animation frame, incremented by playAnimation(). */
    currentImage = 0;
    /** @type {boolean} Controls whether the endboss health bar is rendered. */
    isVisible = false;

    /**
     * Loads a single image and assigns it as the active sprite.
     * @param {string} path - Relative path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Pre-loads an array of images into the cache so playAnimation() can switch frames instantly.
     * @param {string[]} arr - Array of image paths, e.g. ['img/image1.png', 'img/image2.png'].
     */
    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current sprite onto the provided canvas context.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a blue collision rectangle for interactive objects (debug aid).
     * Only active for Character, Chicken, Endboss, ThrowableObject, Coin, and CollectableBottles.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof Coin || this instanceof CollectableBottles){
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }
}
