//state world is never used, but it's here so that State_Game, State_Infinite, and State_Cutscene can share code
class State_World {
	constructor() {
		this.nearObjs = [];
		this.farObjs = [];
		this.readFrom = [];
		this.substate = 0;
		this.text = ``;
		this.textTime = 0;

		//textures for characters
		this.selectionTextures = [];
		for (var t=0; t<data_characters.length; t++) {
			this.selectionTextures.push(new Texture(eval(`data_sprites.${data_characters[t]}.sheet`), data_sprites.spriteSize, 2, false, false, eval(`data_sprites.${data_characters[t]}.back`)));
		}

		this.orderWorld();

		//make sure to switch into substate 3 if the player is in a bad tunnel
		if (player.parentPrev != undefined) {
			if (player.parentPrev.bannedCharacters[player.constructor.name] != undefined) {
				this.substate = 3;
			}
		}
	}

	execute() {
		switch (this.substate) {
			case 0:
				//logTime("total");
				//handling entities
				world_camera.tick();
				player.tick();

				if (player.parent != undefined) {
					//if the player's left their parent tunnel, change their parent
					if (!player.parent.playerIsInBounds()) {
						player.parentPrev = player.parent;
						player.parent = undefined;
					} else if (!player.parent.playerIsInTunnel()) {
						//if the player is in the void, try to change parent without the whole jazzy reshuffling
						this.changePlayerParentUnofficial();
					}
				} else {
					//if the player isn't in a tunnel, try to get them in one
					this.changePlayerParentOfficial();
				}
				//ticking player parent as well as closest few tunnels
				player.parentPrev.tick();
				for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-20); v--) {
					this.nearObjs[v].tick();
				}

				//drawing!
				//'background' objects
				drawSky(color_bg);
				this.farObjs.forEach(f => {
					f.beDrawn_LowDetail();
				});

				//'foreground' objects
				this.nearObjs.forEach(f => {
					f.beDrawn();
				});
				drawPlayerWithParent();

				//GUI
				if (editor_active) {
					drawCrosshair();
				}
				drawKeys();

				//drawing new tunnel text
				if (this.textTime > 0) {
					ctx.fillStyle = color_text_bright;
					ctx.font = `${canvas.height / 22}px Comfortaa`;
					ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.5);
					this.textTime -= 1;
				}
				break;
			case 1:
				//pause screen
				ctx.fillStyle = color_grey_light;
				ctx.strokeStyle = color_grey_dark;
				ctx.lineWidth = canvas.height / 50;
				drawRoundedRectangle(canvas.width * 0.35, canvas.height * 0.2, canvas.width * 0.1, canvas.height * 0.6, canvas.height * 0.03);
				drawRoundedRectangle(canvas.width * 0.55, canvas.height * 0.2, canvas.width * 0.1, canvas.height * 0.6, canvas.height * 0.03);
				ctx.lineWidth = canvas.height / 100;
				break;
			case 3:
				//drawing rejection text

				//bg box
				ctx.fillStyle = color_grey_lightest;
				ctx.strokeStyle = color_grey_light;
				ctx.lineWidth = canvas.height / 50;
				drawRoundedRectangle(canvas.width * 0.1, canvas.height * 0.3, canvas.width * 0.8, canvas.height * 0.4, canvas.width * 0.04);

				//text
				var textSize = Math.floor(canvas.height / 32);
				var targetWidth = 0.75 * canvas.width;
				ctx.fillStyle = color_text;
				ctx.font = `${textSize}px Comfortaa`;
				ctx.textAlign = "center";
				ctx.fillText(`Exit to the map or choose a different character to continue.`, canvas.width * 0.5, canvas.height * 0.5)
				var targetText = eval(player.parentPrev.bannedCharacters[player.constructor.name]);
				//resize font based on text size
				ctx.font = `${Math.floor(textSize * (targetWidth / ctx.measureText(targetText).width))}px Comfortaa`;
				ctx.fillText(targetText, canvas.width * 0.5, canvas.height * 0.4);

				//drawing characters
				var charWidth = (canvas.width * 0.75) / this.selectionTextures.length;
				var targetY = canvas.height * 0.6;
				var multiplier = 1.2;
				for (var c=0; c<this.selectionTextures.length; c++) {
					var targetX = (canvas.width * 0.125) + (charWidth * c) + (charWidth * 0.5);
					
					//draw selection box if selectable
					if (data_persistent.unlocked.includes(data_characters[c]) && player.parentPrev.bannedCharacters[data_characters[c]] == undefined) {
						drawSelectionBox(targetX, targetY, menu_characterSize * 1.5);
					}
					this.selectionTextures[c].beDrawn(targetX, targetY, 0, menu_characterSize * multiplier);

					//draw lock if locked
					if (!data_persistent.unlocked.includes(data_characters[c])) {
						drawCharacterLock(targetX, targetY, menu_characterSize * 0.7, menu_characterSize * 0.7);
					}
				}
				break;
		}
		//logTimeEnd("total", "avg. frame time");
	}

	changePlayerParentOfficial() {
		this.orderWorld();
		//try the player in the closest few tunnels
		for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-10); v--) {
			if (this.nearObjs[v].playerIsInBounds()) {
				player.parent = this.nearObjs[v];
				player.parentPrev = player.parent;
				v = -1;

				//reset player's new tunnel
				player.parent.resetWithoutPlayer();
				this.orderWorld();
			}
		}
		//if they're still undefined, kill them
		if (player.parent == undefined) {
			this.handlePlayerDeath();
			return;
		}
		
		//display text
		this.text = player.parent.id;
		this.textTime = tunnel_textTime;

		//switch state if in an invalid tunnel
		if (player.parent.bannedCharacters[player.constructor.name] != undefined) {
			this.substate = 3;
		}
	}

	changePlayerParentUnofficial() {
		//try the player in the closest few tunnels
		for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-10); v--) {
			if (this.nearObjs[v].playerIsInTunnel()) {
				player.parent = this.nearObjs[v];
				player.parentPrev = player.parent;
				v = -1;

				player.parent.resetWithoutPlayer();

				//reorder objects anyways if found a new tunnel
				this.orderWorld();

				//display text
				this.text = player.parent.id;
				this.textTime = tunnel_textTime;

				//switch state if in an invalid tunnel
				if (player.parent.bannedCharacters[player.constructor.name] != undefined) {
					this.substate = 3;
				}
				return;
			}
		}
	}

	handlePlayerDeath() {
		player.parentPrev.reset();
		player.parent = player.parentPrev;
	}

	handleMouseDown(a) {
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = Math.round(a.clientX - canvasArea.left);
		cursor_y = Math.round(a.clientY - canvasArea.top);

		//if in menu, go back to regular
		if (this.substate == 1) {
			if (cursor_x > canvas.width * 0.35 && cursor_x < canvas.width * 0.6 && cursor_y > canvas.height * 0.2 && cursor_y < canvas.height * 0.8) {
				this.substate = 0;
			}
			return;
		}

		//if in character selection, select a new character
		if (this.substate == 3) {
			var charWidth = (canvas.width * 0.75) / this.selectionTextures.length;
			var targetY = canvas.height * 0.6;
			for (var c=0; c<data_characters.length; c++) {
				var targetX = (canvas.width * 0.125) + (charWidth * c) + (charWidth * 0.5);
				//if selectable and the cursor is on top, select it
				if (data_persistent.unlocked.includes(data_characters[c]) && player.parentPrev.bannedCharacters[data_characters[c]] == undefined) {
					console.log("helo");
					if (cursor_x > targetX - menu_characterSize * 1.5 && cursor_x < targetX + menu_characterSize * 1.5 && cursor_y > targetY - menu_characterSize * 1.5 && cursor_y < targetY + menu_characterSize * 1.5) {
						var pastPlayer = player;
						player = eval(`new ${data_characters[c]}(player.x, player.y, player.z)`);
						this.substate = 0;
						player.parentPrev = pastPlayer.parentPrev;
						player.parent = pastPlayer.parent;
						return;
					}
				}
			}
		}
	}

	handleEscape() {
		if (this.substate == 0) {
			this.substate = 1;
		} else {
			loading_state = new State_Map();
		}
	}

	orderWorld() {
		this.farObjs = [];
		this.nearObjs = [];

		this.readFrom.forEach(v => {
			//don't add player parent to the near objects, it will be drawn seperately
			if (v != player.parentPrev) {
				//get camera distance, then sort
				v.getCameraDist();
				if (v.cameraDist > render_maxDistance * 1.01) {
					this.farObjs.push(v);
				} else {
					
					this.nearObjs.push(v);
				}
			}
		});

		this.nearObjs = orderObjects(this.nearObjs, 5);
	}
}

