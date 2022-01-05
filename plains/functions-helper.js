//houses functions of various utility, from 3d rendering to 2d drawing to misc. object manipulation

/* 
generation functions:
	
utility:
	avgArray();
	editor_createObject();
	generateStarSphere();
	randomCustom();
	randomSeeded();
	readWorldFile();
	runCrash();
	selectPoly();
	snapTo();
*/


//utility functions

//takes in a 2-dimensional array and averages the elements to output a 1d array
function avgArray(array) {
	var finArr = [];
	var arr = array;

	//get the length of the first 1d array
	for (var y=0;y<arr[0].length;y++) {
		//average all the 0s, the 1s, the 2s, etc until whole is done
		finArr.push(0);
		for (var z=0;z<arr.length;z++) {
			finArr[y] += arr[z][y];
		}
	}

	//divide numbers by the amount of 1d arrays
	for (var d=0;d<finArr.length;d++) {
		finArr[d] /= arr.length;
	}
	

	return finArr;
}

function data_createObject(data) {
	switch (data[0]) {
		case "FRP":
			return new FreePoly(JSON.parse(data[1]), data[2]);
		case "WLX":
			return new WallX(data[1] * 1, data[2] * 1, data[3] * 1, data[4] * 1, data[5] * 1, data[6]);
		case "WLY":
			return new WallY(data[1] * 1, data[2] * 1, data[3] * 1, data[4] * 1, data[5] * 1, data[6]);
		case "WLZ":
			return new WallZ(data[1] * 1, data[2] * 1, data[3] * 1, data[4] * 1, data[5] * 1, data[6]);
		case "BOX":
			return new Box(data[1] * 1, data[2] * 1, data[3] * 1, data[4] * 1, data[5] * 1, data[6] * 1, data[7]);
	}
}

function editor_createObject(ID) {
	var rP = polToCart(player.theta, player.phi, 5);
	rP = [player.x + Math.round(rP[0]), player.y + Math.round(rP[1]) - 2, player.z + Math.round(rP[2])];
	var theObject;
	switch (ID) {
		case 0:
			theObject = new FreePoly([[rP[0], rP[1], rP[2]], [rP[0], rP[1], rP[2] + 5], [rP[0] + 5, rP[1], rP[2]]], color_editor_defaultPoly);
			break;
		case 1:
			theObject = new WallZ(rP[0], rP[1], rP[2], 5, 5, color_editor_defaultPoly);
			break;
		case 2:
			theObject = new WallY(rP[0], rP[1], rP[2], 5, 5, color_editor_defaultPoly);
			break;
		case 3:
			theObject = new WallX(rP[0], rP[1], rP[2], 5, 5, color_editor_defaultPoly);
			break;
		case 4:
			break;
	}
	if (theObject != undefined) {
		loading_world.addFormally(theObject);
	}
}

function generateStarSphere() {
	for (var e=0;e<star_number;e++) {
		var pos = polToCart(
			randomSeeded(0, Math.PI * 2),
			Math.acos(randomSeeded(-1, 1)) - (Math.PI / 2), 
			randomSeeded(star_distance[0], star_distance[1])
		);
		stars.push(new Star(pos[0], pos[1], pos[2]));
	}
}

function mergeIdenticalWorldPoints() {
	world_pointStorage = [];

	//loop through all objects in the world
	loading_world.meshes.forEach(m => {
		m.objects.forEach(h => {
			mergeIdenticalPolyPoints(h);
		});
	});
}

function mergeIdenticalPolyPoints(polygon) {
	//add each individual face
	if (polygon.faces != undefined) {
		polygon.faces.forEach(f => {
			mergeIdenticalPolyPoints(f);
		});
		return;
	}

	//adding points
	for (var p=0; p<polygon.points.length; p++) {
		//get code for ordering
		var pCode = polygon.points[p][0] + polygon.points[p][1] + polygon.points[p][2];
		//loop through points
		var low = 0;
		var high = world_pointStorage.length;

		var indexObj;
		var compareCode;
		while (low < high) {
			indexObj = world_pointStorage[Math.floor((low + high) / 2)];
			compareCode = indexObj[0] + indexObj[1] + indexObj[2];
			if (compareCode < pCode) {
				low = Math.floor((low + high) / 2) + 1;
			} else {
				high = Math.floor((low + high) / 2);
			}
		}

		if (world_pointStorage[low] == undefined || (world_pointStorage[low][0] != polygon.points[p][0] || world_pointStorage[low][1] != polygon.points[p][1] || world_pointStorage[low][2] != polygon.points[p][2])) {
			world_pointStorage.splice(low, 0, polygon.points[p]);
		} else {
			//if the point is identical, merge them
			polygon.points[p] = world_pointStorage[low];
		}
		
	}
}

