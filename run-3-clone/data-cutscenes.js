//here is the data for the challenge modes as well
var challengeData_angelMissions = [
	"Angel",
	["Box Storage Area, Part 4", true, ``, ``, `Step 1: get answers from the Runner.|Done!`],
	["Level 35", true, ``, ``, `Step 2: gather the others.|Step 3: FINALLY go home.`],
	//B-7 and A-5 are missing crumbling tiles
	["B-7", false, ``, ``, `Missing tiles. Someone was here recently!`],
	["A-5", false, ``, ``, `I'm getting close. I hope.|I'd BETTER be getting close.`],
	["A-6", false, ``, ``, ``],
	["A-7", false, `getObjectFromID("A-7").freeObjs.push(new StaticCharacter(getObjectFromID("A-7"), 13, 18, "Skater", cutsceneData_theNextBigThing))`, ``, ``],

	["G-8", false, ``, ``, `Does he WANT to stay out here?|But there's nothing here! I don't get it...`],
	["G-10", false, ``, ``, `The boredom must have driven him crazy.|Wait no, then he'd be desperate to leave.|Maybe he started out crazy.`],
	["G-5", true, ``, ``, `No one there. Where is everyone?|I usually can't go five minutes without crashing into one of those pests.`],

	["Level 48", true, ``, ``, `For once I'm glad I'm single. I won't have a spouse trying to rip out MY antennae when I get back.|Although, hm...|If my friends miss me as much as I miss them...`],
	["Level 47", true, ``, ``, ``],

	["Level 33", true, ``, ``, `That went well!|Except for the part where she wants me to change.|Oh well, I'll just have to ignore her.`],
	["Level 16", true, ``, ``, ``],

	//26 is mising crumbling tiles
	["Level 26", false, ``, ``, `Plus, I'm too nice to leave like that.|They NEED my help. Leaving would be unheroic of me.`],
	["Level 27", false, ``, ``, ``],

	["Low Power Tunnel, Part 11", false, ``, ``, `I remember this tunnel...|I hate it even more than the others.`],
	["Low Power Tunnel, Part 22", false, ``, ``, `it could be just my imagination, but it feels like I can't fly as well here.`],
	["Low Power Tunnel, Part 23", false, ``, ``, ``],

	["M-2", false, ``, ``, `Good riddance.|He's going to be stuck here for another couple years, but that's not my problem.`],
	["M-4", false, ``, ``, `Hey, knocked-out tiles. I'm in luck!`],

	["U-7", false, ``, ``, `Just a few more places left to check.`],
	["D-8", false, ``, ``, ``],
	["D-1", true, ``, ``, `I guess that's it then.`],
	["U-10", false, ``, ``, `Gotta check here just to be sure...`],
	["U-10", true, ``, ``, `As I thought. We must have passed each other at some point.|Her loss.|Maybe the Pastafarian will find her, but I'm not going to spend another two weeks searching.`],
	["U-9", true, ``, ``, ``],
	["U-5", true, ``, ``, `I've done my duty. Time to head home!`],
];
//cutscenes!!!





//~~~~~~~~~base world~~~~~~~~




//(planet missing)


