let canvas;
let character = new Image();
let ctx;



function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    character.src = '../img/2_character_pepe/1_idle/idle/I-1.png';

    setTimeout(() => {
    ctx.drawImage(character, 20, 20, 100, 180);
    }, 1000);
}