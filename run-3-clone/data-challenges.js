//this used to be an array but I changed it to object notation because reading the darn thing was insufferable

/*template: 
 {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
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
		text: `For once I'm glad I'm single. I won't have a spouse trying to rip out MY antennae when I get back.|Although, hm...|If my friends miss me as much as I miss them...`
	}, {
		level: "Level 47",
		backwards: true,
		startCode: `challenge_crumble("Level 47", [[5, 13], [5, 46]]); challenge_addEncounter("Level 47", 5, 3, "Pastafarian", "friendlyGreeting");`,
	},

	{
		level: "Level 33",
		backwards: true,
		text: `That went well!|Except for the part where she wants me to change.|Oh well, I'll just have to ignore her.`
	}, {
		level: "Level 16",
		backwards: true,
		startCode: `challenge_addEncounter("Level 16", 0, 1, undefined, "indecision");`,
	},

	{
		level: "Level 26",
		backwards: false,
		startCode: `challenge_crumble("Level 26", [[14, 5], [1, 16], [14, 27], [8, 30], [12, 32], [11, 36], [13, 40], [5, 48], [2, 53]])`,
		text: `Plus, I'm too nice to leave like that.|They NEED my help. Leaving would be unheroic of me.`
	}, {
		level: "Level 27",
		backwards: false,
		startCode: `challenge_crumble("Level 27", [[11, 4], [6, 11], [11, 23], [5, 31], [10, 39], [4, 47], [10, 52], [4, 58]])`
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
		startCode: `challenge_crumble("M-2", [[4, 0]]);`,
		text: `Good riddance.|He's going to be stuck here for another couple years, but that's not my problem.`
	}, {
		level: "M-4",
		backwards: false,
		startCode: `console.log("activating"); challenge_crumble("M-4", [[5, 1], [13, 4], [8, 7]]); challenge_addEncounter("M-4", 15, 53, "Lizard", "itsJustYou");`,
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
	{
		level: "Level 35",
		backwards: true,
		text: `I'm happy to help, but stil...|Why does everyone act like I'm some kind of genius?`
	}, {
		level: "Level 34",
		backwards: true,
	}, {
		level: "Box Storage Area, Part 6",
		backwards: false,
		startCode: `challenge_addEncounter("Box Storage Area, Part 6", 1, 35, undefined, "somethingWeird");`,
		text: `All I do is follow the steps they taught us in school.`
	},

	{
		level: "Box Storage Area, Part 6",
		backwards: true,
		startCode: `if (player.backwards) {challenge_changeSpawn(1, 24);}`,
		endCode: undefined,
		text: `It moves!|I have no idea how I missed this the first time, but who cares?!|This box moves!`
	}, {
		level: "Box Storage Area, Part 5",
		backwards: true,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "Box Storage Area, Part 2",
		backwards: true,
		text: `Anyway, where was I...|The next step is a class presentation, or a research paper.|Or worse, both. Bad memories...`
	}, {
		level: "Level 35",
		backwards: false,
		startCode: `challenge_crumble("Level 35", [[23, 4], [25, 6]]);`,
		endCode: undefined,
		text:  `But the point isn't writing words or getting stage fright.|What matters is sharing what you found.|Then your friends can benefit too. Or they can point out how horribly wrong you are. Either way.`
	}, {
		level: "Level 36",
		backwards: false,
		startCode: `challenge_crumble("Level 36", [[14, 3], [7, 8], [5, 21], [1, 28], [8, 30], [4, 34]]);`,
		endCode: undefined,
	},

	{
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	},

	{
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	},

	{
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	},

	{
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	}, {
		level: "levelName",
		backwards: undefined,
		startCode: undefined,
		endCode: undefined,
		text: undefined
	},
];

challengeData_bridgeBuilding.forEach(e => {
	//student
	e.char = 8;
});




//incomplete message: "Oops! Forgot the box."
var challengeData_bridgeBuilding1 = [
	"Student",
	
	//something weird


	//tell a friend

	["Level 39", true, ``, ``, `You know, that one box could be some sort of fluke.|Or could it? Whatever, let's say it could.|One box isn't enough. I need to prove that lightning strikes twice.`],
	["Level 38", true, ``, ``, ``],
	["Box Storage Area, Part 1", false, ``, ``, `I think there might have been another one around here...`],
	//lightning strikes twice

	["Box Storage Area, Part 6", false, ``, ``, `She's right. Two isn't enough either.|If they're different, then we wouldn't know which was the "normal" one!`],
	["Box Storage Area, Part 7", false, ``, ``, ``],
	//with box
	//part 7 completes after only half the level
	["Box Storage Area, Part 7", true, ``, ``, `Hey, here we go!`],
	["Box Storage Area, Part 6", true, ``, ``, `So far, it's acting like the first. Good, I guess?|If this box was different, it'd make my job harder...|but it'd also mean I had more to learn about. I'd be happy either way.`],
	["Level 38", false, ``, ``, `Wow, I've been through here a lot lately.|I know sceince involves doing the same things over and over, but this is ridiculous.`],

	//without box now
	["B-7", true, `missing crumbling tiles`, ``, `That's it, I'm going somewhere else this time.|There have to be rings elsewhere, right?|No, no, there don't "have to" be anything.|But I can hope. Better yet, I can check.`],
	["B-6", true, ``, ``, ``],
	["U-3", false, ``, ``, `I've been assuming the rings were all in the same place, but why would they be?|At least this time I didn't take a year to notice the assumption.`],
	["U-4", false, `encounter gentleman`, ``, ``],
	//affliction

	["Level U-7", false, ``, ``, `He wants my help, but he doesn't want to test anything?|I guess he doesn't want my help.`],
	["U-8", false, ``, ``, ``],
	//box time
	["U-8", true, ``, ``, ``],
	//protip here?
	["U-7", true, ``, ``, `Stay very calm...|How would that even affect anything? Wait, no.|The first question isn't how this works, the first question is whether it works at all.|I can make all the hypotheses I like later, once I know I'm dealing with a real phenomenon.`],
	["U-5", true, ``, ``, `Hypothesis time. Am I giving off a signal the Tunnels can sense?|If so, they could be monitoring the Planet. Kind of creepy.|But would alien technology even be able to understand radio?|I'll make sure to test this one. How else could it work?`],
	["B-1", false, ``, ``, `Here's a quick test... What if I *don't* focus on staying calm?|Then the box should go back to its usual behavior.|Thus proving that I'm the one controlling it.`],
	["B-2", false, ``, ``, ``],
	["B-12", false, ``, ``, `It worked! That rules out coincidence. Probably.|What else? I want at least three possible explanations here.|Maybe I fall differently when I focus, and the Tunnels can tell from the air movement. Seems unlikely, but not impossible.|Or maybe it's something I do while I teleport. I still don't know how that works...|And with that, I have four possibilities to test. Not a bad start.`],
	["B-13", false, ``, ``, ``],
	//crossing the gap
];

var challengeData_bridgeBuilding2 = [
	"Skater",
	[]
];

var challengeData_bridgeBuilding2_2 = [
	"Student",
	[]
];

var challengeData_bridgeBuilding3 = [
	"Runner",
	[]
];