//state world is never used, but it's here so that the game state, infinite state, and cutscene states can share code
class State_World {
	constructor() {
		this.nearObjs = [];
		this.farObjs = [];
		this.readFrom = [];
		this.substate = 0;
		this.toPause = false;
		this.text = ``;
		this.textTime = 0;
		this.parentControlsAudio = true;

		this.orderWorld();
		resetAllTunnels();

		//make sure to switch into substate 3 if the player is in a bad tunnel
		if (player.parentPrev != undefined) {
			if (player.parentPrev.bannedCharacters[player.constructor.name] != undefined) {
				this.substate = 3;
			}
		}

		//audio slider
		this.audioSlider = new PropertySlider(0.39, 0.85, 0.22, 0.13, "vol", `audio_channel1.volume = value; audio_channel2.volume = value;`, `audio_channel1.volume`, 0, 1, 0.01, false);
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
					} else if (!player.parent.coordinateIsInTunnel_Bounded(player.x, player.y, player.z)) {
						//if the player is in the void, try to change parent without the whole jazzy reshuffling
						this.changePlayerParentUnofficial();
					}
				} else {
					//if the player isn't in a tunnel, try to get them in one
					this.changePlayerParentOfficial();
				}

				//order entire world if camera is too far away from the player
				if (player.cameraDist > render_maxColorDistance && world_time % 10 == 2) {
					this.orderWorld();
				}

				//every once in a while, order the near objects
				if (world_time % 50 == 24) {
					this.nearObjs = orderObjects(this.nearObjs, 5);
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
					var center = polToCart(world_camera.theta, world_camera.phi, 80);
					drawCrosshair([center[0] + world_camera.x, center[1] + world_camera.y, center[2] + world_camera.z], [Math.PI / 2, 0], [0, Math.PI / 2], [0, 0]);
				}
				drawKeys();

				//drawing new tunnel text
				if (this.textTime > 0) {
					ctx.fillStyle = color_text_bright;
					ctx.font = `${canvas.height / 22}px Comfortaa`;
					ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.5);
					this.textTime -= 1;
				}

				ctx.fillStyle = color_grey_light;
				ctx.strokeStyle = color_grey_dark;
				ctx.lineWidth = canvas.height / 120;

				if (this.toPause) {
					this.toPause = false;
					this.substate = 1;
					ctx.lineWidth = canvas.height / 240;
					//play button
					drawTriangle(canvas.width * 0.03, canvas.height * 0.05, canvas.height * 0.04, 0);
					ctx.stroke();
					return;
				}
				
				//pause button
				drawRoundedRectangle(canvas.width * 0.01, canvas.height * 0.01, canvas.width * 0.02, canvas.height * 0.075, canvas.height / 150);
				drawRoundedRectangle(canvas.width * 0.04, canvas.height * 0.01, canvas.width * 0.02, canvas.height * 0.075, canvas.height / 150);
				break;
			case 1:
				//background for audio slider
				ctx.lineWidth = canvas.height / 240;
				ctx.fillStyle = color_grey_lightest;
				ctx.strokeStyle = color_menuSelectionOutline;
				drawRoundedRectangle((canvas.width * 0.5) - (canvas.width * 0.12), (canvas.height * 0.85) - (canvas.height * 0.03), canvas.width * 0.24, canvas.height * 0.06, canvas.width * 0.02);

				//audio slider
				this.audioSlider.beDrawn();

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
				ctx.fillStyle = color_text;
				ctx.textAlign = "center";

				var textSize = Math.floor(canvas.height / 32);
				ctx.font = `${textSize}px Comfortaa`;
				var targetWidth = 0.75 * canvas.width;
				var targetText = "";

				if (eval(player.parentPrev.bannedCharacters[player.constructor.name]) != undefined) {
					ctx.fillText(`Exit to the map or choose a different character to continue.`, canvas.width * 0.5, canvas.height * 0.5)
					targetText = eval(player.parentPrev.bannedCharacters[player.constructor.name]);
					//resize font based on text size
					ctx.font = `${Math.floor(textSize * (targetWidth / ctx.measureText(targetText).width))}px Comfortaa`;
					ctx.fillText(targetText, canvas.width * 0.5, canvas.height * 0.4);
				} else {
					//if the character is allowed but substate has been entered anyways, show character selection without pretense of banishment
					targetText = `Choose a character to continue!`;
					ctx.font = `${Math.floor(textSize * (targetWidth / ctx.measureText(targetText).width))}px Comfortaa`;
					ctx.fillText(targetText, canvas.width * 0.5, canvas.height * 0.45);
				}

				//drawing characters
				var charWidth = (canvas.width * 0.75) / textures_common.length;
				var targetY = canvas.height * 0.6;
				var multiplier = 1.2;
				for (var c=0; c<textures_common.length; c++) {
					var targetX = (canvas.width * 0.125) + (charWidth * c) + (charWidth * 0.5);
					
					//draw selection box if selectable
					if (data_persistent.unlocked.includes(data_characters.indexes[c]) && player.parentPrev.bannedCharacters[data_characters.indexes[c]] == undefined) {
						drawSelectionBox(targetX, targetY, menu_characterSize * 1.5, menu_characterSize * 1.5);
					}
					textures_common[c].beDrawn(targetX, targetY, 0, menu_characterSize * multiplier);

					//draw lock if locked
					if (!data_persistent.unlocked.includes(data_characters.indexes[c])) {
						drawLock(targetX, targetY, menu_characterSize * 0.7, menu_characterSize * 0.7);
					}
				}
				break;
		}
		//logTimeEnd("total", "avg. frame time");
	}

	changePlayerParent(newParent) {
		if (player.parentPrev != undefined) {
			player.parentPrev.resetWithoutPlayer();
		}
		player.parent = newParent;
		player.parentPrev = player.parent;

		//reset all nearby objects if they're a pastafarian
		if (player.constructor.name == "Pastafarian") {
			this.nearObjs.forEach(t => {
				t.resetWithoutPlayer();
			});
		}
		this.orderWorld();
	}

	changePlayerParentOfficial() {
		this.orderWorld();
		//try the player in the closest tunnels
		for (var v=this.nearObjs.length-1; v>=0; v--) {
			if (this.nearObjs[v].playerIsInBounds()) {
				this.changePlayerParent(this.nearObjs[v]);
				v = -1;
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
			if (this.nearObjs[v].coordinateIsInTunnel_Bounded(player.x, player.y, player.z)) {
				this.changePlayerParent(this.nearObjs[v]);
				v = -1;

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
		this.nearObjs = orderObjects(this.nearObjs, 5);
		player.parent = player.parentPrev;
		player.dx = 0;
		player.dy = 0;
		player.dz = 0;

		player.ax = 0;
	}

	handleMouseDown(a) {
		updateCursorPos(a);

		//if in character selection, select a new character
		if (this.substate == 3) {
			var charWidth = (canvas.width * 0.75) / textures_common.length;
			var targetY = canvas.height * 0.6;
			for (var c=0; c<data_characters.indexes.length; c++) {
				var targetX = (canvas.width * 0.125) + (charWidth * c) + (charWidth * 0.5);
				//if selectable and the cursor is on top, select it
				if (data_persistent.unlocked.includes(data_characters.indexes[c]) && player.parentPrev.bannedCharacters[data_characters.indexes[c]] == undefined) {
					if (cursor_x > targetX - menu_characterSize * 1.5 && cursor_x < targetX + menu_characterSize * 1.5 && cursor_y > targetY - menu_characterSize * 1.5 && cursor_y < targetY + menu_characterSize * 1.5) {
						replacePlayer(c);
						this.substate = 0;
					}
				}
			}
			return;
		}

		//accessing menu
		if (this.substate < 2) {
			if (this.substate == 1) {
				//audio slider
				this.audioSlider.interact();
				data_persistent.settings.volume = audio_channel1.volume;
			}
			//swap between 1 and 0 (menu and gameplay)
			//pausing has one buffer frame so the icon can be changed
			if (cursor_x < canvas.width * 0.06 && cursor_y < canvas.height * 0.1) {
				if (this.substate == 1) {
					this.substate = 0;
				} else {
					this.toPause = true;
				}
			}
		}
	}

	handleMouseMove(a) {
		updateCursorPos(a);
		//audo?? cha cha slide
		this.audioSlider.interact();
		data_persistent.settings.volume = audio_channel1.volume;
	}

	handleEscape() {
		if (this.substate == 0) {
			this.toPause = true;
		} else {
			loading_state = new State_Map();
			loading_state.doWorldEffects();
		}
	}

	orderWorld() {
		this.farObjs = [];
		this.nearObjs = [];

		this.readFrom.forEach(v => {
			//get camera distance, then sort
			v.getCameraDist();
			if (v.cameraDist > render_maxDistance) {
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
							loading_state.doWorldEffects();
						}
					}
					break;
				case 13:
					//enter, return to 0 state
					if (this.substate == 1) {
						this.substate = 0;
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

		this.codeOnExit = ``;
		

		this.data = data;
		this.line = startLine;

		this.substate = 0;
		this.fadeTime = challenge_fadeTime;
		this.addTextToQueue();

		//place player
		this.oldPlayerType = data_characters.map[player.constructor.name];
		this.targetParent = getObjectFromID(this.data[this.line].level);
		this.placePlayer();
	}

	addTextToQueue() {
		//escape if there's no text
		if (this.data[this.line].text == undefined) {
			return;
		}

		//split the input text
		var split = this.data[this.line].text.split("|");
		//add it all
		split.forEach(s => {
			if (s != "") {
				text_queue.push([this.data[this.line].char, s]);	
			}
		});
	}

	doTunnelStartEffects() {
		if (this.data[this.line].startCode != undefined) {
			this.data[this.line].startCode.split("|").forEach(l => {
				eval(l);
			});
		}
	}

	doTunnelStartEffects_Next() {
		//if the next line exists, do that as well (but only if the line allows it)
		if (this.data[this.line+1] != undefined) {
			if (this.data[this.line+1].startCode != undefined) {
				eval(this.data[this.line+1].startCode.split("|")[0]);
			}
		}
	}

	lineIsComplete() {
		//regular case
		if (this.data[this.line].endCode == undefined) {
			return challenge_isComplete();
		}

		//case of having different conditionals
		return eval(this.data[this.line].endCode);
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
				this.placePlayer();
				this.addTextToQueue();
				this.fadeTime = challenge_fadeTime;
				this.substate = 0;
			}
			return;
		}

		if (this.lineIsComplete()) {
			this.updateLine();
			return;
		}
		
		super.execute();
	}

	handleEscape() {
		if (this.substate == 1) {
			replacePlayer(this.oldPlayerType);
			eval(this.codeOnExit);
		}
		super.handleEscape();
	}

	handlePlayerDeath() {
		//if off the end of the tunnel but not out of the tunnel, count the tunnel as completed
		if (player.parentPrev.coordinateIsInTunnel_Boundless(player.x, player.y, player.z)) {
			//don't complete if there's an extra end code
			if (this.data[this.line].endCode == undefined || eval(this.data[this.line].endCode)) {
				player.parentPrev.resetWithoutPlayer();
				this.updateLine();
				return;
			}
		}

		
		super.handlePlayerDeath();
		this.doTunnelStartEffects();
		this.doTunnelStartEffects_Next();
	}

	//so that the challenge functions can access it
	handlePlayerDeath_SUPER() {
		super.handlePlayerDeath();
	}

	placePlayer() {
		replacePlayer(this.data[this.line].char);
		player.parent = this.targetParent;
		player.parentPrev = player.parent;
		player.backwards = this.data[this.line].backwards;
		player.dz = 0;
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
		this.doTunnelStartEffects_Next();
	}

	updateLine() {
		this.line += 1;

		if (this.line > this.data.length - 1) {
			//leave challenge mode if out of lines
			loading_state = new State_Map();
			loading_state.doWorldEffects();
			replacePlayer(0);
			return;
		}

		this.targetParent = getObjectFromID(this.data[this.line].level);
		//if the player's parent / direction is different from the target, do special placement
		if (player.parentPrev != this.targetParent || player.backwards != this.data[this.line].backwards) {
			this.substate = 2;
			return;
		}
		this.addTextToQueue();
		this.doTunnelStartEffects_Next();
	}
}


class State_Cutscene extends State_World {
	constructor(data, optionalExitState) {
		super();
		this.playerStore = player;
		player = new Runner(0, -10000, 0);
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
		this.ref = data;
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
			`new SceneTile(world_camera.x + polToCart(world_camera.theta, world_camera.phi, 5)[0], world_camera.y + polToCart(world_camera.theta, world_camera.phi, 5)[1], world_camera.z + polToCart(world_camera.theta, world_camera.phi, 5)[2], 1, 100, 0)`,
			`new SceneBoat(world_camera.x + polToCart(world_camera.theta, world_camera.phi, 5)[0], world_camera.y + polToCart(world_camera.theta, world_camera.phi, 5)[1], world_camera.z + polToCart(world_camera.theta, world_camera.phi, 5)[2], 0, 0)`
		];


		//loop through frames, if it's a string convert to objects
		this.readFrom = loading_state.readFrom;
		this.frame = 0;
		//activate effects
		eval(this.ref.effects);
		for (var e=0; e<this.ref.frames.length; e++) {
			//if the data line is a string, convert it to a set of objects
			if (this.ref.frames[e].constructor.name == "String") {
				this.ref.frames[e] = this.convertStringData(this.ref.frames[e]);
			}
		}
		this.doSidebar = true;
		this.destinationState = optionalExitState || new State_Map();
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
				this.ref.frames[this.frame][1].push(eval(dataArr[a]));
				return;
			}
		}
	}

	changePlayerParent(newParent) {
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
		3TL - tile				x~y~z~type~size~rot
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
				case "3TL":
					objData.push(new SceneTile(s[1] * 1, s[2] * 1, s[3] * 1, s[4] * 1, s[5] * 1, s[6] * 1));
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
		//a frame less than 0 is the exit code
		if (this.frame < 0) {
			this.exit();
			return;
		}
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
		this.ref.frames[this.frame][1].forEach(d => {
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
			drawSelectionBox(canvas.width * 0.5, canvas.height * 0.03, ctx.measureText(this.ref.id).width + (canvas.width * 0.02), canvas.height * 0.06);
			ctx.fillStyle = color_text_bright;
			
			ctx.fillText(this.ref.id, canvas.width * 0.5, canvas.height * 0.05);
			ctx.fillText(`${this.frame+1} / ${this.ref.frames.length}`, canvas.width * 0.5, canvas.height * 0.1);

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
			world_camera.targetX = world_camera.x;
			world_camera.targetY = world_camera.y;
			world_camera.targetZ = world_camera.z;
			if (this.modifyCameraPos) {
				//also update frame info
				this.ref.frames[this.frame][0] = [world_camera.x, world_camera.y, world_camera.z, world_camera.theta, world_camera.phi, world_camera.rot];
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
		player = this.playerStore;
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
		this.ref.frames.forEach(d => {
			frameData += this.giveStringDataForLine(d);
		});

		//apologies for the indenting here, it's so that when the string is outputted it won't have extra tabs at the start
var outputString = `{
	id: \`${this.ref.id}\`,
	effects: \`${this.ref.effects}\`,
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
			this.debugButton.interact();
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
			var newID = prompt("Enter new ID:", this.ref.id);
			if (isValidString(newID)) {
				this.ref.id = newID;
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
					this.ref.frames[this.frame][1].push(new SceneSprite(0.5, 0.5, 0.1, `data_sprites.${data_characters.indexes[a]}.sheet`, 0, false, 0, 0));
					return;
				}
			}

			//the map object
			if (getDistance2d([cursor_x, cursor_y], [targetX, ((canvas.height / 11) * 10) + (canvas.height / 22)]) < canvas.height / 35) {
				this.ref.frames[this.frame][1].push(new SceneSprite(0.5, 0.5, 0.1, `data_sprites.Map.sheet`, 0, false, 0, 0));
				return;
			}
			return;
		}
		

		//search through list of objects
		var tolerance = editor_handleRadius * 3;
		this.selected = undefined;
		for (var h=this.ref.frames[this.frame][1].length-1; h>-1; h--) {
			//get list of handles
			var handleList = this.ref.frames[this.frame][1][h].giveHandles();
			for (var a=0; a<handleList.length; a++) {
				//if the handle is closer than the tolerance, select it
				if (getDistance2d([cursor_x, cursor_y], handleList[a]) < tolerance) {
					if (this.selected != undefined) {
						this.selected.selectedPart = undefined;
					}

					tolerance = getDistance2d([cursor_x, cursor_y], handleList[a]);
					this.selected = this.ref.frames[this.frame][1][h];
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
					if (this.frame + 1 > this.ref.frames.length) {
						//if space is pressed duplicate the frame
						if (controls_shiftPressed) {
							var strData = this.giveStringDataForLine(this.ref.frames[this.ref.frames.length-1]);
							this.ref.frames[this.ref.frames.length] = this.convertStringData(strData.substring(1, strData.length-4));
							return;
						} else {
							this.ref.frames[this.ref.frames.length] = [JSON.parse(JSON.stringify(this.ref.frames[this.ref.frames.length-1][0])), []];
						}
					}
					this.updateFrame();
					break;
				//delete button
				case 8:
					if (this.selected != undefined) {
						//if shift is pressed, splice out all items
						if (controls_shiftPressed) {
							this.ref.frames[this.frame][1] = [];
							return;
						}
						//normal case
						this.ref.frames[this.frame][1].splice(this.ref.frames[this.frame][1].indexOf(this.selected), 1);
					} else if (this.ref.frames[this.frame][1].length == 0) {
						//if there are no items, delete the frame
						if (this.frame > 0) {
							this.ref.frames.pop();
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
		if (this.ref.frames[this.frame] == undefined) {
			this.frame = -1;
			return;
		}

		//camera properties
		world_camera.x = this.ref.frames[this.frame][0][0];
		world_camera.y = this.ref.frames[this.frame][0][1];
		world_camera.z = this.ref.frames[this.frame][0][2];
		world_camera.theta = this.ref.frames[this.frame][0][3];
		world_camera.phi = this.ref.frames[this.frame][0][4];
		world_camera.rot = this.ref.frames[this.frame][0][5];
		world_camera.reconcileTargets();
		world_camera.tick();

		world_lightObjects = [];
		//special object effects
		this.ref.frames[this.frame][1].forEach(v => {
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
			removeInvalidObjects(n);
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

	doWorldEffects() {
		world_camera.targetTheta = player.dir_front[0];
		world_camera.targetPhi = 0;
		world_camera.targetRot = (player.dir_down[1] + (Math.PI * 1.5)) % (Math.PI * 2);
		player.setCameraPosition();
		world_camera.snapToTargets();
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

	changePlayerParent(newParent) {
		if (player.backwards) {
			//make sure player isn't being backwards when they shouldn't be
			newParent.calculateBackwardsAllow();
			if (!newParent.allowBackwards) {
				player.backwards = false;
			}
			

			//also for convience's sake, if entering a new tunnel, always be forwards
			if (newParent.id.replaceAll(/[A-z]/g, '').replaceAll(',', '').replaceAll('-', '') * 1 == 1 && player.parentPrev.id.replaceAll(/[0-9]/g, '') != newParent.id.replaceAll(/[0-9]/g, '')) {
				player.backwards = false;
			}
		}
		
		super.changePlayerParent(newParent);
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

		//data for each individual run
		this.time = 0;
		this.distance = 0;
		this.powercells = 0;

		this.characterData = {};

		this.charactersUsed = [];

		this.drawEnding = true;

		//game stuff
		this.lastPlayerPos = [undefined, 0];
		this.lastTunnelLine = -1;
		this.worldTree = new IMNode(undefined, 0);
		this.readFrom = this.worldTree.getTunnelList();
	}

	doWorldEffects() {
		//move camera to start so objects are ordered properly, but I also want that nice zoom in effect, so the camera is far away
		world_camera.x = -100;
		world_camera.y = 400;
		world_camera.z = -42000;
		player.backwards = false;

		for (var a=0; a<9; a++) {
			this.worldTree.makeNode();
		}
		this.readFrom = this.worldTree.getTunnelList();
		this.placePlayer();
		this.orderWorld();
	}

	placePlayer() {
		this.substate = 0;
		ctx.lineWidth = 2;

		//putting player into world officially
		player.parentPrev = this.worldTree.tunnel;
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
				//calculate distance
				var newPlayerPos = [player.x - player.parentPrev.x, player.z - player.parentPrev.z];
				newPlayerPos = rotate(newPlayerPos[0], newPlayerPos[1], player.parentPrev.theta * -1);

				//ignore if crossing tunnels
				if (this.lastPlayerPos[0] == player.parentPrev) {
					//disregard x, z is the distance, and there are 30 units in a meter
					var difference = Math.abs(this.lastPlayerPos[1] - newPlayerPos[1]);
					this.distance += difference / 30;
					this.characterData[player.constructor.name].distance += difference / 30;
				}
				this.lastPlayerPos[0] = player.parentPrev;
				this.lastPlayerPos[1] = newPlayerPos[1];

				//calculate time
				this.time += 1;
				this.characterData[player.constructor.name].time += 1;

				super.execute();
				//drawing stats text
				ctx.fillStyle = color_text_bright;
				ctx.textAlign = "left";
				ctx.font = `${canvas.height / 22}px Comfortaa`;
				ctx.fillText(`${this.distance.toFixed(0)} m`, canvas.width * 0.07, canvas.height * 0.05);
				var add = "";
				if (this.powercells != 1) {
					add = "s";
				}
				ctx.fillText(`${this.powercells} power cell${add}`, canvas.width * 0.07, (canvas.height * 0.05) + (canvas.height / 21));
				ctx.textAlign = "center";

				//add tunnel and remove previous tunnel after displaying text
				if (this.textTime == 1) {
					if (this.worldTree.tunnel != player.parent) {
						this.worldTree = this.worldTree.remove();
					}
					this.worldTree.makeNode();
					this.readFrom = this.worldTree.getTunnelList();
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
			super.handlePlayerDeath();
			this.distance = 0;
			this.characterData[player.constructor.name].distance = 0;
		}
	}


	handleEscape() {
		switch (this.substate) {
			case 0:
				this.toPause = true;
				break;
			case 1:
				loading_state = new State_Menu();
				break;
			case 2:
				this.pushScoreToLeaderboard();
				loading_state = new State_Infinite();
				loading_state.doWorldEffects();
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

			data_characters.indexes.forEach(c => {
				if (!characterList.includes(c)) {
					characterList.push(c);
				}
			});

			for (var a=loading_state.charactersUsed.length; a<11; a++) {
				var offY = canvas.height * 0.25 * Math.floor(a / 5);
				var offX = canvas.width * 0.6 * ((a % 5) / 5);

				//only continue if the character
				if (textures_common[data_characters.map[characterList[a]]] != undefined && data_persistent.unlocked.includes(characterList[a])) {
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
			resetAllTunnels();
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


class State_Map {
	constructor() {
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
		this.boxIcon_lower = new Texture(data_sprites.Map.sheet, data_sprites.spriteSize * 2, 1e1001, false, false, [data_sprites.Map.boxes[1]]);
		this.boxIcon_tunnel = new Texture(data_sprites.Map.sheet, data_sprites.spriteSize * 2, 1e1001, false, false, [data_sprites.Map.boxes[0]]);
		this.readFrom = loading_state.readFrom;
		this.dir_held = false;
		this.substate = 0;
		this.angelPanelSpeed = 0;

		this.mouseDownZ;
		this.mouseChangeZ = 0;

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
		if (this.substate < 2) {
			drawSky(color_map_bg);
		} else {
			drawSky(color_map_bg_dark);
		}

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


		//game state specific things
		if (this.substate != 2) {
			if (this.mouseDownZ != undefined) {
				world_camera.targetZ += this.mouseChangeZ;
				world_camera.targetZ = clamp(world_camera.targetZ, (-2 * map_shift) + map_zOffset, (2 * map_shift) + map_zOffset);
				world_camera.z = world_camera.targetZ;
	
				if (!cursor_down) {
					this.mouseChangeZ = Math.floor(this.mouseChangeZ * 0.9);
					if (Math.abs(this.mouseChangeZ) < 15) {
						this.mouseDownZ = undefined;
					}
				} else {
					this.mouseChangeZ *= 0.85;
				}
			}

			//angel going home panel
			if (data_persistent.goingHomeProgress != undefined) {
				this.substate += this.angelPanelSpeed;
				if (this.substate > 1 || this.substate < 0) {
					this.substate = clamp(this.substate, 0, 1);
					this.angelPanelSpeed = 0;
				}
				drawAngelPanel(this.substate);
			}
		}
		

		var fontSize = Math.floor(canvas.height / 22);
		ctx.font = `${fontSize}px Comfortaa`;
		ctx.textAlign = "center";

		//draw selected object + extra UI
		if (editor_active) {
			if (this.objSelected != undefined) {
				//drawing cursor
				drawCircle(color_editor_cursor, cursor_x, cursor_y, canvas.height / 240);

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
			ctx.globalAlpha = 0.6;
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.stroke();
			ctx.globalAlpha = 1;
			return;
		}


		//drawing the name of the level the user hovers over
		drawCircle(color_editor_cursor, this.cursorPos[0], this.cursorPos[1], canvas.height / 240);
		if (this.objSelected != undefined) {
			ctx.fillStyle = color_text;
			ctx.fillText(this.objSelected.id, canvas.width * 0.5, canvas.height * 0.1);
		}

		//box drawings
		if (data_persistent.bridgeBuildingProgress != undefined) {
			this.boxIcon_lower.beDrawn(canvas.width * 0.95, canvas.height * 0.94, 0, canvas.height * 0.125);
			if (this.substate == 2) {
				//draw all visible boxes
				ctx.font = `${Math.floor(canvas.height / 50)}px Permanent Marker`;
				ctx.fillStyle = color_cutsceneBox;
				var ref = undefined;
				var tnRef = undefined;
				for (var k=0; k<data_bridgeBuilding.length; k++) {
					ref = data_bridgeBuilding[k];
					if (data_persistent.bridgeBuildingProgress >= ref[3]) {
						tnRef = getObjectFromID(ref[0]);
						this.boxIcon_tunnel.beDrawn(tnRef.map_circleCoords[0], tnRef.map_circleCoords[1], 0, canvas.height / 30);
						ctx.fillText(`box ${k+1}`, tnRef.map_circleCoords[0] + (canvas.height / 20), tnRef.map_circleCoords[1] + (canvas.height / 50));
					}
					
				}
			}
		}
	}

	handleEscape() {
		loading_state = new State_Menu();
	}


	//mouse handling functions, ack this is ugly
	handleMouseDown(a) {
		//update cursor position
		updateCursorPos(a);

		//box things
		if (data_persistent.bridgeBuildingProgress != undefined) {
			if (this.handleMD_Box() == 31) {
				return;
			}
		}
		if (this.substate == 2) {
			return;
		}

		//going home checklist things
		if (data_persistent.goingHomeProgress != undefined) {
			if (this.handleMD_Angel() == 31) {
				return;
			}
		}

		if (this.objSelected == undefined && !editor_active) {
			//if clicked just over the map, select z pos
			this.mouseDownZ = screenToSpace([cursor_x, cursor_y], world_camera.y)[2];
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

	handleMD_Angel() {
		//flip note up
		if (this.substate < 0.04 && cursor_x > canvas.width * checklist_margin && cursor_x < canvas.width * (checklist_margin + checklist_width) && cursor_y > canvas.height * 0.95) {
			this.angelPanelSpeed = checklist_speed;
			return 31;
		}

		//flip note down
		if (this.substate > 0.96) {
			//flip note down
			if (cursor_x > canvas.width * checklist_margin && cursor_x < canvas.width * (checklist_margin + checklist_width) && 
			cursor_y > canvas.height * (1 - checklist_height) && cursor_y < canvas.height * (1.05 - checklist_height)) {
				this.angelPanelSpeed = -1 * checklist_speed;
				return 31;
			}

			//button
			if (data_persistent.goingHomeProgress < challengeData_angelMissions.length) {
				checklist_searchButton.interact();
				return 31;
			}

			for (var a=1; a<data_angelChecklist.length; a++) {
				var midY = canvas.height * ((1 - checklist_height) + ((a+2) * (checklist_height / (data_angelChecklist.length + 2))));
				var minX = canvas.width * (checklist_margin + (checklist_width / 5) - (checklist_width / 25));
				var maxX = canvas.width * (checklist_margin + checklist_width - (checklist_width / 10));

				if (cursor_x > minX && cursor_x < maxX && cursor_y > midY - (canvas.height / 50) && cursor_y < midY + (canvas.height / 50)) {
					if (data_angelChecklist[a][4] != undefined) {
						loading_state = new State_Challenge(challengeData_angelMissions, data_angelChecklist[a][4]);
					}
					return 31;
				}
			}
		}
	}

	handleMD_Box() {
		//toggling substate
		if (cursor_x > canvas.width * 0.88 && cursor_y > canvas.height * 0.85) {
			//flip substate between 0 and 2 when clicked
			this.substate = (this.substate != 2) * 2;

			if (this.substate == 2) {
				//center camera on overworld
				world_camera.targetZ = map_zOffset;

				//de-select things
				this.objSelected = undefined;
				this.cursorPos = [-100, -100];
			}
			return;
		}

		if (this.substate == 2) {
			//try to enter challenge mode of the boxes
			var minDistStorage = [cursor_hoverTolerance, -1];
			var tnRef;
			for (var k=0; k<data_bridgeBuilding.length; k++) {
				if (data_persistent.bridgeBuildingProgress >= data_bridgeBuilding[k][3]) {
					tnRef = getObjectFromID(data_bridgeBuilding[k][0]);
					if (getDistance2d(tnRef.map_circleCoords, [cursor_x, cursor_y]) < minDistStorage[0]) {
						minDistStorage = [getDistance2d(tnRef.map_circleCoords, [cursor_x, cursor_y]), k];
					}
				}
			}

			if (minDistStorage[1] != -1) {
				loading_state = new State_Challenge(data_bridgeBuilding[minDistStorage[1]][1], data_bridgeBuilding[minDistStorage[1]][2]);
			}
		}
	}

	handleMouseMove(a) {
		updateCursorPos(a);

		if (this.substate == 2) {
			return;
		}

		//if the cursor's down, move map
		if (this.mouseDownZ != undefined && cursor_down) {
			this.mouseChangeZ = this.mouseDownZ - screenToSpace([cursor_x, cursor_y], world_camera.y)[2];
			return;
		}

		//select tunnel
		if (!editor_active) {
			//normal mode, reset + select tunnel
			this.objSelected = undefined;
			this.cursorPos = [-100, -100];
			if (data_persistent.goingHomeProgress != undefined) {
				//if cursor is on the note, don't select an object
				if (this.substate > 0 && cursor_x > canvas.width * checklist_margin && cursor_x < canvas.width * (checklist_margin + checklist_width) && cursor_y > canvas.height * (1 - checklist_height)) {
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
		if (this.substate == 2) {
			return;
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
		for (var t=0; t<data_characters.indexes.length; t++) {
			if (player.constructor.name == data_characters.indexes[t]) {
				this.characterSelected = t;
				this.displayCharacterSelected = t;
			}
		}
		this.substate = 0;
		this.nodeSelected = undefined;
		this.readFrom = [];

		//settings for settings menu
		this.settings = [
			new PropertySlider(0.05, 0.15 + (0 * menu_propertyHeight), 0.4, 0.2, 'music volume', `audio_channel1.volume = value;`, `audio_channel1.volume`, 0, 1, 0.01, false),
			new PropertySlider(0.05, 0.15 + (1 * menu_propertyHeight), 0.4, 0.2, 'effects volume', `audio_channel2.volume = value;`, `audio_channel2.volume`, 0, 1, 0.01, false),
			
			new PropertyToggle(0.05, 0.15 + (3 * menu_propertyHeight), 0.4, `high resolution`, `data_persistent.settings.highResolution`),
			new PropertyToggle(0.05, 0.15 + (4 * menu_propertyHeight), 0.4, `anti-aliasing for sprites`, `data_persistent.settings.antiAlias`),
			new PropertyToggle(0.05, 0.15 + (5 * menu_propertyHeight), 0.4, `precise tunnel rendering`, `data_persistent.settings.altRender`),
			new PropertyToggle(0.05, 0.15 + (6 * menu_propertyHeight), 0.4, `alternate camera rotation`, `data_persistent.settings.altCamera`),

			new PropertyToggle(0.525, 0.15 + (3 * menu_propertyHeight), 0.4, `editor - show polygon outlines`, `data_persistent.settings.enableOutlines`),
			new PropertyToggle(0.525, 0.15 + (4 * menu_propertyHeight), 0.4, `editor - show light bridge tiles`, `data_persistent.settings.pastaView`),

			new PropertyToggle(0.525, 0.15 + (0 * menu_propertyHeight), 0.4, `contain mouse inputs to canvas`, `data_persistent.settings.maskCursor`),

		];
		this.buttons = [
			new PropertyButton(0.5, 0.5 - ((menu_buttonHeight * 0.75) * 3) + 						   (menu_characterSize / canvas.height), menu_buttonWidth, menu_buttonHeight, "Infinite Mode", `loading_state = new State_Infinite(); loading_state.doWorldEffects();`),
			new PropertyButton(0.5, 0.5 - ((menu_buttonHeight * 0.75) * 3) + (menu_buttonHeight * 2) + (menu_characterSize / canvas.height), menu_buttonWidth, menu_buttonHeight, "Explore Mode", `loading_state = new State_Map(); loading_state.doWorldEffects();`),
			new PropertyButton(0.5, 0.5 - ((menu_buttonHeight * 0.75) * 3) + (menu_buttonHeight * 4) + (menu_characterSize / canvas.height), menu_buttonWidth, menu_buttonHeight, "Edit Mode", `loading_state = new State_Edit_Tiles(); alert(editor_warning);`),
		];
		this.readFrom = orderObjects(world_objects, 6);

		this.characterTextTime = undefined;
		this.characterTextObj = undefined;
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
				for (var b=0; b<4; b++) {
					drawTile2d((canvas.height * 0.03) + (canvas.width * (b * 0.07)), canvas.height * 0.9, canvas.width * 0.06, 40 + b);
				}

				//drawing characters

				//selection box
				var offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.indexes.length) * this.displayCharacterSelected) - (Math.PI * 0.5));
				var offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.indexes.length) * this.displayCharacterSelected) - (Math.PI * 0.5));
				drawSelectionBox((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize - 5, menu_characterSize * 2, menu_characterSize * 2);

				for (var h=0; h<data_characters.indexes.length; h++) {
					offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.indexes.length) * h) - (Math.PI * 0.5));
					offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.indexes.length) * h) - (Math.PI * 0.5));
					//character texture
					textures_common[h].frame = 0 + (modularDifference(this.displayCharacterSelected, h, data_characters.indexes.length) < 0.5 && data_persistent.unlocked.includes(data_characters.indexes[h]));
					textures_common[h].beDrawn((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize, 0, menu_characterSize * 1.7);
					if (!data_persistent.unlocked.includes(data_characters.indexes[h])) {
						drawLock((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + (menu_characterSize * 0.75), menu_characterSize, menu_characterSize);
					}
				}

				//drawing character text, if there is any
				if (this.characterTextTime != undefined) {
					this.characterTextTime -= 1;

					ctx.globalAlpha = 1 - Math.pow(1.8 * (this.characterTextTime / menu_characterTextTime) - 1, 10);
					//box
					ctx.fillStyle = color_grey_dark;
					ctx.strokeStyle = color_grey_dark;
					drawRoundedRectangle(canvas.width * (0.5 - (menu_characterTextWidth / 2)), canvas.height * 0.74, canvas.width * menu_characterTextWidth, canvas.height * (0.01 + (0.03 * this.characterTextObj.processedContent.length)), canvas.height / 96);

					//text
					this.characterTextObj.beDrawn();

					if (this.characterTextTime <= 0) {
						this.characterTextTime = undefined;
					}
					ctx.globalAlpha = 1;
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
						var charIndex = data_characters.map[data_persistent.highscores[j][3][k]];
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

				
				//settings menu
				this.settings.forEach(s => {
					if (s.constructor.name == "PropertyButton") {
						s.tick();
					}
					s.beDrawn();
				});
				break;
			case 3:
				//cutscene viewer menu
				ctx.lineWidth = 1;
				data_cutsceneTree.tick();
				data_cutsceneTree.beDrawn_line();
				data_cutsceneTree.beDrawn_handle();
				break;
			case 4:
				//credits
				ctx.fillStyle = color_text_bright;
				ctx.font = `${canvas.height / 25}px Comfortaa`;
				ctx.textAlign = "left";
				for (var l=0; l<credits.length; l++) {
					ctx.fillText(credits[l], canvas.width * 0.03, canvas.height * (0.15 + 0.05 * l));
				}
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
					b.interact();
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
				for (var h=0; h<data_characters.indexes.length; h++) {
					var posX = (canvas.width * 0.5) + (menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.indexes.length) * h) - (Math.PI * 0.5)));
					var posY = (canvas.height * 0.5) + menu_characterSize + (menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.indexes.length) * h) - (Math.PI * 0.5)));
					var charRef = data_characters.indexes[h];
					//selection box
					if (cursor_x > posX - menu_characterSize && cursor_x < posX + menu_characterSize &&
					cursor_y > posY - menu_characterSize && cursor_y < posY + menu_characterSize &&
					data_persistent.unlocked.includes(charRef)) {
						//if the character is already selected, display their text box
						if (this.characterSelected == h) {
							var text = data_characters[charRef].text;
							if (this.characterTextTime != undefined) {
								//if the text is already being displayed, switch to a different text
								text = data_characters[charRef].trivia[Math.floor(randomBounded(0, data_characters[charRef].trivia.length-0.01))];
							}
							
							this.characterTextTime = menu_characterTextTime;
							this.characterTextObj = new SceneText(0.5, 0.75, menu_characterTextWidth / 2.02, 1 / 35, text, true);
						} else {
							this.characterTextTime = undefined;
						}
						this.characterSelected = h;
						player = eval(`new ${charRef}(0, 0, 0)`);
						if (Math.abs(this.characterSelected - this.displayCharacterSelected) > data_characters.indexes.length / 2) {
							if (this.characterSelected < this.displayCharacterSelected) {
								this.displayCharacterSelected -= data_characters.indexes.length;
							} else {
								this.displayCharacterSelected += data_characters.indexes.length;
							}
						}
						return;
					}
				}
				//collision with lower buttons
				for (var b=0; b<4; b++) {
					var xOff = (canvas.height * 0.03) + (canvas.width * (b * 0.07));
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
					return;
				}
				var currentRes = data_persistent.settings.highResolution;
				//others
				this.settings.forEach(s => {
					s.interact();
				});
				//update resolution if required
				if (data_persistent.settings.highResolution != currentRes) {
					updateResolution();
				}
				//anti-aliasing
				ctx.imageSmoothingEnabled = data_persistent.settings.antiAlias;
				break;
			case 3:
				//try to select a cutscene node
				this.nodeSelected = undefined;
				this.nodeSelected = data_cutsceneTree.becomeSelected(canvas.height / 10);
				//cutscene viewer
				if (!editor_active) {
					//activating cutscene
					if (this.nodeSelected != undefined) {
						loading_state = new State_Cutscene(this.nodeSelected.cutsceneRef, this);
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
			return;
		}

		if (this.substate == 2) {
			this.settings.forEach(s => {
				if (s.constructor.name == "PropertySlider") {
					s.interact();
				}
			});
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