class MovableObject {
    x = 120;
    y = 150;
    img;
    height = 280;
    width = 120;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround())
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        },1000 / 40);
    }

    isAboveGround() {
        return this.y < 150;
    }

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }
    /**
     * 
     * @param {Array} arr / ['img/image1.png', 'img/image2.png', ...] 
     */
    loadImages(arr){
        arr.forEach((path) => {        
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });

    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft(){
        setInterval(() => {
            this.x -= this.speed;
        },1000 / 60);
    }

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}