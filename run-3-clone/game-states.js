
class State_Cutscene {
	constructor() {
		this.frame = 0;
	}

	execute() {
		//bege / stars
		ctx.fillStyle = color_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		world_stars.forEach(s => {
			s.beDrawn();
		});

		world_camera.tick();
		
		player.x = world_camera.x;
		player.y = world_camera.y;
		player.z = world_camera.z;

		//order objects every once in a while
		if (world_time % 40 == 3) {
			world_objects.forEach(w => {
				w.tick();
			});
			//order all objects
			world_objects = orderObjects(world_objects, 7);
		}

		//draw all tunnels
		world_objects.forEach(w => {
			w.beDrawn();
		});
	}
}







class State_Game {
	constructor() {
		this.text = ``;
		this.time = 0;

		this.nearObjs = [];
		this.farObjs = [];

		this.orderWorld();
	}

	execute() {
		//logTime("total");
		//handling entities
		world_camera.tick();
		player.tick();

		//if the player isn't in a tunnel, try to get them in one
		if (player.parent == undefined) {
			this.orderWorld();

			//try the player in the closest few tunnels
			for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-6); v--) {
				if (this.nearObjs[v].playerIsInBounds()) {
					player.parent = this.nearObjs[v];
					v = -1;
				}
			}
			//if they're still undefined, kill them
			if (player.parent == undefined) {
				player.parentPrev.reset();
				player.parent = player.parentPrev;
			} else {
				//display text
				this.text = player.parent.id;
				this.time = render_tunnelTextTime;
			}
		} else {
			//if the player's left their parent tunnel, change their parent
			if (!player.parent.playerIsInBounds()) {
				player.parentPrev = player.parent;
				player.parent = undefined;
			} else if (!player.parent.playerIsInTunnel()) {
				
				//if the player is in the void, try to change parent without reordering objects
				//try the player in the closest few tunnels
				for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-10); v--) {
					if (this.nearObjs[v].playerIsInTunnel()) {
						player.parentPrev = player.parent;
						player.parent = this.nearObjs[v];
						v = -1;

						//reorder objects anyways if found a new tunnel
						this.orderWorld();

						//display text
						this.text = player.parent.id;
						this.time = render_tunnelTextTime;
					}
				}
			}
		}

		
		//just tick the closest few tunnels
		for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-20); v--) {
			this.nearObjs[v].tick();
		}
		

		drawSky(color_bg);

		//drawing all tunnels
		this.farObjs.forEach(f => {
			f.beDrawn();
		});
		this.nearObjs.forEach(f => {
			if (f != player.parent) {
				f.beDrawn();
			}
		});

		if (player.parent == undefined) {
			player.beDrawn();
		} else {
			drawPlayerWithParent();
		}

		//crosshair
		if (editor_active) {
			drawCrosshair();
		}


		//drawing pressed keys
		drawKeys();

		//drawing new tunnel text
		if (this.time > 0) {
			ctx.fillStyle = color_text_bright;
			ctx.font = `${canvas.height / 22}px Century Gothic`;
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.5);
			this.time -= 1;
		}
		//logTimeEnd("total", "avg. frame time");
	}

	orderWorld() {
		//ordering all the objects
		world_objects.forEach(u => {
			u.getCameraDist();
		});

		//if the camera distance is more than 5 digits (100,000), just put it in a seperate bin
		this.farObjs = [];
		this.nearObjs = [];
		for (var v=0; v<world_objects.length; v++) {
			if (world_objects[v].cameraDist > 99999) {
				this.farObjs.push(world_objects[v]);
			} else {
				this.nearObjs.push(world_objects[v]);
			}
		}

		this.nearObjs = orderObjects(this.nearObjs, 5);
	}

	handleEscape() {
		loading_state = new State_Map();
	}

	handleMouseDown(a) {

	}

	handleMouseMove(a) {

	}
}

class State_Infinite {
	constructor() {
		this.time = 0;
		this.meters = 0;
		this.data = levelData_infinite.split("\n");
		this.difficulty = 0;

		this.endingScreen = false;

		this.objs = [];
		this.sortedObjs = [];
		for (var a=0; a<5; a++) {
			this.addTunnel();
		}
		this.placePlayer();
		ctx.lineWidth = 2;
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

		this.objs.push(new Tunnel_FromData(this.data[Math.floor(randomBounded(this.difficulty, this.difficulty + infinite_levelRange))]));
		this.objs[this.objs.length-1].theta = sT;
		this.objs[this.objs.length-1].updatePosition([sX, 0, sZ]);
		
		//updating difficulty
		this.difficulty += 1;
		if (this.difficulty + infinite_levelRange > this.data.length-1) {
			this.difficulty -= 1;
		}
		this.orderWorld();
	}

