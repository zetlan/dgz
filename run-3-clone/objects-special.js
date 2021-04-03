//I don't like object-orinted programming that much but somehow over half of my codebase has become classes, the heck is this garbage
class CNode {
	constructor(xPercent, yPercent, cutsceneID, childrenArr) {
		this.trueX = xPercent;
		this.trueY = yPercent;
		this.x = xPercent;
		this.y = yPercent;
		this.cutscene = cutsceneID;
		this.cutsceneRef = eval(`cutsceneData_${this.cutscene}`);
		this.children = childrenArr;
		this.visible = data_persistent.effectiveCutscenes.includes(this.cutscene);
		this.visibleChildren = [];

		this.time = 1;
	}

	getVisible() {
		//get all visible children
		this.visibleChildren = [];
		this.children.forEach(c => {
			c.getVisible();
			if (c.visible) {
				this.visibleChildren.push(c);
			}
		});
		if (editor_active) {
			this.visible = true;
			return;
		}
		this.visible = data_persistent.effectiveCutscenes.includes(this.cutscene);
		
	}

	giveEnglishConstructor(tabNumber) {
		if (tabNumber == undefined) {
			tabNumber = 0;
		}
		var childDat = "";
		var tabDat = "";
		for (var a=0; a<tabNumber; a++) {
			tabDat += "\t";
		}
		if (this.children.length > 0) {
			childDat += "\n";
			for (var a=0; a<this.children.length-1; a++) {
				childDat += tabDat + this.children[a].giveEnglishConstructor(tabNumber+1) + ", \n";
			}
			childDat += this.children[this.children.length-1].giveEnglishConstructor(tabNumber+1) + "\n";
			childDat += tabDat;
		}
		
		return `${tabDat}new CNode(${this.trueX.toFixed(4)}, ${this.trueY.toFixed(4)}, '${this.cutscene}', [${childDat}])`;
	}

	tick() {
		//tick self, then children
		if (editor_active) {
			this.x = (this.trueX * (1 - menu_cutsceneParallax)) + 0.5;
			this.y = (this.trueY * (1 - menu_cutsceneParallax)) + 0.5;
		} else {
			this.x = this.trueX + 0.5 - (((cursor_x - (canvas.width / 2)) / canvas.width) * menu_cutsceneParallax);
			this.y = this.trueY + 0.5- (((cursor_y - (canvas.height / 2)) / canvas.height) * menu_cutsceneParallax);

			if (Math.abs(cursor_x - (this.x * canvas.width)) < editor_handleRadius * 9 && Math.abs(cursor_y - (this.y * canvas.height)) < editor_handleRadius * 3) {
				this.time = linterp(this.time, 2, 0.15);
			} else {
				this.time = linterp(this.time, 1, 0.15);
			}
		}

		
		
		
		this.children.forEach(c => {
			c.tick();
		});
	}

	becomeSelected(tolerance) {
		//if close enough, become selected
		if (getDistance2d([this.x * canvas.width, this.y * canvas.height], [cursor_x, cursor_y]) < tolerance) {
			return this;
		}

		//try selecting children
		for (var c=0; c<this.children.length; c++) {
			var testSelect = this.children[c].becomeSelected(tolerance);
			if (testSelect != undefined) {
				return testSelect;
			}
		}
	}

	beDrawn_line() {
		//draw children, then self
		this.children.forEach(c => {
			c.beDrawn_line();
		});

		if (this.visible) {
			ctx.strokeStyle = color_cutsceneLink;
			
			this.visibleChildren.forEach(c => {
				drawLine([this.x * canvas.width, this.y * canvas.height], [c.x * canvas.width, c.y * canvas.height]);
			});
		}
	}

	beDrawn_handle() {
		this.children.forEach(c => {
			c.beDrawn_handle();
		});
		if (this.visible) {
			var textSize = ((canvas.height / 60) * this.time) / (1 + (editor_active * menu_cutsceneParallax));
			//draw self's handle
			ctx.font = `${textSize}px Comfortaa`;
			ctx.fillStyle = color_text_bright;
			ctx.textAlign = "center";
			ctx.fillText(this.cutsceneRef.id, this.x * canvas.width, (this.y * canvas.height) + (textSize / 2));

			if (editor_active) {
				drawCircle(color_grey_light, this.x * canvas.width, this.y * canvas.height, editor_handleRadius);
			}
		}
	}
}