class State_Challenge extends State_World {
	constructor(data, startLine) {
		super();
		this.readFrom = world_objects;
		

		this.data = data;
		this.line = startLine;

		this.substate = 0;
		this.fadeTime = challenge_fadeTime;
		this.texture = new Texture(data_sprites[this.data[0]].sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites[this.data[0]].front);

		this.textQueue = [];
		this.lowerTextTime = challenge_textTime;
		this.addTextToQueue();

		//place player
		this.targetParent = getObjectFromID(this.data[this.line][0]);
		console.log(this.data[this.line]);
		this.placePlayer();
	}

	addTextToQueue() {
		//split the input text
		var split = this.data[this.line][4].split("|");
		//add it all
		split.forEach(s => {
			if (s != "") {
				this.textQueue.push(s);
			}
		});
	}

	doTunnelStartEffects() {
		eval(this.data[this.line][2]);

		//if the next line exists, do that as well
		if (this.data[this.line+1] != undefined) {
			eval(this.data[this.line+1][2]);
		}
	}

	execute() {
		if (this.substate == 2) {
			//draw the fade out
			ctx.globalAlpha = challenge_opacity;
			ctx.fillStyle = color_challengeFadeout;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;

			this.fadeTime -= 1;
			if (this.fadeTime <= 0) {
				this.fadeTime = challenge_fadeTime;
				this.substate = 0;

				//replace player
				this.placePlayer();
			}
			return;
		}
		
		super.execute();
		//draw lower text
		if (this.substate == 0 && this.textQueue.length > 0) {
			this.lowerTextTime -= 1;
			if (this.lowerTextTime == 0) {
				this.lowerTextTime = challenge_textTime;
				this.textQueue.splice(0, 1);
				return;
			}

			var yOffset = Math.pow((this.lowerTextTime / (challenge_textTime / 2)) - 1, 12);
			var textSize = Math.min(canvas.height * 0.04, (canvas.width * 0.78) / (this.textQueue[0].length * 0.55));

			var yPos = (canvas.height * 0.92) + (yOffset * canvas.width * 0.08);
			ctx.fillStyle = color_grey_light;
			ctx.strokeStyle = color_grey_dark;
			drawRoundedRectangle(canvas.width * 0.1, yPos, canvas.width * 0.8, canvas.height * 0.06, canvas.height / 96);
			this.texture.beDrawn(canvas.width * 0.12, yPos, 0, menu_characterSize);
			ctx.fillStyle = color_text;
			ctx.font = `${textSize}px Comfortaa`;
			ctx.fillText(this.textQueue[0], (canvas.width * 0.5) + menu_characterSize, yPos + (canvas.height * 0.03) + (textSize / 2));
		}
		


		if (this.substate < 2 && player.parentPrev != this.targetParent) {
			this.updateLine();
			//if the player's parent / direction is different from the target, do a fadeout
			if (player.parentPrev != this.targetParent || player.backwards != this.data[this.line][1]) {
				this.substate = 2;
			}
		}
	}

