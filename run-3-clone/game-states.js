//state world is never used, but it's here so that the game state, infinite state, and cutscene states can share code
class State_World {
	constructor() {
		this.nearObjs = [];
		this.farObjs = [];
		this.readFrom = [];
		this.substate = 0;
		this.text = ``;
		this.textTime = 0;
		this.parentControlsAudio = true;

		this.orderWorld();

		//make sure to switch into substate 3 if the player is in a bad tunnel
		if (player.parentPrev != undefined) {
			if (player.parentPrev.bannedCharacters[player.constructor.name] != undefined) {
				this.substate = 3;
			}
		}

		//audio slider
		this.audioSlider = new PropertySlider(0.4, 0.85, 0.2, 0.14, "vol", `audio_channel1.volume = value; audio_channel2.volume = value;`, `audio_channel1.volume`, 0, 1, 0.01, false);
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
				//ticking near objects
				this.nearObjs.forEach(n => {
					n.tick();
				});

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
				//pause button
				ctx.fillStyle = color_grey_light;
				ctx.strokeStyle = color_grey_dark;
				ctx.lineWidth = canvas.height / 50;
				drawRoundedRectangle(canvas.width * 0.35, canvas.height * 0.2, canvas.width * 0.1, canvas.height * 0.6, canvas.height * 0.03);
				drawRoundedRectangle(canvas.width * 0.55, canvas.height * 0.2, canvas.width * 0.1, canvas.height * 0.6, canvas.height * 0.03);
				ctx.lineWidth = canvas.height / 100;

				//background for audio slider
				ctx.lineWidth = canvas.height / 240;
				ctx.fillStyle = color_grey_light;
				ctx.strokeStyle = color_menuSelectionOutline;
				drawRoundedRectangle((canvas.width * 0.5) - (canvas.width * 0.11), (canvas.height * 0.85) - (canvas.height * 0.03), canvas.width * 0.22, canvas.height * 0.06, canvas.width * 0.02);

				//audio slider
				this.audioSlider.beDrawn();
				this.audioSlider.tick();
				data_persistent.settings.volume = audio_channel1.volume;

				//tunnel text
				ctx.fillStyle = color_text_bright;
				ctx.font = `${canvas.height / 15}px Comfortaa`;
				ctx.textAlign = "center";
				if (player.parent == undefined) {
					ctx.fillText("Space", canvas.width * 0.5, canvas.height * 0.075);
				} else {
					ctx.fillText(player.parent.id, canvas.width * 0.5, canvas.height * 0.1);
				}
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
				var charWidth = (canvas.width * 0.75) / textures_common.length;
				var targetY = canvas.height * 0.6;
				var multiplier = 1.2;
				for (var c=0; c<textures_common.length; c++) {
					var targetX = (canvas.width * 0.125) + (charWidth * c) + (charWidth * 0.5);
					
					//draw selection box if selectable
					if (data_persistent.unlocked.includes(data_characters[c]) && player.parentPrev.bannedCharacters[data_characters[c]] == undefined) {
						drawSelectionBox(targetX, targetY, menu_characterSize * 1.5, menu_characterSize * 1.5);
					}
					textures_common[c].beDrawn(targetX, targetY, 0, menu_characterSize * multiplier);

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
		//try the player in the closest tunnels
		for (var v=this.nearObjs.length-1; v>=0; v--) {
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
		for (var v=this.nearObjs.length-1; v>=0; v--) {
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
		this.orderWorld();
		var self = this;
		window.setTimeout(() => {
			self.orderWorld();
		}, 100);
		player.parent = player.parentPrev;
	}

	handleMouseDown(a) {
		updateCursorPos(a);

		//if in menu, go back to regular
		if (this.substate == 1) {
			if (cursor_x > canvas.width * 0.35 && cursor_x < canvas.width * 0.6 && cursor_y > canvas.height * 0.2 && cursor_y < canvas.height * 0.8) {
				this.substate = 0;
			}
			return;
		}

		//if in character selection, select a new character
		if (this.substate == 3) {
			var charWidth = (canvas.width * 0.75) / textures_common.length;
			var targetY = canvas.height * 0.6;
			for (var c=0; c<data_characters.length; c++) {
				var targetX = (canvas.width * 0.125) + (charWidth * c) + (charWidth * 0.5);
				//if selectable and the cursor is on top, select it
				if (data_persistent.unlocked.includes(data_characters[c]) && player.parentPrev.bannedCharacters[data_characters[c]] == undefined) {
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

	handleMouseMove(a) {
		updateCursorPos(a);
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
			//get camera distance, then sort
			v.getCameraDist();
			if (v.cameraDist > render_maxDistance * 1.01) {
				this.farObjs.push(v);
			} else {
				
				this.nearObjs.push(v);
			}
		});

		this.nearObjs = orderObjects(this.nearObjs, 5);
	}

	handleKeyPress(a) {
		if (!editor_active) {
			handleKeyPress_player(a);
			switch(a.keyCode) {
				// w / ^ / space
				case 87:
				case 38:
				case 32:
					if (!controls_spacePressed) {
						//if it's infinite mode, restart
						if (loading_state.constructor.name == "State_Infinite" && this.substate == 2) {
							this.pushScoreToLeaderboard();
							loading_state = new State_Infinite();
						}
					}
					break;
			}
		} else {
			handleKeyPress_camera(a);
		}
	}

	handleKeyNegate(a) {
		if (!editor_active) {
			handleKeyNegate_player(a);
		} else {
			handleKeyNegate_camera(a);
		}
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

		this.lowerTextTime = challenge_textTime;
		this.addTextToQueue();

		//place player
		this.targetParent = getObjectFromID(this.data[this.line][0]);
		this.placePlayer();
	}

	addTextToQueue() {
		//split the input text
		var split = this.data[this.line][4].split("|");
		//add it all
		split.forEach(s => {
			if (s != "") {
				text_queue.push([data_characters.indexOf(this.data[0]), s]);	
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
		


		if (this.substate < 2 && player.parentPrev != this.targetParent) {
			this.updateLine();
			//if the player's parent / direction is different from the target, do a fadeout
			if (player.parentPrev != this.targetParent || player.backwards != this.data[this.line][1]) {
				this.substate = 2;
			}
		}
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
		super();
		this.parentControlsAudio = false;
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
		//make a copy without linking to the reference
		this.selectionTextures = [];
		textures_common.forEach(c => {
			this.selectionTextures.push(c);
		});

		
		//sidebar stuff
		this.selectionTextures.push(new Texture(data_sprites["Map"].sheet, data_sprites.spriteSize * 2, 1e1001, false, false, [[0, 0], [0, 0]]));
		this.objs2d = [
			`new SceneBox(0.5, 0.5, 0.1, 0.1)`,
			`new SceneBubble(0.5, 0.5, 0.1, 0.1)`,
			`new SceneLine(0.4, 0.4, 0.6, 0.6)`,
			`new SceneTri(0.4, 0.4, 0.6, 0.6, (editor_handleRadius * 2) / canvas.width)`,
			`new SceneText(0.5, 0.5, 0.1, 0.05, "lorem ipsum dolor set amet, quim eres it", false);`,
			`new SceneCode(\`console.log("Make absolutely sure you know what you're doing before you use this. For real. 100% sure. I don't take responsibility for anything that breaks as a result.");\`);`
		];
		this.objs3d = [
			`new SceneLight(world_camera.x + polToCart(world_camera.theta, world_camera.phi, 5)[0], world_camera.y + polToCart(world_camera.theta, world_camera.phi, 5)[1], world_camera.z + polToCart(world_camera.theta, world_camera.phi, 5)[2])`,
			`new ScenePowercell(world_camera.x + polToCart(world_camera.theta, world_camera.phi, 5)[0], world_camera.y + polToCart(world_camera.theta, world_camera.phi, 5)[1], world_camera.z + polToCart(world_camera.theta, world_camera.phi, 5)[2])`,
			`new SceneBoxRinged(world_camera.x + polToCart(world_camera.theta, world_camera.phi, 5)[0], world_camera.y + polToCart(world_camera.theta, world_camera.phi, 5)[1], world_camera.z + polToCart(world_camera.theta, world_camera.phi, 5)[2], 100, 0)`,
			`new SceneBoat(world_camera.x + polToCart(world_camera.theta, world_camera.phi, 5)[0], world_camera.y + polToCart(world_camera.theta, world_camera.phi, 5)[1], world_camera.z + polToCart(world_camera.theta, world_camera.phi, 5)[2], 0, 0)`
		];

		


		//loop through frames, if it's a string convert to objects
		this.readFrom = loading_state.readFrom;
		this.frame = 0;
		this.id = data.id;
		this.effects = data.effects;
		//activate effects
		eval(this.effects);
		this.data = data.frames;
		for (var e=0; e<this.data.length; e++) {
			//if the data line is a string, convert it to a set of objects
			if (this.data[e].constructor.name == "String") {
				this.data[e] = this.convertStringData(this.data[e]);
			}
		}
		this.doSidebar = true;
		this.destinationState = new State_Map();
		this.allowDebug = false;
		this.debugButton = new PropertyButton(0.74, 0.95, 0.25, 0.05, "toggle editor", "editor_active = !editor_active;");
		this.skipping = false;

		//editor specific thingies
		this.selected = undefined;
		this.modifyCameraPos = false;
		this.updateFrame();
	}

	drawIconLine(x, IDstart, dataArr) {
		var targetY = 0;
		//cutscene objects
		for (var a=0; a<dataArr.length; a++) {
			targetY = ((canvas.height / dataArr.length) * a) + (canvas.height / (dataArr.length * 2));
			drawTile2d(x, targetY, canvas.height / 30, IDstart + a);
		}
	}

	tickIconLine(x, dataArr) {
		for (var a=0; a<dataArr.length; a++) {
			if (getDistance2d([cursor_x, cursor_y], [x, ((canvas.height / dataArr.length) * a) + (canvas.height / (dataArr.length * 2))]) < canvas.height / 35) {
				this.data[this.frame][1].push(eval(dataArr[a]));
				return;
			}
		}
	}

	convertStringData(line) {
		var camData = [0, 0, 0, 0, 0, 0];
		var objData = [];
		/*
		CAM - camera data		x~y~z~theta~phi~rot
		LGT - light source		x~y~z
		SPR - character sprite	x~y~size~sheetSource~rotation~backwards?~textureX~textureY
		BUB - text box			x~y~width~height
		BOX - text bubble		x~y~width~height
		LIN - line				x1~y1~x2~y2
		TRI - triangle line		x1~y1~x2~y2~width
		TXT - text box			x~y~width~textSize~content~useLightColor? 
		COD - code block		code

		POW - powercell			x~y~z 
		3BR - ringed box		x~y~z~size~rot
		3BT - boat				x~y~z~theta~phi
		
		*/

		//split by vertical seperator, then parse each tag
		var tags = line.split("|");
		tags.forEach(t => {
			var s = t.split("~");
			switch (s[0]) {
				case "CAM":
					for (var n=0; n<s.length-1; n++) {
						camData[n] = s[n+1] * 1;
					}
					break;
				case "LGT":
					objData.push(new SceneLight(s[1] * 1, s[2] * 1, s[3] * 1));
					break;
				case "SPR":
					objData.push(new SceneSprite(s[1] * 1, s[2] * 1, s[3] * 1, s[4], s[5] * 1, JSON.parse(s[6]), s[7] * 1, s[8] * 1));
					break;
				case "BUB":
					objData.push(new SceneBubble(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1));
					break;
				case "BOX":
					objData.push(new SceneBox(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1));
					break;
				case "COD":
					objData.push(new SceneCode(s[1]));
					break;
				case "LIN":
					objData.push(new SceneLine(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1));
					break;
				case "TRI":
					objData.push(new SceneTri(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1, s[5] * 1));
					break;
				case "TXT":
					objData.push(new SceneText(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1, s[5], JSON.parse(s[6])));
					break;
				case "POW":
					objData.push(new ScenePowercell(s[1] * 1, s[2] * 1, s[3] * 1, s[4]));
					break;
				case "3BR":
					objData.push(new SceneBoxRinged(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1, s[5] * 1));
					break;
				case "3BT":
					objData.push(new SceneBoat(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1, s[5] * 1));
					break;
			}
		});
		return [camData, objData];
	}

	drawSidebar() {
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width * editor_cutsceneWidth, canvas.height);
		ctx.globalAlpha = 1;

		this.drawIconLine((editor_cutsceneWidth * 0.2) * canvas.width, 26, this.objs3d);
		this.drawIconLine((editor_cutsceneWidth * 0.5) * canvas.width, 20, this.objs2d);

		var targetX = (editor_cutsceneWidth * 0.8) * canvas.width;
		//texture objects
		for (var a=0; a<11; a++) {
			this.selectionTextures[a].beDrawn(targetX, ((canvas.height / 11) * a) + (canvas.height / 22), 0, canvas.height / 16);
		}
	}

	execute() {
		//'background' objects
		drawSky(color_bg);
		this.farObjs.forEach(f => {
			f.beDrawn_LowDetail();
		});
		//near objects
		this.nearObjs.forEach(f => {
			f.tick();
		})
		this.nearObjs.forEach(f => {
			f.doComplexLighting();
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
			//border if not changing camera pos
			if (!this.modifyCameraPos) {
				ctx.lineWidth = canvas.height / 50;
				ctx.strokeStyle = color_editor_border;
				ctx.globalAlpha = 0.5;
				ctx.beginPath();
				ctx.rect(0, 0, canvas.width, canvas.height);
				ctx.stroke();
				ctx.lineWidth = 2;
				ctx.globalAlpha = 1;
			}

			//show frame number + id at the top
			ctx.font = `${canvas.height * 0.06}px Comfortaa`;
			drawSelectionBox(canvas.width * 0.5, canvas.height * 0.03, ctx.measureText(this.id).width + (canvas.width * 0.02), canvas.height * 0.06);
			ctx.fillStyle = color_text_bright;
			
			ctx.fillText(this.id, canvas.width * 0.5, canvas.height * 0.05);
			ctx.fillText(`${this.frame+1} / ${this.data.length}`, canvas.width * 0.5, canvas.height * 0.1);

			if (this.doSidebar) {
				this.drawSidebar();
			}

			//sidebar triangle
			ctx.fillStyle = color_editor_bg;
			drawTriangle(canvas.width * 0.035, canvas.height * 0.95, canvas.height * 0.03, Math.PI * this.doSidebar);

			//cursor highlight
			drawCircle(color_editor_cursor, cursor_x, cursor_y, 2);

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
			if (this.modifyCameraPos) {
				//also update frame info
				this.data[this.frame][0] = [world_camera.x, world_camera.y, world_camera.z, world_camera.theta, world_camera.phi, world_camera.rot];
			}

			//update world every few frames
			if (world_time % 50 == 1 && this.modifyCameraPos) {
				this.updateFrame();
			}
		}

		//draw editor button
		if (this.allowDebug) {
			this.debugButton.tick();
			this.debugButton.beDrawn();
		}

		//fast forwards if skipping cutscene
		if (this.skipping) {
			this.frame += 1;
			this.updateFrame();
		}
	}

	exit() {
		loading_state = this.destinationState;
		try {
			loading_state.doWorldEffects();
		} catch (error) {
			//don't do this, this code right here is a bad example
		}
	}

	giveStringData() {
		//go through all frames
		var frameData = ``;
		this.data.forEach(d => {
			frameData += this.giveStringDataForLine(d);
		});

		//apologies for the indenting here, it's so that when the string is outputted it won't have extra tabs at the start
var outputString = `{
	id: \`${this.id}\`,
	effects: \`${this.effects}\`,
	frames: [
		${frameData}]
}`;

		return outputString;
	}

	giveStringDataForLine(arr) {
		//camera data
		var camData = "CAM~";
		for (var a=0; a<arr[0].length-1; a++) {
			camData += arr[0][a].toFixed(4) + "~";
		}
		camData += arr[0][arr[0].length-1].toFixed(4);

		var objData = ``;
		for (var a=0; a<arr[1].length; a++) {
			objData += "|" + arr[1][a].giveStringData();
		}

		return `\`${camData}${objData}\`, \n`;
	}

	handlePlayerDeath() {
		//no death in cutscenes
	}

	handleMouseMove(a) {
		updateCursorPos(a);
	}

	handleMouseDown(a) {
		updateCursorPos(a);

		if (this.allowDebug) {
			var editorStorage = editor_active;
			this.debugButton.handleClick();
			if (editor_active != editorStorage) {
				return;
			}
		}

		//in regular mode
		if (!editor_active) {
			this.frame += 1;
			this.updateFrame();
			return;
		}

		//ID change
		if (cursor_y < canvas.height * 0.1 && cursor_x > canvas.width * 0.4 && cursor_x < canvas.width * 0.6) {
			var newID = prompt("Enter new ID:", this.id);
			if (isValidString(newID)) {
				this.id = newID;
			}
			return;
		}

		//sidebar triangle
		if (cursor_x < canvas.width * 0.05 && cursor_y > canvas.height * 0.93) {
			this.doSidebar = !this.doSidebar;
			return;
		}

		//sidebar search
		if (this.doSidebar && cursor_x < canvas.width * editor_cutsceneWidth) {
			var targetX = (editor_cutsceneWidth / 3) * canvas.width;
			this.tickIconLine(editor_cutsceneWidth * 0.2 * canvas.width, this.objs3d);
			this.tickIconLine(editor_cutsceneWidth * 0.5 * canvas.width, this.objs2d);

			targetX = (editor_cutsceneWidth * 0.8) * canvas.width;
			//texture objects
			for (var a=0; a<10; a++) {
				if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / 11) * a) + (canvas.height / 22)]) < canvas.height / 35) {
					this.data[this.frame][1].push(new SceneSprite(0.5, 0.5, 0.1, `data_sprites.${data_characters[a]}.sheet`, 0, false, 0, 0));
					return;
				}
			}

			//the map object
			if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / 11) * 10) + (canvas.height / 22)]) < canvas.height / 35) {
				this.data[this.frame][1].push(new SceneSprite(0.5, 0.5, 0.1, `data_sprites.Map.sheet`, 0, false, 0, 0));
				return;
			}
			return;
		}
		

		//search through list of objects
		var tolerance = editor_handleRadius * 3;
		this.selected = undefined;
		for (var h=this.data[this.frame][1].length-1; h>-1; h--) {
			//get list of handles
			var handleList = this.data[this.frame][1][h].giveHandles();
			for (var a=0; a<handleList.length; a++) {
				//if the handle is closer than the tolerance, select it
				if (getDistance2d([cursor_x, cursor_y], handleList[a]) < tolerance) {
					if (this.selected != undefined) {
						this.selected.selectedPart = undefined;
					}

					tolerance = getDistance2d([cursor_x, cursor_y], handleList[a]);
					this.selected = this.data[this.frame][1][h];
					this.selected.selectedPart = a;
				}
			}
			//if selected a non-text object (text has gaps in it, so objects under it could be selected), exit
			if (this.selected != undefined) {
				if (this.selected.constructor.name != "SceneText") {
					return;
				}
			}
		}
	}

	handleEscape() {
		if (editor_active) {
			this.updateFrame();
			return;
		}

		this.skipping = true;
	}

	handleKeyPress(a) {
		if (editor_active) {
			handleKeyPress_camera(a);
			switch (a.keyCode) {
				//frame control (< / >)
				case 188:
					if (this.frame > 0) {
						this.frame -= 1;
						this.updateFrame();
					}
					break;
				case 190:
					this.frame += 1;
					//creating new frame
					if (this.frame + 1 > this.data.length) {
						//if space is pressed duplicate the frame
						if (controls_shiftPressed) {
							var strData = this.giveStringDataForLine(this.data[this.data.length-1]);
							this.data[this.data.length] = this.convertStringData(strData.substring(1, strData.length-4));
							return;
						} else {
							this.data[this.data.length] = [JSON.parse(JSON.stringify(this.data[this.data.length-1][0])), []];
						}
					}
					this.updateFrame();
					break;
				//delete button
				case 8:
					if (this.selected != undefined) {
						//if shift is pressed, splice out all items
						if (controls_shiftPressed) {
							this.data[this.frame][1] = [];
							return;
						}
						//normal case
						this.data[this.frame][1].splice(this.data[this.frame][1].indexOf(this.selected), 1);
					} else if (this.data[this.frame][1].length == 0) {
						//if there are no items, delete the frame
						if (this.frame > 0) {
							this.data.pop();
							this.frame -= 1;
							this.updateFrame();
						}
					}
					break;
				//c, toggles camera modification
				case 67:
					this.modifyCameraPos = !this.modifyCameraPos;
					break;
				//tab, toggles siddebar
				case 9:
					this.doSidebar = !this.doSidebar;
					break;
			}
		}
	}

	handleKeyNegate(a) {
		if (editor_active) {
			handleKeyNegate_camera(a);
		}
	}

	updateFrame() {
		//if data is undefined, exit
		if (this.data[this.frame] == undefined) {
			this.exit();
			return;
		}

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

		world_lightObjects = [];
		//special object effects
		this.data[this.frame][1].forEach(v => {
			switch (v.constructor.name) {
				case "SceneLight":
					world_lightObjects.push(v);
					break;
				case "SceneText":
					v.process();
					break;
				case "SceneCode":
					v.finished = false;
					break;
			}
		});

		//if there are no light objects and it's in edit mode, use the camera as a light source. (Makes it easier to see when editing frames)
		if (world_lightObjects.length == 0) {
			world_lightObjects.push(world_camera);
		}

		//ordering 
		this.orderWorld();

		//tick all objects
		this.nearObjs.forEach(n => {
			n.tick();
		});

		//do lighting for the closest few tunnels
		this.nearObjs.forEach(n => {
			n.doComplexLighting();
		});
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
			if (player.parentPrev.allowBackwards) {
				drawArrow((canvas.width * 0.5) - (canvas.width * 0.04) + (canvas.width * 0.08 * player.backwards), canvas.height * 0.94, color_grey_light, Math.PI * player.backwards, canvas.width * 0.045, canvas.width * 0.025, canvas.height * 0.03, canvas.height * 0.06);
				ctx.lineWidth = 2;
			}
		}
	}

	handleMouseDown(a) {
		//regular interactions
		super.handleMouseDown(a);

		if (this.substate == 1) {
			//backwards toggle interact
			if (player.parentPrev.allowBackwards && player.parent != undefined && cursor_x > canvas.width * 0.45 && cursor_x < canvas.width * 0.55 && cursor_y > canvas.height * 0.9 && cursor_y < canvas.height * 0.99) {
				player.turnAround();
				player.parent.reset();
				this.substate = 0;
				this.execute();
				this.substate = 1;
				return;
			}
		}
	}

	handleKeyPress(a) {
		super.handleKeyPress(a);
		//r for reset
		if (a.keyCode == 82 && this.substate == 0) {
			this.handlePlayerDeath();
		}
	}
}