//abstract class with functionality for 3d selection and movement
class Scene3dObject {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.selectedPart = undefined;

		this.handle1 = [render_crosshairSize, 0, 0];
		this.handle2 = [0, render_crosshairSize, 0];
		this.handle3 = [0, 0, render_crosshairSize];
		this.magnitude = render_crosshairSize;
	}

	beDrawn() {
		//only draw self if in edit mode and not clipped
		if (editor_active && !isClipped([this.x, this.y, this.z])) {
			this.beDrawnTrue();
		}
	}

	beDrawnTrue() {
		//jumping-off points
		var screenCenter = spaceToScreen([this.x, this.y, this.z]);
		var screenXup =  spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]);
		var screenYup =  spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]);
		var screenZup =  spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]);
		//transforming lines to screen coordinates

		//drawing lines
		ctx.strokeStyle = "#F00";
		drawLine(screenCenter, screenXup);
		ctx.strokeStyle = "#0F0";
		drawLine(screenCenter, screenYup);
		ctx.strokeStyle = "#00F";
		drawLine(screenCenter, screenZup);

		//drawing circles
		drawCircle(color_grey_dark, screenXup[0], screenXup[1], editor_handleRadius);
		drawCircle(color_grey_dark, screenYup[0], screenYup[1], editor_handleRadius);
		drawCircle(color_grey_dark, screenZup[0], screenZup[1], editor_handleRadius);

		//selection circles
		switch (this.selectedPart) {
			case 0:
				drawCircle(color_editor_cursor, screenXup[0], screenXup[1], editor_handleRadius);
				break;
			case 1:
				drawCircle(color_editor_cursor, screenYup[0], screenYup[1], editor_handleRadius);
				break;
			case 2:
				drawCircle(color_editor_cursor, screenZup[0], screenZup[1], editor_handleRadius);
				break;
		}
	}

	tick() {
		switch (this.selectedPart) {
			case 0:
				//x
				this.updatePosWithCursor(this.handle1);
				break;
			case 1:
				//y
				this.updatePosWithCursor(this.handle2);
				break;
			case 2:
				//z
				this.updatePosWithCursor(this.handle3);
				break;
		}
		

		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	//updates position along a ray based on cursor position
	updatePosWithCursor(offset) {
		var screenOffset = spaceToScreen([this.x + offset[0], this.y + offset[1], this.z + offset[2]]); 
		var center = spaceToScreen([this.x, this.y, this.z]);
		//get vector to the offset of the crosshair 
		var angle = Math.atan2(screenOffset[0] - center[0], screenOffset[1] - center[1]) + (Math.PI * 1.5);
		angle %= Math.PI * 2;
		var distance = getDistance2d(center, screenOffset);
		//get cursor offset
		var cursorOffset = [cursor_x - screenOffset[0], cursor_y - screenOffset[1]];
		//rotate offset
		var rayLength = rotate(cursorOffset[0], -cursorOffset[1], -angle)[0];

		//now that the offset is obtained, we can calculate where to move based on it
		var realDistance = rayLength / distance;
		this.x += offset[0] * realDistance;
		this.y += offset[1] * realDistance;
		this.z += offset[2] * realDistance;
	}

	giveHandles() {
		//get the position of the various handles, and return those in a list for selection
		return [
			spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]),
			spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]),
			spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]])
		];
	}

	giveStringData() {
		return "[FILL IN CONSTRUCTOR FOR 3D SCENE OBJECT HERE]";
	}
}


class SceneBoxRinged extends Scene3dObject {
	constructor(x, y, z, size, rot) {
		super(x, y, z);
		//figure out parent from closest object
		var ref = world_objects[0];
		var reqDist = getDistance(this, ref);
		for (var a=1; a<world_objects.length; a++) {
			if (getDistance(this, world_objects[a]) < reqDist) {
				ref = world_objects[a];
				reqDist = getDistance(this, world_objects[a]);
			}
		}

		

		this.box = new Tile_Box_Ringed(this.x, this.y, this.z, size, [(Math.PI * 1.5) - ref.theta, rot], ref, [0, 0]);
		//fix knobs
		this.handle1 = polToCart(this.box.normal[0], 0, render_crosshairSize);
		this.handle2 = [0, render_crosshairSize, 0];
		this.handle3 = polToCart(this.box.normal[0] + (Math.PI / 2), 0, render_crosshairSize);
		this.handle4 = polToCart(this.box.normal[0], this.box.normal[1], this.box.size * 0.5);
	}