	handleMouseDown(a) {
		super.handleMouseDown(a);
	}

	handleMouseMove(a) {

	}

	handleEscape() {
		super.handleEscape();
	}

	handlePlayerDeath() {
		//if off the end of the tunnel but not out of the tunnel, count the tunnel as completed
		if (player.parentPrev.coordinateIsInTunnel(player.x, player.y, player.z)) {
			player.parentPrev.resetWithoutPlayer();
			this.updateLine();
			this.substate = 2;
			return;
		}

		super.handlePlayerDeath();
		this.doTunnelStartEffects();
	}

	placePlayer() {
		player = eval(`new ${this.data[0]}(player.x, player.y, player.z)`);
		player.parent = this.targetParent;
		player.parentPrev = player.parent;
		player.backwards = this.data[this.line][1];
		player.parent.reset();
		player.tick();

		world_camera.x = world_camera.targetX;
		world_camera.y = world_camera.targetY;
		world_camera.z = world_camera.targetZ;

		//text
		this.text = player.parent.id;
		this.textTime = tunnel_textTime;
		this.orderWorld();

		this.doTunnelStartEffects();
	}

	updateLine() {
		this.line += 1;

		if (this.line > this.data.length-1) {
			//leave challenge mode if out of lines
			loading_state = new State_Map();
			player = new Runner(0, 0, 0);
			return;
		}

		this.targetParent = getObjectFromID(this.data[this.line][0]);
		this.addTextToQueue();

		this.doTunnelStartEffects();
	}
}


class State_Cutscene extends State_World {
	constructor(data) {
		//if there's no data, make sure there is data
		if (data == undefined) {
			data = {
				id: `New Cutscene`,
				effects: ``,
				frames: [
					[[world_camera.x, world_camera.y, world_camera.z, world_camera.theta, world_camera.phi, world_camera.rot], []]
				]
			}
		}

		super();
		this.readFrom = world_objects;
		this.frame = 0;
		this.id = data.id;
		this.effects = data.effects;
		//activate effects
		eval(this.effects);
		this.data = data.frames;
		this.doDraw = true;
		this.selected = undefined;
		this.updateFrame();

		editor_snapTolerance *= 2.2;

		
	}

	drawSidebar() {
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width * editor_cutsceneWidth, canvas.height);
		ctx.globalAlpha = 1;

		var targetX = (editor_cutsceneWidth / 3) * canvas.width;
		var targetY = 0;
		//cutscene objects
		for (var a=0; a<5; a++) {
			targetY = ((canvas.height / 5) * a) + (canvas.height / 10);
			drawTile2d(targetX, targetY, canvas.height / 30, 20 + a);
		}

