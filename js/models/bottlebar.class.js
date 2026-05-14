/**
 * HUD status bar that displays how many throwable bottles the player currently holds.
 * Starts full (100 %) and updates via setPercentage as bottles are used or collected.
 * @extends StatusBar
 */
class BottleBar extends StatusBar {

    /** @type {string[]} Ordered image paths from 0 % to 100 % fill. */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 20;
        this.setPercentage(100);
    }
}