	beDrawn() {
		this.box.tick();
		this.box.doComplexLighting();
		this.box.beDrawn();
		super.beDrawn();
	}

	beDrawnTrue() {
		//jumping-off points
		var screenCenter = spaceToScreen([this.x, this.y, this.z]);
		var screenXup = spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]);
		var screenYup = spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]);
		var screenZup = spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]);
		var screenRup = spaceToScreen([this.x + this.handle4[0], this.y + this.handle4[1], this.z + this.handle4[2]]);
		//transforming lines to screen coordinates

		//drawing lines
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#F0F";
		drawLine(screenCenter, screenRup);
		ctx.strokeStyle = "#F00";
		drawLine(screenCenter, screenXup);
		ctx.strokeStyle = "#0F0";
		drawLine(screenCenter, screenYup);
		ctx.strokeStyle = "#00F";
		drawLine(screenCenter, screenZup);

		//drawing circles
		drawCircle(color_grey_dark, screenXup[0], screenXup[1], editor_handleRadius);
		drawCircle(color_grey_dark, screenYup[0], screenYup[1], editor_handleRadius);
		drawCircle(color_grey_dark, screenZup[0], screenZup[1], editor_handleRadius);
		drawCircle(color_grey_dark, screenRup[0], screenRup[1], editor_handleRadius);
		drawCircle(color_grey_dark, screenCenter[0], screenCenter[1] + ((this.box.size / this.box.cameraDist) * world_camera.scale), editor_handleRadius);

		//selection circles
		switch (this.selectedPart) {
			case 0:
				drawCircle(color_editor_cursor, screenXup[0], screenXup[1], editor_handleRadius);
				break;
			case 1:
				drawCircle(color_editor_cursor, screenYup[0], screenYup[1], editor_handleRadius);
				break;
			case 2:
				drawCircle(color_editor_cursor, screenZup[0], screenZup[1], editor_handleRadius);
				break;
			case 3:
				drawCircle(color_editor_cursor, screenRup[0], screenRup[1], editor_handleRadius);
				break;
			case 3:
				drawCircle(color_editor_cursor, screenCenter[0], screenCenter[1] + ((this.box.size / this.box.cameraDist) * world_camera.scale), editor_handleRadius);
				break;
		}
	}

	tick() {
		switch (this.selectedPart) {
			case 0:
				//x
				this.updatePosWithCursor(this.handle1);
				break;
			case 1:
				//y
				this.updatePosWithCursor(this.handle2);
				break;
			case 2:
				//z
				this.updatePosWithCursor(this.handle3);
				break;
			case 3:
				//rot
				//figure out rotation relative to self
				var ctrXY = spaceToScreen([this.x, this.y, this.z]);
				var rotXY = spaceToScreen([this.x + this.handle4[0], this.y, this.z + this.handle4[2]]);

				var cursorRot = Math.atan2(ctrXY[1] - cursor_y, ctrXY[0] - cursor_x) + Math.PI;
				var selfRot = Math.atan2(ctrXY[1] - rotXY[1], ctrXY[0] - rotXY[0]) + Math.PI;

				//actual updating
				this.box.normal[1] = selfRot - cursorRot;
				this.handle4 = polToCart(this.box.normal[0], this.box.normal[1], this.box.size * 0.6);
				break;
			case 4:
				//size
				//get vertical cursor distance to center
				var centerPos = spaceToScreen([this.x, this.y, this.z]);
				var cursorDist = Math.abs(centerPos[1] - cursor_y);
				//turn cursor distance into real distance, then clamp that
				cursorDist = (cursorDist / world_camera.scale) * this.box.cameraDist;
				this.box.size = Math.round(clamp(cursorDist, 5, 300));
				break;
		}
		

		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
		this.box.x = this.x;
		this.box.y = this.y;
		this.box.z = this.z;
		this.box.calculatePointsAndNormal();
	}

	giveHandles() {
		var sizeHandlePos = spaceToScreen([this.x, this.y, this.z]);
		return [
			spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]),
			spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]),
			spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]),
			spaceToScreen([this.x + this.handle4[0], this.y + this.handle4[1], this.z + this.handle4[2]]),
			[sizeHandlePos[0], sizeHandlePos[1] + (this.box.size / this.box.cameraDist) * world_camera.scale]
		];
	}

	giveStringData() {
		return `3BR~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.z.toFixed(4)}~${this.box.size}~${this.box.normal[1].toFixed(4)}`;
	}
}