		targetX = (editor_cutsceneWidth / 1.5) * canvas.width;
		//texture objects
		for (var a=0; a<10; a++) {
			targetY = ((canvas.height / 10) * a) + (canvas.height / 20);
			this.selectionTextures[a].beDrawn(targetX, targetY, 0, canvas.height / 15);
		}
	}

	execute() {
		if (this.doDraw || editor_active) {
			//'background' objects
			drawSky(color_bg);
			this.farObjs.forEach(f => {
				f.beDrawn_LowDetail();
			});
			this.nearObjs.forEach(f => {
				f.beDrawn();
			});

			//draw cutscene objects
			this.data[this.frame][1].forEach(d => {
				d.beDrawn();
			});

			//editor only things
			if (editor_active) {
				//show frame number at the top
				ctx.fillStyle = color_text_bright;
				ctx.font = `${canvas.height * 0.06}px Comfortaa`;
				var text = `${this.frame+1} / ${this.data.length}`;
				ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.05);

				//sidebar
				this.drawSidebar();

				//ticking
				world_camera.tick();

				//tick selected object
				if (this.selected != undefined) {
					this.selected.tick();
					if (this.selected.selectedPart == undefined) {
						this.selected = undefined;
					}
				}
				//move player towards parent
				player.x = world_camera.x;
				player.y = world_camera.y;
				player.z = world_camera.z;

				world_camera.targetX = world_camera.x;
				world_camera.targetY = world_camera.y;
				world_camera.targetZ = world_camera.z;

				//also update frame info
				this.data[this.frame][0] = [world_camera.x, world_camera.y, world_camera.z, world_camera.theta, world_camera.phi, world_camera.rot];
			}
		}
	}

	giveEnglishConstructor() {
		//go through all frames
		var frameData = ``;
		for (var d=0; d<this.data.length; d++) {
			var frame = this.data[d];

			var camData = ``;
			for (var a=0; a<frame[0].length-1; a++) {
				camData += frame[0][a].toFixed(4) + ", ";
			}
			camData += frame[0][frame[0].length-1].toFixed(4);

			var objData = ``;
			for (var a=0; a<frame[1].length-1; a++) {
				objData += frame[1][a].giveEnglishConstructor() + ", ";
			}
			if (frame[1].length > 0) {
				objData += frame[1][frame[1].length-1].giveEnglishConstructor();
			}
			

			frameData += `[[${camData}], [${objData}]], \n`;
		}

		//apologies for the indenting here, it's so that when the string is outputted it won't have extra tabs at the start
var outputString = `{
	id: '${this.id}',
	effects: '${this.effects}',
	frames: [
		${frameData}]
}`;

		return outputString;
	}

	handlePlayerDeath() {
		//no death in cutscenes
	}

	handleMouseMove(a) {
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = Math.round(a.clientX - canvasArea.left);
		cursor_y = Math.round(a.clientY - canvasArea.top);
	}

	handleMouseDown(a) {
		//in regular mode
		if (!editor_active) {
			this.frame += 1;
			if (this.data[this.frame] != undefined) {
				this.updateFrame();
			} else {
				//exiting gracefully
				loading_state = new State_Map();
			}
			return;
		}
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = Math.round(a.clientX - canvasArea.left);
		cursor_y = Math.round(a.clientY - canvasArea.top);

		//sidebar search
		var targetX = (editor_cutsceneWidth / 3) * canvas.width;
		var targetY = 0;
		var sidebarObjects = 5;
		//cutscene objects
		//box
		if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / sidebarObjects) * 0) + (canvas.height / (sidebarObjects * 2))]) < canvas.height / 30) {
			this.data[this.frame][1].push(new SceneBox(0.5, 0.5, 0.1, 0.1));
			return;
		}

		//bubble
		if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / sidebarObjects) * 1) + (canvas.height / (sidebarObjects * 2))]) < canvas.height / 30) {
			this.data[this.frame][1].push(new SceneBubble(0.5, 0.5, 0.1, 0.1));
			return;
		}

		//line
		if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / sidebarObjects) * 2) + (canvas.height / (sidebarObjects * 2))]) < canvas.height / 30) {
			this.data[this.frame][1].push(new SceneTri(0.4, 0.4, 0.6, 0.6, 0.1));
			return;
		}

		//text
		if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / sidebarObjects) * 3) + (canvas.height / (sidebarObjects * 2))]) < canvas.height / 30) {
			this.data[this.frame][1].push(new SceneText(0.5, 0.5, 0.1, 0.05, "lorem ipsum dolor set amet", false));
			return;
		}

		//light source
		if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / sidebarObjects) * 4) + (canvas.height / (sidebarObjects * 2))]) < canvas.height / 30) {
			var offset = polToCart(world_camera.theta, world_camera.phi, 30);
			this.data[this.frame][1].push(new SceneLight(offset[0] + world_camera.x, offset[1] + world_camera.y, offset[2] + world_camera.z));
			return;
		}

		targetX = (editor_cutsceneWidth / 1.5) * canvas.width;
		//texture objects
		for (var a=0; a<10; a++) {
			targetY = ((canvas.height / 10) * a) + (canvas.height / 20);
			if (getDistance2d([cursor_x, cursor_y], [targetX, targetY]) < canvas.height / 15) {
				this.data[this.frame][1].push(new SceneSprite(0.5, 0.5, 0.1, `data_sprites.${data_characters[a]}.sheet`, 0, false, 0, 0));
				return;
			}
		}

		//search through list of objects and potentially make one selected
		for (var h=this.data[this.frame][1].length-1; h>-1; h--) {
			if (this.data[this.frame][1][h].becomeSelected() == true) {
				this.selected = this.data[this.frame][1][h];
				return;
			}
		}
	}

	handleEscape() {
		if (editor_active) {
			this.updateFrame();
			return;
		}

		editor_snapTolerance /= 2.2;
		loading_state = new State_Menu();
	}

	updateFrame() {
		this.doDraw = true;
		//camera properties
		world_camera.x = this.data[this.frame][0][0];
		world_camera.y = this.data[this.frame][0][1];
		world_camera.z = this.data[this.frame][0][2];
		world_camera.theta = this.data[this.frame][0][3];
		world_camera.phi = this.data[this.frame][0][4];
		world_camera.rot = this.data[this.frame][0][5];
		world_camera.reconcileTargets();
		world_camera.tick();

		//player properties
		player.parent = undefined;
		player.parentPrev = undefined;
		player.x = world_camera.x;
		player.y = world_camera.y;
		player.z = world_camera.z;

		//update light sources
		world_lightObjects = [];
		this.data[this.frame][1].forEach(v => {
			if (v.z != undefined) {
				world_lightObjects.push(v);
			}
		});

		//ordering 
		this.orderWorld();

		//tick all objects
		this.nearObjs.forEach(n => {
			n.tick();
		});

		//do lighting for the closest few tunnels
		for (var n=Math.max(0, this.nearObjs.length-1); n>Math.max(0, this.nearObjs.length-20); n--) {
			this.nearObjs[n].doComplexLighting();
		}
	}
}


class State_Game extends State_World {
	constructor() {
		super();
		this.readFrom = world_objects;
		this.isMainGame = true;

		this.orderWorld();
	}

	execute() {
		super.execute();
		if (this.substate == 1) {
			//backwards toggle
			drawArrow((canvas.width * 0.5) - (canvas.width * 0.04) + (canvas.width * 0.08 * player.backwards), canvas.height * 0.94, color_grey_light, Math.PI * player.backwards, canvas.width * 0.045, canvas.width * 0.025, canvas.height * 0.03, canvas.height * 0.06);
			ctx.lineWidth = 2;
		}
	}

	handleMouseDown(a) {
		//regular interactions
		super.handleMouseDown(a);

		if (this.substate == 1) {
			//backwards toggle interact
			if (player.parent != undefined && cursor_x > canvas.width * 0.45 && cursor_x < canvas.width * 0.55 && cursor_y > canvas.height * 0.9 && cursor_y < canvas.height * 0.99) {
				player.turnAround();
				player.parent.reset();
				this.substate = 0;
				this.execute();
				this.substate = 1;
				return;
			}
		}
	}

	handleMouseMove(a) {

	}
}

class State_Infinite extends State_World {
	constructor() {
		super();

		//move camera to start so objects are ordered properly, but I also want that nice zoom in effect, so the camera is far away
		world_camera.x = -100;
		world_camera.y = 400;
		world_camera.z = -2000;
		player.backwards = false;

		//data for each individual run
		this.time = 0;
		this.distance = 0;
		this.powercells = 0;
		this.difficulty = 0;
		this.difficultyBoost = 3.5;

		this.characterData = {
		};

		this.charactersUsed = [];

		this.drawEnding = true;

		//game stuff
		this.data = levelData_infinite.split("\n");
		this.lastTunnelLine = -1;
		this.objs = [];
		this.readFrom = this.objs;
		for (var a=0; a<6; a++) {
			this.addTunnel();
		}
		this.placePlayer();
		this.orderWorld();
	}

