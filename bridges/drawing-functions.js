
function dLine(startXYArr, endXYArr) {
	ctx.beginPath();
	ctx.moveTo(startXYArr[0], startXYArr[1]);
	ctx.lineTo(endXYArr[0], endXYArr[1]);
	ctx.stroke();
}

function dPoint(x, y, size) {
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
}

function dBridge() {
    //determining which array index to start at / end at
    var startInd = Math.floor(camera.xOffset / bridgeSegmentWidth);
    var startPos = ((camera.xOffset / bridgeSegmentWidth) % 1) * bridgeSegmentWidth;
    var endInd = Math.ceil((camera.xOffset + canvas.width) / bridgeSegmentWidth)

    //drawing each segment of the bridge
    ctx.beginPath();
    ctx.fillStyle = color_bridge;
    //ew 1 letter variable names
    var tiles = 0;
    for (var e=startInd;e<endInd;e++) {
        //console.log(e, startPos + (bridgeSegmentWidth * tiles), bridgeHeight);
        //if the bridge segment exists, draw it
        if (loadingBridge.bridgeArr[e] == 1) { 
            ctx.fillRect((bridgeSegmentWidth * tiles) - startPos, bridgeHeight, bridgeSegmentWidth * 0.95, bridgeSegmentHeight);
        } else if (loadingBridge.bridgeArr[e] == 0.5) {
            ctx.fillRect((bridgeSegmentWidth * tiles) - startPos, bridgeHeight + bridgeSegmentHeight * 0.5, bridgeSegmentWidth * 0.95, bridgeSegmentHeight * 0.5);
        }

        tiles += 1;
    }
}

function dWater() {
    ctx.globalAlpha = 0.5;
    //similar to dBridge, but with water instead
    var startInd = Math.floor(camera.xOffset / waterSegmentWidth);
    var startPos = ((camera.xOffset / waterSegmentWidth) % 1) * waterSegmentWidth;
    var endInd = Math.floor((camera.xOffset + canvas.width) / waterSegmentWidth) + 3;

    //drawing the outline of the water box
    ctx.moveTo(0, canvas.height);
    //x is always fixed, but y is determined by the value in the array
    ctx.lineTo(-1 * startPos, waterHeight - (loadingWater[startInd] * waterSegmentHeight));

    //drawing each segment of the bridge
    ctx.beginPath();
    ctx.fillStyle = color_water;
    var tiles = 0;
    for (var e=startInd+1;e<endInd;e++) {
        ctx.lineTo((waterSegmentWidth * tiles) - startPos, waterHeight - (loadingWater[e] * waterSegmentHeight));
        tiles += 1;
    }

    //finishing off the polygon
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();
    ctx.globalAlpha = 1;
}