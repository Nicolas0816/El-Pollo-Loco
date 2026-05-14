/**
 * Holds all game objects that make up a single level.
 * The World class reads these arrays each frame to drive rendering and collision logic.
 */
class Level {
    /** @type {MovableObject[]} All enemy instances (chickens, mini-chickens, endboss). */
    enemies;
    /** @type {Clouds[]} Decorative cloud instances. */
    clouds;
    /** @type {Coin[]} Collectable coin instances. */
    coins;
    /** @type {ThrowableObject[]} Active thrown-bottle instances. */
    bottle;
    /** @type {CollectableBottles[]} Bottle pickups lying on the ground. */
    collectableBottles;
    /** @type {BackgroundObject[]} Parallax background layer tiles. */
    backgroundObjects;
    /** @type {number} World x-coordinate at which the level ends. */
    level_end_x = 2200;

    /**
     * @param {MovableObject[]} enemies
     * @param {Clouds[]} clouds
     * @param {BackgroundObject[]} backgroundObjects
     * @param {Coin[]} coins
     * @param {ThrowableObject[]} bottle
     * @param {CollectableBottles[]} collectableBottles
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottle, collectableBottles){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottle = bottle;
        this.collectableBottles = collectableBottles;
    }
}
