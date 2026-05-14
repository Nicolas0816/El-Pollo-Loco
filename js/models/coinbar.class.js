/**
 * HUD status bar that shows the player's coin collection progress.
 * Starts empty (0 %) and fills as coins are collected.
 * @extends StatusBar
 */
class CoinBar extends StatusBar {

    /** @type {string[]} Ordered image paths from 0 % to 100 % fill. */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 50;
        this.setPercentage(0);
    }
}
