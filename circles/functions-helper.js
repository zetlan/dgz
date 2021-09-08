
function determineTutorialText() {
	if (game_mode == 0) {
		//player knows how to move
		if (menu_x != 0 || menu_y != 0) {
			tutorial.hasDone[0] = true;
		}
	} else {
		if (scan_time > 0) {
			tutorial.hasDone[1] = true;
		}
	}

	//determine which text to display
	if (game_mode == 0) {
		if (!tutorial.hasDone[0]) {
			if (game_time > 600) {
				text_buffer = tutorial.texts[0];
				text_time = text_time_static;
			}
		} else if (!tutorial.hasDone[2]) {
			var cds = menu_queue[menu_queue.length-1];
			if (menu_nodeStruct[cds[1]][cds[0]].completed == true) {
				text_buffer = tutorial.texts[2];
				text_time = text_time_static;
			}
		}
	} else {
		//get minimum distance to orb, if it's large enough do the scan prompt
		if (!tutorial.hasDone[1] && !orbsAreAllBounced() && !orbsAreOnScreen()) {
			text_buffer = tutorial.texts[1];
			text_time = text_time_static;
		}	
	}
}


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

function localStorage_read() {
	var toRead = window.localStorage["circles_data"];
	try {
		toRead = JSON.parse(toRead);
	} catch (error) {
		console.log(`ERROR: could not parse ${toRead}, using default`);
		return;
	}

	//make sure it's somewhat safe, and then make it into the game flags
	if (typeof(toRead) == "object") {
		data_persistent = toRead;
	} else {
		console.log("ERROR: invalid type specified in save data, using default");
		return;
	}
}

function localStorage_write() {
	data_persistent.res = levels_st.statics[1].orbOut;
	data_persistent.tut = tutorial.hasDone[0] && tutorial.hasDone[1] && tutorial.hasDone[2];
	data_persistent.vol = levels_st.statics[2].orbOut;
	//update solve level
	for (var y=0; y<menu_levelOrder.length; y++) {
		if (menu_levelOrder[y].completed) {
			data_persistent.lvl = Math.max(data_persistent.lvl, y);
		}
	}

	//write persistent data to localStorage
	window.localStorage["circles_data"] = JSON.stringify(data_persistent);
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

function setLevelProgress(number) {
	//sets all the levels before a certain point in the level array to completed
	for (var l=0; l<menu_levelOrder.length; l++) {
		menu_levelOrder[l].completed = (l <= number);
	}
}


function screenToSpace(x, y) {
	return [((x - (canvas.width / 2)) / camera.scale) + camera.x, ((y - (canvas.height / 2)) / camera.scale) + camera.y];
}

function spaceToScreen(x, y) {
	return [((x - camera.x) * camera.scale) + canvas.width / 2, ((y - camera.y) * camera.scale) + canvas.height / 2];
}

function trueReset() {
	if (confirm("This action cannot be undone. Would you like to reset completely? \n(Press OK to reset, Cancel to not)")) {
		data_persistent = undefined;
		window.localStorage["circles_data"] = undefined;
		window.location.reload();
	}
}

function updateSettings() {
	var stStore = levels_st.statics;
	stStore[1].orbOut = data_persistent.res;
	stStore[1].orbs[data_persistent.res].layersCurrent = 0;
	stStore[1].func(stStore[1].values[data_persistent.res]);

	stStore[2].orbOut = data_persistent.vol;
	stStore[2].orbs[data_persistent.vol].layersCurrent = 0;
	stStore[2].func(stStore[2].values[data_persistent.vol]);

	tutorial.hasDone[0] = data_persistent.tut;
	tutorial.hasDone[1] = data_persistent.tut;
	tutorial.hasDone[2] = data_persistent.tut;

	setLevelProgress(data_persistent.lvl);
}
