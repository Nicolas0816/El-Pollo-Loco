class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    energy = 100;
    lastHit = 0;
    deadAnimationPlayed = false;
    deadFrameIndex = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        },1000 / 40);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject){ // throwable objects should always fall
            return true;
        } else {
            return this.y < 150;
        }
    }

    moveRight() {
        this.x += 5;
        this.otherDirection = false;
    }

    moveLeft(object){
        if(object === 'enemies'){
            this.x -= this.speed;
        }

        if(object === 'character'){
            this.x -= 5;
        }
    }

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
 
    playDeadAnimationOnce() {
    if (this.deadAnimationPlayed) {
        // hold on last Frame of death animation
        const last = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
        this.img = this.imageCache[last];
        return;
    }

    const path = this.IMAGES_DEAD[this.deadFrameIndex];
    this.img = this.imageCache[path];
    this.deadFrameIndex++;

    if (this.deadFrameIndex >= this.IMAGES_DEAD.length) {
        this.deadAnimationPlayed = true;
    }
}

    jump() {
        this.speedY = 22;
    }



    isColliding(mo){
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit(){
        this.energy -= 5;
        if(this.energy < 0){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead(){
        return this.energy == 0;
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; //Difference in seconds
        return timepassed < 1;
    }
}