/*
because I didn't want to store all the data in the main.js file. It just got too cluttered.
There is still some data creep in main.js, but this significantly reduces it.
*/


var data_alphaNumerics = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//[title text, superscript text, line to jump to when clicked, cutscene complete requirement, character is going home?]
var data_angelChecklist = [
	'GOING HOME CHECKLIST',
	['The Know-It-All', '1st', 'myTurn', false, undefined, []],
	['The Show-Off', '2nd', 'theNextBigThing', false, 0, []],
	['The Crackpot', '3rd', 'youThink', true, 6],
	['The Nerd', '6th', 'discoveries', false, 18, []],
	['The Sneak', '3rd', 'youThink', true, 6],
	['The Meddler', '4th', 'friendlyGreeting', true, 9],
	['The Snob', '5th', 'standardsToUphold', false, 11, []]
];
var data_audio = {
	//music files
	"CrumblingWalls": new Audio('audio/CrumblingWalls.ogg'),
	"LeaveTheSolarSystem": new Audio('audio/LeaveTheSolarSystem.ogg'),
	"MapOfTheStars": new Audio('audio/MapOfTheStars.ogg'),
	"TheVoid": new Audio('audio/TheVoid.ogg'),
	"TravelTheGalaxy": new Audio('audio/TravelTheGalaxy.ogg'),
	"UnsafeSpeeds": new Audio('audio/UnsafeSpeeds.ogg'),
	"WormholeToSomewhere": new Audio('audio/WormholeToSomewhere.ogg'),

	//sfx files
	"Tone": new Audio('audio/Tone.ogg')
}
//[tunnel position of the box, data object, line, progress requirement]
var data_bridgeBuilding = [
	//required
	["Box Storage Area, Part 6", challengeData_bridgeBuilding, 0, 0],
	["Box Storage Area, Part 7", challengeData_bridgeBuilding, 9, 1],
	["U-8", 					challengeData_bridgeBuilding, 17, 3],

	//optional
	["Box Storage Area, Part 1", challengeData_bridgeBuildingRunner, 0, 2],
	["T-4", 					challengeData_bridgeBuildingRunner, 6, 3],
	["M-4", 					challengeData_bridgeBuildingSkater, 0, 3]
]
var data_characters = {
	indexes: [`Runner`, `Skater`, `Lizard`, `Bunny`, `Gentleman`, `Duplicator`, `Child`, `Pastafarian`, `Student`, `Angel`],
	map: {"Runner": 0, "Skater": 1, "Lizard": 2, "Bunny": 3, "Gentleman": 4, "Duplicator": 5, "Child": 6, "Pastafarian": 7, "Student": 8, "Angel": 9},
	"Angel": {
		color: "#DDF",
		text: `He solves practical problems and creates personal ones.`,
		trivia: [
			`The Angel's philosophy: People are stupid, but that's no reason not to help them.`,
			`Both the Runner and the Angel have leadership skills, but you wouldn't know it from listening to the Angel.`,
			`Gravity is different outside the tunnel, so dashing gives the Angel more lift.`,
			`The Angel can jump farther than almost anyone else, but it requires planning.`,
			`After dashing, the Angel can use his ability again to slow down.`,
			`He's probably lost the position by now, but the Angel used to have an important job at the Factory.`,
			`The Angel tells people that his wings are real. If they happen to miss the sarcasm, that's their problem.`,
			`Dashing into a ramp gives a huge boost and restores the dash at the same time.`,
			`The Angel could "cut" a tunnel if he wanted, but why would he? It would be a waste of time and a huge inconvenience.`,
			`Whoever made the Tunnels was an idiot. Space is naturally frictionless, but they added air--and therefore air friction--intentionally.`
		]
	},
	"Bunny": {
		color: "#764",
		text: `It doesn't care if you call it the "Rabbit" or the "Bunny". All it cares about is bouncing.`,
		trivia: [
			`The Bunny's philosophy: standing is bad, bouncing is good.`,
			`The Bunny and the Lizard can jump so high as a result of their strength and weight.`,
			`Don't call it "the Rabbit" or the Child will hate you for it forever.`,
			`Use high jumps if you want to slow down, but be sure not to slow down too much.`,
			`Each bounce speeds you up a little. Use small bounces to gain lots of speed!`,
			`Aim for the corners of the tunnel to bounce twice in a row.`
		]
	},
	"Child": {
		color: "#8F8",
		text: `Sometimes clever, sometimes immature. For example; he carries a balloon to help him jump further, but it's filled with water so he can splash people.`,
		trivia: [
			`The Child's Philosophy: books are boring and stupid unless they have pictures, then they're fun!`,
			`The Child is practicing his jumps, so that he can be like his hero, the Bunny!`,
			`The Child asked the Student why the gray squares sometimes fall, but she went on and talked about Re Action Force and never answered his question.`,
			`The Child loves jumping off of ramps and boxes and floating down.`,
			`The candy tasted bad but it burned ok. The Child likes watching things burn.`,
			`The Child says thank you to whoever left water bottles in all the boxes. He needed water to fill his balloons with.`,
			`Sometimes he leaves his balloon behind and hides. The adults never notice because he's so clever.`
		]
	},
	"Duplicator": {
		color: "#BEE",
		text: `Suspicious of others, but trusts alien technology that's been lying around for ages. Makes sense.`,
		trivia: [
			`The Duplicator's philosophy: if someone gives you parenting advice, say thanks and ignore them.`,
			`All solid objects - including duplicates - can change the tunnel's gravity.`,
			`Duplicates can jump off of one another in midair.`,
			`For some reason, it's hard to make new duplicates when the power is out. At least the existing ones stay around.`,
			`The Duplicator trusts himself, his son, and the animals. Everyone else keeps telling him he's wrong.`,
			`Duplicates jump higher than you do.`,
			`The Duplicator can instantly swap places with any duplicate. He doesn't know how, and unlike the Student, he doesn't care.`,
			`His duplicates are like solid mirror images... that aren't mirrored. (The Duplicator isn't much good at similes.)`
		]
	},
	"Gentleman": {
		color: "#333",
		text: `Employs magnets for rapid procurement of power cells.`,
		trivia: [
			`The Gentleman’s philosophy: the correlation between vocabulary and social standing is not coincidental.`,
			`The Gentleman retains partial maneuverability with his electromagnet engaged. By maneuvering left and right, he can influence his eventual motion upon reaching the power cell.`,
			`The Gentleman will not abandon a power cell he has already claimed, but he exercises discretion in claiming the cells in the first place.`,
			`The lower classes have their uses.`,
			`The Gentleman sees fit to contribute a generous 10 percent of his power cells to the group. He reserves the remainder for his own use.`,
			`Wait until the Gentleman falls below the level of the proximal power cell before energizing his electromagnet to ensure he is propelled upwards.`,
			`In what he considers to be a mildly amusing symmetry, the Gentleman's electromagnet is activated by electromagnetic waves.`
		]
	},
	"Lizard": {
		color: "#5A5",
		text: `Lizards are known for being green and jumping really high.`,
		trivia: [
			`The Lizard’s philosophy: find somewhere bright and sit there for hours.`,
			`The Lizard does not, and perhaps, can not, understand the concept of jumping low.`,
			`Like many animals, lizards have personalities. This one just happens to be boring.`,
			`No one’s claiming the Lizard as their pet. It seems to have wandered out here on its own.`,
			`The Bunny and the Lizard can jump so high as a result of their strength and weight.`
		]
	},
	"Pastafarian": {
		color: "#DBE",
		text: `Her faith in the Flying Spaghetti Monster allows her to run across empty space. Her faith also allows her to ignore the Student's alternate explanation.`,
		trivia: [
			`The Pastafarian's philosophy: The Flying Spaghetti Monster created a flawed world. It's up to us to make it better.`,
			`Back home, the Pastafarian led a small congregation. When she saw the first tunnel, she took it as a sign, and immediately left to explore space.`,
			`The Flying Spaghetti Monster makes this bridge. It is NOT merely a 'feature of the tunnels'.`,
			`The branching and twisting tunnels vaguely resemble the Flying Spaghetti Monster. Coincidence?`,
			`Applying excessive pressure to the Flying Spaghetti Monster's bridge offends him. To show your devotion, refrain from jumping from it or onto it.`
		]
	},
	"Runner": {
		color: "#777",
		text: `Wants to see everything at least once, and she does mean everything.`,
		trivia: [
			`The Runner’s philosophy: you can’t plan for everything. Instead, plan for the fact that you can’t plan for everything.`,
			`Who needs flashy special abilities when you have precision and agility?`,
			`Both the Runner and the Angel have leadership skills, but you wouldn't know it from listening to the Angel.`,
			`True to her name, the Runner performs best on the ground, where she can move and change directions faster.`,
			`As the oldest one here, the Runner naturally has the best strength and agility.`,
			`The Runner may not like people doodling on her map, but she doesn't want to offend them by erasing their work.`,
			`Her map only stores 1GB, but the Runner has never even come close to running out. She doesn't see what the fuss is over 8GB paper.`,
			`The Runner supervised the construction of the City, and several smaller cities.`
		]
	},
	"Skater": {
		color: "#DAA",
		text: `Enjoys challenging himself almost as much as he enjoys going fast.`,
		trivia: [
			`The Skater’s philosophy: challenging yourself helps you improve. Once you improve, you can challenge yourself even more!`,
			`Since he wanders so much, there was a brief time when the Skater had met everyone on the Planet.`,
			`The Skater likes to travel, but mostly he just hates staying still.`,
			`Tunnel running could be the next big sport, and the Skater intends to get a head start.`,
			`The Skater is faster than anyone here. Well, maybe not that rabbit, but animals don’t count.`,
			`The Skater takes a few minutes each day to maintain his skates. His last pair ran out at a bad time, and he can't afford to lose this pair.`,
			`Ramps convert speed into jump height. Guess who benefits most?`
		]
	},
	"Student": {
		color: "#D64",
		text: `Once you figure out how something works, it's yours to use. This includes gravity.`,
		trivia: [
			`The Student's philosophy: Always try to think of different explanations. If you already know the answer, do it anyway for practice.`,
			`The Student loves Sci-fi movies, but she's annoyed by the usual portrayal of aliens as tall red men.`,
			`The Student may be the least athletic person here, but she makes up for it by finding easier ways to get around.`,
			`Whoever made the tunnels was clever. Since tiles attract each other, tunnels can repair themselves automatically. It also means assembling a tunnel is as easy as tossing a stack of tiles into space.`,
			`What's the point of taking finals? The Student is learning just fine on her own, thank you very much.`,
			`The Student knows she promised to explain how she controls gravity, but the device is so poorly built that she'd be embarrassed to let anyone see. Maybe once she has time to make a better one.`,
			`A good way to learn how something works is to pay attention to when it doesn't. For instance, Gravity gets weaker when the power goes out.`,
		]
	}
}
var data_levelSets = [`main`, `boxRoad`, `boxStorage`, `planA`, `planC`, `wayBack`, `wayBackNot`, `winterGames`, `lowPower`, `new`,
						`A`, `B`, `C`, `D`, `F`, `G`, `H`, `I`, `L`, `M`, `N`, `T`, `U`, `W`];
