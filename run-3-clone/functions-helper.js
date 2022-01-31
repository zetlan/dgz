//houses functions of various utility
//THESE AREN'T ALL VOID I'M JUST LAZY
/* 
	generateAngelLines();
	generateStarSphere();

	activateCutsceneFromEditorTunnel(start, end, time);
	activateCutsceneFromTunnel(start, end, time);
	avgArray(array);
	
	calculateLevelsVisited();
	challenge_isCutscene(tile, reverseDirectionBOOLEAN, cutscene, immersiveBOOLEAN);
	challenge_isComplete();
	challenge_isEmpty();
	challenge_isPastTile(tile, reverseDirectionBOOLEAN);
	challenge_isOnlyOtherTunnel(tunnelName);
	challenge_isOops();
	challenge_isOopsTile(tile, reverseDirectionBOOLEAN);
	challenge_addBox(levelID, strip, tile, unitOffset, size, rot);
	challenge_addEncounter(levelID, strip, tile, characterName, cutsceneName, immersiveBOOLEAN);
	challenge_changeSpawn(strip, tile);
	challenge_crumble(tunnelID, posArray);
	challenge_crumbleAll(tunnelID);
	challenge_rareReset(tile?, reverseDirectionBOOLEAN?);

	changeTile(tunnel, tileCoords, newTileID);
	changeTiles(tunnel, tileArray, newTileID);
	clamp(num, min, max);
	compressCutsceneData(csObj);
	compressCutsceneLine(line);
	createTunnelFromData(data);
	decompressCutsceneData(csObj);
	decompressCutsceneLine(line);
	fastLoad();
	fastSqrt(num);

	file_export();
	file_import();
	file_import_1dot1(worldText);
	file_import_1dot2(worldText);

	getClosestObject();
	getImage();
	getObjectFromID(id, array);
	getTimeFromFrames();

	handleAudio();
	HSVtoRGB();
	isComplex(tile);
	isValidString(str);
	linterp3d();
	localStorage_read();
	localStorage_write();
	logTime();
	logTimeEnd();

	makeCutscene();
	makeCutsceneAbsolute();
	makeCutsceneRelative();
	makeCutsceneTag();

	modularDifference();
	outputWorld();
	outputTunnel();
	pickNewParent(object, oldParent);
	placeTunnelSet(setName);

	power_falseAlarm(powStart, powEnd, time);
	power_fast(powStart, powEnd, time);
	power_glimpse(powStart, powEnd, time);
	power_instant(powStart, powEnd, time);
	power_notSoFalseAlarm(powStart, powEnd, time);
	power_slow(powStart, powEnd, time);
	power_slowSmooth(powStart, powEnd, time);
	power_smooth(powStart, powEnd, time);

	randomSeeded(min, max);
	removeInvalidObjects(tunnel);
	removeObjectType(tunnel, constructorName);
	renameTunnelSet(oldPrefix, newPrefix)
	replacePlayer();
	RGBtoHSV();
	runCrash();
	sortWorldArray();
	spliceIn();
	spliceOut();
	stealAudioConsent();
	toggleForcedReset();

	tunnel_applyProperty(setPrefix, codeToExecuteSTRING);
	tunnelData_applyProperty();
	tunnelData_convertObjToString(dataObj);
	tunnelData_convertOldData(dataStr);
	tunnelData_convertOldObject(dataObj);
	tunnelData_handle();
	tunnelData_parseData();
	tunnelData_parseDataReverse();
	tunnelData_parseStars();
*/



//generation functions
function generateAngelLines() {
	data_angelChecklist.forEach(c => {
		if (!c[3]) {
			for (var t=0; t<=checklist_stayLines; t++) {
				c[5].push(randomSeeded(0.1, 1));
			}
		}
	});
}
function generateStarSphere() {
	//set up data structure
	star_arr = [];

	//random stars
	for (var e=0;e<star_number;e++) {
		//squared for distribution more towards the center
		var cosPhi = Math.pow(randomSeeded(0, 1), 2);
		if (randomSeeded(0, 1) < 0.5) {
			cosPhi *= -1;
		}
		//maps to between -1/2pi and 1/2pi
		var phi = Math.acos(cosPhi) - (Math.PI / 2);
		var theta = randomSeeded(0, Math.PI * 2);
		var pos = polToCart(theta, phi, randomSeeded(star_distance, star_distance * 2));
		star_arr.push(new Star(pos[0], pos[1], pos[2]));
	}

	//wormhole stars
	for (var e=0; e<Math.floor(star_number/7); e++) {
		var cosPhi = Math.pow(randomSeeded(-1, 1), 7);

		var phi = Math.acos(cosPhi) - (Math.PI / 2);
		var theta = randomSeeded(0, Math.PI * 2);
		var pos = polToCart(theta, phi, randomSeeded(star_distance, star_distance * 2));
		star_arr.push(new Star_Wormhole(pos[0], pos[1], pos[2]));
	}

	//special star
	star_arr.push(new Star_Special(-286600, -678, -666351));
}



//utility functions

function activateCutsceneFromEditorTunnel(start, end, time) {
	if (time == 0) {
		//simpler because it only applies to edit mode, editor cutscenes are always immersive
		setTimeout(() => {
			loading_state = new State_Cutscene(editor_cutscenes[end], loading_state);
		}, 10);
	}
	
	return start;
}

function activateCutsceneFromTunnel(start, end, time) {
	//don't do the cutscene stuff during a challenge
	if (loading_state.constructor.name != "State_Challenge") {
		//put cutscene in the 'activated cutscenes' array
		if (!data_persistent.effectiveCutscenes.includes(end)) {
			data_persistent.effectiveCutscenes.push(end);
		}
		setTimeout(() => {
			var playerStore = player;
			loading_state = new State_Cutscene(eval(`cutsceneData_${end}`));
			if (playerStore.parentPrev != undefined) {
				playerStore.parentPrev.resetWithoutPlayer();
			}
		}, 10);
	}
	return start;
}

//takes in a 2-dimensional array and averages the elements to output a 1d array
function avgArray(array) {
	var finArr = [];
	var arr = array;

	//get the length of the first 1d array
	for (var y=0;y<arr[0].length;y++) {
		//average all the 0s, the 1s, the 2s, etc until whole is done
		finArr.push(0);
		for (var z=0;z<arr.length;z++) {
			finArr[y] += arr[z][y];
		}
	}

	//divide numbers by the amount of 1d arrays
	for (var d=0;d<finArr.length;d++) {
		finArr[d] /= arr.length;
	}

	return finArr;
}

//returns the total number of levels that have been visited
function calculateLevelsVisited() {
	var infCount = 0;
	var expCount = 0;

	//first do explore mode levels
	world_objects.forEach(w => {
		expCount += w.discovered;
	});

	//then do infinite mode levels
	infCount = (infinite_levelsVisited.match(/1/g) || []).length;
	


	return [expCount, infCount];
}


//challenge conditionals are evaluated as end codes, they deal with ending the current section of challenge mode
function challenge_isCutscene(tile, reverseDirectionBOOLEAN, cutsceneEndString, immersiveBOOLEAN) {
	if (challenge_isPastTile(tile, reverseDirectionBOOLEAN)) {
		if (!data_persistent.effectiveCutscenes.includes(cutsceneEndString)) {
			data_persistent.effectiveCutscenes.push(cutsceneEndString);
		}
		//if not immersive, do the exit code
		if (!immersiveBOOLEAN) {
			eval(loading_state.codeOnExit);
		}
		loading_state = new State_Cutscene(eval(`cutsceneData_${cutsceneEndString}`), immersiveBOOLEAN && loading_state);
		return true;
	}
	return false;
}

function challenge_isComplete() {
	return (player.parentPrev != loading_state.targetParent);
}

function challenge_isEmpty() {
	return (loading_state.targetParent.freeObjs.length == 0);
}

function challenge_isPastTile(tile, reverseDirectionBOOLEAN) {
	var pixelPos = spaceToRelativeRotless([player.x, player.y, player.z], [loading_state.targetParent.x, loading_state.targetParent.y, loading_state.targetParent.z], [-1 * loading_state.targetParent.theta, loading_state.targetParent.phi]);

	if (reverseDirectionBOOLEAN) {
		return ((pixelPos[2] / loading_state.targetParent.tileSize) < tile);
	}
	return ((pixelPos[2] / loading_state.targetParent.tileSize) > tile);
}

function challenge_isOnlyOtherTunnel(tunnelName) {
	//only continue if complete
	if (challenge_isComplete()) {
		//if they're in the wrong tunnel
		if (player.parent != getObjectFromID(tunnelName)) {
			player.parentPrev = loading_state.targetParent;
			loading_state.handlePlayerDeath_SUPER();
			loading_state.doTunnelStartEffects();
			text_queue.push([loading_state.data[loading_state.line].char, "Whoops, I'm not going this way!"]);
			return false;
		}
		return true;
	}
	return false;
}

function challenge_isOops() {
	//only continue if complete
	if (challenge_isComplete()) {
		if (challenge_isEmpty()) {
			return true;
		}
		//if the player has completed but they! Forgot the box!
		player.parentPrev = loading_state.targetParent;
		loading_state.handlePlayerDeath_SUPER();
		loading_state.doTunnelStartEffects();
		loading_state.doTunnelStartEffects_Next();

		//append to text queue
		text_queue.push([loading_state.data[loading_state.line].char, "Oops, forgot the box!"]);
	}
	return false;
}

