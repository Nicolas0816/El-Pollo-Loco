/**
 * A salsa bottle lying on the ground that the player can walk over to collect.
 * @extends DrawableObject
 */
class CollectableBottles extends DrawableObject {

    /** @type {{top: number, left: number, right: number, bottom: number}} Collision hitbox offsets. */
    offset = {
        top: 10,
        left: 25,
        right: 10,
        bottom: 5
    };

    /** @type {number} Vertical position on the ground row. */
    y = 360;

    /**
     * @param {number} x - Horizontal world position of the bottle.
     */
    constructor(x){
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.width = 70;
        this.height = 70;
    }
}