//data_levelSets = [`main`, `lowPower`, `new`, `F`, `U`, `wayBack`, `wayBack2`, `planA`, `planC`];
var data_musics = ['CrumblingWalls', 'LeaveTheSolarSystem', 'MapOfTheStars', 'TheVoid', 'TravelTheGalaxy', 'WormholeToSomewhere', 'None'];

var data_persistent = {
	discovered: "Level 1",
	effectiveCutscenes: [],
	highscores: [],
	name: "Guest User",
	powercells: 0,
	goingHomeProgress: undefined,
	bridgeBuildingProgress: undefined,
	unlocked: [`Runner`],
	version: 1.1,
	settings: {
		altCamera: false,
		/*I was debating for a while whether I wanted this to be true as a default. I decided on yes, because I want people to see the highest quality version 
		of the rendering. If their computers can't handle it, they can always turn it off. */
		altRender: true,
		antiAlias: true,
		enableOutlines: true,
		halfRender: false,
		highResolution: false,
		maskCursor: false,
		pastaView: false,
		volume: 0.5,
	}
};

var data_precision = 4;

/*
I made the executive decision to use PNGs rather than SVGs because of performance. 
However, I think the sprites should be available easily with whatever resolution people want. 
So if you go to clementine.viridian.page/run-3-clone/images/runSprites.fla you can get 
the .fla file I created that stores all the sprites.

I hope someone finds it useful (:    */

