
var exceptSurfaces = ["/", undefined, "Q", "R", "Z"];
var constrainSurfaces = ["/", undefined];

var squareSize = 40;
/*Maps are stored as objects. First all the attributes about the map are stored in these variables, then the actual map is defined.
LoadingMap is a reference to the actual map. */

class Map {
    constructor(data, pallete, name, exits, enemies, statics) {
        this.data = data;
        this.pallete = pallete;
        this.name = name;
        this.exits = exits;
        this.enemies = enemies;
        this.statics = statics;
    }
}

var homeData = [["A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "A", "A", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "0", "0", "0", "0", "0", "0", "A"],
            ["A", "A", "A", "1", "A", "A", "A", "A", "/", "/"]];

var homeExits = [["selya", [3 * squareSize, -8 * squareSize]]];

let home = new Map(homeData, 2, "home", homeExits, [], []);

//the position of the loadingMap variable is awkward, but it needed to be here for the calculations that are being done later
var loadingMap = home;

var selyaData = [  ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
                   ["A", "i", "B", "0", "0", "0", "0", "0", "0", "D", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "B", "0", "0", "i", "i", "i", "0", "D", "0", "0", "0", "0", "0", "0", "S", "0", "0", "0", "1"],
                   ["A", "0", "B", "0", "0", "i", "/", "i", "0", "D", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "1"],
                   ["A", "0", "B", "0", "0", "i", "4", "i", "0", "D", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "B", "0", "0", "0", "0", "0", "0", "D", "0", "0", "0", "0", "S", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "B", "0", "0", "0", "0", "0", "0", "D", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "F", "E", "E", "E", "E", "E", "R", "I", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "A", "A", "A", "A", "A", "0", "0", "A", "A", "A", "0", "G", "C", "C", "C", "H", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A", "0", "B", "0", "0", "0", "D", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A", "0", "B", "0", "0", "0", "D", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A", "0", "B", "0", "0", "0", "D", "A"],
                   ["A", "0", "0", "0", "0", "i", "i", "i", "0", "0", "0", "0", "0", "A", "0", "F", "E", "R", "E", "I", "A"],
                   ["A", "0", "0", "0", "0", "i", "/", "i", "0", "0", "0", "0", "0", "A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "i", "3", "i", "0", "0", "0", "0", "0", "A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A", "0", "S", "0", "0", "0", "0", "A"],
                   ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "2", "2", "A", "A"]];


var selyaExits = [    ["rightMap", [-1 * (selyaData[0].length * squareSize), 0]], 
                      ["downMap", [-14 * squareSize, -1 * selyaData.length * squareSize]],
                      ["potionShop", [-3 * squareSize, -14 * squareSize]],
                      ["home", [-3 * squareSize, 8 * squareSize]]];

var selyaEnemies = [new Ground(squareSize, squareSize*3, 10, 10, 1),
                    new Enemy(squareSize, squareSize*6, 10, 10, 1),
                    new Chatter(squareSize, squareSize*13)];
                      
var selyaStatics = [new Box(squareSize*1, squareSize*1),
                    new House(squareSize*6, squareSize*3),
                    new House(squareSize*6, squareSize*15)];

let selya = new Map(selyaData, 1, "selya", selyaExits, selyaEnemies, selyaStatics);
                      

var rightMapData = [   ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["1", "0", "0", "S", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "S", "0", "Z", "0", "S", "Z", "A"],
                   ["1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "S", "0", "Z", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "Z", "0", "2"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "S", "0", "0", "0", "0", "0", "Z", "0", "0", "Z", "0", "2"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "Z", "Z", "S", "Z", "2"],
                   ["A", "0", "0", "0", "0", "0", "0", "S", "0", "0", "0", "0", "0", "0", "0", "0", "S", "Z", "0", "Z", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "S", "0", "0", "0", "0", "S", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "S", "Z", "A"],
                   ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"]];

var rightMapExits = [["selya", [(selyaData[0].length * squareSize), 0]],
                     ["stoneEntrance", [-1 * (rightMapData[0].length * squareSize), -2 * squareSize]]];

var rightMapEnemies = [new Ground(160, 60, 7, 5, 1),
                       new Ground(160, 120, 20, 50, 1),
                       new Ground(160, 180, 7, 5, 1),
                       new Ground(160, 240, 7, 5, 1)];

var rightMapStatics = [];

let rightMap = new Map(rightMapData, 1, "rightMap", rightMapExits, rightMapEnemies, rightMapStatics);

var downMap = [    ["A", "A", "A", "1", "1", "A", "A", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "A", "A", "A", "A", "A", "A", "A", "downMap"]];

var downMapData =     [1, 
                      ["selya", [14 * squareSize, selya.length * squareSize]]];

var shopData = [["A", "A", "A", "1", "A", "A", "A", "A"],
                ["A", "0", "0", "0", "0", "0", "0", "A"],
                ["A", "0", "0", "0", "0", "0", "0", "A"],
                ["A", "0", "0", "0", "0", "0", "0", "A"],
                ["A", "0", "0", "0", "0", "0", "0", "A"],
                ["A", "0", "0", "0", "0", "0", "0", "A"],
                ["A", "0", "0", "0", "0", "0", "0", "A"],
                ["A", "A", "A", "A", "A", "A", "A", "A"]];

var shopExits = [["selya", [3 * squareSize, 14 * squareSize]]];

var shopEnemies = [ new NPC(squareSize * 2, squareSize * 5, 0, hyperColor, shopText), 
                    new NPC(squareSize * 6, squareSize * 5, 0, hyperColor, questText)];

var shopStatics = [];

let potionShop = new Map(shopData, 2, "potionShop", shopExits, shopEnemies, shopStatics);

var stoneEntrance = [["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "A"],
                   ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "stoneEntrance"]];

var stoneEntranceData =[3, 
                      ["rightMap", [1 * (rightMap[0].length * squareSize), 2 * squareSize]],
                      ["stoneEntrance", [-1 * (rightMap[0].length * squareSize), -2 * squareSize]],
                      "entities",
                      new Ground(160, 60, 10, 10, 1),
                      new Ground(160, 120, 15, 50, 1),
                      new Ground(160, 180, 10, 10, 1),
                      new Ground(160, 240, 10, 10, 1)];