	addTunnel() {
		//if a tunnel is already there, set start coords to that tunnel end
		var [sX, sZ, sT] = [0, 0, 0, 0];
		if (this.objs.length > 0) {
			sT = this.objs[this.objs.length - 1].theta;
			sX = this.objs[this.objs.length - 1].endPos[0] - (tunnel_transitionLength * Math.sin(sT));
			sZ = this.objs[this.objs.length - 1].endPos[2] + (tunnel_transitionLength * Math.cos(sT));
			
		}

		//randomly change theta a bit, the complication is to stay within bounds (0 - 2pi)
		sT = (sT + (Math.random() * 0.6) + ((Math.PI * 2) - 0.3)) % (Math.PI * 2);

		var value = Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange));
		while (value == this.lastTunnelLine) {
			value = Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange));
		}
		this.lastTunnelLine = value;
		this.objs.push(new Tunnel_FromData(this.data[value]));
		var refObj = this.objs[this.objs.length-1];
		refObj.theta = sT;
		refObj.updatePosition(sX, 0, sZ);

		//placing power cells
		var apothemLength = (refObj.tilesPerSide * refObj.tileSize) / (2 * Math.tan(Math.PI / refObj.sides));
		var truePowercells = powercells_perTunnel;
		if (player instanceof Gentleman) {
			truePowercells = Math.round(truePowercells * powercells_gentlemanMultiplier);
		}
		for (var a=0; a<truePowercells; a++) {
			var rotation = randomBounded(0, Math.PI * 2);

			//get offset
			var offset = polToCart(Math.PI / 2, rotation, apothemLength * randomBounded(0.3, 0.9));
			offset[2] = ((a + 0.5) / truePowercells) * refObj.len * refObj.tileSize;

			//rotate offset for true position
			[offset[0], offset[2]] = rotate(offset[0], offset[2], refObj.theta);
			
			refObj.freeObjs.push(new Powercell(refObj.x + offset[0], refObj.y + offset[1], refObj.z + offset[2], refObj));
		}
		
		
		//updating difficulty
		this.difficulty += this.difficultyBoost;
		if (this.difficulty + infinite_levelRange > this.data.length-1) {
			this.difficulty = this.data.length - 1 - infinite_levelRange;
		}
		this.orderWorld();
	}

	placePlayer() {
		this.substate = 0;
		ctx.lineWidth = 2;

		//putting player into world officially
		player.parentPrev = this.objs[0];
		player.parent = player.parentPrev;
		player.parentPrev.reset();
		player.dz = 0;
		player.dy = 0.3;

		//add player's type to data object
		this.characterData[player.constructor.name] = {
			distance: 0,
			powercells: 0,
			time: 0
		};
		this.charactersUsed.push(player.constructor.name);

		player.parent.strips.forEach(s => {
			s.collideWithEntity(player);
		});
	}

	execute() {
		switch (this.substate) {
			case 0:
				//update run data
				this.distance += player.dz / 30;
				this.time += 1;
				this.characterData[player.constructor.name].distance += player.dz / 30;
				this.characterData[player.constructor.name].time += 1;

				super.execute();
				//drawing stats text
				ctx.fillStyle = color_text_bright;
				ctx.textAlign = "left";
				ctx.font = `${canvas.height / 22}px Comfortaa`;
				ctx.fillText(`${this.distance.toFixed(0)} m`, canvas.width * 0.02, canvas.height * 0.05);
				var add = "";
				if (this.powercells != 1) {
					add = "s";
				}
				ctx.fillText(`${this.powercells} power cell${add}`, canvas.width * 0.02, (canvas.height * 0.05) + (canvas.height / 21));
				ctx.textAlign = "center";

				//add tunnel and remove previous tunnel after displaying text
				if (this.textTime == 1) {
					if (this.objs[0] != player.parent) {
						this.objs.splice(0, 1);
					}
					this.addTunnel();
				}
				break;
			case 1:
				super.execute();
				break;
			case 2:
				if (this.drawEnding) {
					drawInfiniteEndScreen();
					this.drawEnding = false;
				}

		}
	}

	handlePlayerDeath() {
		if (this.distance > 20) {
			this.substate = 2;
			data_persistent.powercells += this.characterData[player.constructor.name].powercells;
		} else {
			player.parentPrev.reset();
			player.parent = player.parentPrev;
			this.distance = 0;
			this.characterData[player.constructor.name].distance = 0;
		}
	}


	handleEscape() {
		switch (this.substate) {
			case 0:
				this.substate = 1;
				break;
			case 1:
				loading_state = new State_Menu();
				break;
			case 2:
				loading_state = new State_Infinite();
				break;
		}
	}

	handleMouseMove(a) {

	}

	handleMouseDown(a) {
		//if in the menu, attempt to pick a new character
		if (this.substate == 2) {
			//updating cursor position
			var canvasArea = canvas.getBoundingClientRect();
			cursor_x = Math.round(a.clientX - canvasArea.left);
			cursor_y = Math.round(a.clientY - canvasArea.top);

			//getting character order to choose from them
			var characterList = [];
			loading_state.charactersUsed.forEach(c => {
				characterList.push(c);
			});

			data_characters.forEach(c => {
				if (!characterList.includes(c)) {
					characterList.push(c);
				}
			});

			for (var a=loading_state.charactersUsed.length; a<11; a++) {
				var offY = canvas.height * 0.25 * Math.floor(a / 5);
				var offX = canvas.width * 0.6 * ((a % 5) / 5);

				//only continue if the character at the specified index is real
				if (loading_state.selectionTextures[data_characters.indexOf(characterList[a])] != undefined && data_persistent.unlocked.includes(characterList[a])) {
					//if the player has clicked on the box for the character, send them into the infinite mode thingy again
					if (cursor_x > (canvas.width * 0.35) + offX - menu_characterSize && cursor_x < (canvas.width * 0.35) + offX + menu_characterSize && 
						cursor_y > (canvas.height * 0.13) + offY && cursor_y < (canvas.height * 0.13) + offY + (menu_characterSize * 2)) {
						this.drawEnding = true;
						player = eval(`new ${characterList[a]}(${player.x}, ${player.y}, ${player.z})`); 
						this.placePlayer();
					}
				}
			}
		} else {
			super.handleMouseDown(a);
		}
	}

	//don't bother with the near / far thing, there aren't going to be any tunnels far enough to qualify
	orderWorld() {
		//ordering all the objects
		this.readFrom.forEach(u => {
			u.getCameraDist();
		});

		//make sure to splice out player parent though
		this.nearObjs = [];
		this.readFrom.forEach(r => {
			if (r != player.parentPrev) {
				this.nearObjs.push(r);
			}
		});

		this.nearObjs = orderObjects(this.nearObjs, 5);
	}
}

