//for storing large data variables that aren't going to change, and that I generally don't want to deal with in main
var audio_table = {
	"type-A": {
		file: new Audio("audio/type-A.mp3"),
		bpm: 135,
		//loop start and loop end are in beats, multiplied by 8 because the first number is the measure number.
		loopStart: 0 * 8,
		loopEnd: 16 * 8,
		title: `Korobeiniki`
	},
	"type-B": {
		file: new Audio("audio/type-B.mp3"),
		bpm: 145,
		//loop start and loop end are in beats, multiplied by 8 because the first number is the measure number.
		loopStart: 2 * 8,
		loopEnd: 24 * 8,
		title: `Unknown (please contact me if you know)`
	},
	"type-C": {
		file: new Audio("audio/type-C.mp3"),
		bpm: 140,
		loopStart: 0 * 6,
		loopEnd: 36 * 6,
		title: `Bach Menuet from French Suite #3`
	},
	"none": undefined
}



let cpOLD = ["#9bbc0f", "#8bac0f", "#306230", "#0f380f"];
var color_palettes = [
	//modern
	{
		clearColor: "#FFFFFF",
		bg: "#01295F",
		endBg: "#C4F0FF",
		mg: "#395E91",
		lines: "#FFFFFF",
		text: "#D49CFF",
		pColors: {
			"I": "#00FFFF",
			"J": "#0000FF",
			"L": "#FF8800",
			"O": "#FFFF00",
			"S": "#00FF00",
			"T": "#FF00FF",
			"Z": "#FF0000",
		},
		draw: (color, x, y, size) => {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.globalAlpha = 0.7;
			ctx.fillRect(x+1, y+1, size-2, size-2);
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.fillRect(x + (size * 0.1), y + (size * 0.1), size * 0.8, size * 0.8);
			ctx.fill();
		}
	}, {
		//classic
		clearColor: cpOLD[0],
		bg: cpOLD[0],
		endBg: cpOLD[1],
		mg: cpOLD[1],
		lines: cpOLD[1],
		text: cpOLD[3],
		pColors: {
			"I": cpOLD[2],
			"J": cpOLD[2],
			"L": cpOLD[2],
			"O": cpOLD[2],
			"S": cpOLD[3],
			"T": cpOLD[3],
			"Z": cpOLD[3],
		},
		draw: (color, x, y, size) => {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, size+1, size+1);
		}
	}]
var controls_s = {
	l: 'ArrowLeft',
	r: 'ArrowRight',
	d: 'ArrowDown',
	u: 'ArrowUp',
	hd: ' ',

	rl: 'z',
	rl2: 'ArrowUp',
	rr: 'x',
	st: 'c',

	esc: `Escape`,
	confirm: `Enter`
}

var controls_m = {
	p1: {
		l: 'ArrowLeft',
		r: 'ArrowRight',
		d: 'ArrowDown',
		hd: ',',
	
		rl: '.',
		rl2: 'ArrowUp',
		rr: '/',
		st: 'm',
	},
	p2: {
		l: 'd',
		r: 'g',
		d: 'f',
		hd: '2',
	
		rl: '3',
		rl2: 'r',
		rr: '4',
		st: '1'
	}
}

var data_persistent = {
	name1: `Person 1`,
	name2: `Person 2`,
	music1: `type-A`,
	music2: `type-C`,
	type: `modern`
}

var menu_buttons = [
	[`Endless`, `game_state = 1; boards = [new System_New()]; audio_channel1.target = audio_table[data_persistent.music1];`],
	[`Sprint`, `game_state = 2; boards[0] = new System_New();`],
	//[`2 Player Competition`, `game_state = 3; boards = [new System_New(), new System_New()];`],
	[`High Scores`, `game_substate = 2;`],
	[`Settings`, `game_substate = 1; menu_selectSet = menu_settings; menu_selected = 0;`],
]

var menu_buttons_old = [
	[`Endless`, `game_state = 1; boards = [new System_Old()]; audio_channel1.target = audio_table[data_persistent.music2];`],
	[`High Scores`, `game_substate = 2;`],
	[`Settings`, `game_substate = 1; menu_selectSet = menu_settings; menu_selected = 0;`],
]

