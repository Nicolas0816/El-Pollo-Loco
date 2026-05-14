/**
 * HUD health bar that reflects the player character's current health.
 * Starts full (100 %) and decreases as the character takes damage.
 * @extends StatusBar
 */
class HealthBar extends StatusBar {

    /** @type {string[]} Ordered image paths from 0 % to 100 % health. */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = -10;
        this.setPercentage(100);
    }
}
