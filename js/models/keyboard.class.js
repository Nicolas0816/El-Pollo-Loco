/**
 * Tracks the pressed/released state of every game control key or button.
 * Values are toggled by the keydown/keyup and touchstart/touchend listeners in game.js.
 */
class Keyboard {
    /** @type {boolean} True while the left arrow / left button is held. */
    LEFT = false;
    /** @type {boolean} True while the right arrow / right button is held. */
    RIGHT = false;
    /** @type {boolean} True while the up arrow / jump button is held. */
    UP = false;
    /** @type {boolean} True while the down arrow is held. */
    DOWN = false;
    /** @type {boolean} True while the space bar / throw button is held. */
    SPACE = false;
}
