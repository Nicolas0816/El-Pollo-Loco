class World {
    audio = new AudioMusic();
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
    intervals = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkStompCollisions();
        this.allCollisions();
        this.checkPressedKey();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => { enemy.world = this; });
    }

    allCollisions() {
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.checkCollisions();
            this.collectCoin();
            this.chickensHitByBottle();
            this.collectBottle();
        }, 10);
        this.intervals.push(intervalId);
    }

    checkStompCollisions() {
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.jumpOnEnemy();
        }, 10);
        this.intervals.push(intervalId);
    }

    checkPressedKey() {
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.throwBottle();
        }, 1000 / 25);
        this.intervals.push(intervalId);
    }

    getEndboss() { return this.level.enemies.find((enemy) => enemy instanceof Endboss); }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.characterHit(enemy)) {
                this.character.hit();
                this.audio.playCharacterHurtSound();
                this.healthBar.setPercentage(this.character.energy);
            }
            if (this.character.isDead()) {
                this.endGame("lose");
            }
        });
    }

    characterHit(enemy) {
        return !enemy.isDead() && this.character.isColliding(enemy) && !this.character.isHurt();
    }

    jumpOnEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.collideMiniChicken(enemy)) {
                enemy.hit();
                this.character.jump();
                this.audio.playSplashSound();
            }
        });
    }

    collideMiniChicken(enemy) {
        return !enemy.isDead() && this.character.isCollidingOnTop(enemy) && this.character.speedY < 0 && !this.character.isHurt() && enemy instanceof MiniChicken;
    }

    throwBottle() {
        if (this.keyboard.SPACE && this.character.bottlesInInventory > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100);
            this.level.bottle.push(bottle);
            this.keyboard.SPACE = false;
            this.character.bottlesInInventory -= 1;
            this.bottleBar.setPercentage(this.character.bottlesInInventory * 20);
        }
    }

    collectCoin() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                this.audio.playCollectCoinSound();
                this.coinBar.setPercentage(this.character.coins * 10);
                const index = this.level.coins.indexOf(coin);
                if (index > -1) this.level.coins.splice(index, 1);
            }
        });
    }

    collectBottle() {
        this.level.collectableBottles.forEach((bottle) => {
            if (this.character.isColliding(bottle) && this.character.bottlesInInventory < 5) {
                this.character.collectBottle();
                this.audio.playCollectBottleSound();
                this.bottleBar.setPercentage(this.character.bottlesInInventory * 20);
                const index = this.level.collectableBottles.indexOf(bottle);
                if (index > -1) this.level.collectableBottles.splice(index, 1);
            }
        });
    }

    chickensHitByBottle() {
        this.level.bottle.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!enemy.isDead() && bottle.isColliding(enemy) && !bottle.isSplashing && (enemy instanceof Chicken || enemy instanceof Endboss)) {
                    this.handleBittleOnCollision(bottle, enemy);
                    if (enemy instanceof Endboss) {
                        const percentage = Math.max(0, (enemy.energy / 500) * 100);
                        this.endbossHealthBar.setPercentage(percentage);
                        if (enemy.isDead()) this.endGame("win");
                    }
                }
            });
        });
    }

    handleBittleOnCollision(bottle, enemy) {
        bottle.stopBottle();
        bottle.splashAnimation();
        enemy.hit();
        this.audio.playSplashSound();
        this.removeBottleFromInventory(bottle);
    }

    removeBottleFromInventory(bottle) {
        setTimeout(() => {
            const bottleIndex = this.level.bottle.indexOf(bottle);
            if (bottleIndex > -1) this.level.bottle.splice(bottleIndex, 1);
        }, 250);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.addGameObjectsToMap());
        this.ctx.translate(-this.camera_x, 0);
        this.addStatusBars();
        requestAnimationFrame(() => this.draw());
    }

    addStatusBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        if (this.endbossHealthBar.isVisible) this.addToMap(this.endbossHealthBar);
    }

    addGameObjectsToMap() {
        return [...this.level.backgroundObjects, ...this.level.clouds, ...this.level.enemies, ...this.level.coins, ...this.level.collectableBottles, ...this.level.bottle, this.character];
    }

    addObjectsToMap(objects) { objects.forEach((o) => this.addToMap(o)); }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    endGame(result) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.waitForAnimationAndShowOverlay(result);
    }

    waitForAnimationAndShowOverlay(result) {
        const checkAnimationDone = setInterval(() => {
            if (this.isAnimationDone(result)) {
                clearInterval(checkAnimationDone);
                this.onGameEndAnimationComplete(result);
            }
        }, 100);
    }

    isAnimationDone(result) {
        if (result === "lose") return this.character.deadAnimationPlayed;
        if (result === "win") {
            const endboss = this.getEndboss();
            return endboss && endboss.deadAnimationPlayed;
        }
        return false;
    }

    onGameEndAnimationComplete(result) {
        this.deactivateKeyboard();
        this.showGameOverScreen(result);
        this.hideGameStartedButtons();
    }

    showGameOverScreen(result) {
        document.getElementById("game-over").classList.toggle("hidden", result !== "lose");
        document.getElementById("you-won").classList.toggle("hidden", result !== "win");
        
        this.audio.gameMusic.pause();
        if (result === "lose" && !this.audio.gameOverSoundPlayed) {
            this.audio.playGameOverSound();
            this.audio.gameOverSoundPlayed = true;
        } else if (result === "win" && !this.audio.youWonSoundPlayed) {
            this.audio.stopEndbossMusic();
            this.audio.playYouWonSound();
            this.audio.youWonSoundPlayed = true;
        }
    }

    hideGameStartedButtons() {
        const mb = document.getElementById("mobile-buttons");
        if (mb) mb.classList.remove("game-started");
    }

    deactivateKeyboard() {
        this.keyboard.RIGHT = this.keyboard.LEFT = this.keyboard.UP = this.keyboard.DOWN = this.keyboard.SPACE = false;
    }

    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }
}