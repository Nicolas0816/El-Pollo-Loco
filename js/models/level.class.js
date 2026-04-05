class Level {
    enemies;
    clouds;
    coins;
    bottle;
    collectableBottles;
    backgroundObjects;
    level_end_x = 2200;

    constructor(enemies, clouds, backgroundObjects, coins, bottle, collectableBottles){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottle = bottle;
        this.collectableBottles = collectableBottles;
    }
}