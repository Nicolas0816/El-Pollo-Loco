class AudioMusic {

    splashSoundPlayed = false;
    gameOverSoundPlayed = false;
    youWonSoundPlayed = false;
    characterHurtSoundPlayed = false;
    collectCoinSoundPlayed = false;
    collectBottleSoundPlayed = false;
    gameMusicPlayed = false;

    constructor() {
        this.walkingSound = new Audio('audio/freesound_community-sand-walk-106366.mp3');
        this.jumpingSound = new Audio('audio/freesound_community-cartoon-jump-6462.mp3');
        this.characterHurtSound = new Audio('audio/homemade_sfx-slap-hurt-pain-sound-effect-262618.mp3');
        this.youWonSound = new Audio("audio/floraphonic-you-win-sequence-1-183948.mp3");
        this.collectCoinSound = new Audio("audio/liecio-collect-points-190037.mp3");
        this.collectBottleSound = new Audio("audio/freesound_community-item-equip-6904.mp3");
        this.splashSound = new Audio('audio/stepir44-hurt-sound-435314.mp3');
        this.gameOverSound = new Audio('audio/drummusiclooper5000-lose-sfx-365579.mp3');
        this.gameMusic = new Audio("audio/openmindaudio-cartoon-background-music-modern-path-short-preview-497396.mp3");
        this.characterDeathSound = new Audio("audio/u_r7cny11q7r-man-death-scream-186763.mp3");
        this.endbossSound = new Audio("audio/phatphrogstudio-demon-voice-no-mercy-477827.mp3");
        this.endbossMusic = new Audio("audio/freesound_community-warning-75933 (1).mp3");
        this.endbossHitSound = new Audio("audio/digitalstore07-chicken-430403.mp3");
        this.gameMusic.volume = 0.5;
        this.gameMusic.loop = true;
    }

    playGameMusic() {
        if (!this.gameMusicPlayed) {
            this.gameMusic.play();
            this.gameMusicPlayed = true;
        }
    }

    playSplashSound() {
        this.splashSound.currentTime = 0;
        this.splashSound.play();
    }

    playCollectCoinSound() {
        this.collectCoinSound.currentTime = 0;
        this.collectCoinSound.play();
    }

    playCollectBottleSound() {
        this.collectBottleSound.currentTime = 0;
        this.collectBottleSound.play();
    }

    playGameOverSound() {
        this.gameOverSound.play();
        this.characterDeathSound.play();
    }

    playYouWonSound() {
        this.youWonSound.play();
    }

    playCharacterHurtSound() {
        this.characterHurtSound.currentTime = 0;
        this.characterHurtSound.play();
    }

    playCharacterDeathSound() {
        this.characterDeathSound.play();
    }

   playEndbossHitSound() {
        this.endbossHitSound.currentTime = 0;
        this.endbossHitSound.play();
    }

    stopEndbossMusic() {
        if (this.endbossMusic) {
            this.endbossMusic.pause();
            this.endbossMusic.currentTime = 0;
        }
    }
}
