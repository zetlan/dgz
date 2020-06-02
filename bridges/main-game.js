//globals here
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);

//global vars
var canvas;
var ctx;
var timer;

var worldSeed = 0.25;



//functions

function setup() {
    canvas = document.getElementById("centralStation");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    
	timer = window.requestAnimationFrame(main);
}

function handleKeyPress(u) {
	switch (u.keyCode) {
		//player controls
		case 37:
		case 65:
			player.dx = -1 * pSpeed;
			break;
		case 38:
		case 87:
			player.dy = pSpeed;
			break;
		case 39:
		case 68:
			player.dx = pSpeed;
			break;
		case 40:
		case 83:
			player.dy = -1 * pSpeed;
			break;
	}
}

function handleKeyNegate(u) {
    switch (u.keyCode) {
		//movement
        case 37:
        case 65:
			if (player.dx < 0) {
				player.dx = 0;
			}
            break;
        case 38:
        case 87:
			if (player.dy > 0) {
				player.dy = 0;
			}
            break;
        case 39:
        case 68:
			if (player.dx > 0) {
				player.dx = 0;
			}
            break;
        case 40:
        case 83:
			if (player.dy < 0) {
				player.dy = 0;
			}
			break;
    }
}

function main() {
	//background
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}