//(gentleman)
var cutsceneData_grandOpening = {
	id: 'Grand Opening',
	effects: 'console.log("this is a test effect for the cutscene");',
	frames: [
		[[-24281.6476, -8.0136, -93936.2133, 6.2552, 0.0400, -1.5800], [new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.4992, 0.5917, 0.0188, 'data_sprites.Gentleman.sheet', 0.0000, false, 13, 0), new SceneBubble(0.5031, 0.2333, 0.3242, 0.1240), new SceneText(0.5031, 0.1698, 0.2984, 0.0479, 'Ladies and gentlemen, welcome to the Grand Opening of the Memory Evaluation!', false), new SceneTri(0.4305, 0.3458, 0.4945, 0.5313, 0.0078)]], 
		[[-24270.1046, 20.4981, -93869.7720, 6.2552, -0.0400, -1.5600], [new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.5000, 0.5875, 0.0223, 'data_sprites.Gentleman.sheet', 0.0000, false, 12, 0), new SceneBubble(0.4766, 0.2531, 0.3726, 0.1031), new SceneText(0.4828, 0.1990, 0.3133, 0.0469, 'Unlike any tunnel you\'ve yet seen, the tunnel before you was designed by an expert!', false), new SceneTri(0.4375, 0.3521, 0.4945, 0.5313, 0.0078), new SceneBubble(0.5359, 0.7833, 0.4008, 0.0719), new SceneText(0.5398, 0.7604, 0.3578, 0.0396, 'Each trial is a challenge to your recollection. Will you be able to pass all seven?', false), new SceneTri(0.6016, 0.7219, 0.5234, 0.6281, 0.0094)]], 
		[[-24336.1222, 180.2175, -93797.4270, 6.5352, -0.6400, -1.7800], [new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.5039, 0.5906, 0.0235, 'data_sprites.Gentleman.sheet', 0.0000, true, 14, 5), new SceneBubble(0.5000, 0.3177, 0.4406, 0.1063), new SceneText(0.5008, 0.2677, 0.4117, 0.0479, 'In the former half of each trial, you are granted the opportunity to study the pattern of obstacles.', false), new SceneTri(0.4656, 0.4167, 0.4945, 0.5313, 0.0078), new SceneBubble(0.5039, 0.7562, 0.3414, 0.0813), new SceneText(0.5102, 0.7188, 0.3008, 0.0490, 'The latter half then plunges you into darkness.', false), new SceneBubble(0.6969, 0.9219, 0.1266, 0.0510), new SceneBox(0.6469, 0.8635, 0.0086, 0.0563), new SceneText(0.6984, 0.9063, 0.1109, 0.0510, 'Good luck!', false), new SceneTri(0.4906, 0.6896, 0.4922, 0.6427, 0.0078)]], 
		[[-24308.9372, 244.7207, -93675.8828, 6.2952, -1.0400, -1.6200], [new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.4648, 0.6375, 0.0211, 'data_sprites.Gentleman.sheet', 0.0000, true, 12, 5), new SceneBubble(0.5109, 0.2031, 0.3961, 0.1156), new SceneText(0.5094, 0.1573, 0.3461, 0.0427, 'Before you begin, please be advised that the colorful tetrahedral decorations are the property of the Gentleman.', false), new SceneTri(0.4586, 0.3083, 0.4688, 0.5417, 0.0078), new SceneBubble(0.5938, 0.8302, 0.3672, 0.0833), new SceneText(0.5945, 0.7927, 0.3297, 0.0448, 'Should you collect any, return them to me before exiting the attraction.', false), new SceneTri(0.5617, 0.7573, 0.4992, 0.6813, 0.0039)]], 
		[[-24256.7521, 199.4268, -93617.9419, 6.6552, -1.3200, -2.0400], [new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.5141, 0.5750, 0.0252, 'data_sprites.Gentleman.sheet', 0.0000, true, 13, 4), new SceneBubble(0.4188, 0.2854, 0.2875, 0.0510), new SceneText(0.4234, 0.2687, 0.2836, 0.0479, 'Now without further ado...', false), new SceneTri(0.4305, 0.3302, 0.4945, 0.5313, 0.0078), new SceneBubble(0.4734, 0.7490, 0.2820, 0.0635), new SceneText(0.4750, 0.7323, 0.2758, 0.0500, 'Please enjoy your journey!', false), new SceneTri(0.5484, 0.7010, 0.5227, 0.6302, 0.0047)]], 
		[[-24256.7521, 199.4268, -93617.9419, 6.6552, -1.3200, -2.0400], [new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.5141, 0.5740, 0.0252, 'data_sprites.Gentleman.sheet', 0.0000, true, 12, 5), new SceneBubble(0.4016, 0.3000, 0.3117, 0.0510), new SceneText(0.4055, 0.2844, 0.2867, 0.0479, 'That concludes my rehersal.', false), new SceneTri(0.4305, 0.3302, 0.4945, 0.5313, 0.0078), new SceneBubble(0.4414, 0.7562, 0.2930, 0.0781), new SceneText(0.4406, 0.7042, 0.2648, 0.0500, 'Do you have any questions or suggestions?', false), new SceneTri(0.5484, 0.7010, 0.5227, 0.6302, 0.0047)]], 
		[[-24315.7140, 160.6049, -93381.6345, 3.2152, -0.1600, 1.4800], [new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.6781, 0.7802, 0.0304, 'data_sprites.Gentleman.sheet', 0.0000, false, 0, 5), new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneSprite(0.4594, 0.6625, 0.0170, 'data_sprites.Lizard.sheet', 0.0000, false, 12, 0)]], 
		[[-24279.9987, 152.3694, -93363.9924, 3.2552, -0.0800, 1.4800], [new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.6867, 0.7250, 0.0344, 'data_sprites.Gentleman.sheet', 0.0000, false, 0, 3), new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneSprite(0.4781, 0.6438, 0.0180, 'data_sprites.Lizard.sheet', 0.0000, false, 12, 0), new SceneBubble(0.4977, 0.4552, 0.0414, 0.0385), new SceneBubble(0.4508, 0.2208, 0.2930, 0.1094), new SceneBubble(0.4961, 0.8969, 0.4180, 0.0865), new SceneBox(0.4938, 0.3510, 0.0070, 0.0875), new SceneTri(0.5148, 0.4760, 0.6578, 0.6625, 0.0102), new SceneTri(0.6195, 0.8323, 0.6484, 0.7510, 0.0125), new SceneText(0.4508, 0.1677, 0.2422, 0.0500, 'Of course not. That was mere wishful thinking on my part.', false), new SceneText(0.4938, 0.4281, 0.1000, 0.0500, '...', false), new SceneText(0.4914, 0.8552, 0.3750, 0.0469, 'I cannot wait for the return of those capable of carrying a conversation.', false)]], 
		[[-24328.1716, 99.3270, -93297.2532, 3.2552, 0.0108, 1.5800], [new SceneLight(-24202.6484, 6.6078, -93566.9479), new SceneSprite(0.6219, 0.7531, 0.0344, 'data_sprites.Gentleman.sheet', 0.0000, false, 0, 3), new SceneLight(-24167.2493, 130.7269, -93859.9829), new SceneSprite(0.4789, 0.6750, 0.0170, 'data_sprites.Lizard.sheet', 0.0000, false, 12, 0), new SceneBubble(0.5883, 0.2687, 0.2070, 0.0531), new SceneBubble(0.2687, 0.8000, 0.2633, 0.1635), new SceneTri(0.4984, 0.7781, 0.5828, 0.7562, 0.0078), new SceneTri(0.6242, 0.3115, 0.6273, 0.6219, 0.0086), new SceneText(0.5906, 0.2510, 0.2320, 0.0500, 'Ok, from the top...', false), new SceneText(0.2656, 0.7250, 0.2930, 0.0500, 'Ladies and gentlemen, welcome to the Grand Opening of the Memory Evaluation!', false)]],
	]
}




