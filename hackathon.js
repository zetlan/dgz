/*problems I did for a hackathon.
*/


/**
 * Viable Vaccines
 * Print the number of vaccines away from N that it is possible to buy.
 */



 function viableVaccines(input) {
    var pfizerBox;
    var modernaBox;

    //nested functions because I want my code to take only one large function. Fun.
    function numVaccinesFromBoxes(pfizer, moderna) {
        return (pfizer * pfizerBox) + (moderna * modernaBox);
    }

    function updateBestGuess(n, combination) {
        //if the new n is closer to the goal
        if (Math.abs(goalN - n) < Math.abs(goalN - closestN)) {
            closestN = n;
            closestCombination = combination;
        }
    }

    //Enter your code here
    //turn into 3 numbers
    //console.log(input.constructor.name)
    input = input.replace("\n", " ");
    input = input.split(" ");
    var goalN = input[0];
    pfizerBox = input[1];
    modernaBox = input[2];
    
    //if he has up to two purchases of either, he can get half the vaccines in a box.
    //Since half of 2 is 1, the only extra thing this does is allow buying of 0.5 boxes
    var maxBoxes = 1000
    
    //first fill up with pfizer boxes
    var startPfi = 0
    
    //will give slightly higher than the actual n
    startPfi = Math.ceil(goalN / pfizerBox);
    
    //in [pfizer, moderna] form
    var closestCombination = [startPfi, 0];
    var closestN = numVaccinesFromBoxes(startPfi, 0);
    //loop downwards, slowly replacing the pfizer with moderna. Once you reach 0, you're done
    var lastNum = numVaccinesFromBoxes(startPfi, 0);
    var thisNum;
    for (var p=startPfi-1; p>=0; p-= 0.5) {
        //go until the distance starts increasing
        var m = 0;
        while ((m <= maxBoxes) && (m < 2 || Math.abs(goalN - thisNum) < Math.abs(goalN - lastNum))) {
            lastNum = thisNum;
            thisNum = numVaccinesFromBoxes(p, m);
            updateBestGuess(thisNum, [p, m]);
            m += 0.5;
        }
    }

    console.log(Math.abs(goalN - closestN));
} 


/**
 * Procrastination Preparation
 * there are N videos
 * each video has a certain number of knowledge points
 * can only watch K videos, where K < N
 * first line has integers N and K, next lines have knowledge points for all videos
 * print the best number of knowledge points thtat you can get
 */

//I can't believe I spent so long on a problem that was just number
 function procrastinationPreparation(input) {
    //split into lines
    input = input.split("\n");
    var [numVideos, numWatchable] = input[0].split(" ");
    var bestKnowledgePoints = 0;
    var pointsArr = [];

    //making points
    for (var h=1; h<=numVideos; h++) {
        pointsArr.push(+input[h]);
    }
     
    //loop for watchable videos number of times
    var maxVal = -1;
    for (var l=0; l<numWatchable; l++) {
        //get the max value
        maxVal = pointsArr.reduce((a, b) => {return Math.max(a, b);});
        //pop that off and add to best
        
        bestKnowledgePoints += maxVal;
        pointsArr.splice(pointsArr.indexOf(maxVal), 1);
    }

    console.log(bestKnowledgePoints);
}

/**
 * there are a set of coordinates
 * how many triangles can be created with the points?
 */
