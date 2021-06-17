//all editor classes / functions go here
class Editor {
	constructor() {
		this.iconNum = 4;
		this.iconWidth = 0.2;
		this.iconSize = 0.03;
		this.sBarWidth = 0.15;
		this.tBarHeight = 0.1;
		this.tolerance = 10;

		this.worldRelative = false;

		this.clipboard;
		this.obj;
		this.mesh;
		this.points = [];
		this.handle = -1;

		this.handleStorageArray = [[[]]];
	}

	beDrawn() {
		if (loading_world.meshes.indexOf(this.mesh) == -1) {
			this.mesh = loading_world.meshes[0];
		}
		//crosshair
		var center = polToCart(player.theta, player.phi, render_crosshairSize * render_crosshairDivide);
		center = [center[0] + player.x, center[1] + player.y, center[2] + player.z];
		drawCrosshair(center, [render_crosshairSize, 0, 0], [0, render_crosshairSize, 0], [0, 0, render_crosshairSize]);

		//drawing object
		this.drawSelectedObject();
		this.drawOverlay();

		//cursor
		drawCircle(color_selection, cursor_x, cursor_y, 4);
	}

	drawHandles() {
		var hRef = this.handleStorageArray;
		//first 3 lines
		drawCrosshair(hRef[0][0], hRef[0][1], hRef[1][1], hRef[2][1]);
		//any lines beyond the first 3 get drawn with a pink line
		if (hRef.length > 3) {
			ctx.strokeStyle = "#F0F";
			for (var g=3; g<hRef.length; g++) {
				drawWorldLine(hRef[g][0], hRef[g][1]);
			}
		}

		//drawing all dots
		var pnt;
		for (var h=0; h<hRef.length; h++) {
			pnt = [hRef[h][0][0] + hRef[h][1][0], hRef[h][0][1] + hRef[h][1][1], hRef[h][0][2] + hRef[h][1][2]];
			if (!isClipped(pnt)) {
				var coords = spaceToScreen(pnt);
				drawCircle(((this.handle == h) && color_selection) || color_editor_handles, coords[0], coords[1], this.tolerance / 2);
			}
		}
	}

	drawOverlay() {
		//bar at the top
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height * this.tBarHeight);

		//bar to the side
		ctx.fillRect(0, 0, canvas.width * this.sBarWidth, canvas.height);

		//mesh list
		ctx.font = `${canvas.height/ 40}px Comfortaa`;
		ctx.fillStyle = color_text_light;
		var x = canvas.width * 0.01;
		for (var a=0; a<loading_world.meshes.length; a++) {
			ctx.fillText(loading_world.meshes[a].name, x, canvas.height * (this.tBarHeight + 0.05 + (0.04 * a)));
		}

		//icons
		var y = (canvas.height * this.tBarHeight * 0.5);
		for (var i=0; i<=this.iconNum; i++) {
			x = (canvas.width / this.iconNum) * (i + 0.5) * this.iconWidth;
			drawEditorIcon(x - (canvas.height * this.iconSize / 2), y - (canvas.height * this.iconSize / 2), canvas.height * this.iconSize, i);
		}

		y += canvas.height / 100;

		//color
		if (this.obj != undefined) {
			ctx.fillStyle = color_text_light;
			ctx.fillText("#", canvas.width * 0.935, y);
			for (var c=0; c<3; c++) {
				ctx.fillText("▲", canvas.width * (0.945 + 0.015 * c), y - (canvas.height / 42));
				ctx.fillText(this.obj.color[c+1], canvas.width * (0.95 + 0.015 * c), y);
				ctx.fillText("▼", canvas.width * (0.945 + 0.015 * c), y + (canvas.height / 50));
			}
		}

