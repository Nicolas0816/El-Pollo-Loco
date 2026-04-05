class DrawableObject {
    x = 120;
    y = 150;
    img;
    height = 280;
    width = 120;
    imageCache = {};
    currentImage = 0;

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

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof Coin || this instanceof CollectableBottles){
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }
}