function challenge_isOopsTile(tile, reverseDirectionBOOLEAN) {
	//if past a tile
	if (challenge_isPastTile(tile, reverseDirectionBOOLEAN)) {
		//get the box
		var boxRef;
		for (var n=0; n<loading_state.targetParent.freeObjs.length; n++) {
			if (loading_state.targetParent.freeObjs[n].constructor.name == "PushableBox") {
				boxRef = loading_state.targetParent.freeObjs[n].box;
				n = loading_state.targetParent.freeObjs.length + 1;
			}
		}
		//if there are no boxes, cool!
		if (boxRef == undefined) {
			return true;
		}
		//if there is a box, but it's past the boundary, also cool
		if (reverseDirectionBOOLEAN) {
			if (spaceToRelativeRotless([boxRef.x, boxRef.y, boxRef.z], [boxRef.parent.x, boxRef.parent.y, boxRef.parent.z], [boxRef.parent.theta * -1, 0])[2] / boxRef.parent.tileSize <= tile) {
				return true;
			}
		} else {
			if (spaceToRelativeRotless([boxRef.x, boxRef.y, boxRef.z], [boxRef.parent.x, boxRef.parent.y, boxRef.parent.z], [boxRef.parent.theta * -1, 0])[2] / boxRef.parent.tileSize >= tile) {
				return true;
			}
		}
		//if still here, do the death effect
		player.parentPrev = loading_state.targetParent;
		loading_state.handlePlayerDeath_SUPER();
		loading_state.doTunnelStartEffects();
		loading_state.doTunnelStartEffects_Next();
		text_queue.push([loading_state.data[loading_state.line].char, "Oops, forgot the box!"]);
	}
	return false;
}

//challenge_ functions are used as start code to execute in a challenge segment
function challenge_addBox(levelID, strip, tile, unitOffset, size, rot, haltResetBOOLEAN) {
	var ref = getObjectFromID(levelID);
	if (ref.id == undefined) {
		console.error(`ERROR: Level ${levelID} doesn't exist!`);
		return;
	}

	var tileObj = ref.tiles[strip][tile];
	var offset = polToCart(tileObj.dir_down[0], tileObj.dir_down[1], unitOffset);
	//if a box already exists, instead of adding a box, reset the current box
	var objs = ref.freeObjs;
	for (var f=0; f<objs.length; f++) {
		if (objs[f].constructor.name == "PushableBox") {
			if (!haltResetBOOLEAN) {
				objs[f].homeX = tileObj.x + offset[0];
				objs[f].homeY = tileObj.y + offset[1];
				objs[f].homeZ = tileObj.z + offset[2];
				objs[f].reset();
			}
			return;
		}
	}

	//figure out next tunnel ID
	var prefix = levelID.replaceAll(/[0-9]/g, '');
	var num = levelID.replaceAll(/[A-z]/g, '').replaceAll(',', '').replaceAll('-', '') * 1;
	num -= boolToSigned(player.backwards);

	//if a box exists in the next tunnel, just return, don't have to worry about it
	var level = getObjectFromID(prefix + num);
	if (level.id != undefined) {
		objs = level.freeObjs;
		for (var f=0; f<objs.length; f++) {
			if (objs[f].constructor.name == "PushableBox") {
				return;
			}
		}
	}
	
	//if still here...

	ref.freeObjs.push(new PushableBox(tileObj.x + offset[0], tileObj.y + offset[1], tileObj.z + offset[2], ref, size, rot));
}

function challenge_addEncounter(levelID, strip, tile, characterName, cutsceneName, immersiveBOOLEAN) {
	//loop through the free objects. If there's a character already on that strip + tile, don't add the character
	var objs = getObjectFromID(levelID).freeObjs;
	for (var f=0; f<objs.length; f++) {
		if (objs[f].strip == strip && objs[f].tile == tile) {
			return;
		}
	}
	getObjectFromID(levelID).freeObjs.push(new StaticCharacter(getObjectFromID(levelID), strip, tile, characterName, cutsceneName, immersiveBOOLEAN));
}
//respawns the player at a certain strip / tile
function challenge_changeSpawn(strip, tile) {
	var spawnObj = player.parent.tiles[strip][tile];
	spawnObj.doRotationEffects(player);

	var offsetCoords = polToCart(spawnObj.normal[0], spawnObj.normal[1], 10);
	player.x = spawnObj.x + offsetCoords[0];
	player.y = spawnObj.y + offsetCoords[1];
	player.z = spawnObj.z + offsetCoords[2];
}

//crumbles different tiles
function challenge_crumble(tunnelID, posArray) {
	tunnelID = getObjectFromID(tunnelID);
	posArray.forEach(p => {
		try {
			tunnelID.tiles[p[0]][p[1]].fallStatus = physics_crumblingShrinkTime + physics_crumblingShrinkStart - 1;
			tunnelID.tiles[p[0]][p[1]].propogateCrumble();
		} catch (error) {
			console.log(`Error crumbling tile with strip ${p[0]} and tile ${p[1]} at tunnel ${tunnelID.id}`);
		}
		
	});
}

function challenge_crumbleAll(tunnelID) {
	tunnelID = getObjectFromID(tunnelID);
	//loop through all crumbling tile sets, crumble the first tile of every set then propogate it naturally
	tunnelID.crumbleSets.forEach(s => {
		s[0].fallStatus = physics_crumblingShrinkTime + physics_crumblingShrinkStart - 1;
		s[0].propogateCrumble();
	});
}

//like oops, but resets are manual most of the time. This means that the box doesn't reset.
function challenge_rareReset(tile, reverseDirectionBOOLEAN) {
	if (challenge_isComplete() || (tile != undefined && challenge_isPastTile(tile, reverseDirectionBOOLEAN))) {
		//get return condition
		var returnCondition = challenge_isEmpty();
		//special case for tiles
		if (tile != undefined) {
			returnCondition = false;
			if (challenge_isPastTile(tile, reverseDirectionBOOLEAN)) {
				var boxRef;
				for (var n=0; n<loading_state.targetParent.freeObjs.length; n++) {
					if (loading_state.targetParent.freeObjs[n].constructor.name == "PushableBox") {
						boxRef = loading_state.targetParent.freeObjs[n].box;
						n = loading_state.targetParent.freeObjs.length + 1;
					}
				}
				if (boxRef == undefined) {
					returnCondition = true;
				} else {
					//if there is a box, but it's past the boundary, also cool
					if (reverseDirectionBOOLEAN) {
						if (spaceToRelativeRotless([boxRef.x, boxRef.y, boxRef.z], [boxRef.parent.x, boxRef.parent.y, boxRef.parent.z], [boxRef.parent.theta * -1, 0])[2] / boxRef.parent.tileSize <= tile) {
							returnCondition = true;
						}
					} else {
						if (spaceToRelativeRotless([boxRef.x, boxRef.y, boxRef.z], [boxRef.parent.x, boxRef.parent.y, boxRef.parent.z], [boxRef.parent.theta * -1, 0])[2] / boxRef.parent.tileSize >= tile) {
							returnCondition = true;
						}
					}
				}
			}
		}
		if (returnCondition) {
			deathCount = 0;
			return true;
		}
		player.parentPrev = loading_state.targetParent;
		loading_state.handlePlayerDeath_SUPER();
		loading_state.doTunnelStartEffects();
		loading_state.doTunnelStartEffects_Next();

		//append to text queue
		text_queue.push([loading_state.data[loading_state.line].char, "Oops, forgot the box!"]);
		return;
	}

	//destructuring
	var [x] = rotate(player.x - player.parentPrev.x, player.z - player.parentPrev.z, player.parentPrev.theta * -1);
	//if player's about to die
	if (Math.sqrt((x * x) + (player.y * player.y)) >= player.parentPrev.r + tunnel_voidWidth - (player.fallMax * 1.5)) {
		//if there are tiles crumbled, count up the death counter.
		var tileFound = false;
		for (var s=0; s<player.parentPrev.realTiles.length; s++) {
			for (var t=0; t<player.parentPrev.realTiles[s].length; t++) {
				if (player.parentPrev.realTiles[s][t].fallStatus != undefined) {
					deathCount += 1;
					tileFound = true;
					//known bug: this will break if a tunnel has over 1 million strips or 1 million tiles, but the game will probably break before then so I don't care.
					t = 1e7;
				}
			}
			if (tileFound) {
				s = 1e7;
			}
		}

		//if the death counter's too high, let them die normally. If it's low enough, reset without actually dying, which stops the tunnel from resetting.
		if (deathCount <= 3) {
			player.parentPrev.placePlayer();
		} else {
			loading_state.handlePlayerDeath();
			text_queue.push([loading_state.data[loading_state.line].char, `Let's try this again from the top.`]);
			deathCount = 0;
		}
		
	}
	return false;
}