//~~~~~~~~angel's mission~~~~~~~~
var cutsceneData_theNextBigThing = {
	id: 'The Next Big Thing',
	effects: 'if (data_persistent.goingHomeProgress < 7) {data_persistent.goingHomeProgress = 7;}',
	frames: [
		[[-17809.6914, -45.2583, 7449.6337, -18.6508, 0.0000, 7.2282], [new SceneLight(-17856.2065, -77.3005, 7651.2535), new SceneLight(-17835.6282, -147.1101, 7660.2708), new SceneSprite(0.5594, 0.6948, 0.0205, 'data_sprites.Angel.sheet', 6.2306, false, 4, 3), new SceneSprite(0.4547, 0.7271, 0.0229, 'data_sprites.Skater.sheet', 0.0000, false, 6, 3), new SceneBubble(0.6766, 0.1281, 0.2742, 0.1000), new SceneBubble(0.6945, 0.4375, 0.0648, 0.0438), new SceneBubble(0.3141, 0.2885, 0.2195, 0.0542), new SceneBubble(0.3469, 0.5417, 0.1914, 0.0573), new SceneBubble(0.4445, 0.9198, 0.1453, 0.0521), new SceneText(0.3070, 0.2750, 0.2297, 0.0448, 'Yep, that\'s where I was!', false), new SceneText(0.3484, 0.5281, 0.1773, 0.0448, 'All over the place.', false), new SceneText(0.4430, 0.9052, 0.2000, 0.0500, 'I\'m on lap 50!', false), new SceneTri(0.4445, 0.8823, 0.4531, 0.7781, 0.0086), new SceneTri(0.4117, 0.5896, 0.4305, 0.6833, 0.0055), new SceneBox(0.2680, 0.4198, 0.0055, 0.0979), new SceneText(0.6742, 0.0781, 0.2281, 0.0448, 'Where *were* you? I\'ve been looking all over the place!', false), new SceneBox(0.7180, 0.3271, 0.0094, 0.1208), new SceneText(0.6945, 0.4240, 0.1000, 0.0427, 'Huh?', false), new SceneTri(0.6656, 0.4698, 0.5750, 0.6427, 0.0117)]], 
		[[-17760.7448, -43.0660, 7624.8707, -18.6508, 0.0000, 0.9400], [new SceneLight(-17771.2511, -147.1510, 7901.1239), new SceneLight(-17812.1171, -78.4076, 7933.3339), new SceneSprite(0.5453, 0.6760, 0.0229, 'data_sprites.Angel.sheet', 0.0000, false, 7, 2), new SceneSprite(0.4633, 0.6417, 0.0175, 'data_sprites.Skater.sheet', 0.0000, false, 1, 2), new SceneBubble(0.7289, 0.1271, 0.2500, 0.0562), new SceneTri(0.6398, 0.1729, 0.5773, 0.5573, 0.0141), new SceneBubble(0.4398, 0.3083, 0.1000, 0.0625), new SceneBubble(0.2703, 0.7604, 0.2703, 0.0906), new SceneBubble(0.5859, 0.9094, 0.2711, 0.0687), new SceneText(0.5898, 0.8948, 0.2891, 0.0500, 'Not 50 approaching 51.', false), new SceneText(0.2680, 0.7323, 0.2660, 0.0385, 'I\'ve done each tunnel 49 times, and I\'m working on my 50th.', false), new SceneTri(0.4688, 0.3510, 0.4625, 0.5687, 0.0070), new SceneBox(0.3750, 0.5240, 0.0117, 0.1969), new SceneText(0.7312, 0.1146, 0.3047, 0.0396, 'What are you talking about?', false), new SceneText(0.4383, 0.2958, 0.1000, 0.0427, 'Oh, sorry.', false), new SceneBox(0.4219, 0.8490, 0.0086, 0.0323)]], 
		[[-17718.7279, -15.1769, 7760.6865, -18.6908, -0.0000, 0.9400], [new SceneLight(-17767.2614, -46.3173, 8028.9561), new SceneLight(-17755.8323, -140.6331, 7955.2461), new SceneSprite(0.5938, 0.7823, 0.0383, 'data_sprites.Angel.sheet', 0.0000, false, 0, 0), new SceneSprite(0.4609, 0.6365, 0.0273, 'data_sprites.Skater.sheet', 0.0000, false, 0, 0), new SceneBubble(0.6867, 0.1208, 0.2805, 0.1000), new SceneBubble(0.3812, 0.8896, 0.3648, 0.0521), new SceneText(0.3805, 0.8750, 0.3617, 0.0500, 'It\'s going to be the next big thing!', false), new SceneTri(0.4508, 0.8573, 0.4570, 0.7021, 0.0133), new SceneTri(0.8031, 0.2031, 0.6570, 0.6219, 0.0125), new SceneBubble(0.3195, 0.3885, 0.2703, 0.0531), new SceneText(0.3305, 0.3708, 0.2773, 0.0500, 'More like a sport, really.', false), new SceneBox(0.2492, 0.6417, 0.0078, 0.2188), new SceneText(0.6937, 0.0917, 0.2607, 0.0500, 'Do you think this is some kind of game?', false)]], 
		[[-17685.7881, -15.1769, 7992.7533, -18.6908, -0.0000, 0.9600], [new SceneLight(-17699.6170, -27.3425, 8177.7808), new SceneLight(-17670.5801, -63.1782, 8153.9764), new SceneSprite(0.5609, 0.6010, 0.0344, 'data_sprites.Angel.sheet', 0.0000, false, 0, 0), new SceneSprite(0.4742, 0.5781, 0.0250, 'data_sprites.Skater.sheet', 0.0000, false, 4, 0), new SceneBubble(0.5695, 0.1667, 0.3844, 0.1271), new SceneText(0.5664, 0.1344, 0.3805, 0.0500, 'Changing the subject, I\'ve found how to get home. You should come.', false), new SceneTri(0.5289, 0.2750, 0.5539, 0.5260, 0.0156), new SceneBubble(0.3359, 0.8365, 0.1461, 0.0531), new SceneText(0.3352, 0.8229, 0.1305, 0.0479, 'Can it wait?', false), new SceneTri(0.3609, 0.7969, 0.4578, 0.6240, 0.0094)]],
		[[-17628.4090, -73.2876, 8290.4288, -18.6508, 0.0400, 0.9600], [new SceneLight(-17704.1198, -61.6723, 8461.5107), new SceneLight(-17651.5661, -128.5265, 8415.6215), new SceneSprite(0.5305, 0.6896, 0.0422, 'data_sprites.Angel.sheet', 0.0000, false, 6, 0), new SceneSprite(0.3984, 0.6927, 0.0367, 'data_sprites.Skater.sheet', 0.0000, false, 6, 0), new SceneBubble(0.4430, 0.1313, 0.3367, 0.0750), new SceneBubble(0.4203, 0.3917, 0.3609, 0.0885), new SceneText(0.4258, 0.0917, 0.2898, 0.0448, 'Once you go home and tell everyone, they\'ll come out here.', false), new SceneText(0.4164, 0.3552, 0.3008, 0.0500, 'I\'m not sure I\'m ready for that tunnel of competition!', false), new SceneTri(0.3828, 0.4542, 0.3969, 0.6292, 0.0125), new SceneBox(0.6070, 0.2594, 0.0094, 0.0781)]],
]
};


//~~~~~~~~~the way backwards~~~~~~~~

var cutsceneData_skates = [

];





//~~~~~~~~bridge building~~~~~~~~



//~~~~~~~~the way onwards~~~~~~~~