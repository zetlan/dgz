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
    defaultMap = new Map("#44A", []);
    defaultMap.contains = [ new Floor(), 
                            new Cube(0.7 * mapSize, nF, nH, 15),
                            new Wall(0, 0, pF * 0.166666, 10, pF, pF * 0.833333)];

    mapR1 = new Map("#45B", []);
    mapR1.contains = [  new Floor(),
                        new Wall(0, 0, 0, pF * 0.6666666, pF, 10)]
    
}