class SceneLine {
	constructor(x1, y1, x2, y2) {
		this.x = x1;
		this.y = y1;
		this.endX = x2;
		this.endY = y2;
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		ctx.strokeStyle = color_cutsceneBox;
		ctx.lineWidth = canvas.height / 48;
		drawLine([this.x * canvas.width, this.y * canvas.height], [this.endX * canvas.width, this.endY * canvas.height]);
		ctx.lineWidth = 2;
	}

	drawSelectionCircles() {
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.endX, canvas.height * this.endY, editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			//p1
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			//p2
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.endX, canvas.height * this.endY, editor_handleRadius);
				break;
		}
	}

	tick() {
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//p2
				this.endX = cursor_x / canvas.width;
				this.endY = cursor_y / canvas.height;
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	giveHandles() {
		//start / end pos
		return [
			[canvas.width * this.x, canvas.height * this.y],
			[canvas.width * this.endX, canvas.height * this.endY]
		]
	}

	giveStringData() {
		return `LIN~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.endX.toFixed(4)}~${this.endY.toFixed(4)}`;
	}
}
//acts as a light source, as the player normally would
class SceneLight extends Scene3dObject {
	constructor(x, y, z) {
		super(x, y, z);
	}

	tick() {
		super.tick();
		if (cursor_down) {
			//update the lighting of the world
			for (var n=Math.max(0, loading_state.nearObjs.length-1); n>Math.max(0, loading_state.nearObjs.length-15); n--) {
				loading_state.nearObjs[n].doComplexLighting();
			}
		}
	}

	giveStringData() {
		return `LGT~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.z.toFixed(4)}`;
	}
}

class ScenePowercell extends Scene3dObject {
	constructor(x, y, z) {
		super(x, y, z);
		this.powercell = new Powercell(x, y, z, getObjectFromID("Level 1"));
		this.powercell.color = RGBtoHSV(colors_powerCells[0]);
		this.powercell.pushForce = [0, 0, 0];
	}

	tick() {
		super.tick();
		this.powercell.x = this.x;
		this.powercell.y = this.y;
		this.powercell.z = this.z;
	}

	beDrawn() {
		this.powercell.tick();
		this.powercell.doComplexLighting();
		this.powercell.beDrawn();
		super.beDrawn();
	}

	giveStringData() {
		return `POW~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.z.toFixed(4)}`;
	}
}



class SceneText {
	constructor(x, y, width, textSize, content, lightBOOLEAN) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.fontSize = textSize;
		this.rawContent = content.replace("\\'", "'");
		this.processedContent = [];
		this.isLight = lightBOOLEAN;
		this.selectedPart = undefined;

