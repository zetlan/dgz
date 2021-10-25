//globals here
window.onload = setup;
// window.addEventListener("keydown", keyPress, false);
// window.addEventListener("keyup", keyNegate, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mouseup", handleMouseUp, false);


//global vars
var animation;
var canvas;
var ctx;

var editor_active = false;

var scale = undefined;

var hypPoints = [];
//parameters for the space, in p q format
var space_params = [7, 3];
var space_recursions = 0;
var space_nodeTree = new WorldTreeNode(space_params[0]);
var space_nodeHash = {};
var space_nodeArray = [];
var space_hash_sigFigs = 2;

var circle_maxComputeR = 10000;
var circle_maxDrawR = 100;


var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;
var cursor_tolerance = 0.3;



//functions

function setup() {
	canvas = document.getElementById("centralStation");
	ctx = canvas.getContext("2d");
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	scale = canvas.height * 0.4;

	updateSpace(7, 3);

	animation = window.requestAnimationFrame(main);
}

function main() {
	//background
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

	ctx.fillStyle = "#404";

	

	//disk
	ctx.globalAlpha = 0.5;
	ctx.beginPath();
	drawCircle(0, 0, scale);
	ctx.stroke();

	//traceHypLine([0.9178121173544146, 5.379869450548097], [0.8596071760922103, 5.379900528557607]);


	
	//reflections
	traceHypGrid(space_recursions, space_nodeTree);
	//reset draw state
	space_nodeArray.forEach(n => {
		n.drawnInFrame = false;
	});

	//cursor stuff
	if (editor_active) {
		var tetsPts = [];
		var a = Math.tan(Math.PI / 2 - Math.PI / space_params[1]);
		var b = Math.tan(Math.PI / space_params[0]);
		var d = Math.sqrt((a - b) / (a + b));

		for (var a=0; a<space_params[0]; a++) {
			tetsPts.push([d, ((Math.PI * 2) / space_params[0]) * a]);
		}
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000";
		traceHypPoly(tetsPts);

		var polarCursorPos = [Math.sqrt(cursor_x ** 2 + cursor_y ** 2) / scale, (Math.atan2(cursor_y, cursor_x) + Math.PI * 2) % (Math.PI * 2)];

		ctx.strokeStyle = "#F0F";
		


		var MLen = (polarCursorPos[0] + (1 / polarCursorPos[0])) / 2;
		var MCenter = polToXY(0, 0, polarCursorPos[1], MLen);
		var OBcirc = [0, 0, polarCursorPos[0]];
		var MOcirc = [MCenter[0], MCenter[1], MLen];
		var intersectPts = intersectionOfTwoCircles(OBcirc, MOcirc);
		var bisectorLine = circleFrom3Points(intersectPts[0], intersectPts[1], hypInvert(intersectPts[0]));

		drawCircle(OBcirc[0] * scale, OBcirc[1] * scale, OBcirc[2] * scale);
		ctx.stroke();
		drawCircle(MOcirc[0] * scale, MOcirc[1] * scale, MOcirc[2] * scale);
		ctx.stroke();

		ctx.strokeStyle = "#088";
		traceHypLine(XYtoPol(intersectPts[0][0], intersectPts[0][1]), XYtoPol(intersectPts[1][0], intersectPts[1][1]));

		traceHypLine([0.9178121173544146, 5.379869450548097], [0.8596071760922103, 5.379900528557607]);
		ctx.lineWidth = 2.5;
	}
	
	animation = window.requestAnimationFrame(main);
}

function handleMouseDown(a) {
	cursor_down = true;
	//clear all points from the nodes
	space_nodeArray.forEach(n => {
		n.hypPoints = undefined;
	});

	updateBasePoints();

	//convert cursor to polar coordinates
	var polarCursorPos = [Math.sqrt(cursor_x ** 2 + cursor_y ** 2) / scale, (Math.atan2(cursor_y, cursor_x) + Math.PI * 2) % (Math.PI * 2)];
	//M is halfway between B (cursor coords) and B' (inverse of B)
	var MLen = (polarCursorPos[0] + (1 / polarCursorPos[0])) / 2;
	var MCenter = polToXY(0, 0, polarCursorPos[1], MLen);

	//that's B, now get the two circles
	var OBcirc = [0, 0, polarCursorPos[0]];
	var MOcirc = [MCenter[0], MCenter[1], MLen];

	var intersectPts = intersectionOfTwoCircles(OBcirc, MOcirc);
	var bisectorLine = circleFrom3Points(intersectPts[0], intersectPts[1], hypInvert(intersectPts[0]));

	hypPoints = hypInvertGroup(hypPoints, undefined, bisectorLine);
	space_nodeArray[0].hypPoints = hypPoints;

	//renew points
	for (var n=0; n<space_nodeArray.length; n++) {
		space_nodeArray[n].propogatePoints();
		if (space_nodeArray[n].hypPoints == undefined) {
			console.log(n, space_nodeArray[n].hasChildren, space_nodeArray[n].children);
		}
	}
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left - canvas.width / 2;
	cursor_y = a.clientY - canvasArea.top - canvas.height / 2;

	if (cursor_down) {
		handleMouseDown();
	}
}

function handleMouseUp(a) {
	cursor_down = false;
}





//computation functions below this point
function calculateHypDistance(xyP1, xyP2) {

}

