/*all map zones:
	J/A -- tutorial

	C -- crossroads

	G/B/Y/R -- zones for Green, blue, yellow, and red

	F -- final
*/

let menuMap;
let defaultMap;
let mapDef_F;
let mapJ1;
let mapJ1_F;
let mapJ2;
let mapJ2_F;

let mapA1;
let mapA2;
let mapA3;
let mapA4;
let mapA5;

let mapC;
let mapCa;
let mapCb;
let mapCaa;
let mapCab;
let mapCba;
let mapCbb;

let mapR1;
let mapR2;
let mapR3;
let mapR4;
let mapR5;
let mapR6;
let mapR7;
let mapR5_F;
let mapR

let mapE1;

let mapMT;

//all the map generation is inside a function so I can control when they're defined
//numbers in terms of mapSize for quick reference

function initMaps() {
	//defining some numbers in terms of mapSize for quick reference
	var pH = 0.5 * mapSize;
	var nH = -0.5 * mapSize;
	var pF = mapSize;
	var nF = -1 * mapSize;

	//intro maps (J+A)
	menuMap = new Map("#A08060", [], NaN, "defaultMap"); 
	menuMap.contains = [new Floor(),
						new Box(-125, -112.5, 0, -25, 37.5, 10),
						new Wall(3),
						new Box(0, 0, 0, -100, 150, 10),
						new Text("Press X or L to Rotate")];
	
	defaultMap = new Map("#A08060", [], "menuMap", "mapJ1");
	defaultMap.contains = [ new Floor(),
							new PartialBox(nF, 0, 0, 1, pF, pF, true, true, true),
							new Box(0, 0, 0, 10, pF, pF * 0.6666666),
							new Box(0, -92.5, 125, 10, 57.5, 25),
							new Text(["Use WASD or arrow keys to move"])];

	mapJ1 = new Map("#A08060", [], "mapDef_F", "mapJ2"); 
	mapJ1.contains = [ 	new Floor(), 
						new Box(0, 0, 150, 150, 150, 1), 
						new Box(0, 0, 150, 150, 150, 1), 
						new Box(0, 0, 0, 100, 150, 10), 
						new Box(125, -92.5, 0, 25, 57.5, 10)];

	mapJ2 = new Map("#A08060", [], "mapJ1", NaN); 
	mapJ2.contains = [		new Floor(), 
							new Box(150, 0, 0, 1, 150, 150), 
							new Box(0, 0, 0, 10, 150, 100), 
							new Box(0, -92.5, -125, 10, 57.5, 25), 
							new Text("Press Z or K to Counter-Rotate")];
	
	mapDef_F = new Map("#E5B25D", [], "menuMap", "mapJ1_F");
	mapDef_F.contains = [new Floor(),
						new PartialBox(nF, 0, 0, 1, pF, pF, true, true, true),
						new Box(0, 0, 0, 10, pF, pF * 0.6666666),
						new Text(["X or L"])];
	
	mapJ1_F = new Map("#E5B25D", [], "mapDef_F", "mapJ2_F"); 
	mapJ1_F.contains = [	new Floor(),
							new Box(0, 0, 0, 100, 150, 10)];

	mapJ2_F = new Map("#E5B25D", [], "mapJ1_F", "mapA1"); 
	mapJ2_F.contains = [new Floor(), 
						new Box(-5, -125, 125, 15, 25, 25), 
						new Box(25, -115, 140, 15, 15, 10), 
						new Box(0, 0, 0, 10, 150, 100)];
	
	mapA1 = new Map("#E5B25D", [], "mapJ2_F", "mapA2"); 
	mapA1.contains = [ 		new Floor(), 
							new Box(-125, -125, 0, 25, 25, 10), 
							new PartialBox(-35, -145, 85, 115, 10, 70, true, true, true), 
							new Box(0, 0, 0, 100, 150, 10), 
							new Box(125, -125, 0, 25, 25, 10), 
							new Box(140, -115, -25, 10, 15, 15)];

	mapA2 = new Map("#E5B25D", [], "mapA1", "mapA3"); 
	mapA2.contains = [ 	new Floor(), 
						new Box(0, -125, 125, 10, 25, 25), 
						new PartialBox(85, -145, 35, 70, 10, 115, true, true, true), 
						new Box(0, 0, 0, 10, 150, 100), 
						new Box(0, -125, -125, 10, 25, 25), 
						new Box(-25, -115, -140, 15, 15, 10)];

	mapA3 = new Map("#E5B25D", [], "mapA2", "mapA4"); 
	mapA3.contains = [		new Floor(), 
							new Box(-140, -115, 25, 10, 15, 15), 
							new Box(-125, -125, 0, 25, 25, 10), 
							new Box(125, -125, 0, 25, 25, 20), 
							new Box(0, 0, 0, 100, 150, 10), 
							new PartialBox(45, -145, -80, 110, 5, 70, true, true, true)];

	mapA4 = new Map("#E5B25D", [], "mapA3", "mapA5"); 
	mapA4.contains = [ 	new Floor(), 
						new Box(25, -115, 140, 15, 15, 10), 
						new Box(0, -125, 125, 10, 25, 25), 
						new PartialBox(150, 0, 0, 1, 150, 150, true, true, true), 
						new PartialBox(-75, -145, -40, 75, 5, 110, true, true, true), 
						new Box(0, 0, 0, 10, 150, 100), 
						new Box(0, -125, -125, 20, 25, 25)];
						
	mapA5 = new Map("#CCAACC", [], "mapC", "mapC"); 
	mapA5.contains = [		new Floor(),
							new PartialBox(0, 0, nF, 150, 150, 1, true, true, true),
							new Box(0, 0, 0, 10, 150, 10),
							new Text(["Welcome to the Crossroads"])];
	//crossroads maps	
	/*
	Ca - blend of red/yellow
	Cb - blend of green/blue

	Caa - red
	Cab - yellow
	Cba - green
	Cbb - blue

	*/
							
	mapC = new Map("#CCAACC", [], "mapCa", "mapCb"); 
	mapC.contains = [ 	new Floor(), 
						new Box(0, 0, 0, 10, 150, 10)];

	mapCa = new Map("#FC9B94", [], "mapCaa", "mapCab"); 
	mapCa.contains = [		new Floor(),
							new Wall(2), 
							new Wall(0), 
							new Box(0, 0, 0, 10, 150, 10)];
	
	mapCaa = new Map("#FF5468", [], "mapR1", "mapCa"); 
	mapCaa.contains = [		new Floor(), 
							new Wall(3),
							new Box(0, 0, 0, 10, 150, 10)];
	
	mapCab = new Map("#F9FFBD", [], "mapCa", "mapCab"); 
	mapCab.contains = [ 	new Floor(),
							new Wall(3), 
							new Box(0, 0, 0, 10, 150, 10)];

	mapCb = new Map("#4096AA", [], "mapCba", "mapCbb"); 
	mapCb.contains = [ 	new Floor(), 
						new Wall(2), 
						new Wall(0),
						new Box(0, 0, 0, 10, 150, 10)];

	mapCba = new Map("#70C1B3", [], "mapCba", "mapCb"); 
	mapCba.contains = [ new Floor(), 
						new Wall(3), 
						new Box(0, 0, 0, 10, 150, 10)];
	
	mapCbb = new Map("#106BA0", [], "mapCb", "mapCbb"); 
	mapCbb.contains = [ new Floor(),
						new Wall(3), 
						new Box(0, 0, 0, 10, 150, 10)];

	//four zones (green: #70C1B3   blue: #106BA0   yellow: #F9FFBD   red: #FF366B)



	//red zone	
	mapR1 = new Map("#FF5468", [], "mapR4", "mapR2"); 
	mapR1.contains = [ 	new Floor(), 
						new TiltedBox(26, -37, 156, 45, 5, 15, false, false, false, -0.5, 0, 0, 0), 
						new Box(60, -150, 120, 45, 25, 0), 
						new PartialBox(140, -100, 6, 25, 5, 70, true, true, true), 
						new Wall(0), 
						new Box(30, -130, 6, 0, 11, 107), 
						new Box(-35, -80, 0, 10, 70, 150), 
						new Box(150, -95, -85, 15, 15, 15), 
						new PartialBox(25, -135, -135, 25, 15, 15, true, true, true), 
						new PartialBox(-10, -25, -135, 15, 15, 15, true, true, true)];
	
	mapR2 = new Map("#FF5468", [], "mapR1", "mapR3"); 
	mapR2.contains = [ 	new Floor(), 
						new Wall(1), 
						new Box(0, -80, 35, 150, 70, 10), 
						new PartialBox(-135, -25, 10, 15, 15, 15, true, true, true), 
						new PartialBox(-135, -135, -25, 15, 15, 25, true, true, true), 
						new TiltedBox(156, -37, -26, 15, 5, 45, false, false, false, 0, 0, 0, 0.5), 
						new Box(120, -150, -60, 0, 25, 45), 
						new Box(6, -130, -30, 107, 11, 0), 
						new Box(-85, -95, -150, 15, 15, 15), 
						new PartialBox(6, -100, -140, 70, 5, 25, true, true, true)];

	mapR3 = new Map("#FF5468", [], "mapR2", "mapR4"); 
	mapR3.contains = [ 	new Floor(), 
						new PartialBox(-25, -135, 135, 25, 15, 15, true, true, true), 
						new PartialBox(10, -25, 135, 15, 15, 15, true, true, true), 
						new Box(-150, -95, 85, 15, 15, 15), 
						new PartialBox(-140, -100, -6, 25, 5, 70, true, true, true), 
						new Wall(2), 
						new Box(-30, -130, -6, 0, 11, 107), 
						new Box(35, -80, 0, 10, 70, 150), 
						new Box(-60, -150, -120, 45, 25, 0), 
						new TiltedBox(-26, -37, -156, 45, 5, 15, false, false, false, 0.5, 0, 0, 0.25)];

	mapR4 = new Map("#FF5468", [], "mapR3", "mapR5"); 
	mapR4.contains = [ 	new Floor(), 
						new Blocker(0), 
						new Wall(3)];


	mapR5 = new Map("#FF5468", [], "mapR4_F", "mapR6"); 
	mapR5.contains = [ 	new Floor(), 
						new PartialBox(-5, -85, 70, 5, 65, 70, true, true, true), 
						new Box(-75, -80, 0, 75, 70, 5), 
						new PartialBox(-60, -125, -130, 15, 5, 15, true, true, true)];

	mapR6 = new Map("#FF5468", [], "mapR5_F", "mapR7"); 
	mapR6.contains = [ 	new Floor(), 
						new PartialBox(139, -55, -57, 11, 10, 10, true, true, true), 
						new Box(0, -110, -45, 150, 40, 5), 
						new PartialBox(-80, -110, -115, 15, 15, 15, true, true, true)];

	mapR7 = new Map("#FF5468", [], "mapR6", "mapR5"); 
	mapR7.contains = [ 	new Floor(), 
						new PartialBox(-115, -110, 80, 15, 15, 15, true, true, true), 
						new Box(-45, -110, 0, 5, 40, 150), 
						new PartialBox(-57, -55, -139, 10, 10, 11, true, true, true)];

	mapR4_F = new Map("#FF5468", [], "NaN", "mapR5"); 
	mapR4_F.contains = [new Floor(), 
						new Wall(0), 
						new PartialBox(-70, -85, -5, 70, 65, 5, true, true, true), 
						new PartialBox(130, -125, -60, 15, 5, 15, true, true, true), 
						new Box(0, -80, -75, 5, 70, 75)];

	mapR5_F = new Map("#FF5468", [], "mapR5", "mapR6"); 
	mapR5_F.contains = [new Floor(), 
						new Box(45, -110, 0, 5, 40, 150), 
						new PartialBox(-70, -75, 5, 15, 75, 15, true, true, true), 
						new PartialBox(110, -135, -85, 15, 15, 15, true, true, true)];


	mapMT = new Map("#FFFFFF", [], "mapMT", "mapMT"); 
	mapMT.contains = [	new Floor(),
						new Custom(0, 0, 0, [	[[15, 15, 15], [0, 0, 0], [30, 0, 30], "#0F0"],
												[[0, 0, 0], [-15, 0, 0], [-15, 0, -15], "#0F5"]])];
}