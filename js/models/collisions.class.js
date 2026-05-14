/**
 * Manages all collision detection and resolution for the game world.
 * Holds a reference to the World instance to access game objects and HUD.
 */
class CollisionManager {
    /** @type {World} The game world this manager belongs to. */
    world;

    /**
     * @param {World} world - The active World instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Starts the combined collision interval: enemy hits, coin/bottle collection,
     * bottle-to-enemy hits, and bottle-to-ground hits every 10 ms.
     */
    allCollisions() {
        let intervalId = setInterval(() => {
            if (this.world.gameEnded) return;
            this.checkCollisions();
            this.collectCoin();
            this.chickensHitByBottle();
            this.bottleHitsGround();
            this.collectBottle();
        }, 10);
        this.world.intervals.push(intervalId);
    }

    /**
     * Starts the stomp detection interval (10 ms) that checks if the character
     * has jumped onto a MiniChicken from above.
     */
    checkStompCollisions() {
        let intervalId = setInterval(() => {
            if (this.world.gameEnded) return;
            this.jumpOnEnemy();
        }, 10);
        this.world.intervals.push(intervalId);
    }

    /**
     * Checks whether any enemy is colliding with the character and applies damage.
     * Triggers the lose condition when character health reaches zero.
     */
    checkCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.characterHit(enemy)) {
                this.world.character.hit();
                this.world.audio.playCharacterHurtSound();
                this.world.healthBar.setPercentage(this.world.character.energy);
            }
            if (this.world.character.isDead()) this.world.endGame("lose");
        });
    }

    /**
     * Returns true if the enemy is alive, overlapping the character, and the character
     * is not in the post-hit invincibility window.
     * @param {MovableObject} enemy
     * @returns {boolean}
     */
    characterHit(enemy) {
        return !enemy.isDead() && this.world.character.isColliding(enemy) && !this.world.character.isHurt();
    }

    /**
     * Checks for top-collision stomp on MiniChickens; kills the enemy and bounces the character.
     */
    jumpOnEnemy() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.collideMiniChicken(enemy)) {
                enemy.hit();
                this.world.character.jump();
                this.world.audio.playSplashSound();
            }
        });
    }

    /**
     * Returns true when all stomp conditions are met.
     * @param {MovableObject} enemy
     * @returns {boolean}
     */
    collideMiniChicken(enemy) {
        return !enemy.isDead() && this.world.character.isCollidingOnTop(enemy)
            && this.world.character.speedY < 0 && !this.world.character.isHurt()
            && enemy instanceof MiniChicken;
    }

    /**
     * Checks each coin for overlap with the character, collects it, updates HUD, and removes it.
     */
    collectCoin() {
        this.world.level.coins.forEach((coin) => {
            if (this.world.character.isColliding(coin)) {
                this.world.character.collectCoin();
                this.world.audio.playCollectCoinSound();
                this.world.coinBar.setPercentage(this.world.character.coins * 10);
                const index = this.world.level.coins.indexOf(coin);
                if (index > -1) this.world.level.coins.splice(index, 1);
            }
        });
    }

    /**
     * Checks each ground bottle for overlap with the character, collects it when inventory
     * is not full, updates HUD, and removes it from the level.
     */
    collectBottle() {
        this.world.level.collectableBottles.forEach((bottle) => {
            if (this.world.character.isColliding(bottle) && this.world.character.bottlesInInventory < 5) {
                this.world.character.collectBottle();
                this.world.audio.playCollectBottleSound();
                this.world.bottleBar.setPercentage(this.world.character.bottlesInInventory * 20);
                const index = this.world.level.collectableBottles.indexOf(bottle);
                if (index > -1) this.world.level.collectableBottles.splice(index, 1);
            }
        });
    }

    /**
     * Checks every in-flight bottle against every living enemy.
     * Ends the game with a win if the endboss dies.
     */
    chickensHitByBottle() {
        this.world.level.bottle.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                if (!enemy.isDead() && bottle.isColliding(enemy) && !bottle.isSplashing
                    && (enemy instanceof Chicken || enemy instanceof Endboss)) {
                    this.handleBottleOnCollision(bottle, enemy);
                    if (enemy instanceof Endboss) this.handleEndbossHit(enemy);
                }
            });
        });
    }

    /**
     * Updates the endboss health bar and triggers a win if the endboss is dead.
     * @param {Endboss} endboss
     */
    handleEndbossHit(endboss) {
        const percentage = Math.max(0, (endboss.energy / 500) * 100);
        this.world.endbossHealthBar.setPercentage(percentage);
        if (endboss.isDead()) this.world.endGame("win");
    }

    /**
     * Stops the bottle, plays the splash animation, damages the enemy, and plays the sound.
     * @param {ThrowableObject} bottle
     * @param {MovableObject} enemy
     */
    handleBottleOnCollision(bottle, enemy) {
        bottle.stopBottle();
        bottle.splashAnimation(() => this.removeBottleFromLevel(bottle));
        enemy.hit();
        this.world.audio.playSplashSound();
    }

    /**
     * Detects bottles that have reached the ground and triggers their splash.
     */
    bottleHitsGround() {
        this.world.level.bottle.forEach((bottle) => {
            if (!bottle.isSplashing && bottle.y + bottle.height >= 400) {
                bottle.stopBottle();
                bottle.splashAnimation(() => this.removeBottleFromLevel(bottle));
                this.world.audio.playSplashSound();
            }
        });
    }

    /**
     * Removes a bottle from the active bottle array after the splash animation finishes.
     * @param {ThrowableObject} bottle
     */
    removeBottleFromLevel(bottle) {
        const index = this.world.level.bottle.indexOf(bottle);
        if (index > -1) this.world.level.bottle.splice(index, 1);
    }
}
