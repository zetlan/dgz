let menuMap;
let defaultMap;
let mapR1;
let mapR1_F;
let mapR2;

let mapE1;

//all the map generation is inside a function so I can control when they're defined
//numbers in terms of mapSize for quick reference

function initMaps() {
	//defining some numbers in terms of mapSize for quick reference
	var pH = 0.5 * mapSize;
	var nH = -0.5 * mapSize;
	var pF = mapSize;
	var nF = -1 * mapSize;

	menuMap = new Map("#AAAAFF", [], "mapE1", "defaultMap");
	menuMap.contains = [new Floor(),
						new partialWall(0, 0, nF, pF, pF, 1, true, true, true),
						new Text("Press X or L to Rotate")];
	
	defaultMap = new Map("#A08060", [], "menuMap", "mapR1");
	defaultMap.contains = [ new Floor(),
							new Cube(0.7 * mapSize, nF, nH, 15),
							new Cube(nH, 0, 0, 15),
							new partialWall(nF, 0, 0, 1, pF, pF, true, true, true),
							new Box(0, 0, 0, 10, pF, pF * 0.6666666),
							new Wall(0, -0.75 * pF, pF * 0.8333333, 10, 0.25 * pF, 0.16666 * pF),
							new Text(["Use WASD or arrow keys to move"])];

	mapR1 = new Map("#A08060", [], "defaultMap", "mapR2"); 
	mapR1.contains = [	new Floor(),
						new Cube(0, 0, 75, 15),
						new Box(0, 0, 0, 100, 150, -10),
						new Wall(pF * 0.83333, -0.75 * pF, 0, 0.166666 * pF, 0.25 * pF, 10),
						new Cube(-75, -150, -105, 15),
						new Text(["Press Z or K to Counter-Rotate"])];
	
	mapR1_F = new Map("#A08060", [], "defaultMap", "mapR2"); 
	mapR1_F.contains = [	new Floor(),
							new Cube(0, 0, 75, 15),
							new Box(0, 0, 0, 100, 150, -10),
							new Cube(-75, -150, -105, 15),
							new Text(["Dont't take the world for granted"])];

	mapR2 = new Map("#A08060", [], "mapR1_F", NaN); 
	mapR2.contains = [	new Floor(),
						new Box(0, 0, 0, -10, 150, -100),
						new Cube(-105, -150, 75, 15)];

	
}