function challenge_resetBox(levelID, strip, tile, unitOffset) {
	var ref = getObjectFromID(levelID);
	if (ref.id == undefined) {
		console.error(`ERROR: Level ${levelID} doesn't exist!`);
		return;
	}

	var tileObj = ref.tiles[strip][tile];
	var offset = polToCart(tileObj.dir_down[0], tileObj.dir_down[1], unitOffset);
	//just the reset portion
	var objs = ref.freeObjs;
	for (var f=0; f<objs.length; f++) {
		if (objs[f].constructor.name == "PushableBox") {
			objs[f].homeX = tileObj.x + offset[0];
			objs[f].homeY = tileObj.y + offset[1];
			objs[f].homeZ = tileObj.z + offset[2];
			objs[f].reset();
			return;
		}
	}
}

function challenge_setTempTile(levelID, strip, tile) {
	var tun = getObjectFromID(levelID);
	if (tun.data[strip][tile] != 109) {
		changeTile(tun, [strip, tile], 109);
		loading_state.codeOnExit += `changeTile(getObjectFromID("${levelID}"), [${strip}, ${tile}], 0);`;
	}
}








//THIS IS SUPER COOL!
/**
 * changeTile changes a single tile in a tunnel.
 * @param {Tunnel} tunnel 
 * @param {Array} tileCoords 
 * @param {Number} newTileID 
 * @returns nothing
 */
function changeTile(tunnel, tileCoords, newTileID) {
	//make sure tunnel is an object
	if (tunnel.constructor.name == "String") {
		tunnel = getObjectFromID(tunnel);
	}

	//don't change tile if it's already the same thing
	if (tunnel.data[tileCoords[0]][tileCoords[1]] == newTileID) {
		return;
	}

	//get the offending object at the start
	var objToRemove = tunnel.tiles[tileCoords[0]][tileCoords[1]];
	var oldSimplicity = tunnel.simple;

	//In the tunnel, many things must be edited and match up:
	//THINGS TO EDIT - data, tiles, realTiles, realTilesComplex, realTilesSimple, plexiglass, crumblies, simplicity

	tunnel.data[tileCoords[0]][tileCoords[1]] = newTileID;
	tunnel.repairData();
	var oldCrumblies = tunnel.crumbleSets;
	tunnel.determineSimplicity();
	var newSimplicity = tunnel.simple;

	//only remove the old tile if it actually needs removal
	if (objToRemove != undefined && objToRemove.constructor.name != "Tile_Plexiglass") {
		if (tunnel.tiles[tileCoords[0]][tileCoords[1]] != undefined) {
			tunnel.tiles[tileCoords[0]][tileCoords[1]] = undefined;
		}
		tunnel.realTiles[tileCoords[0]].splice(tunnel.realTiles[tileCoords[0]].indexOf(objToRemove), 1);

		//when removing a tile, don't need to re-establish reals because it's impossible to mess up the ordering of things.
		//when a tile is added later, the reals for this strip need to be re-established.
		if (!oldSimplicity) {
			//if the tunnel is complex, gotta remove it from the extra arrays
			if (isComplex(objToRemove)) {
				tunnel.realTilesComplex[tileCoords[0]].splice(tunnel.realTilesComplex[tileCoords[0]].indexOf(objToRemove), 1);
			} else {
				tunnel.realTilesSimple[tileCoords[0]].splice(tunnel.realTilesSimple[tileCoords[0]].indexOf(objToRemove), 1);
			}
		}
	}
	
	//add a new tile if ID isn't 0 (in that case it's simply a removal)
	if (newTileID != 0) {
		//regular, adding case
		//create the tile object, put it in all the various arrays it needs to be in
		var wCoords = tunnel.worldPositionOfTile(tileCoords[0], tileCoords[1] + 1);;
		var objToAdd = tunnel.generateTile(newTileID, wCoords[0], wCoords[1], wCoords[2], tunnel.tileSize, tunnel.strips[tileCoords[0]].normal, tunnel.color, tileCoords[0], tileCoords[1]);

		tunnel.tiles[tileCoords[0]][tileCoords[1]] = objToAdd;

		//if switching simplicity gotta do the whole tunnel, sorry
		if (oldSimplicity != newSimplicity) {
			tunnel.establishReals();
		} else {
			tunnel.establishReals_strip(tileCoords[0]);
		}
	}

	//necessary things to make the tunnel function as normal again
	if (!newSimplicity && (oldCrumblies != undefined || (objToRemove != undefined && objToRemove.constructor.name == "Tile_Crumbling") || (objToAdd != undefined && objToAdd.constructor.name == "Tile_Crumbling"))) {
		//re-establish crumble sets if a crumbling tile was involved in removal / placement
		if (oldCrumblies != undefined) {
			//if having old crumblies, can just use that
			oldCrumblies.forEach(g => {
				g.forEach(t => {
					if (t.crumbleSet != undefined) {
						t.crumbleSet = -1;
					}
				});
			});
		} else {
			//if no old crumblies, search through the whole tunnel
			tunnel.realTilesComplex.forEach(c => {
				c.forEach(t => {
					if (t.crumbleSet != undefined) {
						t.crumbleSet = -1;
					}
				});
			});
		}
		tunnel.establishCrumbleSets();
	}
	var plexTileDist = Math.ceil(physics_maxBridgeDistance / tunnel.tileSize);
	//strip distance is capped, because circling more than half the tunnel is just unnecessary
	var plexStripDist = Math.min(plexTileDist, Math.ceil(tunnel.strips.length / 2) + 1);
	tunnel.generatePlexies_bounded(tileCoords[0] - plexStripDist, tileCoords[0] + plexStripDist, tileCoords[1] - plexTileDist, tileCoords[1] + plexTileDist);
	tunnel.calculatePoints();
}

//changeTile, but for multiple tiles
function changeTiles(tunnel, tileArray, newTileID) {
	if (tunnel.constructor.name == "String") {
		tunnel = getObjectFromID(tunnel);
	}
	tileArray.forEach(t => {
		changeTile(tunnel, t, newTileID);
	});
}


//keeps a number between certain bounds
//these operators are stupid and I hope to never use them again
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

function compressCutsceneData(csObj) {
	//don't compress non-existent frames
	if (csObj.frames.length < 1) {
		return;
	}

	//only compress if it's not compressed
	if (csObj.frames[0].constructor.name == "String") {
		return;
	}
	//loop through all frames
	for (var f=0; f<csObj.frames.length; f++) {
		csObj.frames[f] = compressCutsceneLine(csObj.frames[f]);
	}

	//is the cutscene relative to something? Then make sure that's reflected in the data
	if (csObj.relativeTo != undefined) {
		makeCutsceneRelative(csObj.relativeTo, csObj);
	}
}

function compressCutsceneLine(line) {
	//don't compress if already compressed
	if (line.constructor.name == "String") {
		return line;
	}

	//camera data
	var camData = "CAM~";
	for (var a=0; a<line[0].length-1; a++) {
		camData += line[0][a].toFixed(data_precision) + "~";
	}
	camData += line[0][line[0].length-1].toFixed(data_precision);

	var objData = ``;
	for (var a=0; a<line[1].length; a++) {
		objData += "|" + line[1][a].giveStringData();
	}

	return `${camData}${objData}`;
}

function createTunnelFromData(data) {
	data = tunnelData_handle(data);
	return new Tunnel(data.theta, RGBtoHSV(data.color), data.tileData, data.id, data.maxLen, data.power, data.functions, data.sides, data.spawns, data.endSpawns, 
		data.tilesPerSide, data.tileSize, data.x, data.z, data.bannedCharacters, data.music);
}

function decompressCutsceneData(csObj) {
	//don't handle non-existent frames
	if (csObj.frames.length < 1) {
		return;
	}
	
	//only decompress if necessary
	if (csObj.frames[0].constructor.name != "String") {
		return;
	}

	//if it's relative, revert that before decompressing
	if (csObj.relativeTo != undefined) {
		makeCutsceneAbsolute(csObj);
	}

	for (var f=0; f<csObj.frames.length; f++) {
		if (csObj.frames[f].constructor.name == "String") {
			csObj.frames[f] = decompressCutsceneLine(csObj.frames[f]);
		}
	}
}

//turns a single cutscene line into an array
function decompressCutsceneLine(line) {
	var camData = [0, 0, 0, 0, 0, 0];
	var objData = [];

	//translate each tag into its corresponding object
	//for an easier read of possible tags and arguments, see data-cutscenes.js, line 1
	var tags = line.split("|");
	tags.forEach(t => {
		var s = t.split("~");
		switch (s[0]) {
			case "CAM":
				for (var n=0; n<s.length-1; n++) {
					camData[n] = +s[n+1];
				}
				break;
			case "LGT":
				objData.push(new SceneLight(+s[1], +s[2], +s[3]));
				break;
			case "SPR":
				objData.push(new SceneSprite(+s[1], +s[2], +s[3], s[4], +s[5], JSON.parse(s[6]), +s[7], +s[8], +s[9]));
				break;
			case "BUB":
				objData.push(new SceneBubble(+s[1], +s[2], +s[3], +s[4]));
				break;
			case "BOX":
				objData.push(new SceneBox(+s[1], +s[2], +s[3], +s[4]));
				break;
			case "COD":
				objData.push(new SceneCode(s[1]));
				break;
			case "LIN":
				objData.push(new SceneLine(+s[1], +s[2], +s[3], +s[4]));
				break;
			case "TRI":
				objData.push(new SceneTri(+s[1], +s[2], +s[3], +s[4], +s[5]));
				break;
			case "TXT":
				objData.push(new SceneText(+s[1], +s[2], +s[3], +s[4], s[5], JSON.parse(s[6])));
				break;
			case "POW":
				objData.push(new ScenePowercell(+s[1], +s[2], +s[3]));
				break;
			case "3TL":
				objData.push(new SceneTile(+s[1], +s[2], +s[3], +s[4], +s[5], +s[6]));
				break;
			case "3BT":
				objData.push(new SceneBoat(+s[1], +s[2], +s[3], +s[4], +s[5]));
				break;
		}
	});
	return [camData, objData];
}

