class EndbossHealthBar extends StatusBar {

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