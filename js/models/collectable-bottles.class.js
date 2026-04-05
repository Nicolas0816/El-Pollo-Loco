class CollectableBottles extends DrawableObject {

    offset = {
        top: 10,
        left: 25,
        right: 10,
        bottom: 5
    };

    y = 360;

    constructor(x){
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.width = 70;
        this.height = 70;
    }
}