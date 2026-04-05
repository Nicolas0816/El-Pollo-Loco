class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.allCollisions();
        this.checkPressedKey();
    }

    setWorld(){
        this.character.world = this;
    }

    allCollisions(){
        setInterval(() => {
            this.checkCollisions();
            this.collectCoin();
            this.chickensHitByBottle();
            this.collectBottle();
        }, 100);
    }

    checkPressedKey(){
        setInterval(() => {
            this.throwBottle();
        }, 1000/25);
    }

    checkCollisions(){
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                    this.character.hit();
                    console.log('Collision with enemy! Energy: ' + this.character.energy);
                    this.healthBar.setPercentage(this.character.energy);
                }
            });
    }

    throwBottle(){
        if(this.keyboard.SPACE && this.character.bottlesInInventory > 0){
            this.bottles = new ThrowableObject(this.character.x + 50, this.character.y + 150);
            this.level.bottle.push(this.bottles);
            this.keyboard.SPACE = false; // Prevent continuous throwing while space is held down
            this.character.bottlesInInventory -= 1;
            console.log('Bottle thrown! Bottles left in inventory: ' + this.character.bottlesInInventory);
            this.bottleBar.setPercentage(this.character.bottlesInInventory * 20);  
        }
    }

    collectCoin(){
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                console.log('Collected a coin! Total coins: ' + this.character.coins);
                this.coinBar.setPercentage(this.character.coins * 10); // Assuming 10 coins total for 100%
                // Remove the collected coin from the level
                const index = this.level.coins.indexOf(coin);
                if (index > -1) {
                    this.level.coins.splice(index, 1);
                }
            }
        });
    }

    collectBottle(){
        this.level.collectableBottles.forEach((bottle) => {
            if (this.character.isColliding(bottle) && this.character.bottlesInInventory < 5) {
                this.character.collectBottle();
                console.log('Collected a bottle! Total bottles in inventory: ' + this.character.bottlesInInventory);
                this.bottleBar.setPercentage(this.character.bottlesInInventory * 20);
                // Remove the collected bottle from the level
                const index = this.level.collectableBottles.indexOf(bottle);
                if (index > -1) {
                    this.level.collectableBottles.splice(index, 1);
                }
            }
        });
    }

    chickensHitByBottle() {
        this.level.bottle.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.isSplashing) {
                    bottle.stopBottle();
                    bottle.splashAnimation();

                    enemy.hit();
                    if (enemy.energy <= 0) {
                        const index = this.level.enemies.indexOf(enemy);
                        if (index > -1) this.level.enemies.splice(index, 1);
                    }

                    setTimeout(() => {
                        const bottleIndex = this.level.bottle.indexOf(bottle);
                        if (bottleIndex > -1) this.level.bottle.splice(bottleIndex, 1);
                    }, 250);
                }
            });   
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottle);
        this.addObjectsToMap(this.level.collectableBottles);
        
        //Statusbar should not move with camera
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        this.ctx.translate(this.camera_x, 0);

        this.ctx.translate(-this.camera_x, 0);

            //call draw() one after another
        let self = this;
        requestAnimationFrame(()=>{self.draw()});
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo){
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);     
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;  
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}