		this.process();
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		if (this.isLight) {
			ctx.fillStyle = color_text_bright;
		} else {
			ctx.fillStyle = color_text;
		}
		ctx.textAlign = "center";
		ctx.font = `${this.fontSize * canvas.height}px Comfortaa`;
		for (var p=0; p<this.processedContent.length; p++) {
			ctx.fillText(this.processedContent[p], (this.x * canvas.width), (this.y * canvas.height) + (canvas.height * this.fontSize * (p + 0.66)));
		}
	}

	drawSelectionCircles() {
		var height = this.fontSize * this.processedContent.length * canvas.height;
		//grey circles
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.x, (canvas.height * this.y) + height, editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);

		drawCircle(color_grey_dark, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (height * 0.5), editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * (this.x - this.width), canvas.height * this.y, editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.x, (canvas.height * this.y) + height, editor_handleRadius);
				break;
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
			case 3:
				drawCircle(color_editor_cursor, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (height * 0.5), editor_handleRadius);
				break;
			case 4:
				drawCircle(color_editor_cursor, canvas.width * (this.x - this.width), canvas.height * this.y, editor_handleRadius);
				break;
		}
	}

	process() {
		ctx.font = `${this.fontSize * canvas.height}px Comfortaa`;
		//split content by spaces
		this.processedContent = [];
		var split = this.rawContent.split(" ");
		var temp = "";
		while (split.length > 0) {
			//if adding the next word makes the temp string too long, push the temp string on and put the word on the temp string
			if (ctx.measureText(temp + " " + split[0]).width > this.width * 2 * canvas.width) {
				this.processedContent.push(temp);
				temp = "";
			}
			temp += " " + split.splice(0, 1);
		}
		this.processedContent.push(temp);
	}

	tick() {
		//different behavior depending on part selected
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//font size
				var newFontSize = Math.abs(this.y - (cursor_y / canvas.height)) / this.processedContent.length;
				if (newFontSize != this.fontSize) {
					//change width as well
					this.width *= newFontSize / this.fontSize;
					this.fontSize = newFontSize;
				}
				this.process();
				break;
			case 2:
				//width
				this.width = Math.abs(this.x - (cursor_x / canvas.width));
				this.process();
				break;
			case 3:
				var test = prompt("Enter message text please;", this.rawContent);
				if (test != null && test != undefined && test != "") {
					this.rawContent = test;
					this.process();
				}
				this.selectedPart = undefined;
				break;
			case 4:
				this.isLight = !this.isLight;
				this.selectedPart = undefined;
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	giveHandles() {
		//determines which part should be selected based on cursor position
		var x = canvas.width * this.x;
		var y = canvas.height * this.y;
		var width = canvas.width * this.width;
		var height = canvas.height * this.fontSize * this.processedContent.length;



		/* 
		center
		font size
		width
		text modification
		bright toggle
		*/
		return [
			[x, y],
			[x, y + height],
			[x + width, y],
			[x - (width / 2), y + (height / 2)],
			[x - width, y],
		];
	}

	giveStringData() {
		return `TXT~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.width.toFixed(4)}~${this.fontSize.toFixed(4)}~${this.rawContent.replace("~", "")}~${this.isLight}`;
	}
}


class SceneBox {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.selectedPart = undefined;
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		ctx.strokeStyle = color_cutsceneBox;
		ctx.fillStyle = color_cutsceneBox;
		drawRoundedRectangle((canvas.width * this.x) - (canvas.width * this.width), (canvas.height * this.y) - (canvas.height * this.height), canvas.width * this.width * 2, canvas.height * this.height * 2, canvas.height / 48);
	}

	drawSelectionCircles() {
		//grey circles
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
				break;
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
		}
	}

	tick() {
		//different behavior depending on part selected
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//vertical stretch
				this.height = Math.abs(this.y - (cursor_y / canvas.height));
				break;
			case 2:
				//horizontal stretch
				this.width = Math.abs(this.x - (cursor_x / canvas.width));
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	giveHandles() {
		//determines which part should be selected based on cursor position
		var x = canvas.width * this.x;
		var y = canvas.height * this.y;
		var width = canvas.width * this.width;
		var height = canvas.height * this.height;

		return [
			[x, y],
			[x, y + height],
			[x + width, y]
		];
	}

	giveStringData() {
		return `BOX~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.width.toFixed(4)}~${this.height.toFixed(4)}`;
	}
}

class SceneBubble extends SceneBox {
	constructor(x, y, width, height) {
		super(x, y, width, height);
	}

	drawMainBody() {
		//variable definition
		var arcRadiusX = this.width * canvas.width;
		var arcRadiusY = this.height * canvas.height;
		var width = this.width * canvas.width * 2;
		var height = this.height * canvas.height * 2;
		var x = ((this.x - this.width) * canvas.width);
		var y = ((this.y - this.height) * canvas.height);
		

		ctx.beginPath();
		ctx.fillStyle = color_cutsceneBox;
		ctx.moveTo(x + arcRadiusX, y);
		ctx.lineTo(x + width - arcRadiusX, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + arcRadiusY);
		ctx.lineTo(x + width, y + height - arcRadiusY);
		ctx.quadraticCurveTo(x + width, y + height, x + width - arcRadiusX, y + height);
		ctx.lineTo(x + arcRadiusX, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - arcRadiusY);
		ctx.lineTo(x, y + arcRadiusY);
		ctx.quadraticCurveTo(x, y, x + arcRadiusX, y);
		ctx.fill();
	}