class State_Infinite extends State_World {
	constructor() {
		super();

		//move camera to start so objects are ordered properly, but I also want that nice zoom in effect, so the camera is far away
		world_camera.x = -100;
		world_camera.y = 400;
		world_camera.z = -42000;
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
		for (var a=0; a<9; a++) {
			this.addTunnel();
		}
		this.placePlayer();
		setTimeout(() => {
			loading_state.orderWorld();
		}, 100);
		
	}

	addTunnel() {
		//if a tunnel is already there, set start coords to that tunnel end
		var [sX, sZ, sT] = [0, -40000, 0];
		if (this.objs.length > 0) {
			sT = this.objs[this.objs.length - 1].theta;
			sX = this.objs[this.objs.length - 1].endPos[0] - (tunnel_transitionLength * Math.sin(sT));
			sZ = this.objs[this.objs.length - 1].endPos[2] + (tunnel_transitionLength * Math.cos(sT));
			
		}

		//randomly change theta a bit, the complication is to stay within bounds (0 - 2pi)
		sT = (sT + (Math.random() * 0.6) + (Math.PI * 2) - 0.2) % (Math.PI * 2);

		var value = Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange));
		while (value == this.lastTunnelLine) {
			value = Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange));
		}
		this.lastTunnelLine = value;
		var tunnelConstructionData = `pos-x~${sX}|pos-z~${sZ}|direction~${sT}|${this.data[value]}`;
		this.objs.push(new Tunnel_FromData(tunnelConstructionData));
		this.objs[this.objs.length-1].placePowercells();
		
		
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

	pushScoreToLeaderboard() {
		//format is [name, distance, powercells, characters used]
		//go through scoreboard scores and append self if necessary
		for (var spot=0; spot<10; spot++) {
			//if spot is undefined, place self
			if (data_persistent.highscores[spot] == undefined) {
				data_persistent.highscores.push([data_persistent.name, Math.floor(this.distance), this.powercells, JSON.parse(JSON.stringify(this.charactersUsed))]);
				return;
			}

			//if spot has less score than self, place self and then pop off the list
			if (data_persistent.highscores[spot][1] < Math.floor(this.distance)) {
				data_persistent.highscores.splice(spot, 0, [data_persistent.name, Math.floor(this.distance), this.powercells, JSON.parse(JSON.stringify(this.charactersUsed))]);
				spot = 999;
			}

			if (data_persistent.highscores.length > 10) {
				data_persistent.highscores.pop();
			}
		}
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
				this.pushScoreToLeaderboard();
				loading_state = new State_Infinite();
				break;
		}
	}

	handleMouseDown(a) {
		//if in the menu, attempt to pick a new character
		if (this.substate == 2) {
			//updating cursor position
			updateCursorPos(a);

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
				if (textures_common[data_characters.indexOf(characterList[a])] != undefined && data_persistent.unlocked.includes(characterList[a])) {
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
					//load in one time cutscenes
					placeOneTimeCutsceneTriggers();
					//story things after loading everything else
					updatePlotProgression();
				}
			}
		}
		if (this.time > 540) {
			loading_state = new State_Menu();
		}
	}

	handleMouseDown(a) {
		//after all, why not create a star at the cursor position?
		updateCursorPos(a);
		//don't update the RNG, that's pretty important
		drawCircle(color_stars, cursor_x, cursor_y, randomBounded(3, 7));
	}

	handleMouseMove(a) {

	}

	handleKeyPress(a) {

	}

	handleKeyNegate(a) {

	}
}

