//syncs two object's positions together, with rotation

function sync(object1, object2, radians) {
    //step 1, get object 1's position
    var [tX, tY, tZ] = [object1.x, object1.y, object1.z];
    //step 2, apply rotation/rounding
    [tX, tZ] = rotate(tX, tZ, radians);

    //step 3, write to object 2's position
    [object2.x, object2.y, object2.z] = [tX, tY, tZ];
}

//function for activating the cutsceene
function activate(zone0123_OrderRYGB) {
	//only do things if the player is close to the center of the map
	if (Math.abs(player.x) < 20 && Math.abs(player.z) < 20 && Math.abs(player.y) < 105) {
		switch (zone0123_OrderRYGB) {
			case 0:
				gameFlags["hasR"] = true;
				break;
			case 1:
				gameFlags["hasY"] = true;
				break;
			case 2:
				gameFlags["hasG"] = true;
				break;
			case 3:
				gameFlags["hasB"] = true;
				break;
		}
		cutscene = 1;
		handleLocalStorage(true);
		updateMaps();
	}
}

//function for true reset
function trueReset() {
	//give user a warning
	if (confirm("This action cannot be undone. Would you like to reset completely? \n(Press OK to reset, Cancel to not)")) {
	//reset game flags
	gameFlags = {
		atC: false,
		hasR: false,
		hasY: false,
		hasG: false,
		hasB: false
	};

	//push to local storage
	handleLocalStorage(true);

	//refresh page
	window.location.reload();
	}
}

//keeping the player on the maze platforms
function falseFloor() {
	//make sure remote control is on
	player.remote = 2;

	//just making absolutely sure the player is in bounds
	while (Math.abs(player.x) > mapSize) {
		player.x *= 0.99;
		player.dx = 0;
	}

	while (Math.abs(player.z) > mapSize) {
		player.z *= 0.99;
		player.dz = 0;
	}

	//only run when not rotating, like normal movement
	//there is most likely a better way to do this but I'm sick of working on it and just want to finish the game
	if (!loadingMap.rotating) {
		//create a 5x5 array
		var ground = [	[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0]];

		//converting all tile objects in the map into 1s on the ground array
		for (var g=0;g<loadingMap.contains.length;g++) {
			//if it's a partialbox with y -150, count it as a floor tile
			if (loadingMap.contains[g].y == -150 && loadingMap.contains[g].constructor.name == "PartialBox") {
				//transforming coordinates
				var [tX, tZ] = getSquare(loadingMap.contains[g].x, loadingMap.contains[g].z);
				//one last check to make sure it will work
				if (tX % 1 == 0 && tZ % 1 == 0) {
					ground[tZ][tX] = 1;
				}
			}
		}
		//now that the array has been achieved, the player can be moved.
		var value;
		var newVal;
		var tP;

		//y is easiest
		player.y += player.dy;

		//x
		//getting the value of the square if dx were to be applied
		tP = getSquare(player.x + player.dx, player.z);
		try {
			value = ground[tP[1]][tP[0]];
		} catch(error) {
			value = 0;
		}
		//if the value is still a valid square, move the player
		if (value == 1) {
			player.x += player.dx;
		}

		//z
		//same thing, but for z
		tP = getSquare(player.x, player.z + player.dz);
		try {
			value = ground[tP[1]][tP[0]];
		} catch(error) {
			value = 0;
		}
		if (value == 1) {
			player.z += player.dz;
		}

		//if the player is still on a bad square, just let them control
		tP = getSquare(player.x, player.z);
		try {
			value = ground[tP[1]][tP[0]];
		} catch(error) {
			value = 0;
		}

		if (value == 0) {
			player.remote = 0;
		} else {
			//if the player is on a square, make sure that they're above the floor
			if (player.y < -152) {
				player.y = -150;
			}
		}
	}
}

function getSquare(x, z) {

	return [Math.floor(((x + 30) / 60) + 2), Math.floor(((z - 30) / -60) + 2)];
}
//converting real coordinates into square coordinates
//final cutscene
function activateFinalCutscene() {
	//same comparison as normal cutscene
	if (Math.abs(player.x) < 20 && Math.abs(player.z) < 20 && Math.abs(player.y) < 105) {
		//lock player controls
		[player.ax, player.az] = [0, 0];
		[player.dx, player.dy, player.dz] = [0, 0, 0];
		player.gravity = 0.2;

		//set cutscene to 2, the value for the final cutscene
		cutscene = 2;
		gameFlags["done"] = true;
		handleLocalStorage(true);
	}
}