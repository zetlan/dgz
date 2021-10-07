


//takes in a size and the position of the different generators, and outputs a shuffled puzzle.
function generatePuzzle(sizeN, generatorPositions) {
    var n = sizeN;
    //the puzzle object that this function will create
    var puzz = new Puzzle();

    //initialize to empty array
    var data = [];
    for (var r=0; r<n; r++) {
        data.push([]);
        data[r].push(undefined)
    }

    //choose start value
    var primNodes = [[startX, startY]];
    data[primNodes[0][1]][primNodes[0][0]] = {
        connect: [false, false, false, false]
    }
    while (primNodes.length > 0) {
        //choose a random node
        var nChooseI = Math.floor(Math.random() * primNodes.length);
        var nChooseC = primNodes[nChooseI];

        //choose a random available direction
        /*
           1
        2     0
           3
        */
        //get available directions
        var dirRelate = [[1, 0], [0, -1], [-1, 0], [0, 1]]
        var dirs = [0, 1, 2, 3];
        for (var a=0; a<dirs.length; a++) {
            if (!this.nodeIsAvailable(nChooseC[0] + dirRelate[dirs[a]][0], nChooseC[1] + dirRelate[dirs[a]][1])) {
                dirs.splice(a, 1);
                a -= 1;
            } 
        }
        //get number of already made connections
        var connectNums = this.data[nChooseC[1]][nChooseC[0]].connect.reduce((a, b) => a + b);

        //if no directions are available, or self has made too many connections, remove node from the list
        if (dirs.length == 0 || connectNums > 2) {
            primNodes.splice(nChooseI, 1);
        } else {
            //choose a random available direction
            var dirChoose = Math.floor(Math.random() * dirs.length);
            var index = dirs[dirChoose];

            var baseX = nChooseC[0];
            var baseY = nChooseC[1];
            var offX = dirRelate[index][0];
            var offY = dirRelate[index][1];

            //create node in that space
            //these few lines are terrifying and should be abstracted
            this.data[baseY + offY][baseX + offX] = {
                connect: [false, false, false, false]
            }

            //connect to the node and add to queue
            this.data[baseY][baseX].connect[index] = true;
            this.data[baseY + offY][baseX + offX].connect[(index + 2) % 4] = true;
            primNodes.push([baseX + offX, baseY + offY]);
        }
    }

    //go through and convert connections to node objects
    for (var y=0; y<n; y++) {
        for (var x=0; x<n; x++) {
            //null checking, just in case
            if (data[y][x] != undefined) {
                //convert booleans to string
                var strStruct = "";
                var rotation = Math.floor(Math.random() * 4) * Math.PI * 0.5;
                data[y][x].connect.forEach(b => {
                    strStruct += (b * 1);
                });
                //order the string correctly
                var timeout = 5;
                while (strStruct.substring(0, 2) != "01" && timeout > 0) {
                    timeout -= 1;
                    strStruct = strStruct[3] + strStruct.substring(0, 3);
                    //for auto-solving
                    //rotation -= (Math.PI / 2);
                }

                //create final structure
                data[y][x] = {
                    isChip: strStruct.match(/1/g).length == 1,
                    rotation: rotation,
                    rotDir: 0,
                    connections: strStruct,
                    data: undefined,
                }
            }
        }
    }

    //make sure to make the starting nodes into generators
    for (var g=0; g<generatorPositions.length; g++) {
        data[generatorPositions[g][1]][generatorPositions[g][0]].isChip = true;
        this.data[generatorPositions[g][1]][generatorPositions[g][0]].data = ["generator", g];
    }

    return puzz;
    
}