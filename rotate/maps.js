let defaultMap;

//all the map generation is inside a function so I can control when they're defined
function initMaps() {
    defaultMap = new Map("#44A", []);
    defaultMap.contains = [ new Floor(), 
                            new Cube(0.7 * mapSize, -1 * mapSize, -0.5 * mapSize, 15), 
                            new Wall(mapSize * 0.5, 0, mapSize * 0.166666, 10, mapSize, mapSize * 0.833333)];
}