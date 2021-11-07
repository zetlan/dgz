//I don't like object-orinted programming that much but somehow over half of my codebase has become classes, the heck is this garbage

//3d binary tree
class B3Node {
	constructor() {
		this.obj;
		this.low;
		this.hie;
	}

	addObj(object) {
		//if self is undefined add to self
		if (this.obj == undefined) {
			this.obj = object;
			return;
		}

		//if self already contains an object use the object's normal to place the next object
		if (spaceToRelativeRotless([object.x, object.y, object.z], [this.obj.x, this.obj.y, this.obj.z], this.obj.normal)[2] > 0) {
			//front object
			if (this.hie == undefined) {
				this.hie = new B3Node();
			}
			this.hie.addObj(object);
		} else {
			//object is behind
			if (this.low == undefined) {
				this.low = new B3Node();
			}
			this.low.addObj(object);
		}
	}

	//beDrawn is the only ordered function
	beDrawn() {
		//different ordering based on camera position
		if (spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.obj.x, this.obj.y, this.obj.z], this.obj.normal)[2] > 0) {
			//camera is on top
			if (this.low != undefined) {
				this.low.beDrawn();
			}
			this.obj.beDrawn();
			if (this.hie != undefined) {
				this.hie.beDrawn();
			}
		} else {
			//camera is below
			if (this.hie != undefined) {
				this.hie.beDrawn();
			}
			this.obj.beDrawn();
			if (this.low != undefined) {
				this.low.beDrawn();
			}
		}
	}
}



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

	giveEnglishConstructor() {
		var childDat = "";
		var tabDat = "";
		if (this.children.length > 0) {
			var oneChildData;
			for (var a=0; a<this.children.length; a++) {
				oneChildData = this.children[a].giveEnglishConstructor();
				//add tabs to show ownership
				oneChildData = oneChildData.split("\n");
				oneChildData = oneChildData.map(ln => "\t" + ln);
				oneChildData = oneChildData.reduce((a, b) => a + "\n"+ b);
				childDat += oneChildData + "\n";
			}
		}
		
		return `${this.cutscene}~${this.trueX.toFixed(4)}~${this.trueY.toFixed(4)}\n${childDat}`;
	}

	tick() {
		//tick self, then children
		if (editor_active) {
			this.x = (this.trueX * (1 - menu_cutsceneParallax)) + 0.5;
			this.y = (this.trueY * (1 - menu_cutsceneParallax)) + 0.5;
		} else {
			this.x = this.trueX + 0.5 - (((cursor_x - (canvas.width / 2)) / canvas.width) * menu_cutsceneParallax);
			this.y = this.trueY + 0.5- (((cursor_y - (canvas.height / 2)) / canvas.height) * menu_cutsceneParallax);

			if (Math.abs(cursor_x - (this.x * canvas.width)) < editor_handleRadius * 9 && Math.abs(cursor_y - (this.y * canvas.height)) < editor_handleRadius * 2.375) {
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
		var selfDistance = getDistance2d([this.x * canvas.width, this.y * canvas.height], [cursor_x, cursor_y]);
		var childSelected = undefined;
		//try selecting children
		for (var c=0; c<this.children.length; c++) {
			var testSelect = this.children[c].becomeSelected(selfDistance);
			if (testSelect != undefined) {
				childSelected = testSelect;
				selfDistance = getDistance2d([testSelect.x * canvas.width, testSelect.y * canvas.height], [cursor_x, cursor_y]);
			}
		}
		//if nothing's good, exit
		if (selfDistance > tolerance) {
			return undefined;
		}

		//if a child's been selected, return that. If not, return the self.
		if (childSelected) {
			return childSelected;
		}
		if (this.time > 1.02) {
			return this;
		}
	}

	beDrawn_line() {
		//draw children, then self
		this.children.forEach(c => {
			c.beDrawn_line();
		});

		if (this.visible) {
			ctx.strokeStyle = color_cutsceneLink;
			ctx.lineWidth = 2;
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

			//if (editor_active) {
			//	drawCircle(color_grey_light, this.x * canvas.width, this.y * canvas.height, editor_handleRadius);
			//}
		}
	}
}

class IMNode {
	constructor(parent, difficulty, newTunnelPosition) {
		this.parent = parent;
		this.difficulty = difficulty;
		this.cooldown = 0;
		this.tunnel;
		this.leftNode = undefined;
		this.rightNode = undefined;

		this.makeTunnel(newTunnelPosition);
	}

	//returns a list of all the tunnels
	getTunnelList() {
		var tList = [];
		var otherList;
		//add all tunnels
		tList.push(this.tunnel);
		if (this.leftNode != undefined) {
			otherList = this.leftNode.getTunnelList();
			otherList.forEach(o => {
				tList.push(o);
			});
		}

		if (this.rightNode != undefined) {
			otherList = this.rightNode.getTunnelList();
			otherList.forEach(o => {
				tList.push(o);
			});
		}
		return tList;
	}

	//creates a tunnel for self
	makeTunnel(makeCode) {
		//if a tunnel is already there, set start coords to that tunnel end
		var sX = 0;
		var sZ = -40000;
		var sT = 0;
		if (this.parent != undefined) {
			switch(makeCode) {
				case 0:
				default:
					
					break;
			}
			if (makeCode != undefined) {
				//decide whether left or right
				if (makeCode == 1) {
					sT = this.parent.tunnel.theta + (Math.PI / 2);
				} else {
					sT = this.parent.tunnel.theta - (Math.PI / 2);
				}
				var frontLen = randomBounded(this.parent.tunnel.len * this.parent.tunnel.tileSize * 0.1, this.parent.tunnel.len * this.parent.tunnel.tileSize * 0.9);
				var frontOff = [-1 * frontLen * Math.sin(this.parent.tunnel.theta), frontLen * Math.cos(this.parent.tunnel.theta)];
				var sideOff = [-1 * (this.parent.tunnel.r + 30) * Math.sin(sT), (this.parent.tunnel.r + 30) * Math.cos(sT)];
				
				sX = this.parent.tunnel.x + frontOff[0] + sideOff[0];
				sZ = this.parent.tunnel.z + frontOff[1] + sideOff[1];
			} else {
				sT = this.parent.tunnel.theta;
				sX = this.parent.tunnel.endPos[0] - (tunnel_transitionLength * Math.sin(sT));
				sZ = this.parent.tunnel.endPos[2] + (tunnel_transitionLength * Math.cos(sT));
			}
		}

		//randomly change theta a bit
		sT = modulate(sT + randomBounded(-infinite_wobble, infinite_wobble), Math.PI * 2);

		var value = Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange));
		if (this.parent != undefined) {
			while (value == this.parent.lastTunnelLine) {
				value = Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange));
			}
		}
		
		this.lastTunnelLine = value;
		var tunnelConstructionData = `pos-x~${sX}|pos-z~${sZ}|direction~${sT}|${infinite_data[value]}`;
		this.tunnel = new Tunnel_FromData(tunnelConstructionData);
		this.tunnel.placePowercells();
	}

	//creates children nodes for self
	makeNode() {
		//if children already exist, recurse
		if (this.leftNode != undefined) {
			this.leftNode.makeNode();
			if (this.rightNode != undefined) {
				this.rightNode.makeNode();
			}
			return;
		}
		var newDifficulty = this.difficulty + infinite_difficultyBoost;
		if (newDifficulty + infinite_levelRange > infinite_data.length - 1) {
			newDifficulty = infinite_data.length - 1 - infinite_levelRange;
		}

		//chance of a branch
		if (this.cooldown == 0 && Math.random() < infinite_branchChance) {
			//one branch and one continue
			if (Math.random() < 0.5) {
				this.leftNode = new IMNode(this, newDifficulty, Math.floor(Math.random() * 1.99));
				this.leftNode.cooldown = infinite_branchCooldown;

				this.rightNode = new IMNode(this, newDifficulty);
				this.rightNode.cooldown = infinite_branchCooldown;
				return;
			}

			//two branches
			var val = (Math.random() > 0.5);
			this.leftNode = new IMNode(this, newDifficulty, val * 1);
			this.leftNode.cooldown = infinite_branchCooldown;

			this.rightNode = new IMNode(this, newDifficulty, !val * 1);
			this.rightNode.cooldown = infinite_branchCooldown;
			return;
		}

		//single tunnel case
		this.leftNode = new IMNode(this, newDifficulty);
		this.leftNode.cooldown = Math.max(0, this.cooldown - 1);
	}

	//remove self and return a child
	remove() {
		if (player.parentPrev == this) {
			console.error(`player is still in ${this.tunnel.id}`);
			return this;
		}
		//if self has one child, just return that. If not, return the child that the player is in
		//self will always have a leftnode, the right node is used for optional tunnels
		if (this.rightNode == undefined) {
			return this.leftNode;
		}

		if (player.parentPrev == this.leftNode.tunnel) {
			return this.leftNode;
		}
		if (player.parentPrev == this.rightNode.tunnel) {
			return this.rightNode;
		}

		//if it's not in children, check children's children to be safe. Since self is sure to be a branch, children cannot have branches
		if (player.parentPrev == this.leftNode.leftNode.tunnel) {
			return this.leftNode.leftNode;
		}
		if (player.parentPrev == this.rightNode.leftNode.tunnel) {
			return this.rightNode.leftNode;
		}

		console.error(`player is none of these nodes! for object structure ${this.tunnel.id}
																			/     \\
																		  ${this.leftNode.tunnel.id}  ${this.rightNode.tunnel.id}`);
		return this;
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

class SceneBoat extends Scene3dObject {
	constructor(x, y, z, theta, phi) {
		super(x, y, z);

		this.boat = new Boat(this.x, this.y, this.z, theta, phi);
		this.handleSize = 70;
		//fix knobs
		this.handle1 = polToCart(this.boat.theta, 0, render_crosshairSize);
		this.handle2 = polToCart(this.boat.theta + (Math.PI / 2), 0, render_crosshairSize);
		this.handle3 = polToCart(this.boat.theta + (Math.PI / 2), Math.PI / 2, render_crosshairSize);
		this.handle4 = polToCart(this.boat.theta, this.boat.phi, this.handleSize);
		this.handle5 = polToCart(this.boat.theta, 0, this.handleSize);
	}

	beDrawn() {
		this.boat.tick();
		this.boat.doComplexLighting();
		this.boat.beDrawn();
		super.beDrawn();
	}

	beDrawnTrue() {
		//jumping-off points
		var screenCenter = spaceToScreen([this.x, this.y, this.z]);
		var screenXup = spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]);
		var screenYup = spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]);
		var screenZup = spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]);
		var screenRup = spaceToScreen([this.x + this.handle4[0], this.y + this.handle4[1], this.z + this.handle4[2]]);
		var screenTup = spaceToScreen([this.x + this.handle5[0], this.y + this.handle5[1], this.z + this.handle5[2]]);
		//transforming lines to screen coordinates

		//drawing lines
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#F0F";
		drawLine(screenCenter, screenRup);
		drawLine(screenCenter, screenTup);
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
		drawCircle(color_grey_dark, screenTup[0], screenTup[1], editor_handleRadius);

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
			case 4:
				drawCircle(color_editor_cursor, screenTup[0], screenTup[1], editor_handleRadius);
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
				var cursorRot = Math.atan2(ctrXY[1] - cursor_y, ctrXY[0] - cursor_x) + Math.PI;

				//actual updating
				this.boat.phi = cursorRot;
				break;
			case 4:
				//theta
				var ctrXY = spaceToScreen([this.x, this.y, this.z]);
				var cursorRot = Math.atan2(ctrXY[1] - cursor_y, ctrXY[0] - cursor_x) + Math.PI;

				//actual updating
				this.boat.theta = cursorRot;
				break;
		}
		

		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
		this.boat.x = this.x;
		this.boat.y = this.y;
		this.boat.z = this.z;

		this.handle1 = polToCart(this.boat.theta, 0, render_crosshairSize);
		this.handle2 = polToCart(this.boat.theta + (Math.PI / 2), 0, render_crosshairSize);
		this.handle3 = polToCart(this.boat.theta + (Math.PI / 2), Math.PI / 2, render_crosshairSize);
		this.handle4 = polToCart(this.boat.theta, this.boat.phi, this.handleSize);
		this.handle5 = polToCart(this.boat.theta, 0, this.handleSize);
		if (world_time % 5 == 1) {
			this.boat.generate();
		}
		
	}

	giveHandles() {
		return [
			spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]),
			spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]),
			spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]),
			spaceToScreen([this.x + this.handle4[0], this.y + this.handle4[1], this.z + this.handle4[2]]),
			spaceToScreen([this.x + this.handle5[0], this.y + this.handle5[1], this.z + this.handle5[2]]),
		];
	}

	giveStringData() {
		return `3BT~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.z.toFixed(4)}~${this.boat.theta.toFixed(4)}~${this.boat.phi.toFixed(4)}`;
	}
}