function fastLoad() {
	placeTunnelSet(levelData_main);
	var tun = world_objects[0];
	editor_active = true;
	player.parentPrev = tun;
	loading_state = new State_Menu();
	tun.reset();

	world_camera.x = 75000;
	world_camera.y = 1000;
	world_camera.z = world_wormhole.z + 100;
}

function fastSqrt(num) {
	//good enough zozzle
	if (num < 4) {
		return num;
	}

	var a, b;
	a = 40;
	for (var c=0; c<3; c++) {
		b = num / a; 
		a = (a + b) / 2;
	}

	return a;
}

//generate file from editor world
function file_export() {
	//create data
	var textDat = '';

	//version number at the top
	textDat += world_version.toFixed(2) + "\n";

	//should the file be locked?
	var value = confirm(`Locking a file will prevent it from being edited after it is exported. Lock the exported file?\nPress Ok to lock the file, and Cancel to keep it unlocked.`);
	textDat += value + "\n";

	//spawn object index
	textDat += editor_objects.indexOf(editor_spawn) + "\n";

	//world objects
	editor_objects.forEach(e => {
		textDat += e.giveStringData() + "\n";
	});

	//cutscenes
	//loop through all cutscenes
	var cList = Object.keys(editor_cutscenes);
	cList.forEach(c => {
		compressCutsceneData(editor_cutscenes[c]);
		textDat += `\n${c}\n`;
		textDat += `${editor_cutscenes[c].id}\n`;
		textDat += `${editor_cutscenes[c].effects}\n`;
		textDat += `${editor_cutscenes[c].relativeTo || ""}\n`;

		//frames
		var frameRef = editor_cutscenes[c].frames;
		frameRef.forEach(f => {
			textDat += `${f}\n`;
		});
		textDat += "end";
	});

	var fileObj = new Blob([textDat], {type: 'text/plain'});

	//make sure a world file doesn't already exist
	if (editor_worldFile != undefined) {
		window.URL.revokeObjectURL(editor_worldFile);
	}
	editor_worldFile = window.URL.createObjectURL(fileObj);
	var link = document.getElementById('download');
	link.href = editor_worldFile;
	link.click();
}





//turn file into editor world
function file_import() {
	//people say javascript is its most awkward when it's interacting with html + other elements. I think they're right.
	var fileObj = document.getElementById('upload').files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		//function for when the text actually loads
		var worldText = fileLoadedEvent.target.result;
		var version = worldText.split("\n")[0];
		console.log(`file version detected: ${version}`);

		//reset world before loading
		editor_locked = false;
		editor_objects = [];
		editor_cutscenes = {};

		//do different things depending on the save file version
		switch(version) {
			case "1.20":
				file_import_1dot2(worldText);
				break;
			default:
				file_import_1dot1(worldText);
				break;
		}
	};

	fileReader.readAsText(fileObj, "UTF-8");
}


//for old files
function file_import_1dot1(worldText) {
	//loading levels
	var levelToLoad = worldText.substring(0, worldText.indexOf("\n"));
	worldText = worldText.substring(worldText.indexOf("\n")+1);
	while (levelToLoad != "") {
		editor_objects.push(createTunnelFromData(levelToLoad));
		levelToLoad = worldText.substring(0, worldText.indexOf("\n"));
		worldText = worldText.substring(worldText.indexOf("\n")+1);
	}

	loading_state.readFrom = orderObjects(editor_objects, 6);

	//load start level
	editor_spawn = editor_objects[worldText.substring(0, worldText.indexOf("\n")) * 1];
	worldText = worldText.substring(worldText.indexOf("\n")+2);
	
	//safety
	var tolerance = 5000;
	//loading cutscenes
	worldText = worldText.split("\n");
	while (worldText.length > 1) {
		var ref = worldText[0];
		var cName = worldText[1];
		var cEffects = worldText[2];
		var cFrames = [];
		var lineCheck = 3;

		//4 + is frames, search
		while (worldText[lineCheck] != "end") {
			cFrames.push(worldText[lineCheck]);
			lineCheck += 1;

			tolerance -= 1;
			if (tolerance <= 0) {
				if (!confirm(editor_warning_file)) {
					return;
				}
			}
		}
		//push cutscene and delete from the data
		editor_cutscenes[ref] = {
			id: cName,
			effects: cEffects,
			frames: cFrames
		};
		worldText.splice(0, lineCheck+1);
	}
}

function file_import_1dot2(worldText) {
	//first split tag
	var splitText = worldText.split("\n");

	//misc properties go at the top, for example:

	//the version number, this can be skipped
	splitText.splice(0, 1);
	
	//is the world locked?
	editor_locked = (splitText.splice(0, 1)[0] == "true");

	//what's the start index?
	var startInd = +splitText.splice(0, 1)[0];

	//load all levels
	while (splitText[0] != "") {
		editor_objects.push(createTunnelFromData(splitText.splice(0, 1)[0]));
	}
	//get rid of the empty space
	while (splitText[0] == "") {
		splitText.splice(0, 1);
	}
	loading_state.readFrom = orderObjects(editor_objects, 6);

	//load start level
	editor_spawn = editor_objects[startInd];
	
	//loading cutscenes
	while (splitText.length > 1) {
		var cName = splitText[0]
		editor_cutscenes[cName] = {
			id: splitText[1],
			effects: splitText[2],
			frames: []
		};
		//relative to something?
		if (splitText[3] != "") {
			editor_cutscenes[cName].relativeTo = splitText[3];
		}
		splitText.splice(0, 4);

		//frames
		editor_cutscenes[cName].frames = splitText.splice(0, splitText.indexOf("end"));
		splitText.splice(0, 1);
	}

	//if the world is locked, go to the lock screen
	if (editor_locked) {
		if (loading_state.constructor.name == "State_Edit_World") {
			render_maxColorDistance /= loading_state.lightMultiplier;
		}
		loading_state = new State_Edit_Select();
	}
}

function flipObject(object) {
	//takes key:value pairs and turns them into value: key pairs.
	var flipped = {};
	var keyList = Object.keys(object);
	keyList.forEach(k => {
		var val = object[k];
		if (flipped[val] == undefined) {
			flipped[val] = [];
		}
		flipped[val].push(k);
	});
	return flipped;
}

function getClosestObject(arr) {
	var item = 0;
	for (var a=1; a<arr.length; a++) {
		if (arr[a].cameraDist < arr[item].cameraDist) {
			item = a;
		}
	}
	return item;
}

function getImage(url) {
	var image = new Image();
	image.src = url;
	return image;
}

