//houses html interactivity, setup, and main function

window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);


/*FOR REFACTORING LATER: THE REFACTORING CHECKLIST
	combine code blocks used multiple times into functions
	avoid else
	avoid nesting too far
	when using if else, put most likely condition first
*/
//global variables
var audio_channel1 = new AudioChannel(0.5);
var audio_channel2 = new AudioChannel(0.5);
var audio_consentRequired = true;
var audio_fadeTime = 75;
var audio_tolerance = 1 / 30;


var canvas;
var ctx;
var centerX;
var centerY;

var challenge_fadeTime = 40;
var challenge_opacity = 0.05;

var checklist_width = 0.35;
var checklist_height = 0.45;
var checklist_margin = 0.01;
var checklist_speed = 0.04;
var checklist_searchButton = new PropertyButton(checklist_width + (checklist_margin * 2.1) + (checklist_width * 0.375), 1, checklist_width * 0.75, 0.06, `Keep searching`, `loading_state = new State_Challenge(challengeData_angelMissions, data_persistent.goingHomeProgress);`);
var checklist_stayLines = 3;

var controls_cursorLock = false;
var controls_sensitivity = 100;
var controls_spacePressed = false;
var controls_shiftPressed = false;

//some of these are in 6 digits if they need to be parsed to HSV or if I want it to be very precise.
const color_bg = "#100026";
const color_box = "#E6CCE6";
const color_box_secondary = "#776A88";
const color_challengeFadeout = "#000";
const color_character = "#888";
const color_conveyor = "#69BEFF";
const color_conveyor_secondary = "#616BFF";
const color_crumbling = "#CCCCCC";
const color_crumbling_secondary = "#808080";
const color_cutsceneBox = "#FFF";
const color_cutsceneLink = "#404";

const color_editor_bg = "#335";
const color_editor_border = "#F8F";
const color_editor_cursor = "#0FF";
const color_editor_normal = "#F80";

const color_grey_dark = "#888";
const color_grey_light = "#CCC";
const color_grey_lightest = "#FEF";
const color_ice = "#D1E4E6";
const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_map_bg = "#FEA";
const color_map_bg_dark = "#DCC";
const color_map_writing = "#010";
const color_menuSelectionOutline = "#88F";
const color_ring = "#FEEC00";
const color_stars = "#44A";
const color_star_special = "#88F";
const color_star_wormhole = "#F88";
const color_tape = "#5E6570";
const color_text = "#424";
const color_text_bright = "#FAF";
const color_text_danger = "#F22";
const color_trigger = "#A60";
const color_warning = "#FFDB29";
const color_warning_secondary = "#8C8C89";
const colors_powerCells = ["#888888", "#8888FF", "#88FF88", "#88FFFF", "#FF8888", "#FF88FF", "#FFFF88", "#FFFFFF"];

var credits = [
	`CREDITS:`,
	`Cynthia Clementine - coding, art, and interface design`,
	`Joseph Cloutier - level design, original art, and story`,
	`Alex Ostroff - original art/animation`,
	`Jesse Valentine - music`,
	``,
	`ADDITIONAL LEVELS BY:`,
	`Karsh777, mathwiz100, portugal2000,`,
	`Huggaso, StarsOfTheSky, Fivebee2, and Gecco.`,
	``,
	`SPECIAL THANKS:`,
	`A*16 - "I barely did anything but I still wanted`,
	`to be in the credits."`,
	`Chair - "Chair or LongNeckedChair."`
]
var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;
var cursor_hoverTolerance = 10;

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
		highResolution: false,
		maskCursor: false,
		pastaView: false,
		volume: 0.5,
	}
};

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

