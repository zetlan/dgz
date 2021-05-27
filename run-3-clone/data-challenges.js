//this used to be an array but I changed it to object notation because reading the darn thing was insufferable

/*template: 
 {
		level: "levelName",
		backwards: undefined,
		?startCode: undefined,
		?endCode: undefined,
		?text: undefined
	},
*/
var challengeData_angelMissions = [{
		level: "Box Storage Area, Part 4",
		backwards: true,
		text: `Step 1: get answers from the Runner.|Done!`
	}, {
		level: "Level 35",
		backwards: true,
		text: `Step 2: gather the others.|Step 3: FINALLY go home.`
	}, {
		level: "B-7",
		backwards: false,
		startCode: `challenge_crumble("B-7", [[0, 6], [0, 30], [4, 11], [4, 56], [8, 56], [12, 30], [12, 56]]);`,
		text: `Missing tiles. Someone was here recently!`
	}, {
		level: "A-5",
		backwards: false,
		startCode: `challenge_crumble("A-5", [[2, 2], [16, 45]]);`,
		text: `I'm getting close. I hope.|I'd BETTER be getting close.`
	}, {
		level: "A-6",
		startCode: `challenge_crumble("A-6", [[8, 4], [8, 21]]);`,
		backwards: false,
	}, {
		level: "A-7",
		backwards: false,
		startCode: `challenge_addEncounter("A-7", 13, 18, "Skater", "theNextBigThing");`
	}, 
	
	{
		level: "G-8",
		backwards: false,
		text: `Does he WANT to stay out here?|But there's nothing here! I don't get it...`
	}, {
		level: "G-10",
		backwards: false,
		text: `The boredom must have driven him crazy.|Wait no, then he'd be desperate to leave.|Maybe he started out crazy.`
	}, {
		level: "G-5",
		backwards: true,
		startCode: `challenge_addEncounter("G-5", 18, 4, "Child", "youThink"); challenge_addEncounter("G-5", 19, 4, "Duplicator", "youThink");`,
		text: `No one there. Where is everyone?|I usually can't go five minutes without crashing into one of those pests.`
	},

	{
		level: "Level 48",
		backwards: true,
		startCode: `challenge_crumble("Level 48", [[13, 0], [8, 5], [5, 8], [4, 15], [2, 19], [14, 22], [1, 25], [14, 31], [11, 36], [9, 44], [9, 56], [12, 61], [13, 68], [9, 70]]);`,
		endCode: `challenge_isOnlyOtherTunnel("Level 47");`,
		text: `For once I'm glad I'm single. I won't have a spouse trying to rip out MY antennae when I get back.|Although, hm...|If my friends miss me as much as I miss them...`
	}, {
		level: "Level 47",
		backwards: true,
		startCode: `challenge_crumble("Level 47", [[5, 13], [5, 46]]); challenge_addEncounter("Level 47", 5, 3, "Pastafarian", "friendlyGreeting");`,
	},

	{
		level: "Level 33",
		backwards: true,
		endCode: `challenge_isOnlyOtherTunnel("Level 32");`,
		text: `That went well!|Except for the part where she wants me to change.|Oh well, I'll just have to ignore her.`
	}, {
		level: "Level 16",
		backwards: true,
		endCode: `challenge_isCutscene(3, true, "indecision", true);`
	},

	{
		level: "Level 26",
		backwards: false,
		startCode: `challenge_crumble("Level 26", [[14, 5], [1, 16], [14, 27], [8, 30], [12, 32], [11, 36], [13, 40], [5, 48], [2, 53]])`,
		text: `Plus, I'm too nice to leave like that.|They NEED my help. Leaving would be unheroic of me.`
	}, {
		level: "Level 27",
		backwards: false,
		startCode: `challenge_crumble("Level 27", [[11, 4], [6, 11], [11, 23], [5, 31], [10, 39], [4, 47], [10, 52], [4, 58]]);`
	},

	{
		level: "Low Power Tunnel, Part 11",
		backwards: false,
		text: `I remember this tunnel...|I hate it even more than the others.`
	}, {
		level: "Low Power Tunnel, Part 22",
		backwards: false,
		text: `it could be just my imagination, but it feels like I can't fly as well here.`
	}, {
		level: "Low Power Tunnel, Part 23",
		backwards: false,
		startCode: `challenge_crumble("Low Power Tunnel, Part 23", [[13, 8], [2, 11], [16, 19], [17, 46], [4, 46], [2, 55]]); challenge_addEncounter("Low Power Tunnel, Part 23", 11, 63, "Gentleman", "standardsToUphold");`,
	},

	{
		level: "M-2",
		backwards: false,
		startCode: `challenge_crumble("M-2", [[4, 0]]); challenge_crumble("M-3", [[4, 1], [14, 2], [10, 13], [7, 21], [4, 22], [14, 27]]);`,
		text: `Good riddance.|He's going to be stuck here for another couple years, but that's not my problem.`
	}, {
		level: "M-4",
		backwards: false,
		startCode: `challenge_crumble("M-4", [[5, 1], [13, 4], [8, 7]]); challenge_addEncounter("M-4", 15, 53, "Lizard", "itsJustYou", true);`,
		text: `Hey, knocked-out tiles. I'm in luck!`
	},
	
	{
		level: "U-7",
		backwards: false,
		text: `Just a few more places left to check.`
	}, {
		level: "D-8",
		backwards: false,
	}, {
		level: "D-1",
		backwards: true,
		text: `I guess that's it then.`
	}, {
		level: "U-10",
		backwards: false,
		text: `Gotta check here just to be sure...`
	}, {
		level: "U-10",
		backwards: true,
		text: `As I thought. We must have passed each other at some point.|Her loss.|Maybe the Pastafarian will find her, but I'm not going to spend another two weeks searching.`
	}, {
		level: "U-9",
		backwards: true,
		endCode: `challenge_isOnlyOtherTunnel("U-8");`,
	}, {
		level: "U-5",
		backwards: true,
		startCode: `challenge_crumble("U-5", [[16, 0], [7, 4], [22, 9], [11, 12], [5, 20], [11, 29], [11, 40], [0, 53], [11, 70], [15, 70], [7, 75], [0, 80], [0, 95], [11, 94]]); challenge_addEncounter("U-5", 0, 5, "Student", "discoveries");`,
		text: `I've done my duty. Time to head home!`
	},
];
challengeData_angelMissions.forEach(e => {
	//angel
	e.char = 9;
});