class State_Loading {
	constructor() {
		this.time = 10;
	}

	execute() {
		if (this.time == 10) {
			//drawing background
			ctx.fillStyle = color_bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		
		for (var s=0; s<14; s++) {
			this.time += 1;
			var xAdd = (this.time * (canvas.height / 480) * Math.cos((Math.PI * 0.666 * this.time) + Math.pow(randomSeeded(-0.8, 0.8), 3)));
			var yAdd = (this.time * (canvas.height / 480) * Math.sin((Math.PI * 0.666 * this.time) + Math.pow(randomSeeded(-0.8, 0.8), 3)));
			drawCircle(color_stars, (canvas.width * 0.5) + xAdd, (canvas.height * 0.5) + yAdd, randomSeeded(3, 7));

			//loading tunnels at certain times
			if (this.time % 15 == 0) {
				var index = (this.time / 15) - 1;
				
				if (index < data_levelSets.length) {
					//loading in a level set
					placeTunnelSet(eval(`levelData_${data_levelSets[index]}`));
					console.log(`placed ${data_levelSets[index]}`);
				}

				if (this.time == 540) {
					//story things after loading all levels
					updatePlotProgression();
				}
			}
		}
		if (this.time > 540) {
			loading_state = new State_Menu();
		}
	}

	handleMouseDown(a) {

	}

	handleMouseMove(a) {

	}
}

class State_Map {
	constructor() {
		world_camera.x = 0;
		world_camera.y = map_height;
		world_camera.z = map_zOffset;

		world_camera.phi = -0.5 * Math.PI;
		world_camera.theta = -0.5 * Math.PI;
		world_camera.rot = 0;

		//targets
		world_camera.targetRot = world_camera.rot;
		world_camera.targetTheta = world_camera.theta;

		world_camera.targetX = world_camera.x;
		world_camera.targetY = world_camera.y;
		world_camera.targetZ = world_camera.z;

		this.levelSelected = undefined;
		this.cursorPos = [-100, -100];

		//clear player's previous levels
		player.parent = undefined;
		player.parentPrev = undefined;
		player.x = 1e10;
		player.y = 1e10;
		player.z = 1e10;

		this.dir_held = false;
	}