//perhaps this isn't the best data structure to organize this. It's tricky for a system that has to support both linear progression and branches.
//TODO: find a better way to organize this?
var data_cutsceneTree = 
new CNode(-0.3351, -0.2068, 'comingThrough', [
	new CNode(-0.2893, -0.0848, 'niceToMeetYou', []), 
	new CNode(-0.3608, 0.0179, 'goldMedal', []), 
	new CNode(-0.2000, -0.1280, 'insanity', [
		new CNode(-0.1945, -0.0804, 'river', [
			new CNode(-0.1889, -0.0327, 'socraticMethod', [])
		])
	]), 
	new CNode(-0.3887, -0.1369, 'batteries', []), 
	new CNode(-0.4422, -0.1741, 'planetMissing', [
		new CNode(-0.1074, -0.1399, 'planetStolen', [
				new CNode(-0.1163, 0.0595, 'naming', []), 
			new CNode(-0.0739, 0.1324, 'orbits', [])
		])
	]), 
	new CNode(-0.0170, -0.1830, 'heavySleeper', [
		new CNode(-0.0326, -0.0402, 'studentTeacher', []), 
		new CNode(-0.0003, -0.2426, 'cheating', []), 
		new CNode(0.0946, -0.2262, 'teapot', []), 
		new CNode(0.1158, -0.2842, 'boring', []), 
		new CNode(0.1415, -0.2054, 'joinUs', []), 
		new CNode(0.0901, -0.0357, 'dontKnockIt', []), 
		new CNode(0.1426, -0.1622, 'changeTheSubject', []), 
		new CNode(0.0622, 0.0759, 'inflation', []), 
		new CNode(0.2408, 0.0640, 'wormholeInSight', [
			new CNode(0.2084, -0.2887, 'theGap', [
				new CNode(0.2007, -0.4135, 'somethingWeird', [
					new CNode(0.2308, -0.4405, 'tellAFriend', [
						new CNode(0.3233, -0.4647, 'lightningStrikesTwice', [
							new CNode(0.3810, -0.4231, 'affliction', [
								new CNode(-0.0360, -0.3061, 'revision', [
									new CNode(-0.0336, -0.4087, 'grandOpening', [])
								]), 
								new CNode(0.3991, -0.4006, 'protip', [
									new CNode(0.3582, -0.3702, 'leaveItHere', []), 
									new CNode(0.4868, -0.3750, 'dontQuestionIt', []), 
									new CNode(0.4462, -0.3006, 'crossingTheGap', [
										new CNode(0.4976, -0.3253, 'skates', []), 
										new CNode(0.4618, -0.0759, 'fame', []), 
										new CNode(0.5812, -0.3080, 'truancy', []), 
										new CNode(0.5380, -0.2634, 'morningHypothesis1', [
											new CNode(0.5536, -0.2334, 'morningHypothesis2', [
												new CNode(0.5714, -0.2034, 'morningHypothesis3', [
													new CNode(0.5938, -0.1734, 'morningHypothesis4', [
														new CNode(0.6172, -0.1434, 'morningHypothesis5', [])
													])
												])
											])
										])
									])
								])
							])
						])
					])
				])
			])
		])
	]), 
	new CNode(-0.3016, -0.3497, 'candy', [
		new CNode(-0.3719, -0.4182, 'selfAssembly', [
			new CNode(-0.4645, -0.4539, 'conspiracy', [])
		])
	]),
	new CNode(-0.1878, 0.1905, 'myTurn', [
		new CNode(-0.0876, 0.4033, 'theNextBigThing', [
			new CNode(-0.0664, 0.4449, 'youThink', [
				new CNode(-0.0368, 0.4732, 'friendlyGreeting', [
					new CNode(-0.0301, 0.5045, 'indecision', [
						new CNode(-0.0290, 0.5342, 'standardsToUphold', [
							new CNode(-0.0245, 0.5670, 'itsJustYou', [
								new CNode(-0.0647, 0.5997, 'discoveries', [
									new CNode(-0.2053, 0.5804, 'angelVsBunny', [
										new CNode(-0.2924, 0.5565, 'ofCourse', []), 
										new CNode(-0.2132, 0.6324, 'sneaking', []), 
										new CNode(-0.1797, 0.5134, 'obvious', [
											new CNode(-0.3147, 0.5342, 'boatRide', [
												new CNode(-0.3739, 0.5060, 'fourthCondiment', [
													new CNode(-0.3870, 0.4054, 'superpowers', [
														new CNode(-0.1253, -0.3616, 'thanksForPlaytesting', [])
													]), 
													new CNode(-0.5033, 0.5164, 'wait', [
														new CNode(-0.4868, 0.4519, 'stopSolvingProblems', [
															new CNode(-0.4086, 0.3718, 'ABCD', [])
														]), 
														new CNode(-0.6214, 0.4663, 'cantWait', [
															new CNode(-0.4699, 0.3301, 'twoMonthWait1', [
																new CNode(-0.5072, 0.3077, 'twoMonthWait2', [
																	new CNode(-0.5493, 0.2821, 'twoMonthWait3', [])
																])
															])
														])
													])
												])
											])
										])
									])
								])
							])
						])
					])
				])
			])
		])
	])
])

