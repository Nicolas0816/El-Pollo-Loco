/** @type {HTMLCanvasElement} The main game canvas element. */
let canvas;
/** @type {World} The active game world instance. */
let world;
/** @type {Keyboard} Keyboard state tracker shared across the game. */
let keyboard = new Keyboard();
/** @type {boolean} Prevents startGame from running more than once per session. */
let gameStarted = false;

/** @type {boolean} True when the device supports touch input. */
const isTouchDevice = navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    document.body.classList.add('touch-device');
    document.getElementById('game-screen').addEventListener('contextmenu', e => e.preventDefault());
    document.getElementById('mobile-buttons').addEventListener('contextmenu', e => e.preventDefault());
}

/** @type {HTMLElement} Mobile left-movement button. */
let leftButton = document.getElementById('left-button');
/** @type {HTMLElement} Mobile right-movement button. */
let rightButton = document.getElementById('right-button');
/** @type {HTMLElement} Mobile jump button. */
let jumpButton = document.getElementById('jump-button');
/** @type {HTMLElement} Mobile throw button. */
let throwButton = document.getElementById('throw-button');

/**
 * Starts the game for the first time: initializes the world, hides the start screen,
 * shows mobile controls and the mute button.
 */
function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    init();

    const startScreen = document.getElementById("start-screen");
    if (startScreen) startScreen.classList.add("hidden");

    const mobileButtons = document.getElementById('mobile-buttons');
    if (mobileButtons && isTouchDevice) mobileButtons.classList.add('game-started');

    const muteButton = document.getElementById('mute-button');
    if (muteButton) muteButton.classList.remove('hidden');
}

/**
 * Initializes the game world: builds the level, creates the World instance,
 * starts music, and restores mute state from localStorage.
 */
function init() {
    level1 = initLevel();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    world.audio.playGameMusic();
    if (localStorage.getItem('muted') === 'true') {
        world.audio.toggleMute();
        const muteButton = document.getElementById('mute-button');
        if (muteButton) muteButton.textContent = 'Unmute';
    }
}

/**
 * Maps keyboard arrow and space key presses to the keyboard state object.
 * @param {KeyboardEvent} e
 */
document.addEventListener('keydown', (e) => {
    if(e.keyCode == 39){
        keyboard.RIGHT = true;
    }
    if(e.keyCode == 37){
        keyboard.LEFT = true;
    }
    if(e.keyCode == 38){
        keyboard.UP = true;
    }
    if(e.keyCode == 40){
        keyboard.DOWN = true;
    }
    if(e.keyCode == 32){
        keyboard.SPACE = true;
    }

} );

/**
 * Clears keyboard state when arrow or space keys are released.
 * @param {KeyboardEvent} e
 */
document.addEventListener('keyup', (e) => {
    if(e.keyCode == 39){
        keyboard.RIGHT = false;
    }
    if(e.keyCode == 37){
        keyboard.LEFT = false;
    }
    if(e.keyCode == 38){
        keyboard.UP = false;
    }
    if(e.keyCode == 40){
        keyboard.DOWN = false;
    }
    if(e.keyCode == 32){
        keyboard.SPACE = false;
    }

} );

/**
 * Maps touch events on mobile buttons to keyboard state.
 * @param {TouchEvent} e
 */
document.addEventListener('touchstart', (e) => {
    if(e.target == rightButton){
        keyboard.RIGHT = true;
    }
    if(e.target == leftButton){
        keyboard.LEFT = true;
    }
    if(e.target == jumpButton){
        keyboard.UP = true;
    }
    if(e.target == throwButton){
        keyboard.SPACE = true;
    }
} );

/**
 * Clears keyboard state when a touch on a mobile button ends.
 * @param {TouchEvent} e
 */
document.addEventListener('touchend', (e) => {
    if(e.target == rightButton){
        keyboard.RIGHT = false;
    }
    if(e.target == leftButton){
        keyboard.LEFT = false;
    }
    if(e.target == jumpButton){
        keyboard.UP = false;
    }
    if(e.target == throwButton){
        keyboard.SPACE = false;
    }
} );

/**
 * Stops the current world and restarts the game without going back to the start screen.
 */
function playAgain() {
    if (world) {
        world.stopAllIntervals();
        world = null;
    }
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('you-won').classList.add('hidden');
    init();
}

/** Shows the instructions overlay. */
function showInstructions() {
    document.getElementById('instructions-overlay').classList.remove('hidden');
}

/** Hides the instructions overlay. */
function closeInstructions() {
    document.getElementById('instructions-overlay').classList.add('hidden');
}

/**
 * Toggles mute state on the audio manager and persists the preference in localStorage.
 */
function toggleMute() {
    if (!world) return;
    const isMuted = world.audio.toggleMute();
    localStorage.setItem('muted', isMuted);
    const muteButton = document.getElementById('mute-button');
    if (muteButton) muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
}

/**
 * Fully resets the game back to the start screen, stopping all intervals and hiding overlays.
 */
function restartGame() {
    gameStarted = false;
    if (world) {
        world.stopAllIntervals();
        world = null;
    }
    hideOverlays();
    toggleMuteText();
    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.classList.remove('hidden');
}

/** Hides the game-over and you-won overlay elements. */
function hideOverlays() {
    const gameOver = document.getElementById('game-over');
    const youWon = document.getElementById('you-won');
    if (gameOver) gameOver.classList.add('hidden');
    if (youWon) youWon.classList.add('hidden');
}

/** Hides the mute button and resets its label to match the stored mute preference. */
function toggleMuteText() {
    const muteButton = document.getElementById('mute-button');
        if (muteButton) {
            muteButton.classList.add('hidden');
            muteButton.textContent = localStorage.getItem('muted') === 'true' ? 'Unmute' : 'Mute';
        }
}

/**
 * Shows or hides the orientation overlay based on whether the device is in portrait mode.
 */
function checkOrientation() {
    const isPortrait = document.body.clientWidth < document.body.clientHeight;
    const overlay = document.getElementById('orientation-overlay');
    if (isPortrait) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

checkOrientation();

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