	execute() {
		//turn player movement into camera movement
		if (player.ax != 0) {
			if (!this.dir_held) {
				world_camera.targetZ += map_shift * (player.ax / Math.abs(player.ax));
				world_camera.targetZ = clamp(world_camera.targetZ, (-2 * map_shift) + map_zOffset, (2 * map_shift) + map_zOffset);
				this.cursorPos = [-100, -100];
				this.dir_held = true;
			}
		} else {
			this.dir_held = false;
		}

		world_camera.tick();
		//draw sky
		drawSky(color_map_bg);

		//draw world objects
		ctx.lineWidth = canvas.height / 480;
		ctx.strokeStyle = color_map_writing;
		world_objects.forEach(w => {
			w.beDrawnOnMap();
		});

		//if only one object has been discovered, it's the first level and should have the pointer drawn around it
		if (data_persistent.discovered.length == 1) {
			var orbitCoords = getObjectFromID("Level 1").map_circleCoords;
			var multiplier = 0.5 + ((Math.sin(world_time / 35) + 1) * 0.2);
			ctx.strokeStyle = color_editor_cursor;
			ctx.beginPath();
			ctx.ellipse(orbitCoords[0], orbitCoords[1], editor_thetaCircleRadius * multiplier, editor_thetaCircleRadius * multiplier, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
		

		var fontSize = Math.floor(canvas.height / 24);
		ctx.font = `${fontSize}px Comfortaa`;
		ctx.textAlign = "center";

		//draw selected object + extra UI
		if (editor_active) {
			if (editor_selected != undefined) {
				//drawing cursor
				drawCircle(color_editor_cursor, cursor_x, cursor_y, 4);

				//drawing theta circle + knob
				ctx.beginPath();
				ctx.strokeStyle = color_editor_cursor;
				ctx.ellipse(editor_selected.map_startCoords[0], editor_selected.map_startCoords[1], editor_thetaCircleRadius, editor_thetaCircleRadius, 0, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.ellipse(editor_selected.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(editor_selected.theta)), editor_selected.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(editor_selected.theta)), editor_thetaKnobRadius, editor_thetaKnobRadius, 0, 0, Math.PI * 2);
				ctx.fill();
				
				ctx.fillStyle = color_text;
				ctx.fillText(`selected-id: ${editor_selected.id}`, canvas.width * 0.5, canvas.height * 0.1);
				ctx.fillText(`θ: ${editor_selected.theta}`, canvas.width * 0.5, (canvas.height * 0.1) + fontSize);
			} else {
				ctx.fillStyle = color_text;
				ctx.fillText(`selected-id: undefined`, canvas.width * 0.5, canvas.height * 0.1);
				ctx.fillText(`θ: undefined`, canvas.width * 0.5, (canvas.height * 0.1) + fontSize);
			}

			//border around screen
			ctx.strokeStyle = color_editor_border;
			ctx.lineWidth = canvas.height / 20;
			ctx.globalAlpha = 0.5;
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.stroke();
			ctx.globalAlpha = 1;
		} else {
			//drawing the name of the level the user hovers over
			drawCircle(color_editor_cursor, this.cursorPos[0], this.cursorPos[1], 4);
			if (this.levelSelected != undefined) {
				ctx.fillStyle = color_text;
				ctx.fillText(this.levelSelected.id, canvas.width * 0.5, canvas.height * 0.1);
			}
		}
	}

	handleEscape() {
		loading_state = new State_Menu();
	}


	//mouse handling functions, ack this is ugly
	handleMouseDown(a) {
		if (editor_active) {
			var canvasArea = canvas.getBoundingClientRect();
			if (editor_selected != undefined) {
				var knobCoords = [editor_selected.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(editor_selected.theta)), editor_selected.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(editor_selected.theta))];
	
				//if colliding with the theta change circle, do that stuff
				if (getDistance2d(knobCoords, [Math.round(a.clientX - canvasArea.left), Math.round(a.clientY - canvasArea.top)]) < editor_thetaKnobRadius) {
					editor_changingTheta = true;
					var diffX = Math.round(a.clientX - canvasArea.left) - cursor_x;
					var diffY = -1 * (Math.round(a.clientY - canvasArea.top) - cursor_y);
					editor_selected.theta = (Math.atan2(diffY, diffX) + (Math.PI * 2)) % (Math.PI * 2);
					editor_selected.updatePosition(editor_selected.x, editor_selected.y, editor_selected.z);
				} else {
					editor_changingTheta = false;
					editor_selected = undefined;
				}
			} else {
				//update cursor position
				cursor_x = Math.round(a.clientX - canvasArea.left);
				cursor_y = Math.round(a.clientY - canvasArea.top);
	
				//modifying regular tunnels
	
				//loop through all world objects, if one is close enough, make it the selected one
				for (var a=0; a<world_objects.length; a++) {
					if (getDistance2d(world_objects[a].map_circleCoords, [cursor_x, cursor_y]) < editor_clickTolerance) {
						editor_selected = world_objects[a];
						cursor_x = world_objects[a].map_circleCoords[0];
						cursor_y = world_objects[a].map_circleCoords[1];
						a = world_objects.length + 1;
					}
				}
			}
		} else {
			//going into the level that's selected
			if (loading_state instanceof State_Map && loading_state.levelSelected != undefined) {
				//ordering all the objects
				world_objects.forEach(u => {
					u.getCameraDist();
				});
				world_objects = orderObjects(world_objects, 8);
				player.parentPrev = loading_state.levelSelected;
				loading_state = new State_Game();
				player.parentPrev.reset();
	
				//displaying text
				loading_state.text = player.parentPrev.id;
				loading_state.time = tunnel_textTime;
			}
		}
	}

	handleMouseMove(a) {
		var canvasArea = canvas.getBoundingClientRect();

		if (editor_active) {
			if (cursor_down && editor_selected != undefined) {
				if (editor_changingTheta) {
					//update selected tunnel direction
					var diffX = Math.round(a.clientX - canvasArea.left) - cursor_x;
					var diffY = -1 * (Math.round(a.clientY - canvasArea.top) - cursor_y);
					editor_selected.theta = (Math.atan2(diffY, diffX) + (Math.PI * 2)) % (Math.PI * 2);
					editor_selected.updatePosition(editor_selected.x, editor_selected.y, editor_selected.z);
					cursor_x = editor_selected.map_circleCoords[0];
					cursor_y = editor_selected.map_circleCoords[1];
				} else {
					//moving the tunnel
					cursor_x = Math.round(a.clientX - canvasArea.left);
					cursor_y = Math.round(a.clientY - canvasArea.top);

					var snapX = cursor_x;
					var snapY = cursor_y;

					//if a tunnel end is close enough to the tunnel start, snap the tunnel to that position
					var startSelectOffset = [editor_selected.map_startCoords[0] - editor_selected.map_circleCoords[0], editor_selected.map_startCoords[1] - editor_selected.map_circleCoords[1]];
					//calculating tunnel end pos
					for (var a=0; a<world_objects.length; a++) {
						if (world_objects[a] != editor_selected) {
							var endPos = world_objects[a].map_endCoords;
							if (getDistance2d([endPos[0], endPos[1]], [snapX + startSelectOffset[0], snapY + startSelectOffset[1]]) < editor_snapTolerance) {
								//moving position of selection
								//get difference between tunnel start coordinates and selected coordinates
								snapX = endPos[0] - startSelectOffset[0];
								snapY = endPos[1] - startSelectOffset[1];
							}
						}
					}

					//update selected tunnel position
					if (editor_selected != undefined) {
						var offset = [editor_selected.map_startCoords[0] - editor_selected.map_circleCoords[0], editor_selected.map_startCoords[1] - editor_selected.map_circleCoords[1]];
						var newCoords = screenToSpace([snapX + offset[0], snapY + offset[1]], world_camera.y);
						editor_selected.updatePosition(newCoords[0], newCoords[1], newCoords[2]);
					}
				}
			}
		} else {
			if (loading_state instanceof State_Map) {
				//if mousing over a level, set the ID to the display text
				var testX = Math.round(a.clientX - canvasArea.left);
				var testY = Math.round(a.clientY - canvasArea.top);

				//resetting both text and position
				loading_state.levelSelected = undefined;
				loading_state.cursorPos = [-100, -100];

				//if a tunnel end is close enough, snap the tunnel to that position
				//calculating tunnel end pos
				for (var a=0; a<world_objects.length; a++) {
					var tunnelPos = world_objects[a].map_circleCoords;
					if (getDistance2d([tunnelPos[0], tunnelPos[1]], [testX, testY]) < editor_snapTolerance && world_objects[a].discovered) {
						loading_state.cursorPos = tunnelPos;
						loading_state.levelSelected = world_objects[a];
						a = world_objects.length + 1;
					}
				}
			}
		}
	}
}