//for the map editor
var editor_active = false;
var editor_changingTheta = false;
var editor_clickTolerance = 5;
var editor_cutsceneSnapTolerance = 36;
var editor_mapSnapTolerance = 5;
var editor_thetaCircleRadius = 60;
var editor_thetaKnobRadius = 10;

//for the tunnel editor, try to keep up zozzle
var editor_buttonHeightPercentage = 0.45;
var editor_cameraLimit = 300000;
var editor_colorMultiplier = 1.7;
var editor_cutsceneColumns = 3;
var editor_cutsceneMargin = 0.08;
var editor_functionMapping = {
	"instant":			"power (instant)",
	"smooth":			"power (smooth)",
	"slowSmooth":		"power (smooth, slow)",
	"fast": 			"power (stutter)",
	"slow": 			"power (stutter, slow)",
	"glimpse":			"power (glimpse)",
	"falseAlarm":		"power (false alarm)",
	"notSoFalseAlarm":	"power (true alarm)",
	"cutsceneImmerse":	"cutscene"
};
var editor_maxCutscenes = 21;
var editor_cutscenes = {}
var editor_mapHeight = 10000;
var editor_minEditAngle = 0.06;
var editor_objects = [];
var editor_lPropertyW = 0.3;
var editor_lTileW = 0.06;
var editor_lTriggerW = 0.2;
var editor_sliderHeight = 0.05;
var editor_sliderProportion = 0.145;
var editor_sliderMargin = 0.008;
var editor_spawn = undefined;
var editor_substateTravelSpeed = 0.07;
var editor_topBarHeight = 0.12;
var editor_tileSize = 0.02;
var editor_triggerRibX = 0.0075;
var editor_triggerEditW = 0.4;
var editor_triggerEditH = 0.15;
var editor_tunnelDefaultData = [[1, 1, 1, 1, 1], [1, 0, 1, 0, 1], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
var editor_warning = "Warning: Editor data does not save between sessions. If you want to save your data, make sure to export your world before closing the window.";
var editor_warning_file = `the file you have entered has been detected at over 5000 lines long. 
This either means you have quite a large file, or something's gone wrong. 
If you would like to stop processing the file, click cancel. If continuing is alright, hit ok.`;
var editor_controlText = [
	`EDIT MODE CONTROLS:`,
	`< / > - decrement / increment cutscene frame`,
	`WASD - change camera position`,
	`arrow keys - change camera orientation`,
	`QE - change camera rotation`,
	`space - reset camera's rotation`,
	`c - toggle permanent camera change`,
	`esc - reset camera position`,
	`NORMAL MODE CONTROLS:`,
	`esc - skip cutscene`,
	`click - advance frame`
]
var editor_worldSnapTolerance = 25;
var editor_worldFile = undefined;

//for the cutscene editor
var editor_handleRadius = 6;
var editor_cutsceneWidth = 0.2;

var infinite_branchChance = 0.2;
var infinite_branchCooldown = 8;
var infinite_data = levelData_infinite.split("\n");
var infinite_difficultyBoost = 4;
var infinite_levelRange = 40;
var infinite_wobble = 0.3;



let loading_state;

var map_height = 120000;
var map_shift = 57000;
var map_zOffset = -46900;
var map_zStorage = map_zOffset;
var map_iconSize = 0.06;

var menu_buttonWidth = 0.25;
var menu_buttonHeight = 0.06;
var menu_characterCircleRadius = 0.3;
var menu_characterSize = 30;
var menu_characterTextTime = 160;
var menu_characterTextWidth = 0.7;
var menu_cutsceneParallax = 0.4;
var menu_propertyHeight = 0.07;

let page_animation;

var physics_boxFriction = 0.96;
var physics_boxMultiplier = 9;
var physics_boxSidePush = 0.75;
var physics_conveyorStrength = 0.05;
var physics_crumblingShrinkStart = 50;
var physics_crumblingShrinkTime = 150;
var physics_graceTime = 6;
var physics_graceTimeRamp = 10;
var physics_gravity = 0.13;
var physics_jumpTime = 30;
var physics_maxBridgeDistance = 350;

let player;
var player_radius = 18;
var player_coyote = 12;
var player_maxNameWidth = 0.28;

var powercells_acquireDistance = player_radius * 6;
var powercells_gentlemanMultiplier = 0.5;
var powercells_perTunnel = 10;
var powercells_spinSpeed = 0.05;
var powercells_size = 30;

var tunnel_dataStarChainMax = 4;
var tunnel_dataRepeatMax = 3;

var tunnel_textTime = 50;
var tunnel_transitionLength = 200;
var tunnel_voidWidth = 200;
var tunnel_bufferTiles = 4;

var tunnel_functions = {
	"instant": power_instant,
	"smooth": power_smooth,
	"slowSmooth": power_slowSmooth,
	"fast": power_fast,
	"slow": power_slow,
	"glimpse": power_glimpse,
	"falseAlarm": power_falseAlarm,
	"notSoFalseAlarm": power_notSoFalseAlarm,
	"undefined": power_fast,
	"cutscene": activateCutsceneFromTunnel,
	"cutsceneImmerse": activateCutsceneFromEditorTunnel
};
var tunnel_tileAssociation = {
	"~undefined": 1, 
	"~glow": 2, 
	"~crumbling": 3, 
	"~ice": 4,
	"~slow": 5, 
	"~fast": 6, 
	"~left": 7, 
	"~right": 8,
	"~box": 9, 
	"~rotatedZBox": 10, 
	"~steepRamp": 11, 
	"~ramp": 12, //ice ramp
	"~warning": 13,

	//movable tiles all start with 100 because. Just because.
	"~movable": 101, 
	"~movableGlow": 102,
	"~movableBox": 109
};
var tunnel_translation = {
	"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
	":": 10, ";": 11, "<": 12, "=": 13, ">": 14, "?": 15,"@": 16, "A": 17, "B": 18, "C": 19,
	"D": 20, "E": 21, "F": 22, "G": 23, "H": 24, "I": 25, "J": 26, "K": 27, "L": 28, "M": 29,
	"N": 30, "O": 31, "P": 32, "Q": 33, "R": 34, "S": 35, "T": 36, "U": 37, "V": 38, "W": 39,
	"X": 40, "Y": 41, "Z": 42, "[": 43, "/": 44, "]": 45, "^": 46, "_": 47, "!": 48, "a": 49,
	"b": 50, "c": 51, "d": 52, "e": 53, "f": 54, "g": 55, "h": 56, "i": 57, "j": 58, "k": 59,
	"l": 60, "m": 61, "n": 62, "o": 63,
};
var tunnel_validIndeces = {
	0: true,
	1: true,
	2: true,
	3: true,
	4: true,
	5: true,
	6: true,
	7: true,
	8: true,
	9: true,
	10: true,
	11: true,
	12: true,
	13: true,

	101: true,
	102: true,
	109: true,
}

let world_camera;
var world_pRandValue = 1.2532;
var world_time = 0;
let world_lightObjects = [];
let world_objects = [];
var world_specialStar;
let active_objects = [];
let world_wormhole;
var world_version = 1.1;


var render_animSteps = 9;
var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_identicalPointTolerance = 0.0001;
var render_maxColorDistance = 950;
var render_maxDistance = 25000;
var render_minTileSize = 8;
var render_minPolySize = 4;
var render_ringSize = 18;
var render_starOpacity = 0.6;
var render_voidSpinSpeed = 0.04;

let star_arr = [];
var star_distance = 2300;
var star_number = 500;

var text_queue = [];
var text_timeMax = 240;
var text_time = text_timeMax;

var textures_common = [];
data_characters.indexes.forEach(c => {
	textures_common.push(new Texture(eval(`data_sprites.${c}.sheet`), data_sprites.spriteSize, 2, false, false, eval(`[data_sprites.${c}.back[0], data_sprites.${c}.front[0]]`)));
});

var times_holiday = undefined;
var times_current = {};
var times_past = {};

//misc variables I couldn't be bothered giving prefixes to
var haltRotation = false;
var drawPlayer = false;
var deathCount = 0;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");

	//cursor movements setup
	document.addEventListener("mousemove", handleMouseMove, false);
	document.addEventListener("mousedown", handleMouseDown, false);
	document.addEventListener("mouseup", handleMouseUp, false);

	//objects
	world_camera = new Camera(0, 8, 0, 0, 0);
	player = new Runner(-60, 0, 0);
	world_wormhole = new Wormhole(60000, 2000, 199199);

	//adding a fun little suprise :)
	if (Math.random() < 0.001) {
		var icon = document.querySelector("link[rel~='icon']");
		icon.href = 'images/run.png';
	}

	//edit world objects
	if (editor_objects.length == 0) {
		editor_objects.push(new Tunnel(0.00, {h: 120, s: 50, v: 0.8}, JSON.parse(JSON.stringify(editor_tunnelDefaultData)), 'Custom Tunnel IeCo', 5, 1, [], 4, [1], [], 4, 75, 0, 0, [], `TravelTheGalaxy`));
		editor_spawn = editor_objects[0];
	}

	loading_state = new State_Loading();

	//setting up world
	//as a reminder, tunnels are (x, y, z, angle, tile size, sides, tiles per sides, color, length, data)
	world_objects = []; 

	generateStarSphere();
	generateAngelLines();
	localStorage_read();

	//seasons
	var date = new Date();
	if (date.getMonth() + 1 == 10 && date.getDate() == 31) {
		star_arr.forEach(s => {
			s.color = "#FC8";
		});
	}

	//the wavy air
	//navigator.mediaDevices.getUserMedia({audio: true});
	
	page_animation = window.requestAnimationFrame(main);
}