		//world relative icons
		ctx.globalAlpha = 0.2 + (0.8 * this.worldRelative);
		drawEditorIcon(canvas.width * (this.iconWidth), canvas.height * ((this.tBarHeight * 0.25) - (this.iconSize / 2)), canvas.height * this.iconSize, 100);
		ctx.globalAlpha = 0.2 + (0.8 * !this.worldRelative);
		drawEditorIcon(canvas.width * (this.iconWidth), canvas.height * ((this.tBarHeight * 0.75) - (this.iconSize / 2)), canvas.height * this.iconSize, 101);
		ctx.globalAlpha = 1;
	}

	drawSelectedObject() {
		//if it's a mesh
		if (this.obj == undefined) {
			//draw the bounding lines
			var r = this.mesh.minMaxs;
			var ps = [
				[r[0][0], r[1][1], r[2][0]],
				[r[0][1], r[1][1], r[2][0]],
				[r[0][1], r[1][1], r[2][1]],
				[r[0][0], r[1][1], r[2][1]],

				[r[0][0], r[1][0], r[2][0]],
				[r[0][1], r[1][0], r[2][0]],
				[r[0][1], r[1][0], r[2][1]],
				[r[0][0], r[1][0], r[2][1]],
			];
			ctx.strokeStyle = color_selection;
			drawWorldLine(ps[0], ps[1]);
			drawWorldLine(ps[1], ps[2]);
			drawWorldLine(ps[2], ps[3]);
			drawWorldLine(ps[3], ps[0]);

			drawWorldLine(ps[4], ps[5]);
			drawWorldLine(ps[5], ps[6]);
			drawWorldLine(ps[6], ps[7]);
			drawWorldLine(ps[7], ps[4]);

			drawWorldLine(ps[0], ps[4]);
			drawWorldLine(ps[1], ps[5]);
			drawWorldLine(ps[2], ps[6]);
			drawWorldLine(ps[3], ps[7]);
		} else {
			this.obj.beDrawn();

			//if it's an actual object
			if (this.points.length == 0) {
				ctx.strokeStyle = color_selection;
				ctx.stroke();
			} else {
				//if it's a collection of points
				ctx.beginPath();
				ctx.strokeStyle = color_selection;
				for (var p=0; p<this.points.length; p++) {
					if (!isClipped(this.obj.points[this.points[p]])) {
						var coords = spaceToScreen(this.obj.points[this.points[p]]);
						ctx.ellipse(coords[0], coords[1], 4, 4, 0, 0, Math.PI * 2);
					}
				}
				ctx.stroke();
			}

			//on top of object, draw the handles
			this.drawHandles();
		}
	}

	giveHandlePositions() {
		//get offsets
		var defCenter = [this.obj.x, this.obj.y, this.obj.z];
		var pCenter = [this.obj.x, this.obj.y, this.obj.z];
		//if points are selected, the average of those points becomes the center (for selection + movement)
		if (this.points.length > 0) {
			pCenter = [0, 0, 0]
			this.points.forEach(p => {
				pCenter[0] += this.obj.points[p][0];
				pCenter[1] += this.obj.points[p][1];
				pCenter[2] += this.obj.points[p][2];
			});
			pCenter[0] /= this.points.length;
			pCenter[1] /= this.points.length;
			pCenter[2] /= this.points.length;
		}

		var handles = [];
		//world / normal switch
		if (this.worldRelative || this.obj.normal == undefined) {
			handles.push([pCenter, [render_crosshairSize, 0, 0]]);
			handles.push([pCenter, [0, render_crosshairSize, 0]]);
			handles.push([pCenter, [0, 0, render_crosshairSize]]);
		} else {
			handles.push([pCenter, polToCart(this.obj.normal[0] + (Math.PI / 2), 0, render_crosshairSize)]);
			handles.push([pCenter, polToCart(this.obj.normal[0], this.obj.normal[1] + (Math.PI / 2), render_crosshairSize)]);
			handles.push([pCenter, polToCart(this.obj.normal[0], this.obj.normal[1], render_crosshairSize)]);
		}

		if (this.obj == undefined) {
			return handles;
		}

		//extra handles for different objects
		switch (this.obj.constructor.name) {
			case "FreePoly":
				var pR = this.obj.points;
				//add a handle for each point and each in-between point
				for (var p=0; p<pR.length; p++) {
					handles.push([defCenter, [pR[p][0] - this.obj.x, pR[p][1] - this.obj.y, pR[p][2] - this.obj.z]]);
					handles.push([defCenter, [(pR[p][0] + pR[(p + 1) % pR.length][0]) / 2 - this.obj.x, (pR[p][1] + pR[(p + 1) % pR.length][1]) / 2 - this.obj.y, (pR[p][2] + pR[(p + 1) % pR.length][2]) / 2 - this.obj.z]]);
				}
				//adding center handle
				handles.push([defCenter, [0, 0, 0]]);
				break;
		}
		return handles;
	}

	handleClick() {
		//top bar stuff
		if (cursor_y < canvas.height * this.tBarHeight) {
			this.handleBarClick();
		} else {
			//world stuff
			this.handleHandleClick();
			if (this.objHandle != -1) {
				return;
			}
			//select new object if necessary
			this.obj = selectPoly(this.mesh.binTree);
		}
		//do click event for selected object
	}

	handleBarClick() {
		//only do if valid mouse pos
		if (cursor_y > canvas.height * this.tBarHeight) {
			return;
		}

		var yHalf = (cursor_y < canvas.height * this.tBarHeight * 0.5);
		//create objects
		if (cursor_x < canvas.width * this.iconWidth) {
			var size = canvas.height * this.iconSize;
			var y = (canvas.height * this.tBarHeight * 0.5);
			for (var i=0; i<=this.iconNum; i++) {
				var x = (canvas.width / this.iconNum) * (i + 0.5) * this.iconWidth;
				if (Math.abs(cursor_x - x) < size * 0.8 && Math.abs(cursor_y - y) < size * 0.8) {
					editor_createObject(i);
					return;
				}
			}
			return;
		}

		//edit reference frame
		if (cursor_x < canvas.width * (this.iconWidth + this.iconSize)) {
			this.worldRelative = yHalf;
			return;
		}
		

		//editing color
		if (cursor_x > canvas.width * 0.94) {
			if (this.obj != undefined) {
				y += canvas.height / 100;
				//determine which color part to edit
				var part = Math.floor((((cursor_x / canvas.width) - 0.94) / 0.02));
				if (part > -1 && part < 3) {
					var direction = boolToSigned(yHalf);
					var newChar = colorKey[modulate(colorKey.indexOf(this.obj.color[part+1])+direction, colorKey.length)];
					this.obj.color = this.obj.color.substring(0, part+1) + newChar + this.obj.color.substring(part+2, this.obj.color.length);
				}
			}
			return;
		}
	}

	handleHandleClick() {
		//first get handles
		var handles = this.giveHandlePositions();
		var reqDist = this.tolerance;

		//loop through handles, select the closest one
		for (var a=0; a<handles.length; a++) {
			var point = [handles[a][0][0] + handles[a][1][0], handles[a][0][1] + handles[a][1][1], handles[a][0][2] + handles[a][1][2]];
			if (!isClipped(point)) {
				var coords = spaceToScreen(point);
				var xDist = cursor_x - coords[0];
				var yDist = cursor_y - coords[1];
				var trueDist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (trueDist < reqDist) {
					reqDist = trueDist;
					this.handleSelected = a;
				}
			}
		}
	}

	tick() {
		this.handleStorageArr = this.giveHandlePositions();

		//freepoly case
		if (this.obj.constructor.name == "FreePoly") {
			if (this.handleSelected != -1) {
				this.handleHandles();
				if (this.handleSelected > 2) {
					this.pointSelected = (this.handleSelected - 3) / 2;
					this.handleSelected = -1;
	
					//if past all points, return to the center
					if (this.pointSelected >= this.points.length) {
						this.pointSelected = -1;
					}
					//if in between points, create a new point
					if (this.pointSelected % 1 != 0) {
						var pOff = [Math.floor(this.pointSelected), Math.ceil(this.pointSelected) % this.points.length];
						var pRef = this.points;
						pRef.splice(pOff[0]+1, 0, [(pRef[pOff[0]][0] + pRef[pOff[1]][0]) / 2, (pRef[pOff[0]][1] + pRef[pOff[1]][1]) / 2, (pRef[pOff[0]][2] + pRef[pOff[1]][2]) / 2]);
	
						this.pointSelected = pOff[0] + 1;
					}
				}
				if (this.pointSelected != -1) {
					this.determineHandlePositions();
				}
			}
		}
	}

	updatePosWithCursor(handle) {
		var screenOffset = spaceToScreen([handle[0][0] + handle[1][0], handle[0][1] + handle[1][1], handle[0][2] + handle[1][2]]); 
		var center = spaceToScreen(handle[0]);

		//get vector to the offset of the crosshair
		var xDist = center[0] - screenOffset[0];
		var yDist = center[1] - screenOffset[1];
		var distance = Math.sqrt(xDist * xDist + yDist * yDist);
		//realDistance is the distance the cursor is along the original offset (the ray that's selected) divided by the distance the regular ray takes up
		var realDistance = rotate(cursor_x - screenOffset[0], -1 * (cursor_y - screenOffset[1]), -1 * (Math.atan2(screenOffset[0] - center[0], screenOffset[1] - center[1]) - (Math.PI * 0.5)))[0] / distance;

		//now that the offset is obtained, we can calculate where to move based on it
		var changePos = [handle[1][0] * realDistance, handle[1][1] * realDistance, handle[1][2] * realDistance];
		this.move(changePos[0], changePos[1], changePos[2]);
	}

	updateLengthWithCursor(handle, propertySTRING) {
		//this is a copy + modify from posWithCursor, see that for comments
		var oldVal = eval(propertySTRING);
		var screenOffset = spaceToScreen([this.x + offset[0], this.y + offset[1], this.z + offset[2]]); 
		var center = spaceToScreen([this.x, this.y, this.z]);
		var xDist = center[0] - screenOffset[0];
		var yDist = center[1] - screenOffset[1];
		var distance = Math.sqrt(xDist * xDist + yDist * yDist);
		var rayLength = rotate(cursor_x - screenOffset[0], -1 * (cursor_y - screenOffset[1]), -1 * (Math.atan2(screenOffset[0] - center[0], screenOffset[1] - center[1]) - (Math.PI * 0.5)))[0];

		var realDistance = rayLength / distance;
		eval(`${propertySTRING} += ${realDistance};`);
		if (controls_shiftPressed) {
			eval(`${propertySTRING} = snapTo(${propertySTRING}, editor_snapAmount);`);
		}
		if (oldVal != eval(propertySTRING)) {
			this.construct();
			//binary tree doesn't need updating because updating a size can't change the planes
		}
	}

	updateAngleWithCursor(offset, propertySTRING) {

	}
}