//I am terrified that this is a giant pile of spaghetti that will break at any moment but I also just want to finish the project at this point
class State_Map {
	constructor() {
		//change camera and player
		this.doWorldEffects();

		this.objSelected = undefined;
		this.changingTheta = false;
		this.cursorPos = [-100, -100];
		this.cutsceneIcons = [
			new MapTexture(-6075, -224119, data_sprites.Map.planet, 'planetMissing', `true`),
			new MapTexture(28349, -89119, data_sprites.Map.crazy, 'insanity', `data_persistent.effectiveCutscenes.includes('insanity')`),
			new MapTexture(18900, -22720, [[2,0]], 'studentTeacher', `getObjectFromID("U-2").discovered`),
			new MapTexture(-30037, 2005, data_sprites.Map.teapot, 'teapot', `getObjectFromID("A-3").discovered`),
			new MapTexture(8775, -137381, data_sprites.Map.batteryName, 'batteries', `getObjectFromID("Winter Games, Part 2").discovered`),
			new MapTexture(-38812, 65118, [data_sprites.Map.onwards[0]], 'theGap', `(data_persistent.effectiveCutscenes.includes('wormholeInSight') && data_persistent.effectiveCutscenes.includes('boring'));`),
			new MapTexture(-38812, 84029, [data_sprites.Map.onwards[1]], 'theGap', `(data_persistent.effectiveCutscenes.includes('wormholeInSight') && data_persistent.effectiveCutscenes.includes('boring'));`),
			new MapTexture(78975, -177207, [data_sprites.Map.snowflakes[0]], undefined, `getObjectFromID("Winter Games, Part 14").discovered`),
			new MapTexture(1350, -118144, [data_sprites.Map.snowflakes[1]], undefined, `getObjectFromID("Winter Games, Part 7").discovered`),
			new MapTexture(20925, -114769, [data_sprites.Map.snowflakes[2]], undefined, `getObjectFromID("Winter Games, Part 7").discovered`),
			new MapTexture(63112, -149194, [data_sprites.Map.snowflakes[3]], undefined, `getObjectFromID("Winter Games, Part 11").discovered`),
			new MapTexture(46575, -126244, [data_sprites.Map.snowflakes[4]], undefined, `getObjectFromID("Winter Games, Part 7").discovered`),
		];
		this.readFrom = loading_state.readFrom;
		this.dir_held = false;
		this.substate = 0;
		this.angelPanelTime = 0;
		this.angelPanelSpeed = 0;
	}