function main() {
	//main loop
	loading_state.execute();
	handleTextDisplay();

	//handle audio
	handleAudio();
	audio_channel1.tick();
	audio_channel2.tick();

	//save data every once in a while
	if (world_time % 204 == 203) {
		localStorage_write();
	}

	//call self
	world_time = (world_time + 1) % 9e15;
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	loading_state.handleKeyPress(a);

	//universal keys
	switch (a.keyCode) {
		case 16:
			controls_shiftPressed = true;
			break;
		case 27:
			
			try {
				loading_state.handleEscape();
			} catch (er) {
				console.log(`No escape / invalid function defined for the current game state peko`);
			}
			break;
		case 32:
			controls_spacePressed = true;
			break;
		case 221:
			editor_active = !editor_active;
			break;
	}
}

function handleKeyPress_camera(a) {
	//movement controls
	switch (a.keyCode) {
		// a/d
		case 65:
			world_camera.ax = -1 * world_camera.speed;
			break;
		case 68:
			world_camera.ax = world_camera.speed;
			break;
		// w/s
		case 87:
			world_camera.az = world_camera.speed;
			break;
		case 83:
			world_camera.az = -1 * world_camera.speed;
			break;
		//space
		case 32:
			//this if block just avoids repeat presses when holding down the key
			if (!controls_spacePressed) {
				world_camera.handleSpace();
			}
			break;
		//angle controls
		case 37:
			world_camera.dt = -1 * world_camera.sens;
			break;
		case 38:
			world_camera.dp = world_camera.sens;
			break;
		case 39:
			world_camera.dt = world_camera.sens;
			break;
		case 40:
			world_camera.dp = -1 * world_camera.sens;
			break;
		case 81:
			world_camera.dr = world_camera.sens;
			break;
		case 69:
			world_camera.dr = -1 * world_camera.sens;
			break;
	}
}