class SceneTile extends Scene3dObject {
	constructor(x, y, z, type, size, rot) {
		super(x, y, z);
		this.type = type;
		var ref = pickNewParent({x: this.x, y: this.y, z:this.z}, world_objects[0]);
		try {
			this.tile = ref.generateTile(this.type, x, y, z, size, [(Math.PI * 1.5) - ref.theta, rot], ref.color, 0, 0);
			this.updateHandles();
		} catch (error) {
			console.error(`couldn't generate tile with properties - ${x}~${y}~${z}~${this.type}~${rot}`);
		}
		
	}

	beDrawn() {
		this.tile.tick();
		this.tile.doComplexLighting();
		this.tile.beDrawn();
		super.beDrawn();
	}

	beDrawnTrue() {
		//jumping-off points
		var screenCenter = spaceToScreen([this.x, this.y, this.z]);
		var screenXup = spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]);
		var screenYup = spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]);
		var screenZup = spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]);
		var screenRup = spaceToScreen([this.x + this.handle4[0], this.y + this.handle4[1], this.z + this.handle4[2]]);
		var apparentSize = (this.tile.size / this.tile.cameraDist) * world_camera.scale;
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
		drawCircle(color_grey_dark, screenCenter[0], screenCenter[1] + apparentSize, editor_handleRadius);
		drawCircle(color_grey_dark, screenCenter[0] - (apparentSize / 2), screenCenter[1] - (apparentSize / 2), editor_handleRadius);

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
			case 4:
				drawCircle(color_editor_cursor, screenCenter[0], screenCenter[1] + apparentSize, editor_handleRadius);
				break;
			case 5:
				drawCircle(color_editor_cursor, screenCenter[0] - (apparentSize / 2), screenCenter[1] - (apparentSize / 2), editor_handleRadius);
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
				this.tile.normal[1] = selfRot - cursorRot;
				this.updateHandle(4);
				break;
			case 4:
				//size
				//get vertical cursor distance to center
				var centerPos = spaceToScreen([this.x, this.y, this.z]);
				var cursorDist = Math.abs(centerPos[1] - cursor_y);
				//turn cursor distance into real distance, then clamp that
				cursorDist = (cursorDist / world_camera.scale) * this.tile.cameraDist;
				this.tile.size = Math.round(clamp(cursorDist, 5, 300));
				break;
			case 5:
				//tile type
				//this is just lazy input, but I'm trusting people for the most part.
				var result = prompt("Please enter a new tile type (positive integer 1-13, 101, 102, or 109)", this.type);
				while (!isValidString(result) || tunnel_validIndeces[result] == undefined || result == "0") {
					result = prompt("That is not a valid number. Please enter a positive integer between 1 and 13, 101, 102, or 109");
				}
				this.type = result * 1;
				//update tile type
				this.tile = this.tile.parent.generateTile(this.type, this.x, this.y, this.z, this.tile.size, [(Math.PI * 1.5) - this.tile.parent.theta, this.tile.normal[1]], this.tile.parent.color, 0, 0);
				this.updateHandles();
				this.selectedPart = undefined;
		}
		

		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
		this.tile.x = this.x;
		this.tile.y = this.y;
		this.tile.z = this.z;

		//if the tile's not in their parent, try to get a new one
		if (!this.tile.parent.coordinateIsInTunnel_Bounded(this.x, this.y, this.z)) {
			this.tile.parent = pickNewParent(this.tile, this.tile.parent);
			this.tile.color = this.tile.parent.color;
			this.tile.normal[0] = (Math.PI * 1.5) - this.tile.parent.theta;
			this.updateHandles();
		}
		this.tile.calculatePointsAndNormal();
	}

	giveHandles() {
		var sizeHandlePos = spaceToScreen([this.x, this.y, this.z]);
		return [
			spaceToScreen([this.x + this.handle1[0], this.y + this.handle1[1], this.z + this.handle1[2]]),
			spaceToScreen([this.x + this.handle2[0], this.y + this.handle2[1], this.z + this.handle2[2]]),
			spaceToScreen([this.x + this.handle3[0], this.y + this.handle3[1], this.z + this.handle3[2]]),
			spaceToScreen([this.x + this.handle4[0], this.y + this.handle4[1], this.z + this.handle4[2]]),
			[sizeHandlePos[0], sizeHandlePos[1] + (this.tile.size / this.tile.cameraDist) * world_camera.scale],
			[sizeHandlePos[0] - ((this.tile.size / this.tile.cameraDist) * world_camera.scale * 0.5), sizeHandlePos[1] - ((this.tile.size / this.tile.cameraDist) * world_camera.scale * 0.5)]
		];
	}

	giveStringData() {
		return `3TL~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.z.toFixed(4)}~${this.type}~${this.tile.size}~${this.tile.normal[1].toFixed(4)}`;
	}

	updateHandles() {
		for (var a=1; a<=4; a++) {
			this.updateHandle(a);
		}
	}

	updateHandle(handleNum) {
		switch (handleNum) {
			case 1:
				this.handle1 = polToCart(this.tile.normal[0], 0, render_crosshairSize);
				break;
			case 2:
				this.handle2 = [0, render_crosshairSize, 0];
				break;
			case 3:
				this.handle3 = polToCart(this.tile.normal[0] + (Math.PI / 2), 0, render_crosshairSize);
				break;
			case 4:
				this.handle4 = polToCart(this.tile.normal[0], this.tile.normal[1], this.tile.size * 0.5);
				break;
		}
	}
}

