/**
 * Builds and returns a fully populated Level 1 instance containing all enemies,
 * clouds, background layers, coins, bottles, and collectable bottles.
 * @returns {Level}
 */
function initLevel() {
  return new Level(
    [ new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new MiniChicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Endboss(),
    ],

    [new Clouds(), new Clouds(), new Clouds()],

    [
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -720,
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        720 * 3,
      ),
    ],

    [
      new Coin(300),
      new Coin(500),
      new Coin(700),
      new Coin(900),
      new Coin(1100),
      new Coin(1300),
      new Coin(1500),
      new Coin(1700),
      new Coin(1900),
      new Coin(2100),
    ],

    [new ThrowableObject()],

    [
      new CollectableBottles(400, 300),
      new CollectableBottles(800, 300),
      new CollectableBottles(1200, 300),
      new CollectableBottles(1600, 300),
      new CollectableBottles(2000, 300),
    ],
  );
}

/** @type {Level} The active level 1 instance used by the World. */
let level1 = initLevel();
