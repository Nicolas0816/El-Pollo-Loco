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
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
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

    jump() {
        this.speedY = 22;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken || this instanceof Endboss){
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }

    isColliding(mo){
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
    }
}