//interpolates between two values, with an exponential increase towards the second one
function droperp(a, b, percentage) {
	return linterp(a, b, Math.pow(percentage, 15));
}

function loadMenu(success) {
	//go backwards if it's not a success
	if (!success && menu_queue.length > 1) {
        menu_progress = 0;
        menu_queue = [menu_queue[menu_queue.length-1], menu_queue[menu_queue.length-2]];
	}
	game_map.completed = game_map.completed || success;
	camera.scale = camera_scale_menu;
	camera.x = camera_menuCoords[0];
	camera.y = camera_menuCoords[1];
	transitionModeGoal = 0;
	transitionSpeed = transitionSpeedConstant;
}

//handles move inputs in the menu
function menuMove(moveArr) {
	//don't move if transition in progress
	if (transitionProgress > 0) {
		return;
	}
	//divide progress by number of 
	var squareVal;
	var q = menu_queue;
	var ln = q.length;

	try {
		squareVal = menu_nodeStruct[q[ln-1][1] + moveArr[1]][q[ln-1][0] + moveArr[0]];
	} catch (er) {
		//squareVal will remain undefined
	}
	if (squareVal != undefined) {
		if (q.length < 2 || q[ln-1][0] + moveArr[0] != q[ln-2][0] || q[ln-1][1] + moveArr[1] != q[ln-2][1]) {
			menu_queue.push([q[ln-1][0] + moveArr[0], q[ln-1][1] + moveArr[1]]);

			//enter the level if it's not completed yet
			if (!squareVal.completed) {
				squareVal.load();
			}
			return;
		}
		if (q.length == 2) {
			//swap if it would be going back and the player is on the track
			[q[0], q[1]] = [q[1], q[0]];
			menu_progress = 1 - menu_progress;
		} else {
			//just delete the node if it's going back and the player isn't there yet
			menu_queue.splice(ln-1, 1);
		}
	}
}

function orbsAreAllBounced() {
	for (var h=0; h<game_map.statics.length; h++) {
		if (game_map.statics[h].layersCurrent > 0) {
			return false;
		}
	}
	return true;
}

//boolean function, returns true if there are orbs on screen
function orbsAreOnScreen() {
	for (var h=0; h<game_map.statics.length; h++) {
		if (orbIsOnScreen(game_map.statics[h])) {
			return true;
		}
	}
	return false;
}

//boolean function, returns true if an orb is on screen
function orbIsOnScreen(orb) {
	return (orb.layersCurrent > 0) && (Math.abs(orb.y - camera.y) < canvas.height * 0.5 * scan_windowScale[1] / camera.scale) && (Math.abs(orb.x - camera.x) < canvas.width * 0.5 * scan_windowScale[0] / camera.scale);
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

function scanWorld() {
    //do not penalize scans if it's a monster
    if (game_map.playerObj.constructor.name != "MonsterControllable") {
        game_map.playerObj.energy -= scan_energyCost;
    }
	
	scan_time = scan_time_static;
}


function screenToSpace(x, y) {
	return [((x - (canvas.width / 2)) / camera.scale) + camera.x, ((y - (canvas.height / 2)) / camera.scale) + camera.y];
}

function spaceToScreen(x, y) {
	return [((x - camera.x) * camera.scale) + canvas.width / 2, ((y - camera.y) * camera.scale) + canvas.height / 2];
}