//given a dictionary of key:value pairs, returns the key of a value
function getKey(obj, value) {
	return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

function getObjectFromID(id, array) {
	//array might be undefined. If so, use the current state's readFrom array
	array = array ?? world_objects;

	if (array.length < 1) {
		return undefined;
	}
	//binary search through the list
	var low = 0;
	var high = array.length - 1;

	while (low < high) {
		if (array[Math.floor((low + high) / 2)].id.localeCompare(id) < 0) {
			low = Math.floor((low + high) / 2) + 1;
		} else {
			high = Math.floor((low + high) / 2);
		}
	}

	if (array[low].id == id) {
		return array[low];
	}

	//return an empty object to avoid errors
	return {};
}

function getTimeFromFrames(intFrames) {
	var timeText = ` s`;
	//seconds
	timeText = Math.floor((intFrames % 3600) / 60) + timeText;
	

	//minutes
	if (intFrames >= 3600) {
		//add 0 to seconds
		if (Math.floor((intFrames % 3600) / 60) < 10) {
			timeText = "0" + timeText;
		}
		timeText = `${Math.floor((intFrames % 216000) / 3600)}:` + timeText.substring(0, timeText.length-2);
	}
	//hours
	if (intFrames >= 216000) {
		//add 0 to minutes
		if (Math.floor((intFrames % 216000) / 3600) < 10) {
			timeText = "0" + timeText;
		}
		timeText = `${Math.floor(intFrames / 216000)}:` + timeText;
	}
	return timeText;
}






function handleAudio() {
	//channel 2 is pretty simple, just maintain whatever you're doing if in a gameplay state and if not, set self to undefined
	//the only states accessible from the world should be map + menu, if I've missed one I'll need to fix it, but doing constructor.name is faster than instanceof
	if (loading_state.constructor.name == "State_Map" || loading_state.constructor.name == "State_Menu") {
		audio_channel2.target = undefined;
	}

	//subtitles for people with their volume off
	if (audio_channel2.audio == data_audio["Tone"] && audio_channel2.volume == 0 && text_queue.length == 0) {
		text_queue.push([undefined, `beeeep`]);
	} 



	//channel 1
	//first choose what audio should be. Don't update audio target at all during cutscenes, and property editing has its own audio controlling
	if (loading_state.constructor.name == "State_Cutscene" || loading_state.constructor.name == "State_Edit_Properties") {
		return;
	}

	//set target audio to player's parent if in a gameplay state
	audio_channel1.target = undefined;
	if (loading_state.parentControlsAudio) {
		//special case for skater
		if (player.constructor.name == "Skater" && player.parentPrev.music != "None") {
			audio_channel1.target = data_audio["UnsafeSpeeds"];
			return;
		}

		//also special case for infinite mode, going by difficulty
		if (loading_state.constructor.name == "State_Infinite") {
			//songs scale with distance
			switch (Math.floor(loading_state.distance / 2000)) {
				case 0:
					audio_channel1.target = data_audio["TravelTheGalaxy"];
					return;
				case 1:
					audio_channel1.target = data_audio["LeaveTheSolarSystem"];
					return;
				case 2:
					audio_channel1.target = data_audio["WormholeToSomewhere"];
					return;
				case 3:
					audio_channel1.target = data_audio["TheVoid"];
					return;
				case 4:
					audio_channel1.target = data_audio["CrumblingWalls"];
					return;
				case 5:
				default:
					audio_channel1.target = data_audio["MapOfTheStars"];
					return;
			}
		}
		//default case
		if (loading_state.substate != 3) {
			audio_channel1.target = data_audio[player.parentPrev.music];
		}
	}
}


//deals with the text queue at the bottom of the screen
function handleTextDisplay() {
	//only do if things in the queue
	if (text_queue.length > 0) {
		drawCharacterText();

		//choosing text
		if ((loading_state instanceof State_World && loading_state.substate == 0) || loading_state.constructor.name == "State_Menu" || loading_state.constructor.name == "State_Map") {
			text_time -= 1;
			if (loading_state.constructor.name == "State_Menu") {
				text_time -= 2;
			}
			if (text_time <= 0) {
				text_time = text_timeMax;
				text_queue.splice(0, 1);
			}
		}
	}
}



function HSVtoRGB(hsvObject) {
	if (hsvObject.h < 0) {
		hsvObject.h += 360;
	}
	//I don't understand most of this but it appears to work
	var compound = hsvObject.v * (hsvObject.s / 80);
	var x = compound * (1 - Math.abs(((hsvObject.h / 60) % 2) - 1));
	var mystery = hsvObject.v - compound;
	var RGB = [0, 0, 0];

	switch(Math.floor(hsvObject.h / 60)) {
		case 0:
			RGB = [compound, x, 0];
			break;
		case 1:
			RGB = [x, compound, 0];
			break;
		case 2:
			RGB = [0, compound, x];
			break;
		case 3:
			RGB = [0, x, compound];
			break;
		case 4:
			RGB = [x, 0, compound];
			break;
		case 5:
			RGB = [compound, 0, x];
			break;
	}

	RGB = [
		Math.floor((RGB[0] + mystery) * 255), 
		Math.floor((RGB[1] + mystery) * 255), 
		Math.floor((RGB[2] + mystery) * 255)
	];

	var RGBString = "";
	var tempStr = "";
	RGB.forEach(colorPart => {
		tempStr = colorPart.toString(16);
		if (tempStr.length == 1) {
			tempStr = "0" + tempStr;
		}
		RGBString += tempStr;
	});


	return RGBString;
}

//says whether a tile is a complex tile or not
function isComplex(tile) {
	return ((tile.fallRate ?? tile.rampPushForce ?? tile.polys ?? tile.verticalObj) != undefined);
}

function isValidString(str) {
	return (str != null && str != undefined && +str != +"");
}

function linterp3d(p1, p2, percentage) {
	return [linterp(p1[0], p2[0], percentage), linterp(p1[1], p2[1], percentage), linterp(p1[2], p2[2], percentage)];
}

function localStorage_read() {
	//turn the things in the messages section of local storage into a string that can be read into gameFlags
	var toRead;
	try {
		toRead = window.localStorage["run3_data"];
	} catch(error) {
		console.log(`ERROR: could not access local storage. Something has gone very seriously wrong.`);
	}

	try {
		toRead = JSON.parse(toRead);
	} catch (error) {
		console.log(`ERROR: could not parse ${toRead}, using default`);
		return;
	}

	var settingStorage = data_persistent.settings;
	

	//make sure it's somewhat safe, and then make it into the game flags
	if (typeof(toRead) == "object") {
		data_persistent = toRead;
	} else {
		console.log("ERROR: invalid type specified in save data, using default");
		return;
	}

	if (data_persistent.settings == undefined) {
		data_persistent.settings = settingStorage;
		console.log("ERROR: invalid settings recieved, using default");
	}

	//update settings
	audio_channel1.volume = data_persistent.settings.volume;
	if (data_persistent.settings.highResolution) {
		updateResolution();
	}
	ctx.imageSmoothingEnabled = data_persistent.settings.antiAlias;

	//canvas stuff
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	console.log("loaded save");
}

function localStorage_write() {
	//loop through all levels. If it's discovered, add it to the discovered list
	data_persistent.discovered = "";
	for (var a=0; a<world_objects.length; a++) {
		if (world_objects[a].discovered == true) {
			data_persistent.discovered += "~"+world_objects[a].id;
		}
	}
	data_persistent.discovered = data_persistent.discovered.slice(1);

	//collapse the infinite visited array
	data_persistent.infVisited = "";
	for (var p=0; p<infinite_levelsVisited.length; p+=6) {
		data_persistent.infVisited += tunnel_translationInverse[parseInt(infinite_levelsVisited.slice(p, p+6), 2)];
	}


	window.localStorage["run3_data"] = JSON.stringify(data_persistent);
}

function logTime(logName) {
	times_current[logName] = [performance.now(), 0];
	if (times_past[logName] == undefined) {
		times_past[logName] = [];
	}
}

function logTimeEnd(logName, textToDisplay) {
	times_current[logName][1] = performance.now();
	times_past[logName].push(times_current[logName][1] - times_current[logName][0]);
	if (times_past[logName].length > 150) {
		var avgTime = 0;
		times_past[logName].forEach(t => {
			avgTime += t;
		});
		avgTime /= times_past[logName].length;
		console.log(`${textToDisplay}: ${avgTime.toFixed(data_precision)} ms`);
		times_past[logName] = [];
	}
}

//gives you the cutscene in easily managable JSON
function makeCutscene(ref) {
	//go through all frames
	var frameData = ``;
	ref.frames.forEach(d => {
		frameData += `\`${d}\`, \n`;
	});

	//ack this is a bit of a mess
	var outputString = `{\n`;
	outputString += `\tid: \`${ref.id}\`,\n`;
	outputString += `\teffects: \`${ref.effects}\`,\n`;
	if (ref.relativeTo != undefined) {
		outputString += `\trelativeTo: \`${ref.relativeTo}\`,\n`;
	}
	outputString += `\tframes: [\n\t\t${frameData}]\n\t}`;

	return outputString;
}

function makeCutsceneAbsolute(cutsceneData) {
	//determine which array to look for in terms of relativity
	var isEditor = false;
	var editCutKeys = Object.keys(editor_cutscenes);
	for (var x=0; x<editCutKeys.length; x++) {
		if (editor_cutscenes[editCutKeys[x]] == cutsceneData) {
			isEditor = true;
			x = editCutKeys.length;
		}
	}

	var tunnel = getObjectFromID(cutsceneData.relativeTo, isEditor ? editor_objects : world_objects);
	var relPos = [tunnel.x, tunnel.y, tunnel.z];
	var relDirs = [tunnel.theta, 0, 0];
	var buffer1;

	//split into lines, each data tag is handled differently
	for (var ln=0; ln<cutsceneData.frames.length; ln++) {
		buffer1 = cutsceneData.frames[ln].split("|");
		//make each tag relative
		for (var f=0; f<buffer1.length; f++) {
			buffer1[f] = makeCutsceneTag(buffer1[f], 1, relPos, relDirs);
		}
		cutsceneData.frames[ln] = buffer1.reduce((a, b) => a + "|" + b);
	}
}

//given a cutscene object with string frames, makes it relative to a tunnel.
function makeCutsceneRelative(relativeTunnelSTRING, cutsceneData) {
	var relPos;
	var relDirs;
	var tunnel;
	var buffer1;

	var isEditor = false;
	var editCutKeys = Object.keys(editor_cutscenes);
	for (var x=0; x<editCutKeys.length; x++) {
		if (editor_cutscenes[editCutKeys[x]] == cutsceneData) {
			isEditor = true;
			x = editCutKeys.length;
		}
	}

	tunnel = getObjectFromID(relativeTunnelSTRING, isEditor ? editor_objects : world_objects);
	if (tunnel.id == undefined) {
		console.error(`${relativeTunnelSTRING} is not a valid tunnel name!`);
		return;
	}
	relPos = [tunnel.x, tunnel.y, tunnel.z];
	relDirs = [tunnel.theta, 0, 0];

	//make relative to the new tunnel
	for (var ln=0; ln<cutsceneData.frames.length; ln++) {
		buffer1 = cutsceneData.frames[ln].split("|");
		//make each tag relative
		for (var f=0; f<buffer1.length; f++) {
			buffer1[f] = makeCutsceneTag(buffer1[f], -1, relPos, relDirs);
		}
		cutsceneData.frames[ln] = buffer1.reduce((a, b) => a + "|" + b);
	}
}

function makeCutsceneTag(tag, sign, positionData, directionData) {
	var nt = tag.split("~");
	var dp = data_precision;
	switch (nt[0]) {
		case "CAM":
		case "LGT":
		case "POW":
		case "3TL":
		case "3BT":
			nt[1] = +nt[1];
			nt[2] = +nt[2];
			nt[3] = +nt[3];
			//if the sign's positive, do rotation first
			if (sign == 1) {
				[nt[1], nt[3]] = rotate(nt[1], nt[3], sign * directionData[0]);
			}
			//move all coordinates, that's always the first 3 numbers
			nt[1] += (sign * positionData[0]);
			nt[2] += (sign * positionData[1]);
			nt[3] += (sign * positionData[2]);

			//rotate
			if (sign == -1) {
				[nt[1], nt[3]] = rotate(nt[1], nt[3], sign * directionData[0]);
			}

			//direction change completes camera
			if (nt[0] == "CAM") {
				nt[4] = ((+nt[4] - (sign * directionData[0])) + (Math.PI * 2)) % (Math.PI * 2);
				return `CAM~${nt[1].toFixed(dp)}~${nt[2].toFixed(dp)}~${nt[3].toFixed(dp)}~${nt[4].toFixed(dp)}~${nt[5]}~${nt[6]}`;
			}

			//the light and powercell only have xyz, and are now done
			if (nt[0] == "LGT" || nt[0] == "POW") {
				return `${nt[0]}~${nt[1].toFixed(dp)}~${nt[2].toFixed(dp)}~${nt[3].toFixed(dp)}`;
			}

			//boats and tiles have more complex constructors. Should boat theta or Tile size change with the tunnel? Perhaps, but I don't really care enough.
			if (nt[0] == "3BT") {
				return `3BT~${nt[1].toFixed(dp)}~${nt[2].toFixed(dp)}~${nt[3].toFixed(dp)}~${nt[4]}~${nt[5]}`;
			}

			if (nt[0] == "3TL") {
				return `3TL~${nt[1].toFixed(dp)}~${nt[2].toFixed(dp)}~${nt[3].toFixed(dp)}~${nt[4]}~${nt[5]}~${nt[6]}`;
			}
			break;
		//ignore all 2d objects
		default:
			return tag;
	}
}

function modularDifference(a, b, modulo) {
	//first make sure they're both positive
	while (a < 0) {
		a += modulo;
	}
	while (b < 0) {
		b += modulo;
	}

	//get to be the smallest possible
	a %= modulo;
	b %= modulo;

	//check both sides
	return Math.min(Math.abs(a - b), Math.abs((a + modulo) - b), Math.abs((a - modulo) - b));
}

//outputs every tunnel in the world as a string
function outputWorld() {
	var output = ``;
	world_objects.forEach(w => {
		output += w.giveStringData() + "\n";
	});

	return output;
}

//outputs every tunnel with a prefix as a string
function outputTunnel(prefix) {
	var output = ``;
	var num = 1;
	while (getObjectFromID(prefix + num).id != undefined) {
		output += getObjectFromID(prefix + num).giveStringData() + "\n";
		num += 1;
	}

	return output;
}

//picks a new parent tunnel for free objects, given an old one
function pickNewParent(object, oldParent) {
	var reqDist = getDistance_Tunnel(oldParent, object);
	for (var a=0; a<loading_state.readFrom.length; a++) {
		if (loading_state.readFrom[a] != oldParent) {
			var tunDist = getDistance_Tunnel(loading_state.readFrom[a], object)
			if (tunDist < reqDist) {
				oldParent = loading_state.readFrom[a];
				reqDist = tunDist;
			}
		}
	}
	return oldParent;
}

function placeTunnelSet(setName) {
	var setSplit = setName.split("\n");
	for (var g=0; g<setSplit.length-1; g++) {
		world_objects.push(createTunnelFromData(setSplit[g]));
	}
	sortWorldArray();
}







//power functions!
//each power function takes in a start power, end power, and a time. The time determines what the power will be.
function power_falseAlarm(powStart, powEnd, time) {
	time = clamp(time / 60, 0, 1);
	return linterp(powEnd, powStart, Math.max(0, 1 - (2 * (3.00006648 * time * time)) + (6 * (time * time * time * time))))

}

function power_fast(powStart, powEnd, time) {
	//fast is made from other functions
	if (time < 90) {
		return power_notSoFalseAlarm(powStart, powEnd, time);
	} else if (time < 100) {
		return linterp(powStart, powEnd, 0.5);
	} else {
		return power_smooth(powStart, powEnd, (time - 100) * 4);
	}
}

function power_glimpse(powStart, powEnd, time) {
	time = clamp(time / 60, 0, 2);
	return linterp(powStart, powEnd, 1 - ((time - 1) * (time - 1)));
}

function power_instant(powStart, powEnd, time) {
	return powEnd;
}

function power_notSoFalseAlarm(powStart, powEnd, time) {
	//slow fade, jump to start, then jump back to end
	if (time > 70) {
		return powEnd;
	}
	return power_falseAlarm(powStart, powEnd, time);
}

function power_slow(powStart, powEnd, time) {
	//slow is also made from other functions, I used switch because it was worth it
	var mode = Math.floor(time / 10);

	if (mode < 9) {
		mode = 9;
	}
	switch (mode) {
		case 9:
			return power_notSoFalseAlarm(powStart, powEnd, time);
		case 10:
			return power_smooth(powStart, powEnd, (time - 100) * 6);
		case 11:
		case 12:
			return linterp(powEnd, powStart, 0.6);
		case 13:
			return linterp(powEnd, powStart, 0.2);
		case 14:
		case 15:
			return linterp(powEnd, powStart, 0.4);
		case 16:
			return powEnd;
		case 17:
			return linterp(powEnd, powStart, 0.3);
		case 18:
		default:
			return powEnd;
	}
}

//I like the smooth functions because they're easy
function power_slowSmooth(powStart, powEnd, time) {
	return linterp(powStart, powEnd, clamp(time, 0, 120) / 120);
}

function power_smooth(powStart, powEnd, time) {
	return linterp(powStart, powEnd, clamp(time, 0, 60) / 60);
}





//returns a pseudo-random value between the min value and max values
function randomSeeded(min, max) {
	world_pRandValue = Math.pow(world_pRandValue, 1.6414756);
	//keep value in bounds
	while (world_pRandValue > 100) {
		world_pRandValue -= 98;
	}
	return ((world_pRandValue % 1) * (max - min)) + min;
}

function removeInvalidObjects(tunnel) {
	for (var u=0; u<tunnel.freeObjs.length; u++) {
		if (tunnel.freeObjs[u].houseState != loading_state && tunnel.freeObjs[u].houseState != undefined) {
			tunnel.freeObjs.splice(u, 1);
			u -= 1;
		}
	}
}

function removeObjectType(tunnel, constructorName) {
	for (var u=0; u<tunnel.freeObjs.length; u++) {
		if (tunnel.freeObjs[u].constructor.name == constructorName) {
			tunnel.freeObjs.splice(u, 1);
			u -= 1;
		}
	}
}

function renameTunnelSet(oldPrefix, newPrefix) {
	//since the objects array is sorted, I can just get the first index and then iterate from there
	var firstIndex = world_objects.indexOf(getObjectFromID(oldPrefix + "1"));
	if (firstIndex == -1) {
		console.log(`couldn't find any tunnel starting with ${oldPrefix}!`);
		return;
	}
	var prefix = world_objects[firstIndex].id.replaceAll(/[0-9]/g, '');
	var n = 0;
	while (world_objects[firstIndex+n].id.replace(prefix, "") > 0) {
		//I can't just use n for the new number because the sort goes 1, 11, 2, 3 instead of 1, 2, 3, ... 11
		world_objects[firstIndex+n].id = newPrefix + (world_objects[firstIndex+n].id.replace(prefix, "") * 1);
		n += 1;
	}

	//afterwords, resort the list
	sortWorldArray();
}

//replaces the current player with a new player object, with all the same properties that matter
function replacePlayer(characterIDNum) {
	var playerStore = player;
	var str = `new ${data_characters.indexes[characterIDNum]}(player.x, player.y, player.z);`
	player = eval(str);
	player.dx = playerStore.dx;
	player.dy = playerStore.dy;
	player.dz = playerStore.dz;

	player.dir_down = playerStore.dir_down;
	player.dir_side = playerStore.dir_side;
	player.dir_front = playerStore.dir_front;

	player.parent = playerStore.parentPrev;
	player.parentPrev = playerStore.parentPrev;

	player.backwards = playerStore.backwards;
}

//does a reset without the player for all tunnels
function resetAllTunnels() {
	world_objects.forEach(t => {
		if (t.freeObjs.length > 0) {
			t.resetWithoutPlayer();
		}
	});
}

//takes in a six digit RGB hex code and outputs an HSV code in object form.
function RGBtoHSV(sixDigitRGBHexCode) {
	//first get the seperate red, green, and blue values
	var val_red = sixDigitRGBHexCode.substring(1, 3);
	var val_green = sixDigitRGBHexCode.substring(3, 5);
	var val_blue = sixDigitRGBHexCode.substring(5, 7);

	//map from strings to 0-255 value
	val_red = parseInt(val_red, 16);
	val_green = parseInt(val_green, 16);
	val_blue = parseInt(val_blue, 16);

	
	//convert to 0-1 scalar
	val_red /= 255;
	val_green /= 255;
	val_blue /= 255;

	//other helpful parameters
	var val_max = Math.max(val_red, val_green, val_blue);
	var val_min = Math.min(val_red, val_green, val_blue);
	var diff = val_max - val_min;

	var hue;
	var saturation;
	var value = val_max;

	//calculating hue
	if (diff == 0) {
		hue = 0;
	} else if (val_red == val_max) {
		hue = 60 * (((val_green - val_blue) / diff) % 6);
	} else if (val_green == val_max) {
		hue = 60 * (((val_blue - val_red) / diff) + 2);
	} else if (val_blue == val_max) {
		hue = 60 * (((val_red - val_green) / diff) + 4);
	}



	//calculating saturation
	if (val_max == 0) {
		saturation = 0;
	} else {
		saturation = diff / val_max;
	}

	return {h: hue, s: saturation * 80, v: value};
}

function runCrash() {
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//loop through all lines
	ctx.fillStyle = "#F0F";
	for (var y=0; y<canvas.height; y++) {
		if (randomSeeded(0, 1) < 0.25) {
			ctx.fillRect(0, y, canvas.width, 1);
		}
	}

	window.cancelAnimationFrame(page_animation);
}

function sortWorldArray() {
	//alphabetical sort
	world_objects.sort(function (a, b) {
		return (a.id).localeCompare(b.id);
	});
}

function spliceIn(string, charStart, string2) {
	return string.slice(0, charStart) + string2 + string.slice(charStart, string.length);
}

function spliceOut(string, charStart, charEnd) {
	return string.slice(0, charStart) + string.slice(charEnd, string.length);
}

function stealAudioConsent(a) {
	//plays and then pauses all the audio elements. It's triggered by the first click, so the user doesn't notice, but they technically allowed the audio to play.
	if (audio_consentRequired) {
		for (var audio in data_audio) {
			data_audio[audio].play();
			data_audio[audio].pause();
			data_audio[audio].currentTime = 0;
		}
		audio_consentRequired = false;
	}
}

function toggleForcedReset(value) {
	//controls the state of the forced reset thing
	if (value == 0) {
		//turn it off
		window.clearTimeout(page_escBuffer);
		return;
	}

	if (value == 1) {
		//turn it on
		page_escBuffer = window.setTimeout(function() {
			runCrash();
			new Audio(`audio/reset.ogg`).play();
			window.setTimeout(function() {
				toggleForcedReset(2);
			}, 100);
		}, controls_escHoldTime);
		return;
	}

	if (value == 2) {
		//time to do the actual reset, not any of this timeout stuff
		window.cancelAnimationFrame(page_animation);
		loading_state = new State_Menu();
		page_animation = window.requestAnimationFrame(main);
		return;
	}
}

//applies a property to a tunnel set
function tunnel_applyProperty(setPrefix, codeToExecuteSTRING) {
	var targetTunnel = getObjectFromID(`${setPrefix}1`);
	var targetNum = 2;
	while (targetTunnel.id != undefined) {
		eval(codeToExecuteSTRING);
		targetTunnel = getObjectFromID(`${setPrefix}${targetNum}`);
		targetNum += 1;
	}
}

function tunnelData_applyProperty(data, dataTagToApply, startLineIfAny, endLineIfAny) {
	var lines = data.split("\n");
	var newData = ``;
	//start / end line parsing
	var startLine = 0;
	var endLine = lines.length - 1;
	if (startLineIfAny != undefined) {
		startLine = startLineIfAny;
	}

	if (endLineIfAny != undefined) {
		endLine = endLineIfAny;
	}

	for (var a=startLine; a<endLine; a++) {
		lines[a] = lines[a] + "|" + dataTagToApply;
	}

	//recombine data
	for (var b=0; b<lines.length-1; b++) {
		newData += lines[b] + "\n";
	}

	return newData;
}

function tunnelData_convertObjToString(dataObj) {
	var ndo = dataObj;
	//re-make string data
	var output = ``;
	//simple non-tile position features
	output += `id~${ndo.name}`;
	//position data isn't shown in this tag
	output += `|pos-x~0`;
	output += `|pos-z~0`;
	output += `|direction~0`;
	output += `|tube~${ndo.sides}~${ndo.tilesPerSide}`;
	output += `|color~${ndo.color}`;
	output += `|music~${ndo.music}`;

	if (ndo.spawns.length > 0) {
		output += `|spawn`;
		ndo.spawns.forEach(s => {
			output += `~${s}`;
		});
	}
	if (ndo.endSpawns.length > 0) {
		output += `|endSpawn`;
		ndo.endSpawns.forEach(s => {
			output += `~${s}`;
		});
	}
	if (ndo.tileSize != 70) {
		output += `|tileWidth~${ndo.tileSize}`;
	}
	if (ndo.power != 1) {
		output += `|power~${ndo.power.toFixed(data_precision)}`;
	}

	//tile data
	ndo.terrains.forEach(t => {
		output += `|${t}`;
	});

	//I am not anticipating tunnel functions in old custom level data
	return output;
}


//takes in old tunnel data with single quotes surrounding it and NO BACKSLASHES, and converts it to my format of data
function tunnelData_convertOldData(dataStr) {
	//first convert data to new object form
	var ndo = {
		name: "UNHAPPY: UNDEFINED NAME",
		sides: 0,
		tilesPerSide: 0,
		tileSize: 70,
		color: "",
		spawns: [],
		endSpawns: [],
		power: 1,
		terrains: [],
		music: "None"
	};

	//get data out of the old data
	var dataTags = dataStr.split("|");
	dataTags.forEach(t => {
		//reminds me how much I hate player_'s level data system
		if (t.indexOf("id-") == 0) {
			ndo.name = t.replace("id-", "");
			return;
		}

		if (t.indexOf("terrain-pos-") == 0) {
			//changing tags and removing color for comptability
			var fixed = t.replace("terrain-pos-", "terrain~").replaceAll('`', '!').replace("~color-0", "").replaceAll("~bouncy", "~steepRamp");
			//I don't want color1 terrain to just vanish, so it'll become glowing tiles if there's no other tag to specify afterwords
			if (fixed.indexOf("~color-1") != -1 && fixed.indexOf("~color-1~") == -1) {
				fixed = fixed.replace("~color-1", "~glow");
			}

			ndo.terrains.push(fixed);
			return;
		}

		if (t.indexOf("layout-tunnel") == 0) {
			var smallStr = t.replace("layout-tunnel", "").split(",");
			ndo.sides = +smallStr[0];
			ndo.tilesPerSide = +smallStr[1];
			return;
		}

		if (t.indexOf("color0-0x") == 0) {
			ndo.color = t.replace("color0-0x", "");
		}

		if (t.indexOf("spawn-") == 0) {
			ndo.spawns.push(+t.split("-")[1]);
			return;
		}

		if (t.indexOf("endSpawn-") == 0) {
			ndo.endSpawns.push(+t.split("-")[1]);
			return;
		}

		if (t.indexOf("tileWidth-") == 0) {
			ndo.tileSize = +t.split("-")[1];
			return;
		}

		if (t.indexOf("power-") == 0) {
			ndo.power = +t.split("-")[1];
			return;
		}

		if (t.indexOf("music-") == 0) {
			ndo.music = t.split("-")[1];
		}
	});

	return tunnelData_convertObjToString(ndo);
}



//takes an old tunnel data object with NO BACKSLASHES and converts it to my format
function tunnelData_convertOldObject(dataObj) {
	//are there multiple tunnels in the set?
	if (dataObj.contentType == "Level set") {
		var preProcessArr = dataObj.content.split("\n");
		var tunnelArr = [];
		
		//loop through all old tunnel datum
		for (var w=0; w<preProcessArr.length; w++) {
			tunnelArr.push(tunnelData_convertOldData(preProcessArr[w] + `|id-${dataObj.name}${w}`))
		}

		//return an array of all the values
		return tunnelArr;
	}
	//individual level: really the only problem is that the name's seperated out
	return tunnelData_convertOldData(dataObj.content + `|id-${dataObj.name}`);
} 

function tunnelData_fixTag(data) {
	//break up data
	var tunnels = data.split("\n");
	var endData = "";
	var splitTag;
	register = [];
	tunnels.forEach(t => {
		var tags = t.split("|");
		register = [];
		//loop through tags part 1, if it's a spawn tag add to register
		tags.forEach(tag => {
			splitTag = tag.split("~");
			if (splitTag[0] == "spawn") {
				for (var n=1; n<splitTag.length; n++) {
					//only place if the register doesn't have the tag
					if (register.indexOf(splitTag[n]) == -1) {
						register.push(splitTag[n]);
					}
					register.sort(function(a, b) {return a - b});
				}
			}
		});

		//loop through tags part 2, add to final string
		tags.forEach(tag => {
			splitTag = tag.split("~");
			if (splitTag[0] == "color") {
				endData += `|${tag}|spawn`;
				register.forEach(v => {
					endData += `~${v}`;
				});
			} else if (splitTag[0] != "spawn") {
				if (splitTag[0] == "id") {
					endData += tag;
				} else {
					endData += `|${tag}`;
				}
				
			}
		});
		endData += "\n";
	});

	//reassemble data
	return endData;
}

//takes in raw tunnel data and subdivides it into its segments (id, tunnel type information, tile information, color, etc)
function tunnelData_handle(data) {
	var rawInput = data;

	//split input using vertical separators
	var splitInput = rawInput.split("|");

	var tunnelStructure = {
		color: "", 
		id: "ERROR: name not initialized", 
		maxLen: 0, 
		music: "TravelTheGalaxy",
		power: 1, 
		functions: [], 
		sides: 0, 
		spawns: [],
		endSpawns: [],
		tileData: [], 
		tileSize: 70, 
		tilesPerSide: 0, 
		theta: 0, 
		x: 0, 
		z: 0,
		bannedCharacters: {}
	};

	//looping through all indeces of the array to classify them
	splitInput.forEach(i => {
		var splitTag = i.split("~");
		switch (splitTag[0]) {
			case "id":
				tunnelStructure.id = splitTag[1];
				break;
			case "tube":
				//0 is sides, 1 is tiles per side
				tunnelStructure.sides = splitTag[1] * 1;
				tunnelStructure.tilesPerSide = splitTag[2] * 1;
				break;
			case "color":
				tunnelStructure.color = "#" + splitTag[1];
				break;
			case "music":
				tunnelStructure.music = splitTag[1];
				break;
			case "tileWidth":
				tunnelStructure.tileSize = splitTag[1] * 1;
				break;
			case "trigger":
				//split tag will be ["trigger", "0", "1", "smooth"], or ["trigger", "0", "abcd", "cutscene"]

				//turn it into a number if that can be done
				if (+splitTag[2] > -1e1001) {
					splitTag[2] = +splitTag[2];
				}
				tunnelStructure.functions.push([splitTag[1] * 1, splitTag[2], splitTag[3]]);
				break;
			case "terrain":
				tunnelStructure.tileData.push(i.replace("terrain~", ""));
				break;
			case "pos-x":
				tunnelStructure.x = splitTag[1] * 1;
				break;
			case "pos-z":
				tunnelStructure.z = splitTag[1] * 1;
				break;
			case "direction":
				tunnelStructure.theta = splitTag[1] * 1;
				break;
			case "spawn":
				//spawns / end spawns take multiple arguments
				for (var n=1; n<splitTag.length; n++) {
					tunnelStructure.spawns.push(splitTag[n] * 1);
				}
				break;
			case "endSpawn":
				for (var n=1; n<splitTag.length; n++) {
					tunnelStructure.endSpawns.push(splitTag[1] * 1);
				}
				break;
			case "power":
				tunnelStructure.power = splitTag[1] * 1;
				break;
			case "charRestriction":
				//split tag will be ["charRestriction", "[reason]", "character1", "character2"... etc]
				for (var i=2; i<splitTag.length; i++) {
					tunnelStructure.bannedCharacters[splitTag[i]] = splitTag[1];
				}
				break;
		}
	});

	//the tile data is incomplete, so it needs to be fixed
	//generate tunnel array
	var finalTileArray = [];

	finalTileArray[(tunnelStructure.tilesPerSide * tunnelStructure.sides) - 1] = [];
	for (var g=0; g<tunnelStructure.tilesPerSide*tunnelStructure.sides-1; g++) {
		finalTileArray[g] = [];
	}

	tunnelStructure.tileData.forEach(j => {
		var dataBit = j.split("~");
		dataBit[1] = "~" + dataBit[1];
		tunnelData_parseData(dataBit[0], finalTileArray, tunnelStructure.tilesPerSide * tunnelStructure.sides, tunnel_tileAssociation[dataBit[1]]);
	});

	tunnelStructure.tileData = finalTileArray;

	//get the tunnel length
	tunnelStructure.tileData.forEach(td => {
		tunnelStructure.maxLen = Math.max(tunnelStructure.maxLen, td.length);
	});

	//return the final data
	return tunnelStructure;
}


//takes in terrain data and returns the 2d array with different tunnel tile types
function tunnelData_parseData(toParse, tileArray, tilesInLoop, tileTypeNum) {
	//first step is to parse the stars
	toParse = tunnelData_parseStars(toParse);

	//next step is converting the data to 1s/0s
	var newData = "";
	for (var e=0;e<toParse.length;e++) {
		newData += tunnel_translation[toParse[e]].toString(2).padStart(6, "0");
	}

	//final step is to map the 1s/0s onto the tunnel array
	var posCounter = 0;
	while (posCounter < newData.length) {
		var row = posCounter % tilesInLoop;
		var column = Math.floor(posCounter / tilesInLoop);

		//if the array doesn't already have a value, put self's value in
		if (!(tileArray[row][column] > 0)) {
			tileArray[row][column] = newData[posCounter] * tileTypeNum;
		}

		posCounter += 1;
	}
}

function tunnelData_parseDataReverse(tileDataArray) {
	//helpful numbers
	var numOfTiles = Object.keys(tunnel_tileAssociation).length;


	//helpful units of storage
	var dataString = "";
	var stringRegister2 = "";
	var dataLists = [];

	//step 1: convert tunnel array to sets of 1s / 0s
	
	//loop through possible values, create array index
	//doing this loop backwards makes it faster
	for (var n=numOfTiles-1; n>-1; n--) {
		dataLists[n] = "";
	}

	//loop through possible values again, this time search through the tunnel data to see tiles of that type
	for (var n=0; n<numOfTiles; n++) {
		for (var tile=0; tile<tileDataArray[0].length; tile++) {
			for (var strip=0; strip<tileDataArray.length; strip++) {
				//add a 0 or 1 string based on whether the tile is there or not
				dataLists[n] += "" + (1 * (tileDataArray[strip][tile] == (n+1)));
			}
		}
	}


	//step 2: convert binary data into b64 data
	for (var q=0; q<dataLists.length; q++) {
		stringRegister2 = "";


		//only append to final if it's got a tile in it
		if (dataLists[q] * 1 != 0) {
			//go through each set of binary numbers, turn into a b64 character, then remove them. After the whole set has been done put the b64 string back into the list
			while (dataLists[q].length > 0) {
				stringRegister2 += tunnel_translationInverse[parseInt(dataLists[q].slice(0, 6), 2)];
				dataLists[q] = dataLists[q].slice(6);
				//if only zeroes are left, escape early
				if (dataLists[q] * 1 == 0) {
					dataLists[q] = "";
					
				}
			}
			//step 3: add stars while we're at it
			dataLists[q] = tunnelData_parseStarsReverse(stringRegister2);

			//step 4: append data to final array
			dataString += `|terrain~${dataLists[q]}`;
			//if it's a special tile, mark that
			if (q > 0) {
				dataString += getKey(tunnel_tileAssociation, q+1);
			}
		}
	}

	//step 5: return
	return dataString;
}

function tunnelData_parseStars(toParse) {
	//loop through all characters of the data
	for (var u=0;u<toParse.length;u++) {
		//if the character is a star, look forwards for other stars
		if (toParse[u] == "*") {
			var detectorChar = u+1;
			var starNum = 1;

			//determining number of stars/number of repeats
			while (toParse[detectorChar] == "*") {
				detectorChar += 1;
				starNum += 1;
			}
			var repeatTimes = tunnel_translation[toParse[detectorChar]];

			//removing the stars and indicator number from the original data
			toParse = spliceOut(toParse, u, detectorChar+1);

			//extending the data through the duplication process
			var charsToRepeat = toParse.substr(u-starNum, starNum);
			for (var g=0; g<repeatTimes-1; g++) {
				toParse = spliceIn(toParse, u, charsToRepeat);
			}
		}
	}
	return toParse;
}

function tunnelData_parseStarsReverse(toParse) {
	var strStore = "";
	var strFinal = "";
	var repeatTimes = 0;
	var repeatLimit = 0;
	//go through all the characters
	while (toParse.length > 0) {
		//repeat for all the stars
		for (var starNum=1; starNum<=tunnel_dataStarChainMax; starNum++) {
			//get initial check value
			strStore = toParse.substring(0, starNum);

			//jump through and detect how many times that value repeats
			while (strStore == toParse.substring(repeatTimes * starNum, (repeatTimes + 1) * starNum)) {
				repeatTimes += 1;
			}

			//cap repeatTimes at 63, I don't want undefined characters in my data
			if (repeatTimes > 63) {
				repeatTimes = 63;
			}

			//if there's only 1 star, it must repeat 4+ times. 2 stars requires 3 repeats, and 3+ stars requires only 2 repeats
			switch (starNum) {
				case 1:
					repeatLimit = 3;
					break;
				default:
					repeatLimit = 2;
					break;
			}

			//if repeated enough, use the stars and leave the loop. if not, move to the next star number
			if (repeatTimes > repeatLimit) {
				//append to final string
				strFinal += strStore;
				for (var s=0; s<starNum; s++) {
					strFinal += "*";
				}
				strFinal += getKey(tunnel_translation, repeatTimes);
				//update toParse and leave star loop
				toParse = toParse.substring(starNum * repeatTimes);
				starNum = tunnel_dataStarChainMax + 1;
			} else if (starNum == tunnel_dataStarChainMax) {
				//if out of star numbers, remove and add the single character
				strFinal += toParse[0];
				toParse = toParse.substring(1);
			}

			//reset things to default
			repeatTimes = 0;
		}
	}
	return strFinal;
}

function updateCursorPos(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;
}