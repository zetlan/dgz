function dPoint(x, y, size) {
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
	ctx.fill();
}



//takes in two points in [distance, angle] format on the poincare disk and draws a hyperbolic world line between them. (Makes an arc, due to hyperbolic coordinates.)
function traceHypLine(hypP1, hypP2, n) {
	//xy coordinates of each point
	var coords1 = polToXY(0, 0, hypP1[1], hypP1[0]);
	var coords2 = polToXY(0, 0, hypP2[1], hypP2[0]);
	//get inversion of one of the valid points
	var coords3 = polToXY(0, 0, hypP1[1], 1 / hypP1[0]);
	if (!Number.isFinite(coords3[0])) {
		coords3 = polToXY(0, 0, hypP2[1], 1 / hypP2[0]);
	}

	//get circle the arc is on
	var arcReference = circleFrom3Points(coords1, coords2, coords3);

	//actual drawing
	//ctx.fillText(n, coords1[0] * scale, coords1[1] * scale);


	//points
	// dPoint(coords1[0] * scale, coords1[1] * scale, 4);
	// dPoint(coords2[0] * scale, coords2[1] * scale, 4);

	//if the circle isn't valid just use a regular line
	if (arcReference == undefined || arcReference[2] > circle_maxDrawR) {
		//console.log('straightLine');
		ctx.moveTo(coords1[0] * scale, coords1[1] * scale);
		ctx.lineTo(coords2[0] * scale, coords2[1] * scale);
		//ctx.stroke();
		return;
	}

	var p1ArcLoc = Math.atan2(arcReference[1] - coords1[1], arcReference[0] - coords1[0]) + Math.PI;
	var p2ArcLoc = Math.atan2(arcReference[1] - coords2[1], arcReference[0] - coords2[0]) + Math.PI;
	var distance = p2ArcLoc - p1ArcLoc;

	//console.log(arcReference[2], p1ArcLoc, p2ArcLoc);
	//arc
	ctx.arc(arcReference[0] * scale, arcReference[1] * scale, arcReference[2] * scale, p1ArcLoc, p2ArcLoc, !(distance < -Math.PI || (distance > 0 && distance < Math.PI)));
	//ctx.stroke();
}

function traceHypPoly(inputPoints) {
	ctx.fillStyle = ctx.strokeStyle;
	ctx.beginPath();
	for (var j=0; j<inputPoints.length; j++) {
		//console.log(`${j} - tracing ${inputPoints[j]} to ${inputPoints[(j+1) % inputPoints.length]}`);
		traceHypLine(inputPoints[j], inputPoints[(j+1) % inputPoints.length], j);
	}
	ctx.fill();
}