var challengeData_bridgeBuilding = [
	//box 1
	{
		level: "Level 35",
		backwards: true,
		text: `I'm happy to help, but still...|Why does everyone act like I'm some kind of genius?`
	}, {
		level: "Level 34",
		backwards: true,
	}, {
		level: "Box Storage Area, Part 6",
		backwards: false,
		endCode: `challenge_isCutscene(37, false, "somethingWeird", true);`,
		text: `All I do is follow the steps they taught us in school.`
	},
	
	{
		level: "Box Storage Area, Part 6",
		backwards: true,
		startCode: `|challenge_changeSpawn(1, 24); challenge_addBox("Box Storage Area, Part 6", 1, 19, 120, 70, 0);`,
		endCode: `challenge_isOops();`,
		text: `It moves!|I have no idea how I missed this the first time, but who cares?!|This box moves!`
	}, {
		level: "Box Storage Area, Part 5",
		backwards: true,
		startCode: `|challenge_resetBox("Box Storage Area, Part 5", 7, 56, 120);`,
		endCode: `challenge_isOopsTile(20, true);`,
		text: undefined
	}, {
		level: "Box Storage Area, Part 2",
		backwards: true,
		startCode: `challenge_addBox("Box Storage Area, Part 2", 13, 84, 120, 70, Math.PI / 2);`,
		endCode: `challenge_isOops();`,
		text: `Anyway, where was I...|The next step is a class presentation, or a research paper.|Or worse, both. Bad memories...`
	}, {
		level: "Level 35",
		backwards: false,
		startCode: `challenge_crumble("Level 35", [[23, 4], [25, 6]]); challenge_addBox("Level 35", 10, 5, 200, 70, 0);`,
		endCode: `challenge_isOops();`,
		text:  `But the point isn't writing words or getting stage fright.|What matters is sharing what you found.|Then your friends can benefit too. Or they can point out how horribly wrong you are. Either way.`
	}, {
		level: "Level 36",
		backwards: false,
		startCode: `challenge_crumble("Level 36", [[14, 3], [7, 8], [5, 21], [1, 28], [8, 30], [4, 34]]);|challenge_resetBox("Level 36", 7, 10, 180);`,
		endCode: `challenge_isOops();`,
	}, {
		level: "Level 53",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "tellAFriend", true);`
	},
	//tell a friend


	//box 2
	{
		level: "Level 39",
		backwards: true,
		startCode: `challenge_crumbleAll("Level 39");`,
		endCode: `challenge_isOnlyOtherTunnel("Level 38");`,
		text: `You know, that one box could be some sort of fluke.|Or could it? Whatever, let's say it could.|One box isn't enough. I need to prove that lightning strikes twice.`
	}, {
		level: "Level 38",
		backwards: true,
		startCode: `challenge_crumbleAll("Level 38");`
	}, {
		level: "Box Storage Area, Part 1",
		backwards: false,
		//add default box
		startCode: `challenge_setTempTile("Box Storage Area, Part 1", 16, 22);`,
		endCode: `challenge_isCutscene(22.5, false, "lightningStrikesTwice", true);`,
		text: `I think there might have been another one around here...`
	},

	{
		level: "Box Storage Area, Part 6",
		backwards: false,
		endCode: undefined,
		text: `She's right. Two isn't enough either.|If they're different, then we wouldn't know which was the "normal" one!`
	}, {
		level: "Box Storage Area, Part 7",
		backwards: false,
		//add default box
		startCode: `challenge_setTempTile("Box Storage Area, Part 7", 10, 77);`,
		endCode: `challenge_isCutscene(78, false, "somePointBX7", true);`
	}, 

	{
		level: "Box Storage Area, Part 7",
		backwards: true,
		startCode: `|challenge_addBox("Box Storage Area, Part 7", 14, 70, 250, 125, Math.PI * 0.3);`,
		endCode: `challenge_isOopsTile(49, true);`,
		text: `Hey, here we go!`
	}, {
		level: "Box Storage Area, Part 6",
		backwards: true,
		startCode: `|challenge_addBox("Box Storage Area, Part 6", 7, 78, 150, 125, Math.PI * 1.2);`,
		endCode: `challenge_isOops();`,
		text: `So far, it's acting like the first. Good, I guess?|If this box was different, it'd make my job harder...|but it'd also mean I had more to learn about. I'd be happy either way.`
	}, {
		level: "Level 38",
		backwards: false,
		startCode: `challenge_crumbleAll("Level 38");|challenge_addBox("Level 38", 5, 4, 180, 125, Math.PI * 0.6);`,
		endCode: `challenge_isOops();`,
		text: `Wow, I've been through here a lot lately.|I know science involves doing the same things over and over, but this is ridiculous.`
	},

	//box 3
	{
		level: "B-7",
		backwards: true,
		startCode: `challenge_crumbleAll("B-7");`,
		text: `That's it, I'm going somewhere else this time.|There have to be rings elsewhere, right?|No, no, there don't "have to" be anything.|But I can hope. Better yet, I can check.`
	}, {
		level: "B-6",
		backwards: true,
		startCode: `challenge_crumbleAll("B-6");`,
	}, {
		level: "U-3",
		backwards: false,
		text:  `I've been assuming the rings were all in the same place, but why would they be?|At least this time I didn't take a year to notice the assumption.`
	}, {
		level: "U-4",
		backwards: false,
		//added the cutscene so that encountering will finish the level
		startCode: `challenge_addEncounter("U-4", 7, 38, "Gentleman", "affliction", true);`,
		endCode: `challenge_isCutscene(34.5, false, "affliction", true);`
	}, {
		level: "U-7",
		backwards: false,
		text: `He wants my help, but he doesn't want to test anything?|I guess he doesn't want my help.`
	}, {
		level: "U-8",
		backwards: false,
		//default box, you know the standard
		startCode: `challenge_setTempTile("U-8", 5, 115);`,
		endCode: `challenge_isCutscene(116, false, "somePointU8", true);`,
	}, 

	//box time
	{
		level: "U-8",
		backwards: true,
		startCode: `|challenge_addBox("U-8", 5, 111, 180, 80, Math.PI * 1.05);`,
		endCode: `challenge_isOops();`,
	}, {
		level: "Level 53",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "protip", true);`
	},
	
	//at this point the boxes don't reset
	{
		level: "U-7",
		backwards: true,
		startCode: `|challenge_addBox("U-7", 2, 73, 250, 80, Math.PI * 1.05, true);`,
		endCode: `challenge_isOops();`,
		text: `Stay very calm...|How would that even affect anything? Wait, no.|The first question isn't how this works, the first question is whether it works at all.|I can make all the hypotheses I like later, once I know I'm dealing with a real phenomenon.`
	}, {
		level: "U-5",
		backwards: true,
		startCode: `challenge_crumbleAll("U-5");|challenge_addBox("U-5", 6, 98, 230, 80, Math.PI * 0.8, true);`,
		endCode: `challenge_isOops();`,
		text: `Hypothesis time. Am I giving off a signal the Tunnels can sense?|If so, they could be monitoring the Planet. Kind of creepy.|But would alien technology even be able to understand radio?|I'll make sure to test this one. How else could it work?`
	}, {
		level: "B-1",
		backwards: false,
		startCode: `|challenge_addBox("B-1", 15, 5, 170, 80, Math.PI * 0.75);`,
		endCode: `challenge_isOops();`,
		text: `Here's a quick test... What if I *don't* focus on staying calm?|Then the box should go back to its usual behavior.|Thus proving that I'm the one controlling it.`
	}, {
		level: "B-2",
		backwards: false,
		startCode: `|challenge_resetBox("B-2", 3, 5, 70);`,
		endCode: `challenge_isOops();`,
	}, {
		level: "B-12",
		backwards: false,
		startCode: `|challenge_addBox("B-12", 4, 4, 170, 80, 0.7, true);`,
		endCode: `challenge_isOops();`,
		text: `It worked! That rules out coincidence. Probably.|What else? I want at least three possible explanations here.|Maybe I fall differently when I focus, and the Tunnels can tell from the air movement. Seems unlikely, but not impossible.|Or maybe it's something I do while I teleport. I still don't know how that works...|And with that, I have four possibilities to test. Not a bad start.`
	}, {
		level: "B-13",
		backwards: false,
		startCode: `|challenge_resetBox("B-13", 3, 2, 150);`,
		endCode: `challenge_rareReset(74, false);`,
	}, {
		level: "Level 1",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "crossingTheGap");`
	}, {
		//aaaaaaaaaaa
		level: `Level 1`,
		backwards: true,
	}
	//with that, the main bridge building is done!
];

challengeData_bridgeBuilding.forEach(e => {
	//student
	e.char = 8;
});



var challengeData_bridgeBuildingRunner = [
	//box from box storage area, part 1
	{
		level: "Box Storage Area, Part 1",
		backwards: true,
		startCode: `challenge_addBox("Box Storage Area, Part 1", 16, 20, 200, 90, 0, true); challenge_changeSpawn(16, 29);`,
		endCode: `challenge_isOops();`,
		text: `I don't remember the last time I did this...`
	}, {
		level: "B-2",
		backwards: false,
		startCode: `challenge_addBox("B-2", 3, 6, 70, 90, 0, true);`,
		endCode: `challenge_isOops();`,
		text: `Normally a map maker like me makes no decisions at all.|When I map a city, I don't decide what to draw!|I look at buildings that other people built, and I copy them down.`
	}, {
		level: "B-3",
		backwards: false,
		startCode: `challenge_resetBox("B-3", 4, 4, 100);`,
		endCode: `challenge_rareReset();`,
	}, {
		level: "B-7",
		backwards: false,
		startCode: `challenge_addBox("B-7", 2, 7, 200, 90, 0);`,
		endCode: `challenge_rareReset();`,
		text: `But not this time!|This time, I didn't like my map, so I decided to change the world.`
	}, {
		level: "B-8",
		backwards: false,
		endCode: `challenge_isOops();`,
	}, {
		level: "B-9",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "somePointB9");`
	},
	
	

	//box from T-4
	{
		level: "T-3",
		backwards: false,
		//make sure tiles are defaults, not using setTempTile because it's too specific
		startCode: `if (getObjectFromID("T-3").data[2][48] == 9) {
			changeTile("T-3", [2, 48], 0); 
			changeTile("T-3", [23, 77], 0); 
			changeTile("T-3", [15, 88], 0);

			loading_state.codeOnExit += 'changeTile("T-3", [2, 48], 9); changeTile("T-3", [23, 77], 9); changeTile("T-3", [15, 88], 9);';
		}`,
		text: `Imagine if we DO find a teapot floating around!|Wait a minute... we actually might!|She might have brought a teapot for that exact reason.|She tossses it out of a tunnel, and points at where she threw it...|...I tell her the teapot doesn't exist, and she keeps a straight face.|She tells me the FSM put it there. Doesn't she always talk about how she acts as "one of His noodly appendages?"|Honestly, I could appreciate a prank like that. Now I kind of hope she DID prank me.`
	}, {
		level: "T-4",
		backwards: false,
		startCode: `if (getObjectFromID("T-4").data[2][116] != 109) {
			changeTile("T-4", [2, 116], 109); 
			changeTile("T-4", [12, 50], 0); 
			changeTile("T-4", [17, 7], 10);

			loading_state.codeOnExit += 'changeTile("T-4", [2, 116], 0); changeTile("T-4", [12, 50], 9); changeTile("T-4", [17, 7], 0);';
		}`,
		endCode: `challenge_isCutscene(123, false, "somePointT4", true);`,
	}, {
		level: "T-4",
		backwards: true,
		startCode: `|challenge_addBox("T-4", 2, 115, 100, 90, 0, true);`,
		endCode: `challenge_isCutscene(81, true, "leaveItHere", true);`,
		text: `Ah, here we go.`
	}, {
		//haha good luck with this one
		level: "T-3",
		backwards: true,
		startCode: `|challenge_addBox("T-3", 23, 94, 80, 90, 0.4, true);`,
		endCode: `challenge_isOops();`,
		text: `That turned out well!|Now we have a stepping stone for that jump, and I still get to take a box with me.|...|Ok, this area needs some stepping stones too.|I'll have to remember to do that at some point.`
	}, 
	//oh I get it now, it's called some point because the runner does it at "some point" a 
	{
		level: "Level 52",
		backwards: true,
		startCode: `challenge_addBox("Level 52", 0, 41, 100, 90, 0, true);`,
		endCode: `challenge_isOops();`,
		text: `I respect his contributions to society, but...|In a way, that only makes it worse.|I'd normally ignore anyone who acts liek a grade-school bully.|But he's accomplished more with his life than I have!`
	}, {
		level: "Level 43",
		backwards: true,
		startCode: `challenge_addBox("Level 43", 13, 97, 140, 90, 0, true);`,
		endCode: `challenge_isOops();`,
		text: `I want to prove I can do better than him.|And more than that, I want to see him fail.`
	}, {
		level: "Level 42",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "somePointT3", false);`,
		text: `Does that make me a bad person?`
	}
];
challengeData_bridgeBuildingRunner.forEach(e => {
	e.char = 0;
});

var challengeData_bridgeBuildingSkater = [
	{
		char: 1,
		level: "M-5",
		backwards: true,
		startCode: `challenge_addBox("M-5", 7, 96, 100, 125, 0.05);`,
		endCode: `challenge_isOops();`,
		text: `Ok, I found one. Now what?`
	}, {
		char: 1,
		level: "M-3",
		backwards: true,
		startCode: `challenge_addBox("M-3", 12, 57, 100, 125, 0.7);`,
		endCode: `challenge_isOops();`,
		text: `"Try it," she says. "It'll be fun!"|"I'm totally not asking because I need a henchman!"`
	}, {
		char: 1,
		level: "M-3",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "dontQuestionIt", true);`
	},
	//don't question it
	
	{
		char: 8,
		level: "M-2",
		backwards: true,
		startCode: `challenge_addBox("M-2", 9, 54, 80, 125, 0.8);`,
		endCode: `challenge_rareReset();`,
		text: `I still don't know how he stays upright in those skates.|I always thought it was good balance, but he seems more stable than that.|Maybe the skates are gel? Sounds expensive...|These rings keep the boxes upright. Is he carrying one of those?`
	}, {
		char: 8,
		level: "M-1",
		backwards: true,
		startCode: `challenge_resetBox("M-1", 16, 65, 100);`,
		endCode: `challenge_rareReset();`,
	}, {
		level: "Level 33",
		backwards: false,
		endCode: `challenge_isCutscene(0, false, "somePointM1", false);`,
		text: `Of course, I could always ask him, but that would ruin the fun.`
	}
];