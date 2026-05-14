/**
 * Base class for all HUD status bars (health, bottles, coins, endboss health).
 * Selects the correct image frame based on a 0–100 percentage value.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    /** @type {string[]} Ordered image paths representing fill levels (overridden by subclasses). */
    IMAGES = [];

    /** @type {number} Current fill level between 0 and 100. */
    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 0;
        this.y = 0;
        this.width = 150;
        this.height = 40;
        this.setPercentage(100);
    }

    /**
     * Updates the displayed percentage and swaps to the matching image frame.
     * @param {number} percentage - A value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to one of the six image indices (0–5).
     * @returns {number} Index into the IMAGES array.
     */
    resolveImageIndex() {
        if (this.percentage <= 0) {
            return 0;
        } else if (this.percentage <= 20) {
            return 1;
        } else if (this.percentage <= 40) {
            return 2;
        } else if (this.percentage <= 60) {
            return 3;
        } else if (this.percentage <= 80) {
            return 4;
        } else {
            return 5;
        }
    }
}