class State_Menu {
	constructor() {
		ctx.strokeStyle = color_grey_dark;

		this.overButton = -1;
		this.buttons = menu_buttons;

		this.selectionTextures = [];
		for (var t=0; t<data_characters.length; t++) {
			this.selectionTextures.push(new Texture(eval(`data_sprites.${data_characters[t]}.sheet`), data_sprites.spriteSize, 2, false, false, eval(`data_sprites.${data_characters[t]}.back`)));
		}

		this.characterSelected = 0;
		this.displayCharacterSelected = 0;

		//switch character selected
		for (var t=0; t<data_characters.length; t++) {
			if (player.constructor.name == data_characters[t]) {
				this.characterSelected = t;
				this.displayCharacterSelected = t;
			}
		}
	}
	execute() {
		//swivel display character
		this.displayCharacterSelected = ((this.displayCharacterSelected * (render_animSteps - 1)) + this.characterSelected) / render_animSteps;

		//bege
		ctx.fillStyle = color_bg;
		ctx.strokeStyle = color_grey_dark;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//title card
		ctx.font = `${canvas.height / 8}px Comfortaa`;
		ctx.textAlign = `center`;
		ctx.fillStyle = color_text_bright;
		ctx.fillText(`Run 3`, canvas.width * 0.5, canvas.height * 0.13);

		//powercell readout
		ctx.font = `${canvas.height / 24}px Comfortaa`;
		ctx.textAlign = `left`;
		ctx.fillText(`${data_persistent.powercells} power cells`, canvas.width * 0.02, canvas.height * 0.05);
		ctx.textAlign = `center`;

		
		//mode select

		//drawing buttons
		var trueButtonWidth = (canvas.width * menu_buttonWidth * 0.5);
		var trueButtonHeight = (canvas.height * menu_buttonHeight * 0.5);
		var startHeight = (canvas.height * 0.5) - (trueButtonHeight * this.buttons.length * 1.5);

		ctx.lineWidth = canvas.height / 96;
		ctx.font = `${canvas.height / 30}px Comfortaa`;
		for (var y=0; y<this.buttons.length; y++) {
			var yOffset = startHeight + (trueButtonHeight * 4 * y) + menu_characterSize;
			if (this.overButton == y) {
				ctx.fillStyle = color_grey_dark;
			} else {
				ctx.fillStyle = color_grey_light;
			}
			drawRoundedRectangle((canvas.width * 0.5) - trueButtonWidth, yOffset, trueButtonWidth * 2, trueButtonHeight * 2, canvas.height / 48);
			
			//text
			ctx.fillStyle = color_text;
			ctx.fillText(this.buttons[y][0], canvas.width * 0.5, yOffset + trueButtonHeight + (canvas.height / 90));
		}

		//drawing characters

		//selection box
		var offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * this.displayCharacterSelected) - (Math.PI * 0.5));
		var offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * this.displayCharacterSelected) - (Math.PI * 0.5));
		drawSelectionBox((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize - 5, menu_characterSize * 2);

		for (var h=0; h<data_characters.length; h++) {
			offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5));
			offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5));
			//character texture
			this.selectionTextures[h].beDrawn((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize, 0, menu_characterSize * 1.7);
			if (!data_persistent.unlocked.includes(data_characters[h])) {
				drawCharacterLock((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + (menu_characterSize * 0.75), menu_characterSize, menu_characterSize);
			}
		}
	}

	handleMouseDown(a) {
		if (this.overButton > -1) {
			loading_state = eval(this.buttons[this.overButton][1]);
		} else {
			//checking for collision with characters. This is done here instead of the mouseMove function because hovering over characters doesn't do anything.
			for (var h=0; h<data_characters.length; h++) {
				var posX = (canvas.width * 0.5) + (menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5)));
				var posY = (canvas.height * 0.5) + menu_characterSize + (menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5)));
	
				//selection box
				if (cursor_x > posX - menu_characterSize && cursor_x < posX + menu_characterSize &&
				cursor_y > posY - menu_characterSize && cursor_y < posY + menu_characterSize &&
				data_persistent.unlocked.includes(data_characters[h])) {
					this.characterSelected = h;
					player = eval(`new ${data_characters[h]}(0, 0, 0)`);
					if (Math.abs(this.characterSelected - this.displayCharacterSelected) > data_characters.length / 2) {
						if (this.characterSelected < this.displayCharacterSelected) {
							this.displayCharacterSelected -= data_characters.length;
						} else {
							this.displayCharacterSelected += data_characters.length;
						}
					}
				}
			}
		}
	}

	handleMouseMove(a) {
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = a.clientX - canvasArea.left;
		cursor_y = a.clientY - canvasArea.top;

		this.overButton = -1;

		//check for collision with center buttons
		var trueButtonWidth = (canvas.width * menu_buttonWidth * 0.5);
		var trueButtonHeight = (canvas.height * menu_buttonHeight * 0.5);
		var startHeight = (canvas.height * 0.5) - (trueButtonHeight * this.buttons.length * 1.5);
		for (var y=0; y<this.buttons.length; y++) {
			var yOffset = startHeight + (trueButtonHeight * 4 * y) + trueButtonHeight + (canvas.height / 16);

			if (cursor_x > (canvas.width * 0.5) - trueButtonWidth && cursor_x < (canvas.width * 0.5) + trueButtonWidth &&
				cursor_y > yOffset - trueButtonHeight && cursor_y < yOffset + trueButtonHeight) {
					this.overButton = y;
			}
		}
	}
}

