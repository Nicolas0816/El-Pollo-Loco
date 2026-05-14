/**
 * HUD health bar for the endboss, rendered at the bottom of the screen.
 * Hidden until the endboss is first activated, then updated as it takes damage.
 * @extends StatusBar
 */
class EndbossHealthBar extends StatusBar {

    /** @type {string[]} Ordered image paths from 0 % to 100 % health. */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 210;
        this.y = 400;
        this.width = 300;
        this.height = 80;
        this.setPercentage(100);
    }
}
