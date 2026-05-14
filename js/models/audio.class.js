/**
 * Manages all audio files and sound effects for the game.
 * Handles background music, character sounds, item collection, and boss-related audio.
 */
class AudioMusic {
    /** @type {boolean} Flag to prevent multiple parallel splash sound triggers if needed. */
    splashSoundPlayed = false;
    /** @type {boolean} Flag to ensure the game over sound plays only once. */
    gameOverSoundPlayed = false;
    /** @type {boolean} Flag to ensure the win sound plays only once. */
    youWonSoundPlayed = false;
    /** @type {boolean} Flag for the character hurt sound state. */
    characterHurtSoundPlayed = false;
    /** @type {boolean} Flag for the coin collection sound state. */
    collectCoinSoundPlayed = false;
    /** @type {boolean} Flag for the bottle collection sound state. */
    collectBottleSoundPlayed = false;
    /** @type {boolean} Flag to track if the main game music is currently playing. */
    gameMusicPlayed = false;
    /** @type {boolean} Whether all audio is currently muted. */
    isMuted = false;

    /**
     * Initializes all Audio objects with their respective file paths.
     * Sets default volumes and looping properties.
     */
    constructor() {
        /** @type {HTMLAudioElement} Sound played when the character walks. */
        this.walkingSound = new Audio('audio/freesound_community-sand-walk-106366.mp3');
        /** @type {HTMLAudioElement} Sound played when the character jumps. */
        this.jumpingSound = new Audio('audio/freesound_community-cartoon-jump-6462.mp3');
        /** @type {HTMLAudioElement} Sound played when the character takes damage. */
        this.characterHurtSound = new Audio('audio/homemade_sfx-slap-hurt-pain-sound-effect-262618.mp3');
        /** @type {HTMLAudioElement} Fanfare played upon winning the game. */
        this.youWonSound = new Audio("audio/floraphonic-you-win-sequence-1-183948.mp3");
        /** @type {HTMLAudioElement} Sound played when a coin is collected. */
        this.collectCoinSound = new Audio("audio/liecio-collect-points-190037.mp3");
        /** @type {HTMLAudioElement} Sound played when a bottle is collected. */
        this.collectBottleSound = new Audio("audio/freesound_community-item-equip-6904.mp3");
        /** @type {HTMLAudioElement} Sound played when a bottle hits an enemy. */
        this.splashSound = new Audio('audio/stepir44-hurt-sound-435314.mp3');
        /** @type {HTMLAudioElement} Sound played when the player loses the game. */
        this.gameOverSound = new Audio('audio/drummusiclooper5000-lose-sfx-365579.mp3');
        /** @type {HTMLAudioElement} Main background music. */
        this.gameMusic = new Audio("audio/tatamusic-mexican-mexico-music-434632.mp3");
        /** @type {HTMLAudioElement} Dramatic scream played on character death. */
        this.characterDeathSound = new Audio("audio/u_r7cny11q7r-man-death-scream-186763.mp3");
        /** @type {HTMLAudioElement} Voice line or growl for the endboss introduction. */
        this.endbossSound = new Audio("audio/phatphrogstudio-demon-voice-no-mercy-477827.mp3");
        /** @type {HTMLAudioElement} Specific background music for the endboss fight. */
        this.endbossMusic = new Audio("audio/mfcc-mexican-mexican-mexico-mariachi-music-290633.mp3");
        /** @type {HTMLAudioElement} Sound played when the endboss is hit. */
        this.endbossHitSound = new Audio("audio/digitalstore07-chicken-430403.mp3");
        /** @type {HTMLAudioElement} Sound played when the character sleeps. */
        this.sleepingSound = new Audio("audio/audiopapkin-male-snoring-297875.mp3");

        this.gameMusic.volume = 0.5;
        this.gameMusic.loop = true;
        this.sleepingSound.loop = true;
        this.sleepingSound.volume = 0.5;
    }

    /**
     * Starts playing the main game music if it hasn't been started already.
     */
    playGameMusic() {
        if (!this.gameMusicPlayed) {
            this.gameMusic.play();
            this.gameMusicPlayed = true;
        }
    }

    /**
     * Resets and plays the splash sound (e.g., when a bottle breaks).
     */
    playSplashSound() {
        this.splashSound.currentTime = 0;
        this.splashSound.play();
    }

    /**
     * Resets and plays the sound effect for collecting a coin.
     */
    playCollectCoinSound() {
        this.collectCoinSound.currentTime = 0;
        this.collectCoinSound.play();
    }

    /**
     * Resets and plays the sound effect for collecting a bottle.
     */
    playCollectBottleSound() {
        this.collectBottleSound.currentTime = 0;
        this.collectBottleSound.play();
    }

    /**
     * Plays the game over sequence sounds (losing jingle and death scream).
     */
    playGameOverSound() {
        this.gameOverSound.play();
        this.characterDeathSound.play();
    }

    /**
     * Plays the victory sound sequence.
     */
    playYouWonSound() {
        this.youWonSound.play();
    }

    /**
     * Resets and plays the sound when the character gets hurt.
     */
    playCharacterHurtSound() {
        this.characterHurtSound.currentTime = 0;
        this.characterHurtSound.play();
        this.stopSleepingSound();
    }

    /**
     * Plays the character death scream.
     */
    playCharacterDeathSound() {
        this.characterDeathSound.play();
    }

    /**
     * Resets and plays the sound when the endboss takes damage.
     */
    playEndbossHitSound() {
        this.endbossHitSound.currentTime = 0;
        this.endbossHitSound.play();
    }

    /**
     * Toggles mute on all audio. Returns true if now muted, false if unmuted.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        const allSounds = [
            this.walkingSound, this.jumpingSound, this.characterHurtSound,
            this.youWonSound, this.collectCoinSound, this.collectBottleSound,
            this.splashSound, this.gameOverSound, this.gameMusic,
            this.characterDeathSound, this.endbossSound, this.endbossMusic,
            this.endbossHitSound
        ];
        allSounds.forEach(sound => sound.muted = this.isMuted);
        return this.isMuted;
    }

    /**
     * Stops the endboss-specific music and resets its playback position to zero.
     */
    stopEndbossMusic() {
        if (this.endbossMusic) {
            this.endbossMusic.pause();
            this.endbossMusic.currentTime = 0;
        }
    }

    /**
     * Plays sound when character fell asleep.
     */
    playSleepingSound() {
        this.sleepingSound.play();
    }

    /**
     * Stops the sleeping sound.
     */
    stopSleepingSound() {
        this.sleepingSound.pause();
        this.sleepingSound.currentTime = 0;
    }
}