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
		cutscene = true;
		updateMaps();
	}
}