	giveStringData() {
		return `BUB~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.width.toFixed(4)}~${this.height.toFixed(4)}`;
	}
}

class SceneSprite extends SceneBox {
	constructor(x, y, size, spriteSheetSTRING, rotation, backwardsBoolean, textureX, textureY) {
		super(x, y, size, size);
		this.textureX = textureX;
		this.textureY = textureY;
		this.sheet = spriteSheetSTRING;
		this.texture = new Texture(eval(spriteSheetSTRING), data_sprites.spriteSize, 1e1001, false, backwardsBoolean, [[this.textureX, this.textureY]]);

		//special case for map sprite sheet
		if (spriteSheetSTRING == "data_sprites.Map.sheet") {
			this.texture = new Texture(eval(spriteSheetSTRING), data_sprites.spriteSize * 2, 1e1001, false, backwardsBoolean, [[this.textureX, this.textureY]]);
		}
		this.rot = rotation;
	}

	drawMainBody() {
		this.texture.beDrawn(canvas.width * this.x, canvas.height * this.y, this.rot, canvas.width * this.width * 2);
	}

	drawSelectionCircles() {
		//each texture has 5, for modifying different aspects of the texture
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (canvas.height * this.height * 0.5), editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			//center
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			//size
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
				break;
			//direction
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
			//rotation
			case 3:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
				break;
			//frame type
			case 4:
				drawCircle(color_editor_cursor, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (canvas.height * this.height * 0.5), editor_handleRadius);
				break;
		}
	}

	tick() {
		//different behavior depending on part selected
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//size
				this.height = (cursor_y / canvas.height) - this.y;
				if (this.height < 0.004) {
					this.height = 0.004;
				}
				this.width = this.height * 0.75;
				break;
			case 2:
				this.texture.backwards = !this.texture.backwards;
				this.selectedPart = undefined;
				break;
			case 3:
				//rotation
				var xOffset = cursor_x - (canvas.width * this.x);
				var yOffset = cursor_y - (canvas.height * this.y);
				this.rot = Math.atan2(yOffset, xOffset) + (Math.PI * 1.75);
				break;
			case 4:
				//frame to display
				this.rot = 0;
				var xOffset = cursor_x - ((canvas.width * this.x) - (canvas.width * this.width * 0.5));
				var yOffset = cursor_y - ((canvas.height * this.y) + (canvas.height * this.height * 0.5));

				var scale = Math.min(this.texture.size, canvas.width * this.width * 2);

				var sheetXOffset = (this.x * canvas.width) - (((this.textureX + 0.5) - (xOffset / scale)) * this.width * canvas.width * 2);
				var sheetYOffset = (this.y * canvas.height) - (((this.textureY + 0.5) - (yOffset / scale)) * this.height * canvas.height * 2);

				ctx.globalAlpha = 0.2;
				ctx.drawImage(this.texture.sheet, sheetXOffset, sheetYOffset, 
							(this.texture.sheet.width / this.texture.size) * this.width * canvas.width * 2, (this.texture.sheet.height / this.texture.size) * this.height * canvas.height * 2);
				ctx.globalAlpha = 1;

				//if the cursor's up, snap to the nearest frame
				if (!cursor_down) {
					this.textureX = Math.round(this.textureX - (xOffset / scale));
					this.textureY = Math.round(this.textureY - (yOffset / scale));

					this.textureX = clamp(this.textureX, 0, (this.texture.sheet.width / this.texture.size) - 1);
					this.textureY = clamp(this.textureY, 0, (this.texture.sheet.height / this.texture.size) - 1);

					this.texture.frames[0][0] = this.textureX;
					this.texture.frames[0][1] = this.textureY;
				}
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	giveHandles() {
		//determines which part should be selected based on cursor position
		var x = canvas.width * this.x;
		var y = canvas.height * this.y;
		var width = canvas.width * this.width;
		var height = canvas.height * this.height;

		/* 
			center
			size
			backwards toggle
			rotation
			sprite select
		*/
		return [
			[x, y],
			[x, y + height],
			[x + width, y],
			[x + width, y + height],
			[x - (width / 2), y + (height / 2)]
		];
	}

	giveStringData() {
		return `SPR~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.width.toFixed(4)}~${this.sheet}~${this.rot.toFixed(4)}~${this.texture.backwards}~${this.textureX}~${this.textureY}`;
	}
}

