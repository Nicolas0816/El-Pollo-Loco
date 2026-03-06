class MovableObject {
    x = 120;
    y = 150;
    img;
    height = 280;
    width = 120;

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft(){
        console.log('Moving left');
    }
}