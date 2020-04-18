let defaultMap;
let mapR1;

//all the map generation is inside a function so I can control when they're defined
//numbers in terms of mapSize for quick reference

function initMaps() {
	//defining some numbers in terms of mapSize for quick reference
	var pH = 0.5 * mapSize;
	var nH = -0.5 * mapSize;
	var pF = mapSize;
	var nF = -1 * mapSize;

	menuMap = new Map("#A08060", [], NaN, "defaultMap");
	menuMap.contains = [new Text(["Vision", "press X to start"])];
	
	defaultMap = new Map("#A08060", [], NaN, "mapR1");
	defaultMap.contains = [ new Floor(),
							new Text(["Use WASD or arrow keys to move"]), 
							new Cube(0.7 * mapSize, nF, nH, 15),
							new Wall(0, 0, 0, 10, pF, pF * 0.6666666)];

	mapR1 = new Map("#4050B0", [], "defaultMap", NaN);
	mapR1.contains = [  new Floor(),
						new Text(["Use Z to rotate backwards"]),
						new Wall(0, 0, 0, pF * 0.6666666, pF, 10)];
	
}