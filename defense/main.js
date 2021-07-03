//houses html interactivity, setup, and main function

window.onload = setup;
document.addEventListener("keydown", handleKeyPress, false);

//global variables
var animation;

var audio_damage = new Audio('hit.mp3');
var audio_block = new Audio('block.mp3');

var canvas;
var ctx;

const color_bg = "#002";
const color_player = "#F8F";
const color_projectile = "#F80";
const color_shield = "#080";
const color_shield_bright = "#0F0";


let game_defaults = {
	bulletSpeed: 1,
	ticksPerBeat: 50,
	specialChance: 0.1,
}

let game_params = JSON.parse(JSON.stringify(game_defaults));
var game_objs = [];
var game_time = 0;
var game_state = 0;
var game_level = 1;

var player = new Player();


//setup function
function setup() {
	canvas = document.getElementById("cabin");
	ctx = canvas.getContext("2d");

	//retina scaling
	// if(window.devicePixelRatio != 1) {
	// 	var w = canvas.width;
	// 	var h = canvas.height;
	
	// 	// scale the canvas by the viewing ratio
	// 	canvas.setAttribute('width', w * window.devicePixelRatio);
	// 	canvas.setAttribute('height', h * window.devicePixelRatio);
	
	// 	// use css + scale to brign back to original size
	// 	canvas.setAttribute('style', `width="${w}"; height="${h}";`);
	// 	ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	// }
	animation = window.requestAnimationFrame(main);
}

function main() {
	//bg
	ctx.fillStyle = color_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	switch (game_state) {
		case 0:
			doMainState();
			break;
		case 1:
			doSwitchState();
			break;
	}
	

	//draw player
	player.tick();
	player.beDrawn();

	game_time += 1;
	page_animation = window.requestAnimationFrame(main);
}

function doMainState() {
	//create object if time
	if (game_time % game_params.ticksPerBeat == 0) {
		var randInt = Math.floor(Math.random() * 3.99);
		game_objs.push(new Projectile(randInt, game_params.bulletSpeed));
	}

	//run through all objects, tick + draw
	for (var h=0; h<game_objs.length; h++) {
		game_objs[h].tick();
		game_objs[h].beDrawn();

		if (game_objs[h].destroy) {
			game_objs.splice(h, 1);
			h -= 1;
		}
	}
}

function doSwitchState() {
	for (var h=0; h<game_objs.length; h++) {
		game_objs[h].tick();
		game_objs[h].beDrawn();

		if (game_objs[h].destroy) {
			game_objs.splice(h, 1);
			h -= 1;
		}
	}

	//decrease approach rate
	game_params.bulletSpeed -= 0.06;
	//wait until all bullets are offscreen
	if (game_objs[0].distance > canvas.width / 2) {
		//change back to regular mode, apply effects
		game_state = 0;
		game_level += 1;
	}
}

//input
function handleKeyPress(a) {
	switch(a.keyCode) {
		case 37:
			player.angleQueue.push(Math.PI);
			break;
		case 38:
			player.angleQueue.push(Math.PI * 1.5);
			break;
		case 39:
			player.angleQueue.push(0);
			break;
		case 40:
			player.angleQueue.push(Math.PI * 0.5);
			break;
	}
}








//all other helper functions
function linterp(value1, value2, percentage) {
	return value1 + (percentage * (value2 - value1));
}

function cLinterp(color1HalfHex, color2HalfHex, percentage) {
	//performing a linear interpolation on all 3 aspects
	var finR = linterp(parseInt(color1HalfHex[1], 16), parseInt(color2HalfHex[1], 16), percentage);
	var finG = linterp(parseInt(color1HalfHex[2], 16), parseInt(color2HalfHex[2], 16), percentage);
	var finB = linterp(parseInt(color1HalfHex[3], 16), parseInt(color2HalfHex[3], 16), percentage);
	//converting back to hex
	return ("#" + Math.floor(finR).toString(16) + Math.floor(finG).toString(16) + Math.floor(finB).toString(16));
}