	doWorldEffects() {
		world_camera.x = 0;
		world_camera.y = map_height;
		world_camera.z = map_zStorage;

		world_camera.phi = -0.5 * Math.PI;
		world_camera.theta = -0.5 * Math.PI;
		world_camera.rot = 0;

		//targets
		world_camera.targetTheta = world_camera.theta;
		world_camera.targetPhi = world_camera.phi;
		world_camera.targetRot = world_camera.rot;

		world_camera.targetX = world_camera.x;
		world_camera.targetY = world_camera.y;
		world_camera.targetZ = world_camera.z;

		//clear player's previous levels
		player.parent = undefined;
		player.parentPrev = undefined;
		player.x = 1e10;
		player.y = 1e10;
		player.z = 1e10;
	}

	execute() {
		world_camera.tick();
		//store camera pos
		map_zStorage = world_camera.z;
		//draw sky
		drawSky(color_map_bg);

		//draw world objects
		ctx.lineWidth = canvas.height / 480;
		ctx.strokeStyle = color_map_writing;
		this.readFrom.forEach(w => {
			w.beDrawnOnMap();
		});

		//draw cutscene objects
		this.cutsceneIcons.forEach(c => {
			c.beDrawn();
		});

		//if only first level has been discovered, it should have the pointer drawn around it
		if (data_persistent.discovered == "Level 1") {
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
			if (this.objSelected != undefined) {
				//drawing cursor
				drawCircle(color_editor_cursor, cursor_x, cursor_y, 4);

				this.objSelected.beDrawn_selected();
				
				//text at the top
				ctx.fillStyle = color_text;
				ctx.fillText(`selected-id: ${this.objSelected.id}`, canvas.width * 0.5, canvas.height * 0.1);
				ctx.fillText(`θ: ${this.objSelected.theta}`, canvas.width * 0.5, (canvas.height * 0.1) + fontSize);
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
			return;
		}


		//drawing the name of the level the user hovers over
		drawCircle(color_editor_cursor, this.cursorPos[0], this.cursorPos[1], 4);
		if (this.objSelected != undefined) {
			ctx.fillStyle = color_text;
			ctx.fillText(this.objSelected.id, canvas.width * 0.5, canvas.height * 0.1);
		}

		//angel going home panel
		if (data_persistent.goingHomeProgress != undefined) {
			this.angelPanelTime += this.angelPanelSpeed;
			if (this.angelPanelTime > 1 || this.angelPanelTime < 0) {
				this.angelPanelTime = clamp(this.angelPanelTime, 0, 1);
				this.angelPanelSpeed = 0;
			}
			drawAngelPanel(this.angelPanelTime);
		}
	}

	handleEscape() {
		loading_state = new State_Menu();
	}


	//mouse handling functions, ack this is ugly
	handleMouseDown(a) {
		//update cursor position
		updateCursorPos(a);

		//going home checklist things
		if (data_persistent.goingHomeProgress != undefined) {
			//flip note up
			if (this.angelPanelTime < 0.04 && cursor_x > canvas.width * checklist_margin && cursor_x < canvas.width * (checklist_margin + checklist_width) && cursor_y > canvas.height * 0.95) {
				this.angelPanelSpeed = checklist_speed;
				return;
			}

			//flip note down
			if (this.angelPanelTime > 0.96) {
				//flip note down
				if (cursor_x > canvas.width * checklist_margin && cursor_x < canvas.width * (checklist_margin + checklist_width) && 
				cursor_y > canvas.height * (1 - checklist_height) && cursor_y < canvas.height * (1.05 - checklist_height)) {
					this.angelPanelSpeed = -1 * checklist_speed;
					return;
				}

				//button
				if (data_persistent.goingHomeProgress < challengeData_angelMissions.length) {
					checklist_searchButton.handleClick();
					return;
				}

				for (var a=1; a<data_angelChecklist.length; a++) {
					var midY = canvas.height * ((1 - checklist_height) + ((a+2) * (checklist_height / (data_angelChecklist.length + 2))));
					var minX = canvas.width * (checklist_margin + (checklist_width / 5) - (checklist_width / 25));
					var maxX = canvas.width * (checklist_margin + checklist_width - (checklist_width / 10));

					if (cursor_x > minX && cursor_x < maxX && cursor_y > midY - (canvas.height / 50) && cursor_y < midY + (canvas.height / 50)) {
						if (data_angelChecklist[a][4] != undefined) {
							loading_state = new State_Challenge(challengeData_angelMissions, data_angelChecklist[a][4]);
						}
						return;
					}
				}
			}
		}

		if (this.objSelected != undefined) {
			this.objSelected.handleMouseDown();
		}

		//if now has no object selected, attempt to make one
		//I have to do this check twice just in case the objSelected has deselected itself
		if (this.objSelected == undefined) {
			this.selectMapObject();
		}
	}

	handleMouseMove(a) {
		updateCursorPos(a);

		//select tunnel
		if (!editor_active) {
			//normal mode, reset + select tunnel
			this.objSelected = undefined;
			this.cursorPos = [-100, -100];
			if (data_persistent.goingHomeProgress != undefined) {
				//if cursor is on the note, don't select an object
				if (this.angelPanelTime > 0 && cursor_x > canvas.width * checklist_margin && cursor_x < canvas.width * (checklist_margin + checklist_width) && cursor_y > canvas.height * (1 - checklist_height)) {
					return;
				}
			}
			this.selectMapObject();
		} else {
			if (this.objSelected != undefined) {
				//if the editor's active, only register the movement for selected objects
				if (cursor_down) {
					this.objSelected.handleMouseMove();
				}

				cursor_x = this.objSelected.map_circleCoords[0];
				cursor_y = this.objSelected.map_circleCoords[1];
			}
		}
	}

	handleKeyPress(a) {
		if (editor_active) {
			handleKeyPress_camera(a);
		}
		if (!this.dir_held) {
			switch (a.keyCode) {
				//<--
				case 65:
				case 37:
					world_camera.targetZ -= map_shift;
					break;
				//-->
				case 68:
				case 39:
					world_camera.targetZ += map_shift;
					break;
			}
			//shifting left / right
			world_camera.targetZ = clamp(world_camera.targetZ, (-2 * map_shift) + map_zOffset, (2 * map_shift) + map_zOffset);
			this.cursorPos = [-100, -100];
			this.dir_held = true;
		}
	}

	handleKeyNegate(a) {
		if (editor_active) {
			handleKeyNegate_camera(a);
		}
		this.dir_held = false;
	}

	selectMapObject() {
		//loop through all map objects and select the closest one
		var reqDist = editor_cutsceneSnapTolerance;
		this.readFrom.forEach(c => {
			if (c.discovered || editor_active) {
				if (getDistance2d(c.map_circleCoords, [cursor_x, cursor_y]) < reqDist) {
					this.cursorPos = c.map_circleCoords;
					this.objSelected = c;
					reqDist = getDistance2d(c.map_circleCoords, [cursor_x, cursor_y]);
				}
			}
		});

		//do same for cutscene icons
		this.cutsceneIcons.forEach(c => {
			if (c.visible || editor_active) {
				if (getDistance2d(c.map_circleCoords, [cursor_x, cursor_y]) < reqDist) {
					this.cursorPos = c.map_circleCoords;
					this.objSelected = c;
					reqDist = getDistance2d(c.map_circleCoords, [cursor_x, cursor_y]);
				}
			}
		});
	}
}

class State_Menu {
	constructor() {
		this.characterSelected = 0;
		this.displayCharacterSelected = 0;

		//switch character selected
		for (var t=0; t<data_characters.length; t++) {
			if (player.constructor.name == data_characters[t]) {
				this.characterSelected = t;
				this.displayCharacterSelected = t;
			}
		}
		this.substate = 0;
		this.nodeSelected = undefined;
		this.readFrom = [];

		//settings for settings menu
		this.settings = [
			new PropertySlider(0.05, 0.2, 0.4, 0.2, 'music volume', `audio_channel1.volume = value;`, `audio_channel1.volume`, 0, 1, 0.01, false),
			new PropertySlider(0.05, 0.3, 0.4, 0.2, 'effects volume', `audio_channel2.volume = value;`, `audio_channel2.volume`, 0, 1, 0.01, false),
			new PropertyToggle(0.05, 0.4, 0.4, `high resolution`, `data_persistent.settings.highResolution`),
			new PropertyToggle(0.05, 0.5, 0.4, `alternate tunnel rendering`, `data_persistent.settings.altRender`),
			new PropertyToggle(0.05, 0.6, 0.4, `contain mouse inputs to canvas`, `data_persistent.settings.maskCursor`)
		];
		this.buttons = [
			new PropertyButton(0.5, 0.5 - ((menu_buttonHeight * 0.75) * 3) + 						   (menu_characterSize / canvas.height), menu_buttonWidth, menu_buttonHeight, "Infinite Mode", `loading_state = new State_Infinite();`),
			new PropertyButton(0.5, 0.5 - ((menu_buttonHeight * 0.75) * 3) + (menu_buttonHeight * 2) + (menu_characterSize / canvas.height), menu_buttonWidth, menu_buttonHeight, "Explore Mode", `loading_state = new State_Map();`),
			new PropertyButton(0.5, 0.5 - ((menu_buttonHeight * 0.75) * 3) + (menu_buttonHeight * 4) + (menu_characterSize / canvas.height), menu_buttonWidth, menu_buttonHeight, "Edit Mode", `loading_state = new State_Edit_Tiles(); alert(editor_warning);`),
		];
		this.readFrom = orderObjects(world_objects, 6);
	}
	execute() {
		//bege
		ctx.fillStyle = color_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//back button in case of non-main states
		if (this.substate > 0) {
			drawArrow(canvas.width * 0.08, canvas.height * 0.05, color_grey_light, Math.PI, canvas.width * 0.04, canvas.width * 0.02, canvas.height * 0.02, canvas.height * 0.04);
		}


		switch (this.substate) {
			case 0:
				//swivel display character
				this.displayCharacterSelected = ((this.displayCharacterSelected * (render_animSteps - 1)) + this.characterSelected) / render_animSteps;

				//selection box for username
				drawSelectionBox(canvas.width * ((player_maxNameWidth / 2) + 0.01), canvas.height * 0.0375, canvas.width * player_maxNameWidth, canvas.height * 0.055);

				//title card
				ctx.font = `${canvas.height / 8}px Comfortaa`;
				ctx.textAlign = `center`;
				ctx.fillStyle = color_text_bright;
				ctx.fillText(`Run 3`, canvas.width * 0.5, canvas.height * 0.13);

				//powercell readout
				ctx.font = `${canvas.height / 32}px Comfortaa`;
				ctx.textAlign = `left`;

				ctx.fillText(data_persistent.name, canvas.width * 0.02, canvas.height * 0.05);
				ctx.fillText(`${data_persistent.powercells} power cells`, canvas.width * 0.02, canvas.height * 0.1);
				ctx.textAlign = `center`;
				
				ctx.strokeStyle = color_grey_dark;
				this.buttons.forEach(b => {
					b.tick();
					b.beDrawn();
				});

				//lower left buttons
				for (var b=0; b<3; b++) {
					drawTile2d((canvas.height * 0.05) + (canvas.width * (b * 0.07)), canvas.height * 0.9, canvas.width * 0.06, 40 + b);
				}

				//drawing characters

				//selection box
				var offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * this.displayCharacterSelected) - (Math.PI * 0.5));
				var offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * this.displayCharacterSelected) - (Math.PI * 0.5));
				drawSelectionBox((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize - 5, menu_characterSize * 2, menu_characterSize * 2);

				for (var h=0; h<data_characters.length; h++) {
					offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5));
					offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5));
					//character texture
					textures_common[h].frame = 0 + (modularDifference(this.displayCharacterSelected, h, data_characters.length) < 0.5 && data_persistent.unlocked.includes(data_characters[h]));
					textures_common[h].beDrawn((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize, 0, menu_characterSize * 1.7);
					if (!data_persistent.unlocked.includes(data_characters[h])) {
						drawCharacterLock((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + (menu_characterSize * 0.75), menu_characterSize, menu_characterSize);
					}
				}
				break;
			case 1:
				//leaderboards
				ctx.font = `${Math.floor(canvas.height / 30)}px Comfortaa`;
				ctx.textAlign = "left";
				ctx.fillStyle = color_text_bright;
				//headers
				ctx.fillText("Username", canvas.width * 0.04, canvas.height * 0.15);
				ctx.fillText("Distance", canvas.width * 0.35, canvas.height * 0.15);
				if (data_persistent.effectiveCutscenes.includes("batteries")) {
					ctx.fillText("Batteries", canvas.width * 0.5, canvas.height * 0.15);
				} else {
					ctx.fillText("Powercells", canvas.width * 0.5, canvas.height * 0.15);
				}
				ctx.fillText("Characters Used", canvas.width * 0.65, canvas.height * 0.15);

				for (var j=0; j<data_persistent.highscores.length; j++) {
					ctx.fillText(data_persistent.highscores[j][0], canvas.width * 0.04, ((canvas.height * 0.2) + (canvas.width * 0.05 * j)) + (Math.floor(canvas.height / 30) * 0.5), canvas.width * 0.34);
					//normal data
					ctx.fillText(data_persistent.highscores[j][1] + "m", canvas.width * 0.35, ((canvas.height * 0.2) + (canvas.width * 0.05 * j)) +  (Math.floor(canvas.height / 30) * 0.5));
					ctx.fillText(data_persistent.highscores[j][2], canvas.width * 0.5, ((canvas.height * 0.2) + (canvas.width * 0.05 * j)) +  (Math.floor(canvas.height / 30) * 0.5));

					//characters used
					for (var k=0; k<data_persistent.highscores[j][3].length; k++) {
						var charIndex = data_characters.indexOf(data_persistent.highscores[j][3][k]);
						textures_common[charIndex].frame = 0;
						textures_common[charIndex].beDrawn((canvas.width * 0.65) + (menu_characterSize * 0.8 * (k + 0.5)), (canvas.height * 0.2) + (canvas.width * 0.05 * j), 0, menu_characterSize * 0.75);
					}
				}
				break;
			case 2:
				//reset save data button
				drawSelectionBox(canvas.width * 0.5, canvas.height * 0.935, canvas.width * 0.4, canvas.height * 0.08);
				ctx.fillStyle = color_text_danger;
				ctx.textAlign = "center";
				ctx.font = `${canvas.height / 20}px Comfortaa`;
				ctx.fillText(`Delete save data`, canvas.width * 0.5, canvas.height * 0.95);

				var currentRes = data_persistent.settings.highResolution;
				//settings menu
				this.settings.forEach(s => {
					s.tick();
					s.beDrawn();
				});
				//update resolution if required
				if (data_persistent.settings.highResolution != currentRes) {
					updateResolution();
				}
				break;
			case 3:
				//cutscene viewer menu
				ctx.lineWidth = 1;
				data_cutsceneTree.tick();
				data_cutsceneTree.beDrawn_line();
				data_cutsceneTree.beDrawn_handle();
				break;
		}
	}

	handleEscape() {
		this.substate = 0;
	}

	handleMouseDown(a) {
		updateCursorPos(a);
		//any substate > 0 shares the back button functionality
		if (this.substate > 0 && cursor_x < canvas.width * 0.1 && cursor_y < canvas.height * 0.1) {
			this.substate = 0;
			return;
		}

		switch (this.substate) {
			case 0:
				//collision with buttons
				this.buttons.forEach(b => {
					b.handleClick();
				});
				if (loading_state != this) {
					return;
				}

				//collision with name changer
				if (cursor_x < canvas.width * 0.25 && cursor_y < canvas.height * 0.1) {
					var value = prompt("Enter new username please:", data_persistent.name);
					if (isValidString(value)) {
						//make sure name fits in the box lol
						ctx.font = `${canvas.height / 32}px Comfortaa`;
						var charNum = value.length;
						while (ctx.measureText(value).width > canvas.width * player_maxNameWidth) {
							charNum -= 1;
							value = value.substring(0, charNum);
						}
						data_persistent.name = value;
					}
					return;
				}

				//collision with characters.
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
						return;
					}
				}
				//collision with lower buttons
				for (var b=0; b<3; b++) {
					var xOff = (canvas.height * 0.05) + (canvas.width * (b * 0.07));
					var yOff = canvas.height * 0.9;

					if (cursor_x > xOff && cursor_x < xOff + canvas.width * 0.05 && cursor_y > yOff && cursor_y < yOff + canvas.width * 0.05) {
						this.substate = b + 1;
						//if cutscene mode, update viewership
						if (this.substate == 3) {
							data_cutsceneTree.getVisible();
						}
						return;
					}
				}
				break;
			case 2:
				//reset button
				if (cursor_x > canvas.width * 0.3 && cursor_x < canvas.width * 0.7 && cursor_y > canvas.height * 0.9) {
					trueReset();
				}

				break;
			case 3:
				//try to select a cutscene node
				this.nodeSelected = undefined;
				this.nodeSelected = data_cutsceneTree.becomeSelected(editor_cutsceneSnapTolerance);
				//cutscene viewer
				if (!editor_active) {
					//activating cutscene
					if (this.nodeSelected != undefined) {
						loading_state = new State_Cutscene(this.nodeSelected.cutsceneRef);
						loading_state.destinationState = this;
						loading_state.readFrom = world_objects;
						loading_state.orderWorld();
					}
				}
				break;
		}
	}

	handleMouseMove(a) {
		updateCursorPos(a);
		if (this.substate == 3 && cursor_down && editor_active && this.nodeSelected != undefined) {
			this.nodeSelected.trueX = ((cursor_x / canvas.width) - 0.5) / (1 - menu_cutsceneParallax);
			this.nodeSelected.trueY = ((cursor_y / canvas.height) - 0.5) / (1 - menu_cutsceneParallax);
		}
	}

	handleKeyPress(a) {
		if (a.keyCode == 221 && this.substate == 3) {
			//editor updating
			setTimeout(() => {
				data_cutsceneTree.getVisible();
			}, 1);
		}
	}

	handleKeyNegate(a) {

	}
}