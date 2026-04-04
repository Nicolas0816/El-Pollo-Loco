const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],

    [
        new Clouds(),
        new Clouds(),
        new Clouds()
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/air.png', 720*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/air.png', 720*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3),
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
        new Coin(2300)
    ],

    [ 
        new ThrowableObject()
    ]
);

