
/* 
INDEX:
	placeOneTimeCutsceneTriggers();
	trueReset();
	unlockCharacter();
	updatePlotProgression();
*/


function placeOneTimeCutsceneTriggers() {
	//triggers

	//overworld
	getObjectFromID("Level 1").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("Level 1"), 0.5, true, "planetMissing"));
	getObjectFromID("F-4").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("F-4"), 1.1, false, "river"));
	getObjectFromID("U-1").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("U-1"), 0.2, false, "planetStolen"));
	getObjectFromID("New Tunnel, Part 1").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("New Tunnel, Part 1"), 0.1, false, "selfAssembly"));


	//the way back
	getObjectFromID("The Way Back, Part 1").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("The Way Back, Part 1"), 0.5, false, "angelVsBunny"));
	getObjectFromID("The Way Back, Part 8").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("The Way Back, Part 8"), 0.5, false, "boatRide"));
	
	getObjectFromID("Plan A, Part 8").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("Plan A, Part 8"), 54.5, false, "wait"));

	getObjectFromID("Plan C, Part 8").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("Plan C, Part 8"), 97, false, "superpowers"));
	getObjectFromID("Plan C, Part 9").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("Plan C, Part 9"), 110, false, "twoMonthWait1"));
	getObjectFromID("Plan C, Part 12").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("Plan C, Part 12"), 86, false, "twoMonthWait2"));
	getObjectFromID("Plan C, Part 14").freeObjs.push(new OneTimeCutsceneTrigger(getObjectFromID("Plan C, Part 14"), 69.4, false, "twoMonthWait3"));

	//hard-coded values ew
	var level = getObjectFromID("Level X");
	level.freeObjs.push(new Boat(24828, 120, -159034, level.theta - (Math.PI / 2), 3.8));

	level = getObjectFromID("Launch Site A");
	level.freeObjs.push(new Boat(77892, 44, -270906, (Math.PI * 2.5) - level.theta, 0.6));

	//the way onwards

	//character encounters
	getObjectFromID("Level 10").freeObjs.push(new StaticCharacterPermanent(getObjectFromID("Level 10"), 12, 58, "Skater", "comingThrough"));
	getObjectFromID("Level 41").freeObjs.push(new StaticCharacterPermanent(getObjectFromID("Level 41"), 3, 1, "Lizard", "heavySleeper"));
}

function trueReset() {
	//give user a warning
	if (confirm("This action cannot be undone. Would you like to reset completely? \n(Press OK to reset, Cancel to not)")) {
		//reset game flags
		data_persistent = undefined;

		//push to local storage
		window.localStorage["run3_data"] = undefined;

		//refresh page
		window.location.reload();
	}
}

function unlockCharacter(characterName) {
	if (!data_persistent.unlocked.includes(characterName)) {data_persistent.unlocked.push(characterName);}
}

function updatePlotProgression() {
	//first make sure save file is up to date

	//out of date case
	if (data_persistent.version == undefined || data_persistent.version < world_version) {
		if (confirm("Your save file is out of date. If you continue without resetting it, things may break. Would you like to reset? \n(Press OK to reset, Cancel to not)")) {
			//resetting stuff
			trueReset();
		}
	} else if (data_persistent.version > world_version) {
		//past date case, how dare you mess with my save file like this. All your stars are lizards.
		for (var j=0; j<world_stars.length; j++) {
			world_stars[j] = new Star_Lizard(world_stars[j].x, world_stars[j].y, world_stars[j].z);
		}
	}


	//activate all cutscene effects
	if (data_persistent.effectiveCutscenes == undefined) {
		data_persistent.effectiveCutscenes = [];
	}
	data_persistent.effectiveCutscenes.forEach(c => {
		var reference = eval(`cutsceneData_${c}`);
		try {
			eval(reference.effects);
		} catch (e) {
			console.error("couldn't do effects for cutscene " + c)
		}
		
	});

	var discoveredLevels = data_persistent.discovered.split("~");
	//change the visited tags for all levels
	discoveredLevels.forEach(a => {
		getObjectFromID(a).discovered = true;
	});

	//level 1 is always discovered
	//if no characters are unlocked, reset to the default
	if (data_persistent.unlocked == undefined) {
		data_persistent.unlocked = ["Runner"];
	}

	//if the end of the low power tunnel hasn't been discovered, move the new tunnel away
	if (!(getObjectFromID(`Low Power Tunnel, Part 25`).discovered)) {
		var a = 1;
		var targetTunnel = getObjectFromID(`New Tunnel, Part ${a}`);
		while (targetTunnel.id != undefined) {
			targetTunnel.updatePosition(targetTunnel.x, targetTunnel.y, targetTunnel.z - 30000);
			a += 1;
			targetTunnel = getObjectFromID(`New Tunnel, Part ${a}`);
		}
	}
	console.log("applied story progression");
}