var menu_settings = [
	//in [label, value, onchange] format
	["Edit Controls", ``, `game_substate = 3;`],
	["Player 1 name:", `data_persistent.name1`, `setSafeString("data_persistent.name1", prompt("Enter new name for player 1", data_persistent.name1))`],
	["Player 2 name:", `data_persistent.name2`, `setSafeString("data_persistent.name2", prompt("Enter new name for player 2", data_persistent.name2))`],
	[``, ``, ``],
	["music:", `data_persistent.music1`, `enumerate("data_persistent.music1", Object.keys(audio_table), 1)`],
	["game type:", `data_persistent.type`, `swapGameType();`]
]

function swapGameType() {
	if (data_persistent.type == "modern") {
		//move to classic
		menu_settings[4][1] = `data_persistent.music2`;
		menu_settings[4][2] = `enumerate("data_persistent.music2", Object.keys(audio_table), 1)`;
	} else {
		//move to modern
		menu_settings[4][1] = `data_persistent.music1`;
		menu_settings[4][2] = `enumerate("data_persistent.music1", Object.keys(audio_table), 1)`;
	}
}


//T, L, R, Z, S, O, I
//each piece is stored in the format [data, centerCoords]
//data stores the positions of the blocks, and centerCoords says where the reference point of those blocks are.
//Data is 4 hex characters, because the array is 4x4 and each hex character can be 4 bits (0000 - 1111)
var piece_pos = {
	//the I piece is weird
	"I": [
		["0F00", [0, 1]],
		["2222", [0, 1]],
		["00F0", [0, 1]],
		["4444", [0, 1]]
	],
	"J": [
		["8E00", [1, 2]],
		["6440", [1, 2]],
		["0E20", [1, 2]],
		["44C0", [1, 2]]
	],
	"L": [
		["2E00", [1, 2]],
		["4460", [1, 2]],
		["0E80", [1, 2]],
		["C440", [1, 2]],
	],
	"O": [
		["CC00", [0, 2]],
		["CC00", [0, 2]],
		["CC00", [0, 2]],
		["CC00", [0, 2]]
	],
	"S": [
		["6C00", [1, 2]],
		["4620", [1, 2]],
		["06C0", [1, 2]],
		["8C40", [1, 2]]
	],
	"T": [
		["4E00", [0, 2]],
		["4640", [0, 2]],
		["0E40", [0, 2]],
		["4C40", [0, 2]]
	],
	"Z": [
		["C600", [1, 2]],
		["2640", [1, 2]],
		["0C60", [1, 2]],
		["4C80", [1, 2]]
	],
};

//kicks say which alternative positions a piece can move to when being rotated. This helps with awkwardness at the side walls, 
//for example, where a pure rotation would put the piece into the wall.
var piece_kicks_standard = {
	"0>>1": [[-1,0], [-1,1], [0,-2], [-1,-2]],
	"1>>2": [[1, 0], [1, -1], [0, 2], [1, 2]],
	"2>>3": [[1, 0], [1, 1], [0, -2], [1, -2]],
	"3>>0": [[-1, 0], [-1, -1], [0, 2], [-1, 2]],

	"1>>0": [[1, 0],[1,-1],[0, 2],[1, 2]],
	"2>>1": [[-1, 0], [-1, 1], [0, -2], [-1, -2]],
	"3>>2": [[-1, 0], [-1, -1], [0, 2], [-1, 2]],
	"0>>3": [[1, 0], [1, 1], [0, -2], [1, -2]],
}
var piece_kicks_i = {
	"0>>1": [[-2, 0], [1, 0], [-2, -1], [1, 2]],
	"1>>2": [[-1, 0], [2, 0], [-1, 2], [2, -1]],
	"2>>3": [[2, 0], [-1, 0], [2, 1], [-1, -2]],
	"3>>0": [[1, 0], [-2, 0], [1, -2], [-2, 1]],

	"1>>0": [[2, 0], [-1, 0], [2, 1], [-1, -2]],
	"2>>1": [[1, 0], [-2, 0], [1, -2], [-2, 1]],
	"3>>2": [[-2, 0], [1, 0], [-2, -1], [1, 2]],
	"0>>3": [[-1, 0], [2, 0], [-1, 2], [2, -1]],
}
var piece_kicks = {
	"I": piece_kicks_i,
	"J": piece_kicks_standard,
	"L": piece_kicks_standard,
	"O": {
		"0>>1": [], "1>>2": [], "2>>3": [], "3>>0": [],
		"1>>0": [], "2>>1": [], "3>>2": [], "0>>3": [],
	},
	"S": piece_kicks_standard,
	"T": piece_kicks_standard,
	"Z": piece_kicks_standard,
}