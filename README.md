# El Pollo Loco

A browser-based 2D jump-and-run game built with vanilla JavaScript and the HTML5 Canvas API.

## Gameplay

Play as Pepe and fight your way through a desert filled with chickens and mini-chickens. Collect coins and salsa bottles, throw bottles at enemies, and defeat the mighty Endboss to win.

**Controls**

| Key | Action |
|---|---|
| `→` | Move right |
| `←` | Move left |
| `↑` | Jump |
| `Space` | Throw bottle |

Mobile devices are supported in landscape mode via on-screen touch buttons.

## Features

- Animated player character with walk, jump, hurt, sleep, idle, and death states
- Two regular enemy types (Chicken, Mini-Chicken) plus a multi-hit Endboss
- Stomp mechanic — jump on Mini-Chickens from above to kill them
- Collectable coins and bottles with HUD status bars
- Throwable salsa bottles that splash on impact with enemies or the ground
- Background music, per-action sound effects, and a global mute toggle (state saved in localStorage)
- Win and lose end screens with Play Again / Main Menu options
- Portrait-mode overlay on mobile devices
- Impressum page

## Project Structure

```
El Pollo Loco/
├── index.html
├── impressum.html
├── style.css
├── audio/          # All sound files (.mp3)
├── fonts/          # Locally embedded fonts
├── img/            # Sprites, backgrounds, UI images
└── js/
    ├── game.js     # Entry point, input handling, game init/restart
    ├── levels/
    │   └── level1.js
    └── models/
        ├── drawable-object.class.js
        ├── movable-object.class.js
        ├── character.class.js
        ├── chicken.class.js
        ├── mini-chicken.class.js
        ├── endboss.class.js
        ├── throwable-object.class.js
        ├── collectable-bottles.class.js
        ├── coin.class.js
        ├── background-object.class.js
        ├── clouds.class.js
        ├── level.class.js
        ├── keyboard.class.js
        ├── world.class.js
        ├── collisions.class.js
        ├── audio.class.js
        ├── statusbar.class.js
        ├── healthbar.class.js
        ├── bottlebar.class.js
        ├── coinbar.class.js
        └── endboss-healthbar.class.js
```

## Live Demo

[nicolas-kiss.developerakademie.net/El Pollo Loco](https://nicolas-kiss.developerakademie.net/El%20Pollo%20Loco/index.html)

## Getting Started

No build step or dependencies required.

1. Clone or download the repository
2. Open `index.html` in a browser — or serve the folder with any static file server, e.g.:

```bash
npx serve .
```

> **Note:** Some browsers block `Audio` autoplay when opening files directly from the filesystem (`file://`). Using a local server avoids this.

## Technical Notes

- Pure vanilla JS, no frameworks or libraries
- OOP class hierarchy: `DrawableObject → MovableObject → Character / Chicken / Endboss / ThrowableObject`
- Collision detection is handled by a dedicated `CollisionManager` class (`collisions.class.js`)
- All audio is managed centrally in `AudioMusic` (`audio.class.js`)
- Game intervals are tracked in `World.intervals` and cleared on restart to prevent memory leaks

## License

Assets (sprites, sounds) are used for educational purposes. See `impressum.html` for contact and legal information.
