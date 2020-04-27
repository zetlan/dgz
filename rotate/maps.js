let menuMap;
let defaultMap;
let mapDef_F;
let mapR1;
let mapR1_F;
let mapR2;
let mapR2_F;

let mapE1;

//all the map generation is inside a function so I can control when they're defined
//numbers in terms of mapSize for quick reference

function initMaps() {
	//defining some numbers in terms of mapSize for quick reference
	var pH = 0.5 * mapSize;
	var nH = -0.5 * mapSize;
	var pF = mapSize;
	var nF = -1 * mapSize;

	menuMap = new Map("#A08060", [], NaN, "defaultMap"); 
	menuMap.contains = [new Floor(),
						new Box(-125, -112.5, 0, -25, 37.5, 10),
						new partialBox(0, 0, nF, 150, 150, 1, true, true, true),
						new Box(0, 0, 0, -100, 150, 10),
						new Text("Press X or L to Rotate")];
	
	defaultMap = new Map("#A08060", [], "menuMap", "mapR1");
	defaultMap.contains = [ new Floor(),
							new partialBox(nF, 0, 0, 1, pF, pF, true, true, true),
							new Box(0, 0, 0, 10, pF, pF * 0.6666666),
							new Box(0, -0.75 * pF, pF * 0.8333333, 10, 0.25 * pF, 0.16666 * pF),
							new Text(["Use WASD or arrow keys to move"])];

	mapR1 = new Map("#A08060", [], "mapDef_F", "mapR2"); 
	mapR1.contains = [	new Floor(),
						new Box(0, 0, 0, 100, 150, 10),
						new Box(pF * 0.83333, -0.75 * pF, 0, 0.166666 * pF, 0.25 * pF, 10)];

	mapR2 = new Map("#A08060", [], "mapR1", NaN); 
	mapR2.contains = [		new Floor(),
							new Box(0, 0, 0, 10, 150, 100),
							new Box(0, -112.5, -125, 10, 37.5, 25),
							new Text(["Press Z or K to Counter-Rotate"])];
	
	mapDef_F = new Map("#A08060", [], "menuMap", "mapR1_F");
	mapDef_F.contains = [new Floor(),
						new partialBox(nF, 0, 0, 1, pF, pF, true, true, true),
						new Box(0, 0, 0, 10, pF, pF * 0.6666666),
						new Text(["X or L"])];
	
	mapR1_F = new Map("#A08060", [], "mapDef_F", "mapR2_F"); 
	mapR1_F.contains = [	new Floor(),
							new Box(0, 0, 0, 100, 150, 10)];

	mapR2_F = new Map("#A08060", [], "mapR1_F", NaN); 
	mapR2_F.contains = [	new Floor(),
							new Box(0, 0, 0, 10, 150, 100)];

	

	

	
}