class SceneTri {
	constructor(x1, y1, x2, y2, width) {
		this.x = x1;
		this.y = y1;
		this.endX = x2;
		this.endY = y2;
		this.width = width;
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		//determine angle from width
		var angle = Math.atan2(this.endX - this.x, this.endY - this.y);
		var triOffset = [this.width * canvas.width, 0];
		triOffset = rotate(triOffset[0], triOffset[1], (Math.PI * 2) - angle);
		drawPoly(color_cutsceneBox, [[(this.x * canvas.width) + triOffset[0], (this.y * canvas.height) + triOffset[1]], [this.endX * canvas.width, this.endY * canvas.height], [(this.x * canvas.width) - triOffset[0], (this.y * canvas.height) - triOffset[1]]]);
	}

	drawSelectionCircles() {
		//each texture has 5, for modifying different aspects of the texture
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.endX, canvas.height * this.endY, editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			//p1
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			//p2
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.endX, canvas.height * this.endY, editor_handleRadius);
				break;
			//offset
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
		}
	}

	tick() {
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//p2
				this.endX = cursor_x / canvas.width;
				this.endY = cursor_y / canvas.height;
				break;
			case 2:
				//width
				this.width = Math.abs(this.x - (cursor_x / canvas.width));
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	giveHandles() {
		/* 
			p1
			p2
			width
		*/
		return [
			[this.x * canvas.width, this.y * canvas.height],
			[this.endX * canvas.width, this.endY * canvas.height],
			[(this.x + this.width) * canvas.width, this.y * canvas.height]
		];
	}

	giveStringData() {
		return `TRI~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.endX.toFixed(4)}~${this.endY.toFixed(4)}~${this.width.toFixed(4)}`;
	}
}


//texture that's in the map and activates a cutscene upon viewing
class MapTexture {
	constructor(x, z, coordinates, cutsceneString, viewCondition) {
		this.x = x;
		this.y = 0;
		this.z = z;
		this.texture = new Texture(data_sprites["Map"].sheet, data_sprites.spriteSize * 2, 1e1001, false, false, coordinates);
		this.map_circleCoords = [-1, -1];
		this.cutsceneRef = `cutsceneData_${cutsceneString}`;
		this.id = "";
		if (this.cutsceneRef != `cutsceneData_undefined`) {
			this.id = eval(this.cutsceneRef).id;
		}
		this.viewCondition = viewCondition;
		this.visible = false;
	}

	activate() {
		if (this.visible) {
			activateCutsceneFromTunnel(1, this.cutsceneRef.split("_")[1], 1);
		}
	}

	beDrawn() {
		this.visible = eval(this.viewCondition);
		if (editor_active || this.visible) {
			this.map_circleCoords = spaceToScreen([this.x, this.y, this.z]);
			this.texture.beDrawn(this.map_circleCoords[0], this.map_circleCoords[1], 0, map_iconSize * canvas.height);
			//small circle in the middle of self for editor
			if (editor_active) {
				drawCircle(color_grey_light, this.map_circleCoords[0], this.map_circleCoords[1], editor_handleRadius);
			}
		}

		//if doesn't lead to a cutscene, make sure self can't be selected
		if (this.id == "") {
			this.visible = false;
		}
	}

	beDrawn_selected() {
		this.beDrawn();
	}

	handleMouseDown() {
		if (!editor_active) {
			//activating cutscene if not in edit mode
			this.activate();
		} else {
			//if in edit mode and the cursor is down too far away, become unselected
			if (getDistance2d(this.map_circleCoords, [cursor_x, cursor_y]) > map_iconSize * canvas.height) {
				loading_state.objSelected = undefined;
			}
		}
	}

	handleMouseMove() {
		//move to where the cursor is
		var newCoords = screenToSpace([cursor_x, cursor_y], world_camera.y);
		this.x = newCoords[0];
		this.z = newCoords[2];
	}

	giveStringData() {
		return `new MapTexture(${Math.round(this.x)}, ${Math.round(this.z)}, ${JSON.stringify(this.texture.frames)}, \`${this.cutsceneRef.split("_")[1]}\`, \`${this.viewCondition}\`)`;
	}
}
















