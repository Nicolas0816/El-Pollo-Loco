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
    endbossHealthBar = new EndbossHealthBar();
    gameEnded = false;
    animationFrameId = null;
    intervals = [];

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkStompCollisions();
        this.allCollisions();
        this.checkPressedKey();
    }

    setWorld(){
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    allCollisions(){
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.checkCollisions();
            this.collectCoin();
            this.chickensHitByBottle();
            this.collectBottle();
        }, 100);
        this.intervals.push(intervalId);
    }

    checkStompCollisions(){
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.jumpOnEnemy();
        }, 1000 / 60);
        this.intervals.push(intervalId);
    }

    checkPressedKey(){
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.throwBottle();
        }, 1000/25);
        this.intervals.push(intervalId);
    }

    getEndboss() {
        return this.level.enemies.find(enemy => enemy instanceof Endboss);
    }

    checkCollisions(){
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                console.log('Collision with enemy! Energy: ' + this.character.energy);
                this.healthBar.setPercentage(this.character.energy);
            }
            if (this.character.isDead()) {
                this.endGame('lose');
                return;
            }
        });
    }

    jumpOnEnemy(){
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead() && this.character.isCollidingOnTop(enemy) && this.character.speedY < 0 && !this.character.isHurt()) {
                enemy.hit();
                this.character.jump();
                console.log('Jumped on enemy! Enemy energy: ' + enemy.energy);
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
                if (!enemy.isDead() && bottle.isColliding(enemy) && !bottle.isSplashing) {
                    bottle.stopBottle();
                    bottle.splashAnimation();

                    enemy.hit();

                    setTimeout(() => {
                        const bottleIndex = this.level.bottle.indexOf(bottle);
                        if (bottleIndex > -1) this.level.bottle.splice(bottleIndex, 1);
                    }, 250);

                    if (enemy instanceof Endboss) {
                        const percentage = Math.max(0, (enemy.energy / 500) * 100);
                        this.endbossHealthBar.setPercentage(percentage);
                    }
                    if (enemy instanceof Endboss && enemy.isDead()) {
                        this.endGame('win');
}
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
    
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    if (this.endbossHealthBar.isVisible){
        this.addToMap(this.endbossHealthBar);
    }
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(() => { self.draw(); });
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

    endGame(result) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        // Warte bis die Animation fertig ist
        const checkAnimationDone = setInterval(() => {
            let animationDone = false;

            if (result === 'lose') {
                animationDone = this.character.deadAnimationPlayed === true;
            } else if (result === 'win') {
                const endboss = this.getEndboss();
                animationDone = endboss && endboss.deadAnimationPlayed === true;
            }

            if (animationDone) {
                clearInterval(checkAnimationDone);
                this.deactivateKeyboard();
                document.getElementById('game-over').classList.toggle('hidden', result !== 'lose');
                document.getElementById('you-won').classList.toggle('hidden', result !== 'win');
            }
        }, 100);
    }

    deactivateKeyboard() {
        this.keyboard.RIGHT = false;
        this.keyboard.LEFT = false;
        this.keyboard.UP = false;
        this.keyboard.DOWN = false;
        this.keyboard.SPACE = false;
    }

    stopAllIntervals() {
        this.intervals.forEach(id => {
            clearInterval(id);
        });
        this.intervals = [];  // Array leeren für den nächsten Start
    }

}