	placePlayer() {
		//putting player into world officially
		player.parentPrev = this.objs[0];
		player.parent = player.parentPrev;
		player.parentPrev.reset();
		
		loading_state.text = player.parentPrev.id;
		loading_state.time = render_tunnelTextTime;
	}

	execute() {

		if (!this.endingScreen) {
			//add to meter count, 30 pixels in a meter
			this.meters += player.dz / 30;

			//regular stuff, similar to explore mode
			world_camera.tick();
			player.tick();

			if (player.parent == undefined) {
				this.orderWorld();
				for (var v=this.sortedObjs.length-1; v>=0; v--) {
					if (this.sortedObjs[v].playerIsInBounds()) {
						player.parent = this.sortedObjs[v];
						v = -1;
					}
				}
				if (player.parent == undefined) {
					if (this.meters > 20) {
						this.endingScreen = true;
					} else {
						player.parentPrev.reset();
						player.parent = player.parentPrev;
						this.meters = 0;
					}
				} else {
					if (player.parent != player.parentPrev) {
						this.text = player.parent.id;
						this.time = render_tunnelTextTime;
						this.objs.splice(0, 1);
						this.addTunnel();
					}
				}
			} else { 
				if (!player.parent.playerIsInBounds()) {
					player.parentPrev = player.parent;
					player.parent = undefined;
				} else if (!player.parent.playerIsInTunnel()) {
					for (var v=this.sortedObjs.length-1; v>=0; v--) {
						if (this.sortedObjs[v].playerIsInTunnel()) {
							player.parentPrev = player.parent;
							player.parent = this.sortedObjs[v];
							v = -1;
							this.orderWorld();
							this.text = player.parent.id;
							this.time = render_tunnelTextTime;
							this.objs.splice(0, 1);
							this.addTunnel();
						}
					}
				}
			}
			this.sortedObjs.forEach(v => {
				v.tick();
			});

			//drawing
			drawSky(color_bg);
			this.sortedObjs.forEach(f => {
				if (f != player.parent) {
					f.beDrawn();
				}
			});
			if (player.parent == undefined) {
				player.beDrawn();
			} else {
				drawPlayerWithParent();
			}
			if (editor_active) {
				drawCrosshair();
			}
			drawKeys();

			//drawing meter text
			ctx.fillStyle = color_text_bright;
			ctx.textAlign = "left";
			ctx.font = `${canvas.height / 22}px Century Gothic`;
			ctx.fillText(`${this.meters.toFixed(0)} m`, canvas.width * 0.02, canvas.height * 0.05);
			ctx.textAlign = "center";

			//drawing new tunnel text
			if (this.time > 0) {
				ctx.font = `${canvas.height / 22}px Century Gothic`;
				ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.5);
				this.time -= 1;
			}
		} else {
			//main box
			ctx.fillStyle = color_grey_lightest;
			ctx.strokeStyle = color_grey_light;
			ctx.lineWidth = canvas.height / 50;
			drawRoundedRectangle(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8, canvas.width * 0.04);
		}

	}

	orderWorld() {
		//ordering all the objects
		this.objs.forEach(u => {
			u.getCameraDist();
		});
		this.sortedObjs = orderObjects(this.objs, 5);
	}

	handleEscape() {
		loading_state = new State_Menu();
	}

	handleMouseDown(a) {
		
	}

	handleMouseMove(a) {

	}
}

class State_Loading {
	constructor() {
		this.time = 10;
		this.levelSets = data_levelSets;

		//this.levelSets = [`M`, `D`, `F`];
	}

