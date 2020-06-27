//globals here
window.onload = setup;
window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);

//global vars
var canvas;
var ctx;

var size = 20;
var pSpeed = 1;



//functions

function setup() {
    canvas = document.getElementById("centralStation");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";

	camera = new Camera(100, 100, canvas.height * 0.5);	
	player = new Character(0, 0);
	timer = window.requestAnimationFrame(main);
	
}

function keyPress(u) {
	//normal mode controls
	//switch statement for keys, J+L or Z+C controls camera while WASD or ↑←↓→ controls character
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

function keyNegate(u) {
    //similar to keyPress, but for negation. The if statements are so the controls feel smooth.
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


	ctx.fillStyle = "#888888";
	dPoint(canvas.width * 0.5, canvas.height * 0.5, camera.dR);
	ctx.stroke();

	player.tick();
	ctx.fillStyle = "#000000";
	var screenPoint = hyperToDisk(player.y, player.x);
	dPoint(screenPoint[0], screenPoint[1], 3);
	ctx.fill();

	ctx.globalAlpha = 0.3;
	//drawing points grid
	for (var a=-1 * size; a<size;a+= 3) {
		for (b=-1*size;b<size;b+=0.75) {
			ctx.fillStyle = `hsl(${(Math.abs(a) + Math.abs(b)) * 7}, 90%, 40%)`;
			var screenPoint = hyperToDisk(a, b);
			dPoint(screenPoint[0], screenPoint[1], 2);
			ctx.fill();
		}
	}
	ctx.globalAlpha = 1;
	timer = window.requestAnimationFrame(main);
	//camera.r -= 0.05;
}



//computation functions below this point





/*
Takes in an xy point on the map and outputs it's position on the poincáre disk projection of the hyperbola. 
Since the hyperbola is the same all the way around, and only the positive hyperbola is used, the z position is implied.

formula for a circle is x^2 + y^2 = r^2
that can be collapsed to y = sqrt(r^2 + x^2) + h 

formula for a hyperbola is y^2/a^2 - x^2/a^2 = 1
that can be collapsed to y = sqrt(h^2 + x^2) in positive case when a and b are the same
*/



function hyperToDisk(x, y) {
	//step 1, take the xy point and turn into vector
	
	var dist = Math.sqrt((x * x) + (y * y));
	var angle = Math.atan2(x, y) - Math.PI / 2;

	/*step 2, use the angle information to collapse the problem to 1 dimension 
	(sphere is the same in all directions rotated around polar axis) */

	//distance angle is the angle that matches the distance given
	var angDist = dist * ((Math.PI / 3) / camera.r);

	//angDist is vertical inclination, angle is horizontal
	var x = camera.r * Math.cos(angle) * Math.sin(angDist);
	var y = camera.r * Math.cos(angDist);
	var z = camera.r * Math.sin(angle) * Math.sin(angDist);

	y += camera.sH;

	//spherical


	var tX = x / y;
	var tY = z / (-1 * y);

	[tX, tY] = [tX * camera.dR, tY * camera.dR];
	[tX, tY] = [tX + canvas.width * 0.5, tY + canvas.height * 0.5];

    //step 5, return it
    return [tX, tY];
}

function loggery(theta, phi) {
	var x = camera.r * Math.cos(phi) * Math.sin(theta);
	var y = camera.r * Math.cos(theta);
	var z = camera.r * Math.sin(phi) * Math.sin(theta);

	y += camera.sH;
	x /= y;
	z /= y;

	[x, z] = [x * camera.dR, z * camera.dR];
	[x, z] = [x + canvas.width * 0.5, z + canvas.height * 0.5];

	return [x, z];
}
