//houses html interactivity, setup, and main function

window.onload = setup;
document.addEventListener("keydown", handleKeyPress, false);
document.addEventListener("keyup", handleKeyNegate, false);
document.addEventListener("mousedown", handleMouseDown, false);
document.addEventListener("mousemove", handleMouseMove, false);
document.addEventListener("mouseup", handleMouseUp, false);

//global variables
var animation;

var canvas;
var ctx;

let game_defaults = {
	bulletSpeed: 1,
	ticksPerBeat: 50,
	specialChance: 0.1,
}

let game_params = JSON.parse(JSON.stringify(defaults));
var game_objs = [];
var game_time = 0;


//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");

	//retina scaling
	if(window.devicePixelRatio != 1) {
		var w = canvas.width;
		var h = canvas.height;
	
		// scale the canvas by the viewing ratio
		canvas.setAttribute('width', w * window.devicePixelRatio);
		canvas.setAttribute('height', h * window.devicePixelRatio);
	
		// use css + scale to brign back to original size
		canvas.setAttribute('style', `width="${w}"; height="${h}";`);
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
	animation = window.requestAnimationFrame(main);
}

function main() {
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	//editor-specific functions keys
	if (editor_active && controls_commandPressed) {
		var used = false;
		switch (a.keyCode) {
			//c for copying
			case 67:
				if (editor_objSelected != undefined) {
					//copy the point if has a point selected, if not copy the whole object instead
					if (editor_objSelected.pointSelected != undefined || editor_objSelected.pointSelected == -1) {
						editor_clipboard = editor_objSelected.giveStringData();
					}
				}
				used = true;
				break;
			//d, for deselecting
			case 68:
				if (editor_objSelected != undefined) {
					editor_objSelected = undefined;
				}
				used = true;
				break;
		}
		if (used) {
			a.preventDefault();
			return;
		}
	}

	switch(a.keyCode) {
		//player controls
		// a/d
		case 65:
			player.ax = -1 * player.speed;
			break;
		case 68:
			player.ax = player.speed;
			break;
		// w/s
		case 87:
			player.az = player.speed;
			break;
		case 83:
			player.az = -1 * player.speed;
			break;

		//space
		case 32:
			if (player.onGround) {
				player.onGround = false;
				player.dy = 2.5;
			}
			break;
		//shift
		case 16:
			controls_shiftPressed = true;
			break;

		//camera controls
		case 37:
			player.dt = -1 * player.sens;
			break;
		case 38:
			player.dp = player.sens;
			break;
		case 39:
			player.dt = player.sens;
			break;
		case 40:
			player.dp = -1 * player.sens;
			break;

		case 219:
			noclip_active = !noclip_active;
			player.dy = 0;
			break;
		case 221:
			ctx.lineWidth = 2;
			if (!editor_active) {
				document.exitPointerLock();
			}
			editor_active = !editor_active;
			break;
		case 224:
			controls_commandPressed = true;
			break;

		//editor-only keys
		case 8:
			//delete
			if (editor_objSelected != undefined) {
				//if it's not a freePoly, (or it's a freePoly and no point is selected)delete the object.
				if (editor_objSelected.pointSelected == undefined || editor_objSelected.pointSelected == -1) {
					editor_meshSelected.objects.splice(editor_meshSelected.objects.indexOf(editor_objSelected), 1);
					editor_objSelected = undefined;
					loading_world.generateBinTree();
				} else {
					//if it's a point selected, remove that point
					if (editor_objSelected.points.length > 2) {
						editor_objSelected.points.splice(editor_objSelected.pointSelected, 1);
						editor_objSelected.determineHandlePositions();
						editor_objSelected.pointSelected = -1;
					}
				}
			}
			break;
	}
}

function handleKeyNegate(a) {
	switch(a.keyCode) {
		//player controls
		// a/d
		case 65:
			if (player.ax < 0) {
				player.ax = 0;
			}
			break;
		case 68:
			if (player.ax > 0) {
				player.ax = 0;
			}
			break;
		// w/s
		case 87:
			if (player.az > 0) {
				player.az = 0;
			}
			break;
		case 83:
			if (player.az < 0) {
				player.az = 0;
			}
			break;
		case 16:
			controls_shiftPressed = false;
			break;


		//camera controls
		case 37:
			if (player.dt < 0) {
				player.dt = 0;
			}
			break;
		case 38:
			if (player.dp > 0) {
				player.dp = 0;
			}
			break;
		case 39:
			if (player.dt > 0) {
				player.dt = 0;
			}
			break;
		case 40:
			if (player.dp < 0) {
				player.dp = 0;
			}
			break;

		case 224:
			controls_commandPressed = false;
			break;
	}
}

function handleCursorLockChange() {
	controls_cursorLock = (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas);
}

function handleMouseMove(a) {
	//regular case
	if (!editor_active) {
		if (controls_cursorLock) {
			player.theta += a.movementX / controls_sensitivity;
			player.phi -= a.movementY / controls_sensitivity;
			if (Math.abs(player.phi) > Math.PI / 2.02) {
				if (player.phi < 0) {
					player.phi = Math.PI / -2.01;
				} else {
					player.phi = Math.PI / 2.01;
				}
			}
		}
		
	} else {
		//in editor, cursor can't be locked
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = clamp(a.clientX - canvasArea.left, 0, canvas.width);
		cursor_y = clamp(a.clientY - canvasArea.top, 0, canvas.height);
	}
}

function handleMouseDown(a) {
	cursor_down = true;
	if (editor_active) {
		editor.handleClick();
	}
}

function handleMouseUp(a) {
	cursor_down = false;
}

function updateResolution() {
	var multiplier = 0.5;
	if (document.getElementById("haveHighResolution").checked) {
		multiplier = 2;
	}

	//all things necessary for switching between resolutions
	canvas.width *= multiplier;
	canvas.height *= multiplier;
	player.scale *= multiplier;
}