function triangleTracking(input) {
    function areaOfTriangle(p1, p2, p3) {
        return 0.5 * ((p1[0] - p2[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p2[1]));
    }
    //first line is just number
    input = input.split("\n");
    num = input.splice(0, 1);
    var coords = input.map((a) => {return a.split(" ");});
    coords = coords.map(a => {return [+a[0], +a[1]];});

    while (coords.length > num) {
        coords.pop();
    }

    var numTriangles = 0;

    //get all possible triangles
    function combinations(array) {
        return new Array(1 << array.length).fill().map((e1, i) => array.filter((e2, j) => i & 1 << j));
    }
      
    var allTris = combinations(coords).filter(a => a.length == 3);
    allTris = allTris.filter(a => areaOfTriangle(a[0], a[1], a[2]) != 0);


    console.log(allTris.length);
}

/**
 * figure out the minimum number of new roads needed to connect any anthill to any other anthill
 * first line contains two numbers in format [num of anthills, num of pre-existing roads] 
 * next lines contain road data in format [start anthill, end anthill]
 */

function colonyCounting(input) {
    input = input.split("\n");
    input = input.map(a => a.split(" "));
    input = input.map(a => [+a[0], +a[1]]);

    var numColonies = input[0][0];
    var numRoadsAlready = input[0][1];

    while(input.length > numRoadsAlready + 1) {
        input.pop();
    }

    //figure out number of groups
    var groups = [];
    for (var c=1; c<=numColonies; c++) {
        groups.push([c]);
    }

    //pre-existing roads will connect groups
    for (var r=1; r<input.length; r++) {
        //get the groups that the start and end are in
        var startGroup = -1;
        var endGroup = -1;

        for (var x=0; x<groups.length; x++) {
            if (groups[x].indexOf(input[r][0]) != -1) {
                startGroup = x;
            }

            if (groups[x].indexOf(input[r][1]) != -1) {
                endGroup = x;
            }
        }

        
        if (startGroup == -1 || endGroup == -1) {
            console.log(`HISSS`);
        }

        //if they're different groups, then merge them into one group
        if (startGroup != endGroup) {
            while (groups[endGroup].length > 0) {
                groups[startGroup].push(groups[endGroup].pop());
            }
            groups.splice(endGroup, 1);
        }
    }

    //each new road can only ever connect one group to one other group. Therefore, the number of new roads needed is the number of groups - 1
    console.log(groups.length - 1);
}

/**
 * Interesting Information
 * given a phrase and a keyword, remove all instances of the keyword. As you delete them, more may appear. Delete those as well.
 * Example: given thirtybabanknkbansk, bank, print thirtybansk
 */

function interestingInformation(input) {
    input = input.split("\n");
    //first line is phrase
    var phrase = input[0];
    var keyword = input[1];

    var re = new RegExp(phrase);
    while (phrase.includes(keyword)) {
        phrase = phrase.replace(re, "");
    }
    
    /*
    for (var c=0; c<phrase.length; c++) {
        //if found the string, delete it
        if (phrase.substring(c, c+keyword.length) == keyword) {
            phrase = phrase.substring(0, c) + phrase.substring(c+keyword.length);
            //back up so you don't miss things
            c = Math.max(c - keyword.length + 1, 0);
        }
    } */
    console.log(phrase);
}

/**
 * Transport Task
 * given two coordinates, find the difference (rounded to hundreds place) between manhattan distance and straight-line distance
 */

function transportTask(input) {
    input = input.split("\n");
    input = input.map(a => a.split(" "));
    var coords1 = [+input[0][0], +input[0][1]];
    var coords2 = [+input[1][0], +input[1][1]];

    var dist = Math.sqrt((coords1[0] - coords2[0]) ** 2 + (coords1[1] - coords2[1]) ** 2);
    var manhattanDist = Math.abs(coords1[0] - coords2[0]) + Math.abs(coords1[1] - coords2[1]);

    console.log(Math.round(Math.abs(dist - manhattanDist) * 100) / 100);
}

/**
 * Diet difficulty
 * given a spreadsheet in [day, calories, sugar grams, fat grams], identify the day that minimizes the numbers according to certain rules
 * calories are more important than sugar, sugar is more important than fat
 * (prioritize fewer calories, in case of a tie use other numbers)
 * 
 */
function dietDifficulty(input) {
    input = input.split("\n");
    var numLines = +input.splice(0, 1);
    input = input.map(a => a.split(" "));
    input = input.map(a => [+a[1], +a[2], +a[3]]);

    while (input.length > numLines) {
        input.pop();
    }

    //get rows with fewest calories
    var fewest = [1e1001, 1e1001, 1e1001];
    var fewestIndex = -1;

    //yeah this one's a mess of hardcoded logic. Oh well, it's fast.
    for (var a=0; a<input.length; a++) {
        
        var shouldReplaceA = input[a][0] < fewest[0];
        var shouldReplaceB = (input[a][0] == fewest[0]) && (input[a][1] < fewest[1]);
        var shouldReplaceC = (input[a][0] == fewest[0]) && (input[a][1] == fewest[1]) && (input[a][2] < fewest[2]);
        //console.log(input[a], fewest, shouldReplaceA, shouldReplaceB, shouldReplaceC);
        if (shouldReplaceA || shouldReplaceB || shouldReplaceC) {
            fewestIndex = a;
            fewest = input[a]
        }
    }
    console.log(fewestIndex);
}

/**
 * Route Reroutes
 * ben is trying to go to location B from location A
 * there are multiple roads with different factors
 * print cheapest path from start to end
 * 
 * given first line in [number of locations, final location, number of paths]
 * roads in [start location, end location, price]
 * 
 * EXAMPLE:
 * given 
 * 3 2 3
 * 1 3 5
 * 3 2 7
 * 1 2 13
 * print
 * 1 3 2
 */
//UNFINISHED
function routeReroutes(input) {
    //turn input into something useful
    input = input.split("\n");
    input.map(a => a.split(" "));
    input.map(a => [+a[0], +a[1], +a[2]]);

    var [numLocations, finalLocation, numPaths] = input.splice(0, 1);
    // I guess? This part isn't particularly clear
    var startLocation = 1; 

    while (input.length > numPaths) {
        input.pop();
    }

    //create linkage
    var paths = [];
    for (var g=0; g<numLocations; g++) {
        paths.push([]);
    }
    input.forEach(p => {
        //append each path
        paths[p[0]-1].push([p[1]-1, p[2]]);
    });

    //now that the data structure is created, run dijkstra on it to figure out the best path 
    var parents = {};
    parents[""+0] = "end";
    wilderness = [[0, 0]];


}



/**
 * Running Race
 * Runners are running, at certain speeds, but don't want to pass each other.
 * Given a first line of [num runners, final time] and all other lines as runners in [starting position, speed]
 * figure out how many groups of blocked runners there will be at the final time.
 */
function runningRace(input) {
    input = input.split("\n");
    input = input.map(a => a.split(" "));
    input = input.map(a => [+a[0], +a[1]]);

    var numRunners = input[0][0];
    var finalTime = input[0][1];
    input.splice(0, 1);

    while (input.length > numRunners) {
        input.pop();
    }
    var runners = input;

    //apply time
    runners.forEach(r => {
        r[0] += r[1] * finalTime;
    });
    for (var y=runners.length-2; y>-1; y--) {
        //if two runners have swapped, put the faster runner back
        if (runners[y][0] > runners[y+1][0]) {
            runners[y][0] = runners[y+1][0];
        }
    }

    //console.log(runners);

    var numGroups = 0;
    var lastPos = -1;
    //count number of groups
    runners.forEach(r => {
        if (r[0] != lastPos) {
            lastPos = r[0];
            numGroups += 1;
        }
    });

    console.log(numGroups);
}


/**
 * EGG
 */

function projectPredictions(input) {
    var boardSize = 8;
    var eggIsSafe = true;
    //convert input
    input = input.split("\n");
    if (input.length > 8) {
        input.pop();
    }

    function squareIsSafe(board, startX, startY) {
        //check all 8 directions

        //left
        for (var x=startX; x>-1; x--) {
            if (board[startY][x] == "D") {
                x = -1;
            }
            if (board[startY][x] == "R") {
                return false;
            }
        }

        //right
        for (var x=startX; x<boardSize; x++) {
            if (board[startY][x] == "D") {
                x = boardSize;
            }
            if (board[startY][x] == "R") {
                return false;
            }
        }

        //top
        for (var y=startY; y>-1; y--) {
            if (board[y][startX] == "D") {
                y = -1;
            }
            if (board[y][startX] == "R") {
                return false;
            }
        }

        //bottom
        for (var y=startY; y<boardSize; y++) {
            if (board[y][startX] == "D") {
                y = -1;
            }
            if (board[y][startX] == "R") {
                return false;
            }
        }

        //diagonals
        var doLower = true;
        var doUpper = true;
        //left
        var offset;
        for (var x=startX; x>-1; x--) {
            var lowerY = startY - Math.abs(startX - x);
            var upperY = startY + Math.abs(startX - x);
            if (lowerY < 0) {
                doLower = false;
            }

            if (upperY > boardSize - 1) {
                doUpper = false;
            }

            if (doLower) {
                if (board[lowerY][x] == "D") {
                    doLower = false;
                }
                if (board[lowerY][x] == "B") {
                    return false;
                }
            }

            if (doUpper) {
                if (board[upperY][x] == "D") {
                    doUpper = false;
                }
                if (board[upperY][x] == "B") {
                    return false;
                }
            }
        }

        for (var x=startX; x<boardSize; x++) {
            var lowerY = startY - Math.abs(startX - x);
            var upperY = startY + Math.abs(startX - x);
            if (lowerY < 0) {
                doLower = false;
            }

            if (upperY > boardSize - 1) {
                doUpper = false;
            }

            if (doLower) {
                if (board[lowerY][x] == "D") {
                    doLower = false;
                }
                if (board[lowerY][x] == "B") {
                    return false;
                }
            }

            if (doUpper) {
                if (board[upperY][x] == "D") {
                    doUpper = false;
                }
                if (board[upperY][x] == "B") {
                    return false;
                }
            }
        }

        return true;
    }

    //find egg
    var ePos = [-1, -1];
    for (var x=0; x<boardSize; x++) {
        for (var y=0; y<boardSize; y++) {
            if (board[y][x] == "E") {
                ePos = [x, y];
            }
        }
    }

    eggIsSafe = squareIsSafe(input, )

    console.log(eggIsSafe ? "SAFE" : "NOT SAFE");
}