//sliders for editing properties in the editor
class PropertySlider {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, sliderWidthPERCENTAGE, label, propertyToModifySTRING, displayProperty, minValue, maxValue, snapAmount, resetTunnel) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;
		this.textSpace = this.width - sliderWidthPERCENTAGE;

		this.property = displayProperty;
		this.execution = propertyToModifySTRING;
		this.label = label;
		this.min = minValue;
		this.max = maxValue;
		this.snapTo = snapAmount;
		this.doReset = resetTunnel;
	}

	beDrawn() {
		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 36}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 108));



		//slider
		ctx.strokeStyle = color_grey_dark;
		ctx.beginPath();

		ctx.moveTo(canvas.width * (this.x + this.textSpace), canvas.height * this.y);
		ctx.lineTo(canvas.width * (this.x + this.width), canvas.height * this.y);
		ctx.stroke();
		drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace + (getPercentage(this.min, this.max, eval(this.property)) * (this.width - this.textSpace))), canvas.height * this.y, 4);
		//drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace), canvas.height * this.y, 4);
		ctx.stroke();
	}

	tick() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance &&
			cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
				var percentage = cursor_x - (canvas.width * (this.x + this.textSpace));
				percentage = clamp(percentage / (canvas.width * (this.width - this.textSpace)), 0, 1);
				var value = linterp(this.min, this.max, percentage);
				value = Math.round(value / this.snapTo) * this.snapTo;
				eval(this.execution);
				if (this.doReset) {
					player = new Runner(player.x, player.y, player.z);
					loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
					player = new Pastafarian(player.x, player.y, player.z);
				}
			}
		}
	}
}

//text boxes you can click on and change in the editor
class PropertyTextBox {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING, propertyDisplay, textBoxText, textBoxPrefill, resetTunnel) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;

		this.label = label;
		this.property = propertyDisplay;
		this.execution = propertyToModifySTRING;
		this.boxLabel = textBoxText;
		this.boxContent = textBoxPrefill;
		this.doReset = resetTunnel;
	}

	beDrawn() {
		//selection box
		ctx.strokeStyle = color_menuSelectionOutline;
		ctx.fillStyle = color_grey_light;
		ctx.globalAlpha = 0.3;
		drawRoundedRectangle(canvas.width * this.x, (canvas.height * this.y) - (canvas.height / 50), canvas.width * this.width, canvas.height / 25, canvas.height / 96);
		ctx.globalAlpha = 1;

		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 42}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label + eval(this.property), canvas.width * (this.x + 0.01), (canvas.height * this.y) + (canvas.height / 126));
	}

	tick() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance) {
				if (cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
					var value = prompt(this.boxLabel, eval(this.boxContent));
					//sanitize input because users are evil gremlins (sorry any user that's reading this, you're not an evil gremlin, but your typing habits could cause problems)
					if (value != undefined && value != "" && value != null) {
						value.replace(`\'`, "");
						value.replace(`\\`, "");

						eval(this.execution);
						if (this.doReset) {
							player = new Runner(player.x, player.y, player.z);
							loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
							player = new Pastafarian(player.x, player.y, player.z);
						}
					}
					
				}
			}
		}
	}
}

class PropertyToggle {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;
		this.text = label;
		this.property = propertyToModifySTRING;
		this.halt = false;
	}

	beDrawn() {
		//selection box
		drawSelectionBox(this.x * canvas.width, this.y * canvas.height, (canvas.height / 36) * 2);

		ctx.fillStyle = color_text_bright;
		if (eval(this.property)) {
			ctx.fillRect(x, y, size * 0.75, size * 0.75);
		}

		//text
		ctx.font = `${canvas.height / 36}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label, canvas.width * (this.x + 0.01), (canvas.height * this.y) + (canvas.height / 108));
	}

	tick() {
		//if cursor's down and in the area, toggle then halt self
		if (cursor_down) {
			if (!this.halt) {
				this.halt = true;
				if (cursor_x > this.x * canvas.width && cursor_x < (this.x + this.width) * canvas.width && cursor_y > (this.y * canvas.height) - (canvas.height / 36) && cursor_y < (this.y * canvas.height) + (canvas.height / 36)) {
					eval(`${this.property} = !${this.property};`);
				}
			}
			return;
		}
		this.halt = false;
	}
}