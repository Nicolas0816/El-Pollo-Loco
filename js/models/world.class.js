/**
 * Central game world that owns all game objects, drives the render loop,
 * and coordinates all collision checks between the character, enemies, and items.
 */
class World {
    /** @type {AudioMusic} Audio manager for all sounds and music. */
    audio = new AudioMusic();
    /** @type {Character} The player character instance. */
    character = new Character();
    /** @type {Level} The currently active level data. */
    level = level1;
    /** @type {HTMLCanvasElement} The game canvas element. */
    canvas;
    /** @type {CanvasRenderingContext2D} 2D rendering context. */
    ctx;
    /** @type {Keyboard} Shared keyboard state object. */
    keyboard;
    /** @type {number} Horizontal camera offset applied via ctx.translate(). */
    camera_x = 0;
    /** @type {HealthBar} Player health HUD element. */
    healthBar = new HealthBar();
    /** @type {BottleBar} Bottle inventory HUD element. */
    bottleBar = new BottleBar();
    /** @type {CoinBar} Coin count HUD element. */
    coinBar = new CoinBar();
    /** @type {EndbossHealthBar} Endboss health HUD element (hidden until boss activates). */
    endbossHealthBar = new EndbossHealthBar();
    /** @type {boolean} Set to true when win/lose condition is met; pauses collision loops. */
    gameEnded = false;
    /** @type {number[]} IDs of all setInterval calls, so they can all be cleared on restart. */
    intervals = [];

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.collisions = new CollisionManager(this);
        this.draw();
        this.setWorld();
        this.collisions.checkStompCollisions();
        this.collisions.allCollisions();
        this.checkPressedKey();
    }

    /**
     * Injects a world reference into the character and every enemy so they can
     * read camera position, keyboard state, and audio.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => { enemy.world = this; });
    }

    /**
     * Starts the throw-input polling interval (~25 fps) that spawns a bottle when SPACE is held.
     */
    checkPressedKey() {
        let intervalId = setInterval(() => {
            if (this.gameEnded) return;
            this.throwBottle();
        }, 1000 / 25);
        this.intervals.push(intervalId);
    }

    /**
     * Returns the Endboss instance from the enemy array.
     * @returns {Endboss|undefined}
     */
    getEndboss() { return this.level.enemies.find((enemy) => enemy instanceof Endboss); }

    /**
     * Spawns a ThrowableObject when SPACE is held and the player has bottles.
     * Deducts one bottle and updates the HUD.
     */
    throwBottle() {
        if (this.keyboard.SPACE && this.character.bottlesInInventory > 0) {
            let startX = this.character.otherDirection ? this.character.x - 20 : this.character.x + 50;
            let bottle = new ThrowableObject(startX,
              this.character.y + 100,
              this.character.otherDirection
            );
            this.level.bottle.push(bottle);
            this.keyboard.SPACE = false;
            this.character.bottlesInInventory -= 1;
            this.bottleBar.setPercentage(this.character.bottlesInInventory * 20);
        }
    }

    /**
     * Main render loop: clears the canvas, translates for the camera, draws all world objects,
     * then draws fixed HUD elements and schedules the next frame via requestAnimationFrame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.addGameObjectsToMap());
        this.ctx.translate(-this.camera_x, 0);
        this.addStatusBars();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws all HUD status bars in fixed screen space (outside camera transform).
     */
    addStatusBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        if (this.endbossHealthBar.isVisible) this.addToMap(this.endbossHealthBar);
    }

    /**
     * Builds the ordered draw list for the current frame.
     * @returns {DrawableObject[]} All world objects in draw order.
     */
    addGameObjectsToMap() {
        return [...this.level.backgroundObjects, ...this.level.clouds, ...this.level.enemies, ...this.level.coins, ...this.level.collectableBottles, ...this.level.bottle, this.character];
    }

    /**
     * Iterates an array of objects and draws each one.
     * @param {DrawableObject[]} objects
     */
    addObjectsToMap(objects) { objects.forEach((o) => this.addToMap(o)); }

    /**
     * Draws a single object, flipping it horizontally when otherDirection is set.
     * @param {DrawableObject} mo
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Saves canvas state and applies a horizontal flip transform for left-facing sprites.
     * @param {DrawableObject} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores canvas state after a flipped draw.
     * @param {DrawableObject} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Triggers the end-game sequence (win or lose) once per game session.
     * @param {'win'|'lose'} result
     */
    endGame(result) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.waitForAnimationAndShowOverlay(result);
    }

    /**
     * Polls until the final death animation has fully played, then calls onGameEndAnimationComplete.
     * @param {'win'|'lose'} result
     */
    waitForAnimationAndShowOverlay(result) {
        const checkAnimationDone = setInterval(() => {
            if (this.isAnimationDone(result)) {
                clearInterval(checkAnimationDone);
                this.onGameEndAnimationComplete(result);
            }
        }, 100);
    }

    /**
     * Returns true when the relevant death animation has finished playing.
     * @param {'win'|'lose'} result
     * @returns {boolean}
     */
    isAnimationDone(result) {
        if (result === "lose") return this.character.deadAnimationPlayed;
        if (result === "win") {
            const endboss = this.getEndboss();
            return endboss && endboss.deadAnimationPlayed;
        }
        return false;
    }

    /**
     * Deactivates controls, shows the appropriate overlay, and hides mobile buttons.
     * @param {'win'|'lose'} result
     */
    onGameEndAnimationComplete(result) {
        this.deactivateKeyboard();
        this.showGameOverScreen(result);
        this.hideGameStartedButtons();
    }

    /**
     * Shows the win or lose overlay and plays the matching audio sequence.
     * @param {'win'|'lose'} result
     */
    showGameOverScreen(result) {
        document.getElementById("game-over").classList.toggle("hidden", result !== "lose");
        document.getElementById("you-won").classList.toggle("hidden", result !== "win");
        this.audio.gameMusic.pause();
        if (result === "lose" && !this.audio.gameOverSoundPlayed) {
            this.audio.stopEndbossMusic();
            this.audio.playGameOverSound();
            this.audio.gameOverSoundPlayed = true;
        } else if (result === "win" && !this.audio.youWonSoundPlayed) {
            this.audio.stopEndbossMusic();
            this.audio.playYouWonSound();
            this.audio.youWonSoundPlayed = true;
        }
    }

    /** Removes the game-started class from the mobile buttons container. */
    hideGameStartedButtons() {
        const mb = document.getElementById("mobile-buttons");
        if (mb) mb.classList.remove("game-started");
    }

    /** Sets all keyboard inputs to false to prevent the character from moving after game end. */
    deactivateKeyboard() {
        this.keyboard.RIGHT = this.keyboard.LEFT = this.keyboard.UP = this.keyboard.DOWN = this.keyboard.SPACE = false;
    }

    /**
     * Clears every interval registered in this.intervals and empties the array.
     * Called on restart to prevent orphaned intervals from the previous game session.
     */
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }
}