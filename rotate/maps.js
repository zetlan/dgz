let defaultMap;
let mapR1;
let menuMap;

//all the map generation is inside a function so I can control when they're defined
//numbers in terms of mapSize for quick reference

function initMaps() {
	//defining some numbers in terms of mapSize for quick reference
	var pH = 0.5 * mapSize;
	var nH = -0.5 * mapSize;
	var pF = mapSize;
	var nF = -1 * mapSize;

	//menuMap = new Map("#A08060", [], NaN, "defaultMap");
	//menuMap.contains = [new Text(["Vision", "press X to start"])];
	
	defaultMap = new Map("#A08060", [], NaN, "mapR1");
	defaultMap.contains = [ new Floor(),
							new Text(["Use WASD or arrow keys to move"]), 
							new Cube(0.7 * mapSize, nF, nH, 15),
							new Cube(nH, 0, 0, 15),
							new Wall(0, 0, 0, 10, pF, pF * 0.6666666)];

	mapR1 = new Map("#A08060", [], "defaultMap", NaN); 
	mapR1.contains = [	new Floor(),
						new Cube(0, 0, 75, 15),
						new Wall(0, 0, 0, 100, 150, -10),
						new Cube(-75, -150, -105, 15),
						new Text("Use WASD or arrow keys to move")];
}