class SceneCode {
	constructor(codeToExecute) {
		this.code = codeToExecute;
		this.finished = false;
		this.selectedPart = undefined;
	}

	tick() {
		//update code info after cursor is down't
		if (!cursor_down) {
			var test = prompt("Enter new code please;", this.code);
			if (isValidString(test)) {
				this.code = test;
				this.finished = false;
			}
			this.selectedPart = undefined;
		}
	}

	beDrawn() {
		if (editor_active) {
			drawCircle(color_grey_dark, canvas.width * 0.95, canvas.height * 0.95, editor_handleRadius);
			if (cursor_down && this.selectedPart != undefined) {
				drawCircle(color_editor_cursor, canvas.width * 0.95, canvas.height * 0.95, editor_handleRadius);
			}
		} else {
			if (!this.finished) {
				eval(this.code);
				this.finished = true;
			}
		}
	}

	giveHandles() {
		return [[canvas.width * 0.95, canvas.height * 0.95]];
	}

	giveStringData() {
		return `COD~${this.code}`;
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
		this.rawContent = content.replaceAll("\\'", "'");
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
				if (isValidString(test)) {
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
		return `TXT~${this.x.toFixed(4)}~${this.y.toFixed(4)}~${this.width.toFixed(4)}~${this.fontSize.toFixed(4)}~${this.rawContent.replaceAll("~", "")}~${this.isLight}`;
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
















class PropertyButton {
	constructor(x, y, widthPERCENTAGE, heightPERCENTAGE, label, codeOnClick) {
		this.x = x;
		this.y = y;
		this.width = widthPERCENTAGE;
		this.height = heightPERCENTAGE;
		this.label = label;
		this.code = codeOnClick;
		this.mouseOver = false;
	}

	beDrawn() {
		ctx.lineWidth = canvas.height / 96;
		ctx.strokeStyle = color_grey_dark;
		if (this.mouseOver) {
			ctx.fillStyle = color_grey_dark;
		} else {
			ctx.fillStyle = color_grey_light;
		}
		drawRoundedRectangle(canvas.width * (this.x - this.width / 2), canvas.height * (this.y - this.height / 2), canvas.width * this.width, canvas.height * this.height, canvas.height / 48);

		ctx.font = `${canvas.height / 25}px Comfortaa`;
		ctx.textAlign = "center";
		ctx.fillStyle = color_text;
		ctx.fillText(this.label, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 75));
	}

	tick() {
		//mouseover check
		this.mouseOver = (cursor_x > canvas.width * (this.x - this.width * 0.5) && 
						cursor_x < canvas.width * (this.x + this.width * 0.5) && 
						cursor_y > canvas.height * (this.y - this.height * 0.5) && 
						cursor_y < canvas.height * (this.y + this.height * 0.5));
	}

	interact() {
		if (this.mouseOver) {
			eval(this.code);
			return 31;
		}
	}
}

//slider
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
		var propertyValue = eval(this.property);
		var displayValue = propertyValue;
		if (this.snapTo % 1 != 0) {
			displayValue = displayValue.toFixed(2);
		} else {
			displayValue = Math.round(displayValue);
		}
		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 40}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(`${this.label} (${displayValue})`, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 108));



		//slider
		ctx.strokeStyle = color_grey_dark;
		ctx.beginPath();

		ctx.moveTo(canvas.width * (this.x + this.textSpace), canvas.height * this.y);
		ctx.lineTo(canvas.width * (this.x + this.width), canvas.height * this.y);
		ctx.stroke();
		drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace + (getPercentage(this.min, this.max, propertyValue) * (this.width - this.textSpace))), canvas.height * this.y, 4);
		//drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace), canvas.height * this.y, 4);
		ctx.stroke();
	}

	interact() {
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
					replacePlayer(0 + (7 * data_persistent.settings.pastaView));
					loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
					replacePlayer(7);
				}
				return 31;
			}
		}
	}

	tick() {
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
		drawSelectionBox(canvas.width * (this.x + (this.width * 0.5)), canvas.height * this.y, canvas.width * this.width, canvas.height / 25);

		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 42}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label + eval(this.property), canvas.width * (this.x + 0.01), (canvas.height * this.y) + (canvas.height / 126));
	}

	interact() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance) {
				if (cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
					var value = prompt(this.boxLabel, eval(this.boxContent));
					//sanitize input because users are evil gremlins (sorry any user that's reading this, you're not an evil gremlin, but your typing habits could cause problems)
					if (isValidString(value)) {
						value.replaceAll(`\'`, "");
						value.replaceAll(`\\`, "");

						eval(this.execution);
						if (this.doReset) {
							player = new Runner(player.x, player.y, player.z);
							loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
							player = new Pastafarian(player.x, player.y, player.z);
						}
						//repeat pop-up prevention
						cursor_x = -1000;
						cursor_y = -1000;
					}
				}
			}
		}
	}
	
	tick() {
	}
}

class PropertyToggle {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;
		this.text = label;
		this.property = propertyToModifySTRING;
	}

	beDrawn() {
		//selection box
		drawSelectionBox((this.x + this.width) * canvas.width, this.y * canvas.height, (canvas.height / 36) * 2,( canvas.height / 36) * 2);

		ctx.fillStyle = color_text_bright;
		if (eval(this.property)) {
			ctx.fillRect(((this.x + this.width) * canvas.width) - (canvas.height / 72), (this.y * canvas.height) - (canvas.height / 72), canvas.height / 36, canvas.height / 36);
		}

		//text
		ctx.font = `${canvas.height / 36}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.text, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 108));
	}

	interact() {
		if (cursor_x > this.x * canvas.width && cursor_x < (this.x + this.width) * canvas.width && cursor_y > (this.y * canvas.height) - (canvas.height / 36) && cursor_y < (this.y * canvas.height) + (canvas.height / 36)) {
			eval(`${this.property} = !${this.property};`);
		}
	}

	tick() {
	}
}