var data_sprites = {
	spriteSize: 144,

	Map: {
		sheet: getImage('images/mapSprites.png'),
		planet: [[0, 0]],
		crazy: [[1, 0]],
		battery: [[2, 0]],
		teapot: [[3, 0]],
		batteryName: [[4, 0]],
		onwards: [[5, 0], [6, 0]],
		snowflakes: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
		boxes: [[0, 4], [1, 4]],
	},

	Angel: {
		sheet: getImage('images/angelSpritesNEW.png'),
		frameTime: 2.2,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Bunny: {
		sheet: getImage('images/bunnySprites.png'),
		frameTime: 2.2,
		back: [[0, 0]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]]
	},

	Child: {
		sheet: getImage('images/childSprites.png'),
		frameTime: 2.1,
		back: [[0, 3]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpLeft: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		jumpRight: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]],
		walkForwards: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
					   [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]],
		walkLeft: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
						[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]],
		walkRight: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
						[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]],
	},

	Duplicator: {
		sheet: getImage('images/duplicatorSprites.png'),
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Gentleman: {
		sheet: getImage('images/gentlemanSprites.png'),
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
		flyForwards: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]],
		flySideways: [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]]
	},

	Lizard: {
		sheet: getImage('images/lizardSprites.png'),
		frameTime: 2.4,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Pastafarian: {
		sheet: getImage('images/pastaSprites.png'),
		frameTime: 2.3,
		back: [[0, 3]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpLeft: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		jumpRight: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]],
		walkForwards: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
					   [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]],
		walkLeft: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
						[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]],
		walkRight: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
						[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]],
	},

	Runner: {
		sheet: getImage('images/runnerSprites.png'),
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Skater: {
		sheet: getImage('images/skaterSprites.png'),
		frameTime: 2.1,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Student: {
		sheet: getImage('images/studentSprites.png'),
		frameTime: 2.2,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	}
};

var data_cutsceneTree = 
`comingThrough~-0.3351~-0.2068
	niceToMeetYou~-0.2893~-0.0848
	goldMedal~-0.3608~0.0179
	insanity~-0.2000~-0.1280
		river~-0.1945~-0.0804
			socraticMethod~-0.1889~-0.0327
	batteries~-0.3887~-0.1369
	planetMissing~-0.4422~-0.1741
		planetStolen~-0.1074~-0.1399
			naming~-0.1163~0.0595		
			orbits~-0.0739~0.1324
	heavySleeper~-0.0170~-0.1830
		studentTeacher~-0.0326~-0.0402	
		cheating~-0.0003~-0.2426	
		teapot~0.0946~-0.2262	
		boring~0.1158~-0.2842
		joinUs~0.1415~-0.2054
		dontKnockIt~0.0901~-0.0357
		changeTheSubject~0.1426~-0.1622
		inflation~0.0622~0.0759
		wormholeInSight~0.2408~0.0640
			theGap~0.2084~-0.2887
				somethingWeird~0.2007~-0.4135
					tellAFriend~0.2308~-0.4405
						lightningStrikesTwice~0.3233~-0.4647
							affliction~0.3810~-0.4231
								revision~-0.0360~-0.3061
									grandOpening~-0.0336~-0.4087
								protip~0.3991~-0.4006
									leaveItHere~0.3582~-0.3702
									dontQuestionIt~0.4868~-0.3750
									crossingTheGap~0.4462~-0.3006
										skates~0.4976~-0.3253
										fame~0.4618~-0.0759
										truancy~0.5812~-0.3080
										morningHypothesis1~0.5380~-0.2634
											morningHypothesis2~0.5536~-0.2334
												morningHypothesis3~0.5714~-0.2034
													morningHypothesis4~0.5938~-0.1734
														morningHypothesis5~0.6172~-0.1434
	candy~-0.3016~-0.3497
		selfAssembly~-0.3719~-0.4182
			conspiracy~-0.4645~-0.4539
	myTurn~-0.1878~0.1905
		theNextBigThing~-0.0876~0.4033
			youThink~-0.0664~0.4449
				friendlyGreeting~-0.0368~0.4732
					indecision~-0.0301~0.5045
						standardsToUphold~-0.0290~0.5342
							itsJustYou~-0.0245~0.5670
								discoveries~-0.0647~0.5997
									angelVsBunny~-0.2053~0.5804
										ofCourse~-0.2924~0.5565
										sneaking~-0.2132~0.6324
										obvious~-0.1797~0.5134
											boatRide~-0.3147~0.5342
												fourthCondiment~-0.3739~0.5060
													superpowers~-0.3870~0.4054
														thanksForPlaytesting~-0.1253~-0.3616
													wait~-0.5033~0.5164
														stopSolvingProblems~-0.4868~0.4519
															ABCD~-0.4086~0.3718
														cantWait~-0.6214~0.4663
															twoMonthWait1~-0.4699~0.3301
																twoMonthWait2~-0.5072~0.3077
																	twoMonthWait3~-0.5493~0.2821`