//returns a random value between the min value and max values, using the default javascript randomizer
function randomCustom(min, max) {
	return (Math.random() * (max - min)) + min;
}

//returns a pseudo-random value between the min value and max values
function randomSeeded(min, max) {
	loading_randVal = Math.pow(loading_randVal, 1.6414756);
	//keep value in bounds
	while (loading_randVal > 100) {
		loading_randVal -= 98;
	}
	return ((loading_randVal % 1) * (max - min)) + min;
}

function readWorldFile() {
	var fileText;
	fetch('worlds.txt').then(response => response.text()).then(text => {
		fileText = text.split("\n");
		var appendWorld;
		var appendMesh;
		fileText.forEach(l => {
			//split each line into arguments to determine what to do
			var splitTag = l.split("~");

			//only do if the tag is real
			if (splitTag.length > 1) {
				//creating different types of objects
				switch (splitTag[0]) {
					case "WORLD":
						//world creation

						//if there's a previous world, make sure that world's tree gets generated
						if (appendWorld != undefined) {
							appendWorld.generateBinTree();
						}

						appendWorld = new World(splitTag[1], splitTag[2]);
						world_listing.push(appendWorld);
					case "MESH":
						//if a mesh already exists, append that
						if (appendMesh != undefined) {
							appendWorld.meshes.push(appendMesh);
						}
						//create new mesh object
						appendMesh = new Mesh(splitTag[1]);
						break;
					default:
						appendMesh.objects.push(data_createObject(splitTag));
						break;

				}
			}
		});
		//if a mesh is in use, append it
		if (appendMesh != undefined) {
			appendWorld.meshes.push(appendMesh);
		}

		appendWorld.generateBinTree();
		loading_world = world_listing[0];
	});
}


function runCrash() {
	ctx.fillStyle = "#F0F";
	ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
	ctx.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);

	ctx.fillStyle = "#000";
	ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
	ctx.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

	window.cancelAnimationFrame(game_animation);
}

function selectPoly(startPolygon) {
	//selects the polygon that the cursor is over

	//return undefined if the specifications for the node aren't valid
	if (startPolygon == undefined || startPolygon.constructor.name == "TreeBlob") {
		return undefined;
	}

	//get traversal order
	var reverse = startPolygon.isBackwards();
	var test;

	if (!reverse) {
		test = selectPoly(startPolygon.inObj);
		if (test != undefined) {
			return test;
		}
	} else {
		test = selectPoly(startPolygon.outObj);
		if (test != undefined) {
			return test;
		}
	}

	//determine what projected polygon looks like
	var points = startPolygon.contains.points;
	var tempPoints = [];
	tempPoints[points.length-1] = spaceToRelative(points[points.length-1], [player.x, player.y, player.z], [player.theta, player.phi]);
	for (var p=0; p<points.length-1; p++) {
		tempPoints[p] = spaceToRelative(points[p], [player.x, player.y, player.z], [player.theta, player.phi]);
	}
	tempPoints = clipToZ0(tempPoints, render_clipDistance, false);
	if (tempPoints.length > 2) {
		for (p=0; p<tempPoints.length; p++) {
			tempPoints[p] = cameraToScreen(tempPoints[p]);
		}
		if (inPoly([cursor_x, cursor_y], tempPoints)) {
			//if the cursor is inside the projected polygon, return that
			return startPolygon.contains.parent || startPolygon.contains;
		}
	}

	if (reverse) {
		test = selectPoly(startPolygon.inObj);
		if (test != undefined) {
			return test;
		}
	} else {
		test = selectPoly(startPolygon.outObj);
		if (test != undefined) {
			return test;
		}
	}
}

function setStylePreferences() {
	ctx.lineWidth = 2;
	ctx.lineJoin = "bevel";
}

function snapTo(value, snapInterval) {
	return Math.round(value / snapInterval) * snapInterval;
}