function handleKeyPress_player(a) {
	switch(a.keyCode) {
		//direction controls
		// a / <--
		case 65:
		case 37:
			player.ax = -1 * player.strafeSpeed;
			break;
		//d / -->
		case 68:
		case 39:
			player.ax = player.strafeSpeed;
			break;
		// w / ^ / space
		case 87:
		case 38:
		case 32:
			if (!controls_spacePressed) {
				//if it's infinite mode, restart
				if (loading_state instanceof State_Infinite && loading_state.substate == 2) {
					loading_state.pushScoreToLeaderboard();
					loading_state = new State_Infinite();
					loading_state.doWorldEffects();
				}
				player.handleSpace();
			}
			controls_spacePressed = true;
			break;
		//r
		case 82:
			if (loading_state instanceof State_Game && loading_state.substate == 0) {
				loading_state.handlePlayerDeath();
			}
			break;
	}
}

function handleKeyNegate(a) {
	loading_state.handleKeyNegate(a);

	//universals
	if (a.keyCode == 16) {
		controls_shiftPressed = false;
	}
	if (a.keyCode == 32) {
		controls_spacePressed = false;
	}
}

function handleKeyNegate_camera(a) {
	switch(a.keyCode) {
		//direction controls
		case 65:
			if (world_camera.ax < 0) {
				world_camera.ax = 0;
			}
			break;
		case 68:
			if (world_camera.ax > 0) {
				world_camera.ax = 0;
			}
			break;
		case 87:
			if (world_camera.az > 0) {
				world_camera.az = 0;
			}
			break;
		case 83:
			if (world_camera.az < 0) {
				world_camera.az = 0;
			}
			break;
			
		//angle controls
		case 37:
			if (world_camera.dt < 0) {
				world_camera.dt = 0;
			}
			break;
		case 38:
			if (world_camera.dp > 0) {
				world_camera.dp = 0;
			}
			break;
		case 39:
			if (world_camera.dt > 0) {
				world_camera.dt = 0;
			}
			break;
		case 40:
			if (world_camera.dp < 0) {
				world_camera.dp = 0;
			}
			break;
		case 81:
			if (world_camera.dr > 0) {
				world_camera.dr = 0;
			}
			break;
		case 69:
			if (world_camera.dr < 0) {
				world_camera.dr = 0;
			}
			break;
	}
}