function hypInvert(xyPoint) {
	//convert to polar
	var polConversion = XYtoPol(xyPoint[0], xyPoint[1]);
	//convert back to xy
	return polToXY(0, 0, polConversion[1], 1 / polConversion[0]);
}

//returns a set of polar hypPoints inverted over the inversionCircle. Only polarGroup OR xyGroup is required, not both
function hypInvertGroup(polarGroup, xyGroup, inversionCircle) {
	var cRef = inversionCircle;
	if (xyGroup == undefined) {
		//create xyGroup
		xyGroup = polarGroup.map(a => polToXY(0, 0, a[1], a[0]));
	}
	if (inversionCircle == undefined) {
		console.error(`cannot invert over an undefined arc!`);
		if (polarGroup != undefined) {
			return polarGroup;
		}
		return xyGroup.map(a => XYtoPol(a[0], a[1]));
	}

	//xy case
	return xyGroup.map(function process(a) {
		//translate to center of the circle
		a[0] -= cRef[0];
		a[1] -= cRef[1];
		a = XYtoPol(a[0], a[1]);
		//invert the new vector, make sure inversion uses self's circle and not unit circle
		a[0] /= cRef[2];
		a[0] = 1 / a[0];
		a[0] *= cRef[2];

		//convert back to world coordinates
		a = polToXY(cRef[0], cRef[1], a[1], a[0]);
		
		//convert those to polar coordinates
		return XYtoPol(a[0], a[1]);
	});
}

function traceHypGrid() {
	var treeNode;
	for (var i=space_nodeArray.length-1; i>=0; i--) {
		treeNode = space_nodeArray[i];
		if (treeNode.distance <= space_recursions) {
			//draw the poly
			ctx.strokeStyle = `hsl(${treeNode.color.h}, ${treeNode.color.s}%, ${treeNode.color.v}%)`;
			traceHypPoly(treeNode.hypPoints);
			treeNode.drawnInFrame = true;

			//create children if none exist
			if (treeNode.distance < space_recursions) {
				if (!treeNode.hasChildren) {
					treeNode.makeChildren();
				}
			}
		}
	}
}

function reflectHypPoly(inputPoints, indexOfReflect1, indexOfReflect2) {
	//get xy coords of each point
	var pCoords = inputPoints.map(a => polToXY(0, 0, a[1], a[0]));
	var invPoint = polToXY(0, 0, inputPoints[indexOfReflect1][1], 1 / inputPoints[indexOfReflect1][0]);

	//get the circle to reflect over
	
	var cRef = circleFrom3Points(pCoords[indexOfReflect1], pCoords[indexOfReflect2], invPoint);
	if (cRef != undefined) {
		//reflecting over the circle
		pCoords = hypInvertGroup(undefined, pCoords, cRef);
	} else {
		//reflecting over a line
		pCoords = invertGroup(pCoords, pCoords[indexOfReflect1], pCoords[indexOfReflect2]);
	}
	

	return pCoords;
}

function updateBasePoints() {
	hypPoints = [];
	var a = Math.tan(Math.PI / 2 - Math.PI / space_params[1]);
	var b = Math.tan(Math.PI / space_params[0]);
	var d = Math.sqrt((a - b) / (a + b));

	for (var a=0; a<space_params[0]; a++) {
		hypPoints.push([d, ((Math.PI * 2) / space_params[0]) * a]);
	}
}

function updateSpace(p, q) {
	// if ((p - 2) * (q - 2) <= 4) {
	// 	console.error(`invalid space parameters! H[${p}, ${q}] is not hyperbolic!`);
	// 	return;
	// }
	space_params = [p, q];
	hypPoints = [];
	updateBasePoints();

	space_nodeArray = [];
	space_nodeHash = {};
	space_nodeTree = undefined;

	space_nodeTree = new WorldTreeNode(p, hypPoints);
	space_nodeTree.distance = 0;
	space_nodeTree.updateColor();
	space_nodeArray.push(space_nodeTree);
}




//takes in a series of polar hyper-coordinates and returns a WorldTreeNode with those hyper-coordinates.
//Creates a new node if none exists at those coordinates, but if one exists there it will instead link the parent to the child
function nodeCreateOfficial(hypPointArr, parentNode, parentPos) {
	//first get the hash of the hypercoordinates
	var preHash = hypPointArr.map(a => polToXY(0, 0, a[1], a[0]));
	preHash = preHash.reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
	preHash[0] /= hypPointArr.length;
	preHash[1] /= hypPointArr.length;

	//fix to sigfigs
	preHash[0] = preHash[0].toFixed(space_hash_sigFigs);
	preHash[1] = preHash[1].toFixed(space_hash_sigFigs);
	var hashbrown = `${preHash[0]},${preHash[1]}`
	//turn into string and then search through the hash table
	//is there a node already in the hash table?
	var currentCell = space_nodeHash[hashbrown];
	if (currentCell == undefined) {
		//if there's no one, add one
		currentCell = new WorldTreeNode(hypPointArr.length, hypPointArr);
		space_nodeArray.push(currentCell);
		space_nodeHash[hashbrown] = currentCell;
		
	}
	//link the child node to the parent node
	currentCell.children[parentPos] = parentNode;
	currentCell.distance = Math.min(currentCell.distance, parentNode.distance + 1);
	currentCell.updateColor();

	return currentCell;
}