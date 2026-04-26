class MiniChicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  energy = 100;
  deadShown = false;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  constructor() {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages([this.IMAGE_DEAD]);
    this.speed = 0.15 + Math.random() * 0.25;
    this.x = 500 + Math.random() * 2100;
    this.y = 360;
    this.width = 60;
    this.height = 60;
    this.energy = 100;
    this.deadShown = false;
    this.animate();
  }

  animate() {
    this.animateDeath();

    setInterval(() => {
      if (!this.isDead()) {
        this.moveLeft("enemies");
      }
    }, 1000 / 60);
  }

  animateDeath() {
    setInterval(() => {
      if (this.isDead()) {
        if (!this.deadShown) {
          this.img = this.imageCache[this.IMAGE_DEAD];
          this.deadShown = true;
        }
        return;
      }
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 12);
  }

  hit() {
    this.energy -= 100;
  }
}