	execute() {
		if (this.time == 10) {
			//drawing background
			ctx.fillStyle = color_bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		
		for (var s=0; s<12; s++) {
			this.time += 1;
			var xAdd = (this.time * (canvas.height / 480) * Math.cos((Math.PI * 0.666 * this.time) + Math.pow(randomSeeded(-0.8, 0.8), 3)));
			var yAdd = (this.time * (canvas.height / 480) * Math.sin((Math.PI * 0.666 * this.time) + Math.pow(randomSeeded(-0.8, 0.8), 3)));
			drawCircle(color_stars, (canvas.width * 0.5) + xAdd, (canvas.height * 0.5) + yAdd, randomSeeded(3, 7));

			//loading tunnels at certain times
			if (this.time % 20 == 0) {
				var index = (this.time / 20) - 1;
				
				if (index < this.levelSets.length) {
					//loading in a level set
					placeTunnelSet(eval(`levelData_${this.levelSets[index]}`));
					console.log(`placed ${this.levelSets[index]}`);
				}

				if (this.time == 540) {
					//story things after loading all levels
					localStorage_read();
					getObjectFromID(`Level 1`).discovered = true;
					console.log(`loaded save`);
				}
			}
		}
		if (this.time > 550) {
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
		world_camera.y = map_cameraHeight;
		world_camera.z = 0;

		world_camera.phi = -0.5 * Math.PI;
		world_camera.theta = -0.5 * Math.PI;
		world_camera.rot = 0;

		//targets
		world_camera.targetRot = world_camera.rot;
		world_camera.targetTheta = world_camera.theta;

		this.levelSelected = undefined;
		this.cursorPos = [-100, -100];

		//clear player's previous levels
		player.parent = undefined;
		player.parentPrev = undefined;
		player.x = 1e10;
		player.y = 1e10;
		player.z = 1e10;
	}

	execute() {
		world_camera.tick();
		drawSky(color_map_bg);

		//draw world objects
		ctx.lineWidth = canvas.height / 480;
		ctx.strokeStyle = color_map_writing;
		world_objects.forEach(w => {
			w.beDrawnOnMap();
		});

		var fontSize = Math.floor(canvas.height / 24);
		ctx.font = `${fontSize}px Century Gothic`;
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
					editor_selected.updatePosition([editor_selected.x, editor_selected.y, editor_selected.z]);
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
				loading_state.time = render_tunnelTextTime;
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
					editor_selected.updatePosition([editor_selected.x, editor_selected.y, editor_selected.z]);
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
						var newCoords = screenToSpace([snapX + offset[0], snapY + offset[1]], map_cameraHeight);
						editor_selected.updatePosition(newCoords);
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
			this.selectionTextures.push(new Texture(getImage(eval(`data_sprites.${data_characters[t]}.sheet`)), data_sprites.spriteSize, 2, false, false, eval(`data_sprites.${data_characters[t]}.back`)));
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
		this.displayCharacterSelected = ((this.displayCharacterSelected * 6) + this.characterSelected) / 7;
		menu_characterSize = canvas.height / 16;
		//bege
		ctx.fillStyle = color_bg;
		ctx.strokeStyle = color_grey_dark;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//title card
		ctx.font = `${canvas.height / 10}px Century Gothic`;
		ctx.textAlign = `center`;
		ctx.fillStyle = color_text_bright;
		ctx.fillText(`Run 3`, canvas.width * 0.5, canvas.height * 0.1);

		//character circle
		
		//mode select

		//drawing buttons
		var trueButtonWidth = (canvas.width * menu_buttonWidth * 0.5);
		var trueButtonHeight = (canvas.height * menu_buttonHeight * 0.5);
		var startHeight = (canvas.height * 0.5) - (trueButtonHeight * this.buttons.length * 1.5);

		ctx.lineWidth = canvas.height / 96;
		ctx.font = `${canvas.height / 30}px Century Gothic`;
		for (var y=0; y<this.buttons.length; y++) {
			var yOffset = startHeight + (trueButtonHeight * 4 * y);
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
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = color_grey_light;
		ctx.strokeStyle = color_menuSelectionOutline;
		drawRoundedRectangle((canvas.width * 0.5) + offX - menu_characterSize, (canvas.height * 0.5) + offY, menu_characterSize * 2, menu_characterSize * 2, canvas.height / 48);
		ctx.globalAlpha = 1;

		for (var h=0; h<data_characters.length; h++) {
			offX = menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5));
			offY = menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5));
			//character texture
			this.selectionTextures[h].beDrawn((canvas.width * 0.5) + offX, (canvas.height * 0.5) + offY + menu_characterSize, 0, menu_characterSize * 1.7);
		}
	}

	handleMouseDown(a) {
		if (this.overButton > -1) {
			loading_state = eval(this.buttons[this.overButton][1]);
		} else {
			//checking for collision with charatcers. This is done here instead of the mouseMove function because hovering over characters doesn't do anything.
			for (var h=0; h<data_characters.length; h++) {
				var posX = (canvas.width * 0.5) + (menu_characterCircleRadius * canvas.height * Math.cos((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5)));
				var posY = (canvas.height * 0.5) + menu_characterSize + (menu_characterCircleRadius * canvas.height * Math.sin((Math.PI * 2 * (1 / data_characters.length) * h) - (Math.PI * 0.5)));
	
				//selection box
				if (cursor_x > posX - menu_characterSize && cursor_x < posX + menu_characterSize &&
				cursor_y > posY - menu_characterSize && cursor_y < posY + menu_characterSize) {
					this.characterSelected = h;
					player = eval(`new ${data_characters[h]}(0, 0, 0)`);
					controls_object = player;
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
			var yOffset = startHeight + (trueButtonHeight * 4 * y) + trueButtonHeight;

			if (cursor_x > (canvas.width * 0.5) - trueButtonWidth && cursor_x < (canvas.width * 0.5) + trueButtonWidth &&
				cursor_y > yOffset - trueButtonHeight && cursor_y < yOffset + trueButtonHeight) {
					this.overButton = y;
			}
		}
	}
}

