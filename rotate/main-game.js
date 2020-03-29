window.onload = setup;

//global vars
var canvas;
var ctx;

//objects
let camera;
let loadingMap;
let player;







//functions

function setup() {
    canvas = document.getElementById("cvsPharmacy");
    ctx = canvas.getContext("2d");

    player = new Character(0, 0, 0);
    camera = new Camera(0, 0, -100);
    loadingMap = defaultMap;
}

function keyPress() {
    //switch statement for keys, J+L or Z+C controls camera while WASD+space or <^>⌄+space controls character
    switch (u.keyCode) {
        //player controls
        case 37:
        case 65:
            break;
        case 38:
        case 87:
            break;
        case 39:
        case 68:
            break;
        case 40:
        case 83:
            break;
        
        //camera controls
        //Z or J
        case 90:
        case 74:
            break;
        //C or L
        case 67:
        case 76:
            break;
    }
}

function keyNegate() {
    //similar to keyPress, but slightly more complicated to make the controls feel smooth
    switch (u.keyCode) {
        case 37:
        case 65:
            break;
        case 38:
        case 87:
            break;
        case 39:
        case 68:
            break;
        case 40:
        case 83:
            break;
    }

}

function main() {

}