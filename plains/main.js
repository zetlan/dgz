//houses html interactivity, setup, and main function

window.onload = setup;
document.addEventListener("keydown", handleKeyPress, false);
document.addEventListener("keyup", handleKeyNegate, false);
document.addEventListener("mousedown", handleMouseDown, false);
document.addEventListener("mousemove", handleMouseMove, false);
document.addEventListener("mouseup", handleMouseUp, false);
document.addEventListener('pointerlockchange', handleCursorLockChange, false);
document.addEventListener('mozpointerlockchange', handleCursorLockChange, false);

//global variables
var canvas;
var ctx;

const color_editor_bg = "#335";
const color_editor_defaultPoly = "#088";
const color_editor_handles = "#888";
const color_selection = "#0FF";
const color_text_light = "#F8F";
var colorKey = "0123456789ABCDEF";

var controls_cursorLock = false;
var controls_sensitivity = 200;
var controls_shiftPressed = false;
var controls_commandPressed = false;

var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;

//editor numbers
var editor_iconNum = 4;
var editor_iconWidth = 0.2;
var editor_iconSize = 0.03;
var editor_snapAmount = 1;
var editor_tolerance = 10;
var editor_topBarHeight = 0.1;

//editor variables that are edited by the user
var editor_active = false;
let editor_clipboard = undefined;
let editor_objSelected = undefined;
let editor_meshSelected
var editor_worldRelative = false;

var loading_randVal = 1.241;
var loading_world = undefined;

var noclip_active = false;

let page_animation;


let player;
var player_noclipMultiplier = 10;


var world_time = 0;
let world_listing = [];

var render_crosshairSize = 3;
var render_crosshairDivide = 6;
var render_clipDistance = 0.1;
var render_identicalPointTolerance = 0.0001;
var render_normalLength = 1;

var star_distance = [10000, 20000];
var star_size = 50;
var star_number = 250;
let stars = [];

var testNumStorage = 0;



//setup function
function setup() {
	player = new Player(0, 8, 0, 0, 0);

	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");
	setStylePreferences();

	//cursor movements setup
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

	canvas.onclick = function() {
		if (!editor_active) {
			canvas.requestPointerLock();
		}
	}

	//high resolution slider
	document.getElementById("haveHighResolution").onchange = updateResolution;
	//if the box is already checked from a previous session update resolution to max
	if (document.getElementById("haveHighResolution").checked) {
		updateResolution();
	}
	//set up worlds from file
	readWorldFile();
	generateStarSphere();

	page_animation = window.requestAnimationFrame(main);
}

function main() {
	//var perfTime = [performance.now(), 0]
	testNumStorage = 0;
	if (loading_world == undefined) {
		console.log(`loading world is undefined!!!!`);
		page_animation = window.requestAnimationFrame(main);
		return;
	}
	//drawing background
	ctx.fillStyle = loading_world.bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//handling stars
	for (var c=0;c<stars.length;c++) {
		stars[c].tick();
		stars[c].beDrawn();
	}
	loading_world.exist();

	//crosshair
	if (noclip_active) {
		ctx.beginPath();
		ctx.strokeStyle = color_selection;
		ctx.rect((canvas.width / 2) - (render_crosshairSize / 2), (canvas.height / 2) - (render_crosshairSize / 2), render_crosshairSize, render_crosshairSize);
		ctx.stroke();
	}

	//crosshair 2
	if (editor_active) {
		if (loading_world.meshes.indexOf(editor_meshSelected) == -1) {
			editor_meshSelected = loading_world.meshes[0];
		}
		//starting pos
		var center = polToCart(player.theta, player.phi, 25);
		center = [center[0] + player.x, center[1] + player.y, center[2] + player.z];
		drawCrosshair(center, [render_crosshairSize, 0, 0], [0, render_crosshairSize, 0], [0, 0, render_crosshairSize]);

		//editor object
		editor_meshSelected.beDrawn_editor();
		if (editor_objSelected != undefined) {
			editor_objSelected.beDrawn_editor();
		}

		//editor overlay
		drawEditorOverlay();

		//cursor
		drawCircle(color_selection, cursor_x, cursor_y, 4);
	}

	//call self
	world_time += 1;
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
		//top bar stuff
		editor_handleClick();
		if (cursor_y > canvas.height * editor_topBarHeight) {
			if (editor_objSelected != undefined) {
				editor_objSelected.handleClick();
				if (editor_objSelected.handleSelected != -1) {
					return;
				}
			}
			editor_objSelected = selectPoly(editor_meshSelected.binTree);
		}
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