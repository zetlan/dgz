let defaultMap;

//all the map generation is inside a function so I can control when they're defined
function initMaps() {
    defaultMap = new Map("#44A", [new Floor(), new Cube(mapSize, -100, -1 * mapSize, 15)]);
}