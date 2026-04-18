let canvas;
let world
let keyboard = new Keyboard();
let gameStarted = false;

let leftButton = document.getElementById('left-button');
let rightButton = document.getElementById('right-button');
let jumpButton = document.getElementById('jump-button');
let throwButton = document.getElementById('throw-button');


function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    init();

    const startScreen = document.getElementById("start-screen");
    if (startScreen) startScreen.classList.add("hidden");
    
    const mobileButtons = document.getElementById('mobile-buttons');
    if (mobileButtons) mobileButtons.classList.add('game-started');
}

function init() {
    level1 = initLevel();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    console.log('My character is', world.character);
    
}

document.addEventListener('keydown', (e) => {
    console.log(e);
    
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

document.addEventListener('keyup', (e) => {
    console.log(e);
    
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

document.addEventListener('touchstart', (e) => {
    console.log(e);
    
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

document.addEventListener('touchend', (e) => {
    console.log(e);
    
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

function restartGame() {
    // State zurücksetzen
    gameStarted = false;
    
    // Alte Welt stoppen und entfernen (falls vorhanden)
    if (world) {
        // Hier könntest du später eine Methode wie world.stopAllIntervals() hinzufügen,
        // um alle setInterval-Aufrufe in der World-Klasse zu stoppen.
        // Für jetzt: Setze world auf null, um Speicher freizugeben.
        world.stopAllIntervals();
        world = null;
    }
    
    // Overlays verstecken
    const gameOver = document.getElementById('game-over');
    const youWon = document.getElementById('you-won');
    if (gameOver) gameOver.classList.add('hidden');
    if (youWon) youWon.classList.add('hidden');
    
    // Start-Screen anzeigen (damit der Spieler erneut starten kann)
    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.classList.remove('hidden');
    
    // Hinweis: Die Welt wird NICHT hier neu initialisiert.
    // Stattdessen wartet das Spiel, bis der Spieler erneut auf den Start-Screen klickt,
    // was startGame() aufruft und init() triggert – das erstellt eine frische World mit neuen Gegnern.
}

// Funktion, um die Orientierung zu prüfen (Breite vs. Höhe)
function checkOrientation() {
    const isPortrait = document.body.clientWidth < document.body.clientHeight;
    console.log('Breite:', document.body.clientWidth, 'Höhe:', document.body.clientHeight, 'isPortrait:', isPortrait); // Debug-Log

    const overlay = document.getElementById('orientation-overlay');
    if (isPortrait) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// Initiale Prüfung beim Laden
checkOrientation();

// Event-Listener
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);