function handleKeyNegate_player(a) {
	switch(a.keyCode) {
		//a / <--
		case 65:
		case 37:
			if (player.ax < 0) {
				player.ax = 0;
			}
			break;
		//d / -->
		case 68:
		case 39:
			if (player.ax > 0) {
				player.ax = 0;
			}
			break;
		// w / ^ / space
		case 87:
		case 38:
		case 32:
			controls_spacePressed = false;
			break;
	}
}

function handleMouseDown(a) {
	cursor_down = true;
	var canvasArea = canvas.getBoundingClientRect();
	if (!data_persistent.settings.maskCursor || (
	a.clientX - canvasArea.left <= canvas.width && a.clientX - canvasArea.left >= 0 && 
	a.clientY - canvasArea.top >= 0 && a.clientY - canvasArea.top <= canvas.height)) {
		loading_state.handleMouseDown(a);
	}
}

function handleMouseUp(a) {
	cursor_down = false;
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	if (!data_persistent.settings.maskCursor || (
	a.clientX - canvasArea.left <= canvas.width && a.clientX - canvasArea.left >= 0 && 
	a.clientY - canvasArea.top >= 0 && a.clientY - canvasArea.top <= canvas.height)) {
		loading_state.handleMouseMove(a);
	}
}

function updateResolution() {
	var multiplier = 0.5;
	if (data_persistent.settings.highResolution) {
		multiplier = 2;
	}

	//all things necessary for switching between resolutions
	canvas.width *= multiplier;
	canvas.height *= multiplier;
	world_camera.scale *= multiplier;
	render_minTileSize *= multiplier;
	menu_characterSize *= multiplier;

	cursor_hoverTolerance *= multiplier;

	if (loading_state.drawEnding == false) {
		loading_state.drawEnding = true;
	}

	if (loading_state.doDraw == false) {
		loading_state.doDraw = true;
	}

	//updating star size
	star_arr.forEach(w => {
		w.tick();
	});
}

/* results:
	performing 10,000,000 square roots on random numbers from 1 to 4000 took from 930 - 960 ms
	this is slightly faster than the same number of sin, cos, and tan operations, at 1100-1300 ms

	performing 100,000 spaceToRelative functions with a variable declaration took 218 - 228 ms
	performing the same number of spaceToRelative functions with the variable declaration removed took 210-211 ms,

	performing (10,000,000) a clamp operation on a variable when the condition for that clamp was met took between 48-50 ms. 
	Removing the conditional took between 50-56 ms.

	performing 1,000,000 instanceof tests took 10 ms, while performing 1,000,000 checks for a variable only a certain class has took 1-2 ms.

	run 10,000 times, setting an array of 1000 elements took 50 ms normally (push()) but was cut down to 35 ms when setting the last element of the array to undefined
	

	TL;DR-
	square roots are slow, but faster than trig functions
	variable declarations take time, but aren't the end of the world
	running an if statement on a variable to check for clamping is faster than doing clamping all the time
	instanceof tests are SLOW! avoid them
	increasing the length of an array is slow
	forEach loops are approximately 3 times faster than for loops (107 ms vs 315 ms)
	binary search is indeed, much faster than linear search. For an array of 300 elements, it is at least 20 times as fast.

*/
function performanceTest() {
	var perfTime = [0, 0];
	var totalTime = 0;
	perfTime = [performance.now(), 0];
	for (var a=0; a<50000; a++) {
		clipToZ0([[randomBounded(-10, 10), randomBounded(-10, 10), randomBounded(-10, 10)], [randomBounded(-10, 10), randomBounded(-10, 10), randomBounded(-10, 10)], [randomBounded(-10, 10), randomBounded(-10, 10), randomBounded(-10, 10)], [randomBounded(-10, 10), randomBounded(-10, 10), randomBounded(-10, 10)]], 0, false);
	}

	perfTime[1] = performance.now();
	totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}