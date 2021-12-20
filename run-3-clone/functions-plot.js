
/* 
INDEX:
	createCutsceneTree();
	placeOneTimeCutsceneTriggers();
	placeOneTimeCutscene();
	trueReset();
	unlockCharacter(characterName);
	updatePlotProgression();
*/

//takes it string data for a cutscene tree and creates objects from it
function createCutsceneTree(stringDat) {
	var arrDat = stringDat.split("\n");
	arrDat = arrDat.map(a => [(a.match(/\t/g) || []).length, a.replaceAll("\t", "").split("~")]);

	//go to the first line
	//create the node for that
	return createCutsceneTree_recursive(arrDat);
}

function createCutsceneTree_recursive(strArr) {
	//make sure there's no reference weirdness going on
	strArr = JSON.parse(JSON.stringify(strArr));

	//first make every tab number relative to 0
	var amount = strArr[0][0];
	strArr.forEach(g => {
		g[0] -= amount;
	});


	//convert that first line into a node
	var mainNode = new CNode(+strArr[0][1][1], +strArr[0][1][2], strArr[0][1][0], []);

	//if there are no children just return
	if (strArr.length < 2) {
		return mainNode;
	}

	//figure out all children
	var stopIndex = 1;
	//get all individual child data
	for (var i=2; i<strArr.length; i++) {
		if (strArr[i][0] <= 1) {
			mainNode.children.push(createCutsceneTree_recursive(strArr.slice(stopIndex, i)));
			stopIndex = i;
		}
	}

	//last child
	mainNode.children.push(createCutsceneTree_recursive(strArr.slice(stopIndex)));
	return mainNode;
}




function placeOneTimeCutsceneTriggers() {
	//triggers
	placeOneTimeCutscene("Level 1", 0.5, true, "planetMissing");
	placeOneTimeCutscene("A-4", 86, false, "joinUs", true);
	placeOneTimeCutscene("F-4", 1.1, false, "river", true);
	placeOneTimeCutscene("U-1", 0.2, false, "planetStolen", true);
	placeOneTimeCutscene("New Tunnel, Part 1", 0.1, false, "selfAssembly", true);

	//the way back
	placeOneTimeCutscene("The Way Back, Part 1", 0.5, false, "angelVsBunny", true);
	placeOneTimeCutscene("The Way Back, Part 8", 0.5, false, "boatRide");

	placeOneTimeCutscene("Plan A, Part 8", 54.5, false, "wait");

	placeOneTimeCutscene("Plan C, Part 8", 97, false, "superpowers", true);
	placeOneTimeCutscene("Plan C, Part 9", 110, false, "twoMonthWait1", true);
	placeOneTimeCutscene("Plan C, Part 12", 86, false, "twoMonthWait2", true);
	placeOneTimeCutscene("Plan C, Part 14", 69.4, false, "twoMonthWait3", true);

	//the way onwards
	placeOneTimeCutscene("C-1", 60.5, false, "morningHypothesis1", true);
	placeOneTimeCutscene("C-2", 84, false, "morningHypothesis2", true);
	placeOneTimeCutscene("C-3", 99, false, "morningHypothesis3", true);
	placeOneTimeCutscene("C-4", 97.4, false, "morningHypothesis4", true);
	placeOneTimeCutscene("C-5", 115.5, false, "morningHypothesis5", true);



	//achievement triggers
	getObjectFromID("B-4").freeObjs.push(new CutsceneTrigger_NoJumpWithChar(getObjectFromID("B-4"), ["Runner", "Skater", "Child"], "cheating"));
	getObjectFromID("N-2").freeObjs.push(new CutsceneTrigger_NoJumpWithChar(getObjectFromID("N-2"), ["Skater"], "skates"));

	//character encounters
	getObjectFromID("Level 10").freeObjs.push(new StaticCharacterPermanent(getObjectFromID("Level 10"), 12, 58, "Skater", "comingThrough"));
	getObjectFromID("Level 41").freeObjs.push(new StaticCharacterPermanent(getObjectFromID("Level 41"), 3, 1, "Lizard", "heavySleeper"));

	//not triggers, but special objects so they get to be here as well
	getObjectFromID("Launch Site A").freeObjs.push(new Tunnel_Blocker(getObjectFromID("Launch Site A"), 6, `3Woooo`));
	getObjectFromID("Launch Site C").freeObjs.push(new Tunnel_Blocker(getObjectFromID("Launch Site C"), 15, `3ooooo`));

	//hard-coded values ew
	var level = getObjectFromID("Level X");
	level.freeObjs.push(new Boat(24828, 120, -159034, level.theta - (Math.PI / 2), 3.8));

	level = getObjectFromID("Launch Site A");
	level.freeObjs.push(new Boat(77892, 44, -270906, (Math.PI * 2.5) - level.theta, 0.6));
}

function placeOneTimeCutscene(levelID, levelTilePos, reverseDirection, cutsceneID, isImmersive) {
	var tunnel = getObjectFromID(levelID);
	tunnel.freeObjs.push(new OneTimeCutsceneTrigger(tunnel, levelTilePos, reverseDirection, cutsceneID, isImmersive));
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
	if (!data_persistent.unlocked.includes(characterName)) {
		data_persistent.unlocked.push(characterName);
	}
}

function updatePlotProgression() {
	//first make sure save file is up to date

	//out of date case
	if (data_persistent.version == undefined || data_persistent.version < world_version) {
		if (confirm("Your save file is out of date. Would you like to reset or update it? \n(Press OK to reset, Cancel to update)")) {
			//resetting stuff
			trueReset();
		} else {
			alert("Your save file is being updated.");
			updateSave();
		}
	} else if (data_persistent.version > world_version) {
		//past date case, how dare you mess with my save file like this. All your stars are lizards.
		for (var j=0; j<world_stars.length; j++) {
			world_stars[j] = new Star_Lizard(world_stars[j].x, world_stars[j].y, world_stars[j].z);
		}
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

	console.log("applied story progression");
}

//all the checks for people who had old saves
function updateSave() {
	data_persistent.settings.halfRender = data_persistent.settings.halfRender ?? false;
	data_persistent.settings.gimbal = data_persistent.settings.gimbal ?? false;
	data_persistent.effectiveCutscenes = data_persistent.effectiveCutscenes ?? [];
	data_persistent.unlocked = data_persistent.unlocked ?? ["Runner"];

	data_persistent.deathsE = data_persistent.deathsE ?? 0;
	data_persistent.deathsI = data_persistent.deathsI ?? 0;
	data_persistent.infVisited = data_persistent.infVisited ?? "";

	console.log(`updated save from ${data_persistent.version} to ${world_version}`);
	data_persistent.version = world_version;
}