//houses all classes
class AudioChannel {
	constructor(volume) {
		this.audio = undefined;
		this.target = undefined;
		this.volume = volume;
		this.time = 0;
	}

	tick() {
		//if the current sound isn't played, then play it. Also does looping.
		if (this.audio != undefined) {
			if (this.audio.paused || this.audio.currentTime + audio_tolerance >= this.audio.duration) {
				this.time = 0;
				this.reset();
			}
		}

		//changing audio
		this.change();

		//set volume
		if (this.audio != undefined) {
			this.audio.volume = this.volume * (1 - (this.time / audio_fadeTime));
			if (loading_state instanceof State_World && player.parentPrev != undefined) {
				this.audio.volume *= player.parentPrev.power;
			}
		}
	}

	change() {
		//if the audios are different, fade them out and then play
		if (this.target != this.audio) {
			this.time += 1;

			//if time is up, snap volume up and change audio
			//alternatively, a change from undefined happens instantly
			if (this.time > audio_fadeTime || this.audio == undefined) {
				this.time = 0;
				this.audio = this.target;
				if (this.audio != undefined) {
					this.reset();
				}
				return;
			}
		} else {
			//if the audios are the same and time is greater than 0, subtract time
			if (this.time > 0) {
				this.time -= 1;
			}
		}
	}

	//starts playing the current audio file, from the beginning
	reset() {
		this.audio.currentTime = 0;
		this.audio.volume = this.volume;
		this.audio.play();
	}
}






class Camera {
	constructor(x, y, z, xRot, yRot) {
		this.friction = 0.85;

		this.scale = 200;
		this.sens = 0.04;
		this.speed = 0.05;
		this.aSpeed = 0.8;
		this.speedSettingSelected = 1;
		this.speedSettings = [1 / 8, 1, 10];


		this.x = x;
		this.y = y;
		this.z = z;

		this.targetX = x;
		this.targetY = y;
		this.targetZ = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 12;
		this.dMin = 0.02;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;


		this.theta = yRot;
		this.phi = xRot;
		this.rot = 0;
		this.targetTheta = yRot;
		this.targetPhi = xRot;
		this.targetRot = 0;

		this.rotMatrix = [];
		this.createMatrix();

		this.dt = 0;
		this.dp = 0;
		this.dr = 0;
	}

	createMatrix() {
		//creates a rotation matrix based on the current rotation values
		this.rotMatrix = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1],
		];
		this.rotMatrix.forEach(b => {
			[b[0], b[2]] = rotate(b[0], b[2], this.theta);
			[b[1], b[2]] = rotate(b[1], b[2], this.phi);
			[b[0], b[1]] = rotate(b[0], b[1], this.rot);
		})
	}

	moveFollow() {
		//changing with average
		this.x = (this.targetX + (this.x * (render_animSteps - 1))) / render_animSteps;
		this.y = (this.targetY + (this.y * (render_animSteps - 1))) / render_animSteps;
		this.z = (this.targetZ + (this.z * (render_animSteps - 1))) / render_animSteps;
		this.theta = (this.targetTheta + (this.theta * (render_animSteps - 1))) / render_animSteps;
		this.phi = (this.targetPhi + (this.phi * (render_animSteps - 1))) / render_animSteps;
		this.rot = (this.targetRot + (this.rot * (render_animSteps - 1))) / render_animSteps;
	}

	moveFree() {
		//velocity: add, then bind max, then apply friction
		var vels = [this.dx, this.dy, this.dz];
		var accs = [this.ax, this.ay, this.az];

		for (var u=0; u<vels.length; u++) {
			//if accelerating, add and keep inside bounds. If not, just apply friction
			vels[u] = (accs[u] != 0) ? clamp(vels[u] + accs[u], -this.dMax, this.dMax) : vels[u] * this.friction;
		}
		[this.dx, this.dy, this.dz] = vels;

		//handling position
		var mvMag = this.speedSettings[this.speedSettingSelected];
		var drMag = Math.min(this.speedSettings[1] * this.aSpeed, this.speedSettings[this.speedSettingSelected] * this.aSpeed);
		//first 3 are for positional offsets, second two are for keeping rotation stable
		var moveDirs = [
			[1, 0, 0], 
			[0, 1, 0], 
			[0, 0, 1],
			polToCart(this.dt * drMag, this.dp * drMag, 1), //the new theta-phi vector
			polToCart(this.dt * drMag, (this.dp * drMag) - 0.05, 1) //a reference to get the rotation from
		];
		
		//transform to be relative to the world
		for (var v=0; v<moveDirs.length; v++) {
			[moveDirs[v][0], moveDirs[v][1]] = rotate(moveDirs[v][0], moveDirs[v][1], -this.rot);
			[moveDirs[v][1], moveDirs[v][2]] = rotate(moveDirs[v][1], moveDirs[v][2], -this.phi);
			[moveDirs[v][0], moveDirs[v][2]] = rotate(moveDirs[v][0], moveDirs[v][2], -this.theta);
		}

		//figure out theta and phi
		var pol = cartToPol(moveDirs[3][0], moveDirs[3][1], moveDirs[3][2]);
		this.theta = pol[0];
		this.phi = pol[1];

		//figure out rotation by reverse transforming
		[moveDirs[4][0], moveDirs[4][2]] = rotate(moveDirs[4][0], moveDirs[4][2], this.theta);
		[moveDirs[4][1], moveDirs[4][2]] = rotate(moveDirs[4][1], moveDirs[4][2], this.phi);
		var calculatedRot = (Math.atan2(-moveDirs[4][0], -moveDirs[4][1]) + Math.PI * 2) % (Math.PI * 2);
		this.rot = ((calculatedRot + this.dr) + Math.PI * 2) % (Math.PI * 2);

		//change magnitude of the inertia
		moveDirs[0] = (Math.abs(this.dx) > this.dMin) ? moveDirs[0].map(a => a * this.dx * mvMag) : [0, 0, 0];
		moveDirs[1] = (Math.abs(this.dy) > this.dMin) ? moveDirs[1].map(a => a * this.dy * mvMag) : [0, 0, 0];
		moveDirs[2] = (Math.abs(this.dz) > this.dMin) ? moveDirs[2].map(a => a * this.dz * mvMag) : [0, 0, 0];
		
		//update positions
		this.x += moveDirs[0][0] + moveDirs[1][0] + moveDirs[2][0];
		this.y += moveDirs[0][1] + moveDirs[1][1] + moveDirs[2][1];
		this.z += moveDirs[0][2] + moveDirs[1][2] + moveDirs[2][2];
	}

	moveGimbals() {
		var drMag = Math.min(this.speedSettings[1] * this.aSpeed, this.speedSettings[this.speedSettingSelected] * this.aSpeed);
		var mvMag = this.speedSettings[this.speedSettingSelected];

		//velocity
		var vels = [this.dx, this.dy, this.dz];
		var accs = [this.ax, this.ay, this.az];
		for (var u=0; u<vels.length; u++) {
			vels[u] = (accs[u] != 0) ? clamp(vels[u] + accs[u], -this.dMax, this.dMax) : vels[u] * this.friction;
		}
		[this.dx, this.dy, this.dz] = vels;

		//position
		var moveCoords = [0, 0, 0];
		if (Math.abs(this.dz) > this.dMin) {
			var toAdd = polToCart(this.theta, this.phi, this.dz * mvMag);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}
		if (Math.abs(this.dx) > this.dMin) {
			var toAdd = polToCart(this.theta + (Math.PI / 2), 0, this.dx * mvMag);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}
		if (Math.abs(this.dy) > this.dMin) {
			var toAdd = polToCart(0, Math.PI / 2, this.dy * mvMag);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}

		//theta, phi, and rot are pretty simple
		this.theta += this.dt * drMag;
		//constrain phi to avoid camera weirdness
		this.phi = clamp(this.phi + this.dp * drMag, -Math.PI / 2, Math.PI / 2);
		this.rot += this.dr * drMag;

		this.x += moveCoords[0];
		this.y += moveCoords[1];
		this.z += moveCoords[2];	
	}

	tick() {
		if (!editor_active) {
			this.moveFollow();
		} else {
			if (data_persistent.settings.gimbal) {
				this.moveGimbals();
			} else {
				this.moveFree();
			}
		}
		this.createMatrix();
	}

	reconcileTargets() {
		this.targetX = this.x;
		this.targetY = this.y;
		this.targetZ = this.z;
		this.targetTheta = this.theta;
		this.targetPhi = this.phi;
		this.targetRot = this.rot;
	}

	snapToTargets() {
		this.x = this.targetX;
		this.y = this.targetY;
		this.z = this.targetZ;
		this.theta = this.targetTheta;
		this.phi = this.targetPhi;
		this.rot = this.targetRot;
	}

	reset() {
		this.rot = 0;
		this.phi = 0;
	}
}


class Character {
	constructor(x, y, z, spriteDataName) {
		this.dir_down = [0, Math.PI / 2];
		this.dir_side = [0, 0];
		this.dir_front = [Math.PI / 2, 0];
		
		this.gravStrength = physics_gravity;
		this.speed = 0.12;
		this.strafeSpeed = this.speed * 1.2;
		this.dMax = 3.74;
		this.fallMax = this.dMax * 1.4;
		this.jumpStrength = 2;
		this.jumpBoostStrength = 0.1;
		this.coyote = 0;
		this.coyoteSet = player_coyote;

		this.onIce = false;
		this.onGround = 0;
		this.jumpTime = physics_jumpTime;

		this.x = x;
		this.y = y;
		this.z = z;
		
		this.parent = undefined;
		this.parentPrev = undefined;

		this.dx = 0;
		this.dy = 0;
		this.dz = this.dMax;

		this.ax = 0;
		this.az = 0;
		this.friction = 0.9;
		this.naturalFriction = 0.999;

		this.backwards = false;
		this.r = player_radius;
		this.cameraDist = 1000;
		this.drawR = this.r / getDistance(this, world_camera);
		this.color = color_character;

		var source = data_sprites[spriteDataName];
		this.texture_walkF = new Texture(source.sheet, data_sprites.spriteSize, source.frameTime, true, false, source.walkForwards);
		this.texture_walkL = new Texture(source.sheet, data_sprites.spriteSize, source.frameTime, true, false, source.walkLeft);
		this.texture_walkR = new Texture(source.sheet, data_sprites.spriteSize, source.frameTime, true, true, source.walkRight);
		this.texture_jumpF = new Texture(source.sheet, data_sprites.spriteSize, source.frameTime, false, false, source.jumpForwards);
		this.texture_jumpL = new Texture(source.sheet, data_sprites.spriteSize, source.frameTime, false, false, source.jumpSideways);
		this.texture_jumpR = new Texture(source.sheet, data_sprites.spriteSize, source.frameTime, false, true, source.jumpSideways);

		this.texture_current = this.texture_jumpF;
		this.textureRot = 1;

	}

	collide() {
		//get closest tunnel strip

		//get the closest strip
		var ref = this.parentPrev;
		var relPos = spaceToRelativeRotless([this.x, this.y, this.z], [ref.x, ref.y, ref.z], [-1 * ref.theta, 0]);
		var trueSideStrip = Math.floor((((Math.atan2(relPos[1], relPos[0]) + (Math.PI * (2 + (1 / ref.sides)))) / (Math.PI * 2)) % 1) * ref.sides);
		trueSideStrip = modulate(trueSideStrip * ref.tilesPerSide, ref.sides * ref.tilesPerSide);
		//center strip offset is the number of the strip that the camera is on top of
		var centerStripOffset = Math.floor((spaceToRelativeRotless([this.x, this.y, this.z], ref.strips[trueSideStrip].pos, ref.strips[trueSideStrip].normal)[1] / ref.tileSize) + 0.5);
		centerStripOffset = clamp(centerStripOffset + trueSideStrip, trueSideStrip, trueSideStrip + ref.tilesPerSide - 1);
		//add in side by side strips and collide with them
		//get the closest tile
		var selfTile = Math.floor(relPos[2] / ref.tileSize);

		for (var n=-1; n<2; n++) {
			if (ref.tiles[centerStripOffset][selfTile+n] != undefined) {
				ref.tiles[centerStripOffset][selfTile+n].collideWithEntity(this);
			}
			if (ref.tiles[(centerStripOffset - 1 + ref.tiles.length) % ref.tiles.length][selfTile+n] != undefined) {
				ref.tiles[(centerStripOffset - 1 + ref.tiles.length) % ref.tiles.length][selfTile+n].collideWithEntity(this);
			}
			if (ref.tiles[(centerStripOffset + 1) % ref.tiles.length][selfTile+n] != undefined) {
				ref.tiles[(centerStripOffset + 1) % ref.tiles.length][selfTile+n].collideWithEntity(this);
			}
		}
		haltRotation = false;
	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		//decreasing the time to jump
		this.onGround -= 1;
		
		//if player has a parent, change gravity based on parent power
		if (this.onGround < physics_graceTime - 2) { 
			this.dy -= linterp(activeGravity * 0.8, activeGravity, this.parentPrev.power);
		}

		//jump boost
		if (this.dy > 0 && this.onGround <= 0 && controls_spacePressed && this.jumpTime > 0) {
			this.dy += this.jumpBoostStrength;
			this.jumpTime -= 1;
		}
		
		this.dy = clamp(this.dy, -1 * this.fallMax, 2 * this.fallMax);

		//calculate true ax (different from active AX, I know this makes no sense but trust me the sigmoid is important)
		if (activeAX != 0) {
			var volume = ((this.dMax + (this.dx * boolToSigned(activeAX < 0))) / this.dMax) * 9 - 2;
			activeAX = sigmoid(volume, 0, Math.abs(activeAX)) * boolToSigned(activeAX > 0);
		}
		this.dx += activeAX;
		if (this.ax == 0 || this.ax * this.dx < 0) {
			this.dx *= activeFriction;
		}
		if (Math.abs(this.dx) > this.dMax) {
			this.dx = clamp(this.dx, -1 * this.dMax, this.dMax);
		}


		//accelerate if too slow
		this.az = ((this.az * 5) + activeAZ) / 6;

		if (Math.abs(this.dz) < this.dMax) {
			this.dz += this.az;
		} else {
			//natural friction
			this.dz *= naturalFriction;
		}
		
	}

	tick() {
		//getting camera distance
		this.cameraDist = getDistance(this, world_camera);
		this.drawR = (this.r / this.cameraDist) * world_camera.scale;

		//setting camera position
		this.setCameraPosition();

		//only do the other tick stuff if camera is close enough
		if (this.cameraDist < 1000 && !editor_active) {
			//ticking coyote frames / jumping
			if (this.coyote > 0) {
				this.handleSpace();
				this.coyote -= 1;
			}

			//TODO: this code is ugly and also probably slow. Refactor when / if possible
			if (this.parent != undefined) {
				if (!this.parent.coordinateIsInTunnel(this.x, this.y, this.z, true)) {
					//if in the void, change physics
					var voidStrength = spaceToRelativeRotless(this.parent.centerPos, [this.x, this.y, this.z], this.dir_down)[2] / this.parent.r;
					if (this.parent.playerTilePos > this.parent.len - 0.5) {
						voidStrength *= -0.7;
						//if the player off the end of the tunnel and is above the midpoint, make them go down faster
						if (voidStrength > 0) {
							voidStrength *= 1.8;
						}
					}
					this.modifyDerivitives(this.gravStrength * 0.7 * (voidStrength), 0.95 + (0.0501 * (this.onGround <= 0)), this.naturalFriction, this.ax * 1.5, this.speed / 2);
					//void spin
					this.textureRot += render_voidSpinSpeed;
				} else {
					//restore proper spin if in tunnel
					if (Math.abs(this.textureRot - this.dir_down[1]) > render_voidSpinSpeed * 3) {
						this.textureRot = (this.textureRot + (render_voidSpinSpeed * 3)) % (Math.PI * 2);
					}
					//don't accelerate if dz is too great, and reduce friction if on ice
					this.modifyDerivitives(this.gravStrength, this.friction, this.naturalFriction, this.ax * (1 - (0.2 * this.onIce)), this.speed * (Math.abs(this.dz) <= this.dMax * 1.1));
				}
			}

			//moving according to forces
			var turnForce = polToCart(this.dir_side[0], this.dir_side[1], this.dx);
			var gravForce = polToCart(this.dir_down[0], this.dir_down[1], this.dy);
			var frontForce = polToCart(this.dir_front[0], this.dir_front[1], this.dz);

			this.x += gravForce[0] + turnForce[0] + frontForce[0];
			this.y += gravForce[1] + turnForce[1] + frontForce[1];
			this.z += gravForce[2] + turnForce[2] + frontForce[2];

			//colliding with tiles
			this.collide();

			//choose texture
			this.chooseTexture();
		}
	}

	beDrawn() {
		if (!isClipped([this.x, this.y, this.z])) {
			var [tX, tY] = spaceToScreen([this.x, this.y, this.z]);
			if (this.backwards) {
				this.texture_current.beDrawn(tX, tY, ((Math.PI * 0.5) - this.textureRot) - world_camera.rot, this.drawR * 2);
			} else {
				this.texture_current.beDrawn(tX, tY, this.textureRot - (Math.PI * 0.5) - world_camera.rot, this.drawR * 2);
			}

			this.syncTextures();

			if (editor_active) {
				drawCrosshair([this.x, this.y, this.z], this.dir_side, this.dir_down, this.dir_front);
			}
		}
	}

	chooseTexture() {
		if (this.onGround > 0) {
			//walking texture
			if (this.ax == 0) {
				//center
				this.texture_current = this.texture_walkF;
				return;
			}
			if (this.ax < 0) {
				//left
				this.texture_current = this.texture_walkL;
				return;
			}
			
			this.texture_current = this.texture_walkR;
			return;
		}

		//jumping texture
		if (this.ax == 0) {
			//center
			this.texture_current = this.texture_jumpF;
		} else if (this.ax < 0) {
			//left
			this.texture_current = this.texture_jumpL;
		} else {
			//right
			this.texture_current = this.texture_jumpR;
		}
		//reset ground animations when jumping
		this.texture_walkF.reset();
		this.texture_walkR.reset();
		this.texture_walkL.reset();

		//reset if moving upwards
		if (this.dy > 0) {
			this.texture_current.reset();
		}
	}

	setCameraPosition() {
		var vertOffset = polToCart(this.dir_down[0], (!data_persistent.settings.altCamera * this.dir_down[1]) + (data_persistent.settings.altCamera * (world_camera.rot + (Math.PI / 2))), 70);
		var horizOffset = polToCart(this.dir_front[0], this.dir_front[1], -95);
		world_camera.targetX = this.x + vertOffset[0] + horizOffset[0];
		world_camera.targetY = this.y + vertOffset[1] + horizOffset[1];
		world_camera.targetZ = this.z + vertOffset[2] + horizOffset[2];
	}

	syncTextures() {
		//if on the ground, sync all walking animations
		if (this.onGround > 0) {
			//decrement current frame if not moving forwards
			if (Math.abs(this.dz) <= this.speed && Math.abs(this.ax) < 0.02) {
				this.texture_current.frame = 0;
			}
			this.textureRot = this.dir_down[1];
			this.texture_walkF.frame = this.texture_current.frame;
			this.texture_walkL.frame = this.texture_current.frame;
			this.texture_walkR.frame = this.texture_current.frame;
			return;
		}
		
		//syncing all jumping animations if not walking
		this.texture_jumpF.frame = this.texture_current.frame;
		this.texture_jumpL.frame = this.texture_current.frame;
		this.texture_jumpR.frame = this.texture_current.frame;
	}

	turnAround() {
		//switch direction and change down angle so the tiles are a w a r e
		this.backwards = !this.backwards;
		this.dir_down = [this.dir_down[0], this.dir_down[1] + 0.02];
	}

	handleSpace() {
		if (this.coyote == 0) {
			this.coyote = this.coyoteSet;
		}

		if (this.onGround > 0) {
			this.coyote = 0;
			this.dy = this.jumpStrength;
			this.jumpTime = physics_jumpTime;
			this.onGround = 0;
		}
	}
}

/*
spriteSheet - the image source of the texture
imageSize - how large each individual image is
coordinates - an array, the coordinates of each frame (EX: [[1, 1], [0, 1], [0, 0]])
*/
class Texture {
	constructor(spriteSheet, imageSize, drawsBeforeImageChange, loopBOOLEAN, invertDirectionBOOLEAN, coordinates) {
		this.looping = loopBOOLEAN;
		this.backwards = invertDirectionBOOLEAN;
		this.sheet = spriteSheet;
		this.size = imageSize;
		this.frames = coordinates;
		this.frame = 0;
		this.amount = 1 / drawsBeforeImageChange;
	}

	beDrawn(x, y, rotation, size) {
		//change current frame
		this.frame += (this.amount * (1 + data_persistent.settings.halfRender));
		if (this.frame > this.frames.length - 1) {
			this.frame = this.looping ? (this.frame % this.frames.length) : (this.frames.length - 1);
		}


		//actually draw self
		var xOff = size * 0.7071 * Math.cos(rotation - (Math.PI * 0.75));
		var yOff = size * 0.7071 * Math.sin(rotation - (Math.PI * 0.75));
		//transforming
		ctx.translate(x + xOff, y + yOff);
		ctx.rotate(rotation);
		if (this.backwards) {
			ctx.scale(-1, 1);
			ctx.drawImage(this.sheet, this.size * (this.frames[Math.floor(this.frame)][0] + 1), this.size * this.frames[Math.floor(this.frame)][1], -1 * this.size, this.size, 
							0, 0, -1 * size, size);
			ctx.scale(-1, 1);
			
		} else {
			try {
			ctx.drawImage(this.sheet, this.size * this.frames[Math.floor(this.frame)][0], this.size * this.frames[Math.floor(this.frame)][1], this.size, this.size, 
							0, 0, size, size);
			} catch (error) {
				console.log(error, `problem trying to draw frame ${Math.floor(this.frame)}, with frames ${JSON.stringify(this.frames)}`);
			}
		}
		ctx.rotate(-1 * rotation);
		ctx.translate(-1 * (x + xOff), -1 * (y + yOff));
	}

	reset() {
		this.frame = 0;
	}
}








//characters
//but why are you changing all these properties instead of having them be constructor arguments?
//well, my friendo, mainly readability and I'm lazy. I don't want to have 37 constructor arguments I have to keep track of, I want to know what each individual property is set to.
class Angel extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Angel`);

		this.speed = 0.09;
		this.dMax = 3.96;
		this.fallMax = 3.6;
		this.dMaxTrue = 9.125;
		this.naturalFriction = 0.998;
		this.jumpStrength = 2.8;
		this.jumpBoostStrength = 0.09;

		this.boost = true;
		this.boostStrength = 1.32;
		this.glide = true;
		this.haltGlide = true;
		this.glideStrength = 0.2;
	}

	tick() {
		if (this.onGround > 0) {
			this.boost = true;
			this.glide = true;
			this.haltGlide = true;
		}

		//gliding
		if (this.glide && !this.boost && !this.haltGlide) {
			//trade forwards movement for upwards movements
			if (controls_spacePressed && this.dz > this.glideStrength * 10) {
				this.dz -= this.glideStrength * 0.5;
				this.az *= this.friction;
				this.dy += this.glideStrength;
				//make sure player isn't moving upwards with dy
				if (this.dy > 0) {
					this.dy = 0;
				}
			} else {
				this.glide = false;
			}
		}
		super.tick();
	}

	handleSpace() {
		if (this.onGround > 0) {
			super.handleSpace();
		} else if (this.boost == true) {
			this.boost = false;
			this.dy = this.jumpStrength;
			if (this.parent != undefined) {
				this.dz *= linterp(0.98, this.boostStrength, this.parent.power);
			} else {
				this.dz *= this.boostStrength;
			} 
			this.dz = clamp(this.dz, -1 * this.dMaxTrue, this.dMaxTrue);
			this.jumpTime = 0;
		} else {
			this.haltGlide = false;
		}
	}
}

class Bunny extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Bunny`);

		this.texture_walkF = undefined;
		this.texture_walkL = undefined;
		this.texture_walkR = undefined;

		this.jumpStrength = 3;
		this.jumpTime *= 1.3;
		this.jumpBoostStrength = 0.14;
		this.jumpCooldown = 5;
		this.jumpCooldownMax = 7;
		this.boostFriction = 0.99;

		this.speed = 0.13;
		this.strafeSpeed = 0.4;
		this.trueSpeed = 0.9;
		this.dMax = 11.5;
		this.fallMax = 11.5;
		this.dMin = 3;
		
	}

	//bunny always jumps
	tick() {
		if (this.jumpCooldown < this.jumpCooldownMax) {
			this.jumpCooldown += 1;
		}
		if (this.onGround > 0) {
			this.handleSpace();
			if (this.jumpCooldown == this.jumpCooldownMax) {
				this.dz += this.trueSpeed;
				this.jumpCooldown = 0;
			}
			
			this.textureRot = this.dir_down[1];
		}

		//space being pressed slows down the bunny
		if (controls_spacePressed && this.dy > 0 && this.dz > this.dMin) {
			this.dz *= this.boostFriction;
			this.dy += 0.01;
		}

		if (this.dz > this.dMin) {
			this.dz -= this.speed * 0.75;
		}
		super.tick();
	}

	chooseTexture() {
		//jumping texture
		if (this.ax == 0) {
			//center
			this.texture_current = this.texture_jumpF;
		} else if (this.ax < 0) {
			//left
			this.texture_current = this.texture_jumpL;
		} else {
			//right
			this.texture_current = this.texture_jumpR;
		}

		//reset if moving upwards
		if (this.dy > 0) {
			this.texture_current.reset();
		}
	}

	syncTextures() {
		this.texture_jumpF.frame = this.texture_current.frame;
		this.texture_jumpL.frame = this.texture_current.frame;
		this.texture_jumpR.frame = this.texture_current.frame;
	}
}

class Child extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Child`);
		
		this.texture_walkL = new Texture(data_sprites.Child.sheet, data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkLeft);
		this.texture_walkR = new Texture(data_sprites.Child.sheet, data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkRight);
		this.texture_jumpL = new Texture(data_sprites.Child.sheet, data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpLeft);
		this.texture_jumpR = new Texture(data_sprites.Child.sheet, data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpRight);

		this.gravStrength *= 0.9;
		this.jumpStrength = 3.14;
		this.jumpBoostStrength = 0.082;
		this.speed = 0.048;
		this.strafeSpeed = this.speed * 1.05;
		this.dMax = 3.2;
		this.trueFallMax = 1.13;

		this.jumpBuffer = 0;
		this.coyoteSet = 10;

		this.bunnyIncrease = 0.08;
		this.bunnyDecrease = 0.006;
		this.bunnyBoost = 1;
		this.bunnyBoostMax = 1.2;
		
	}

	//child has one buffer frame so crumbling tiles will fall
	tick() {
		if (this.jumpBuffer > 0) {
			this.handleSpace();
		}
		super.tick();
	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		//if falling down too fast, make that not happen
		if (this.dy < -this.trueFallMax) {
			this.dy = -this.trueFallMax;
		}

		//decrease bunny boost
		if (this.bunnyBoost > 1 && this.onGround > 0) {
			this.bunnyBoost -= this.bunnyDecrease;
			if (this.bunnyBoost < 1) {
				this.bunnyBoost = 1;
			}
		}
		
		super.modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ);
	}

	handleSpace() {
		if (this.jumpBuffer > 0) {
			this.jumpBuffer -= 1;
			if (this.jumpBuffer == 0) {
				if (this.coyote == 0) {
					this.coyote = this.coyoteSet;
				}

				if (this.onGround > 0) {
					//regular jump effects
					this.coyote = 0;
					this.dy = this.jumpStrength * this.bunnyBoost;
					this.jumpTime = physics_jumpTime;
					this.onGround = 0;

					//jump boost for jumping soon after hitting the ground
					this.bunnyBoost += this.bunnyIncrease;
					if (this.bunnyBoost > this.bunnyBoostMax) {
						this.bunnyBoost = this.bunnyBoostMax;
					}
				}

			}
		} else {
			this.jumpBuffer = 2;
		}
	}
}


class Duplicator extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Duplicator`);

		this.jumpStrength = 2.85;
		this.jumpBoostStrength = 0.09;
		this.speed = 0.11;
		this.dMax = 3.74;

		this.duplicates = [];
		this.duplicatesMax = 10;
		this.duplicatesMaxDistance = 900;
		this.duplicateGenerationTime = 140;
		this.duplicateGenerationCountup = 0;
	}

	beDrawn() {
		super.beDrawn();
	}

	updateDuplicateDirs() {
		this.duplicates.forEach(d => {
			d.dir_down = this.dir_down;
			d.dir_side = this.dir_side;
			d.dir_front = this.dir_front;
		});
	}

	createDuplicate() {
		var friend = new DuplicatorDuplicate(this.x, this.y, this.z, this);
		//updating properties to function
		friend.parent = this.parent;
		friend.parentPrev = this.parentPrev;
		friend.backwards = this.backwards;
		friend.dx = this.dx + randomBounded(-0.3, 0.3);
		friend.dy = this.dy + randomBounded(0.1, 0.7);
		friend.dz = this.dz + randomBounded(-0.3, 0.3);

		friend.dir_down = this.dir_down;
		friend.dir_side = this.dir_side;
		friend.dir_front = this.dir_front;
		this.duplicates.push(friend);
	}

	collide() {
		var tempDir = this.dir_down;
		super.collide();
		if (this.dir_down != tempDir) {
			this.updateDuplicateDirs();
		}
	}

	//the duplicator has less of a window outside of the tunnel to work with
	isOutOfParent() {
		if (this.parent == undefined) {
			return true;
		}
		var par = this.parent;
		var newCoords = [this.x - par.x, this.y - par.y, this.z - par.z];
		[newCoords[0], newCoords[2]] = rotate(newCoords[0], newCoords[2], par.theta * -1);

		if (getDistance2d([newCoords[0], newCoords[1]], [0, 0]) < par.r + tunnel_voidWidth - this.r && 
		newCoords[2] > 0 && 
		newCoords[2] < (par.len * par.tileSize) + tunnel_transitionLength * 2) {
			return false;
		}
		return true;
	}

	tick() {
		super.tick();
		//only do tick if close enough
		if (this.cameraDist < 1500) {
			if (!editor_active) {
				this.duplicateGenerationCountup += 1;
			}	

			//if self has fallen out of the world, replace self with a duplicate
			if (this.isOutOfParent()) {
				var replacement = undefined;

				//for loop goes backwards so the closest one is chosen
				for (var g=this.duplicates.length-1; g>=0; g--) {
					if (this.duplicates[g].parent != undefined) {
						//swap player with new duplicate, then replace duplicate with real duplicator
						replacement = this.duplicates[g];
						player = replacement;
						replacePlayer(data_characters.map["Duplicator"]);
						//populate player's duplicate array with every duplicate except the one that's being killed (self) and the one being swapped to
						player.duplicates = [];
						this.duplicates.forEach(d => {
							if (d != this && d != replacement) {
								player.duplicates.push(d);
								d.trueDuplicator = player;
							}
						});
						return;
					}
				}
				//if none has been chosen, kill the player
				return;
			}

			//ordering duplicates
			if (world_time % 6 == 0) {
				this.duplicates = orderObjects(this.duplicates, 4);
			}

			//killing duplicates / ticking duplicates
			for (var d=0; d<this.duplicates.length; d++) {
				//kill a duplicate if they fall out of the world and self is also not out of the world
				if (this.duplicates[d].parent == undefined || getDistance(this.duplicates[d], this) > this.duplicatesMaxDistance) {
					this.duplicates.splice(d, 1);
					d -= 1;
				} else {
					//make sure duplicates have the same strafing as self and they're transferring tunnels as well
					if (this.parent != undefined) {
						this.duplicates[d].parent = this.parent;
					}
					this.duplicates[d].parentPrev = this.parentPrev;
					this.duplicates[d].ax = this.ax;
					this.duplicates[d].tick();
				}
			}

			
			//creating new duplicates
			if (this.duplicates.length < this.duplicatesMax && this.duplicateGenerationCountup % Math.floor(this.duplicateGenerationTime / this.parentPrev.power) == Math.floor(this.duplicateGenerationTime * 0.8)) {
				this.createDuplicate();
			}
		}
	}

	handleSpace() {
		//if a duplicate is close enough to self, change whether it can jump
		this.duplicates.forEach(d => {
			if (getDistance(this, d) < this.r * 2) {
				//if the duplicate is above self, give the duplicate jump ability. If not, give self the jump ability
				if (spaceToRelativeRotless([d.x, d.y, d.z], [this.x, this.y, this.z], this.dir_down)[2] > 0) {
					//the jump ability comes with a penalty to self
					d.onGround = 1;
					this.dy -= 0.4;
				} else {
					this.onGround = 1;
					d.dy -= 0.4;
				}
			}
		});
		super.handleSpace();
		this.duplicates.forEach(d => {
			d.handleSpace();
		})
	}
}

//no thoughts in this brian
class DuplicatorDuplicate extends Character {
	constructor(x, y, z, parentDuplicator) {
		super(x, y, z, `Duplicator`);

		this.jumpStrength = 3;
		this.jumpBoostStrength = 0.095;
		this.speed = 0.15;
		this.dMax = 3.75;
		this.trueDuplicator = parentDuplicator;
	}

	//lesser opacity depending on distance
	beDrawn() {
		
		ctx.globalAlpha = clamp(linterp(0.5, 0, (getDistance(this, this.trueDuplicator) / this.trueDuplicator.duplicatesMaxDistance) + 0.1), 0, 0.5);
		super.beDrawn();
		ctx.globalAlpha = 1;
	}

	collide() {
		var tempDir = this.dir_down;
		super.collide();
		if (this.dir_down != tempDir) {
			this.trueDuplicator.dir_down = this.dir_down;
			this.trueDuplicator.dir_side = this.dir_side;
			this.trueDuplicator.dir_front = this.dir_front;
			this.trueDuplicator.updateDuplicateDirs();
		}
	}

	setCameraPosition() {
	}
}


class Gentleman extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Gentleman`);

		this.texture_flyF = new Texture(data_sprites.Gentleman.sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites.Gentleman.flyForwards);
		this.texture_flyL = new Texture(data_sprites.Gentleman.sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites.Gentleman.flySideways);
		this.texture_flyR = new Texture(data_sprites.Gentleman.sheet, data_sprites.spriteSize, 1e1001, false, true, data_sprites.Gentleman.flySideways);

		this.jumpStrength = 3.6;
		this.jumpBoostStrength = 0.05;
		this.speed = 0.05;
		this.dMax = 3.3;
		this.dMaxTrue = 4.95;
		this.naturalFriction = 0.9994;

		this.attracting = undefined;
		this.attractionForce = undefined;
		this.airFriction = 0.46;
		this.attractionAnimationTime = 0;
		this.attractionAnimationBuffer = 10;
		this.abilityDistance = 600;
	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		this.attractionAnimationTime -= 1;
		//do ability stuff
		if (this.attracting != undefined) {
			this.attractionAnimationTime = this.attractionAnimationBuffer;
			//go towards object
			var dist = getDistance(this, this.attracting);

			if (this.attractionForce != undefined) {
				//friction with air
				this.dx -= this.attractionForce[0] * this.airFriction;
				this.dy -= this.attractionForce[1] * this.airFriction;
				this.dz -= this.attractionForce[2] * this.airFriction;
			}

			//pull object slightly
			this.attracting.pushForce[0] = ((this.x - this.attracting.x) / dist) * (this.abilityDistance / dist) * this.airFriction;
			this.attracting.pushForce[1] = ((this.y - this.attracting.y) / dist) * (this.abilityDistance / dist) * this.airFriction;
			this.attracting.pushForce[2] = ((this.z - this.attracting.z) / dist) * (this.abilityDistance / dist) * this.airFriction;

			//getting attraction towards object in relative coordinates
			var offset = spaceToRelativeRotless([this.attracting.x, this.attracting.y, this.attracting.z], [this.x, this.y, this.z], this.dir_down);
			[offset[0], offset[1], offset[2]] = [offset[1], offset[2], offset[0]];
			this.attractionForce = [(offset[0] / dist) * (this.abilityDistance / Math.max(dist, this.abilityDistance / this.dMaxTrue)),
									(offset[1] / dist) * (this.abilityDistance / Math.max(dist, this.abilityDistance / this.dMaxTrue)),
									(offset[2] / dist) * (this.abilityDistance / Math.max(dist, this.abilityDistance / this.dMaxTrue))];

			this.dx += this.attractionForce[0] / 2;
			this.dy += this.attractionForce[1] / 1.5;
			this.dz += this.attractionForce[2] / 2;

			//make sure self's values aren't too great
			this.dx = clamp(this.dx, -this.dMaxTrue, this.dMaxTrue);
			this.dy = clamp(this.dy, -this.dMaxTrue, this.dMaxTrue);
			this.dz = clamp(this.dz, -1, this.dMaxTrue);

			

			//stop ability if not holding space
			if (!controls_spacePressed) {
				this.attracting = undefined;
				this.attractionForce = undefined;
			}
		}
		super.modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ);
	}

	handleSpace() {
		if (this.onGround < 1 && this.parent != undefined && this.attracting == undefined) {
			//get closest free object that's also in front of self
			var closestObj = undefined;
			var closestObjDist = 99999;
			for (var h=1; h<this.parent.freeObjs.length; h++) {
				//only be attracted to power cells in front
				if (spaceToRelativeRotless([this.parent.freeObjs[h].x, this.parent.freeObjs[h].y, this.parent.freeObjs[h].z], [this.x, this.y, this.z], [this.dir_down[0], (Math.PI * 2) - this.dir_down[1]])[0] > -20) {
					var tempDist = getDistance(this, this.parent.freeObjs[h]);
					if (tempDist < this.abilityDistance && (closestObj == undefined || tempDist < closestObjDist)) {
					closestObj = this.parent.freeObjs[h];
					closestObjDist = getDistance(this, this.parent.freeObjs[h]);
				}
				}
				
			}
			this.attracting = closestObj;
		}
		super.handleSpace();
	}

	chooseTexture() {
		if (this.onGround > 0) {
			//walking texture
			if (this.ax == 0) {
				//center
				this.texture_current = this.texture_walkF;
			} else if (this.ax < 0) {
				//left
				this.texture_current = this.texture_walkL;
			} else {
				//right
				this.texture_current = this.texture_walkR;
			}
			return;
		} 

		//reset ground animations when not on ground
		this.texture_walkF.reset();
		this.texture_walkR.reset();
		this.texture_walkL.reset();
		
		//flying texture
		if (this.attractionAnimationTime > 0) {
			if (this.dx < 1) {
				this.texture_current = this.texture_flyL;
			} else if (this.dx > 1) {
				this.texture_current = this.texture_flyR;
			} else {
				this.texture_current = this.texture_flyF;
			}

			//use dz / dy to determine what frame to be on
			var rot = (Math.atan2(-this.dy, -(this.dz * 0.8)) + (Math.PI / 2)) / (Math.PI * 2);
			rot = (rot + 2) % 1;
			rot = 1 - rot;

			this.texture_current.frame = Math.floor(rot * 7.99);
			
			//reset ground animations when jumping
			return;
		}


		//jumping texture
		if (this.ax == 0) {
			//center
			this.texture_current = this.texture_jumpF;
		} else if (this.ax < 0) {
			//left
			this.texture_current = this.texture_jumpL;
		} else {
			//right
			this.texture_current = this.texture_jumpR;
		}

		//reset if moving upwards
		if (this.dy > 0) {
			this.texture_current.reset();
		}
	}

	syncTextures() {
		//if on the ground, sync all walking animations
		if (this.onGround > 0) {
			//decrement current frame if not moving forwards
			if (Math.abs(this.dz) <= this.speed && Math.abs(this.ax) < 0.02) {
				this.texture_current.frame = 0;
			}
			this.textureRot = this.dir_down[1];
			this.texture_walkF.frame = this.texture_current.frame;
			this.texture_walkL.frame = this.texture_current.frame;
			this.texture_walkR.frame = this.texture_current.frame;
		} else if (this.attracting != undefined) {
			this.texture_flyF.frame = this.texture_current.frame;
			this.texture_flyL.frame = this.texture_current.frame;
			this.texture_flyR.frame = this.texture_current.frame;
		} else {
			//syncing all jumping animations
			this.texture_jumpF.frame = this.texture_current.frame;
			this.texture_jumpL.frame = this.texture_current.frame;
			this.texture_jumpR.frame = this.texture_current.frame;
		}
	}
}


class Lizard extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Lizard`);

		this.jumpStrength = 4.3;
		this.jumpBoostStrength = 0.13;
		this.speed = 0.09;
		this.dMax = 2.86;
	}
}

class Pastafarian extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Pastafarian`);

		this.texture_walkL = new Texture(data_sprites.Pastafarian.sheet, data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, true, false, data_sprites.Pastafarian.walkLeft);
		this.texture_walkR = new Texture(data_sprites.Pastafarian.sheet, data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, true, false, data_sprites.Pastafarian.walkRight);
		this.texture_jumpL = new Texture(data_sprites.Pastafarian.sheet, data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, false, false, data_sprites.Pastafarian.jumpLeft);
		this.texture_jumpR = new Texture(data_sprites.Pastafarian.sheet, data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, false, false, data_sprites.Pastafarian.jumpRight);

		this.jumpStrength = 4.5;
		this.jumpBoostStrength = 0;
		this.speed = 0.13;
		this.dMax = 3.63;
		this.fallMax *= 1.05;

		this.personalBridgeStrength = 1;
		this.bridgeMultiplier = 0.988;
		this.bridgeBoost = 0.6;
	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		if (this.parent != undefined) {
			this.personalBridgeStrength *= this.bridgeMultiplier - ((1 - this.parent.power) * 0.002);
		} else {
			this.personalBridgeStrength *= this.bridgeMultiplier;
		}
		super.modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ);
	}

	handleSpace() {
		if (this.onGround > 0) {
			//yeah this is a long way to go, sorry. TODO: refactor this? Perhaps into Tunnel class as getClosestTile(x, y, z)
			var ref = this.parentPrev;
			var relPos = spaceToRelativeRotless([this.x, this.y, this.z], [ref.x, ref.y, ref.z], [-1 * ref.theta, 0]);
			var trueSideStrip = Math.floor((((Math.atan2(relPos[1], relPos[0]) + (Math.PI * (2 + (1 / ref.sides)))) / (Math.PI * 2)) % 1) * ref.sides);
			trueSideStrip = modulate(trueSideStrip * ref.tilesPerSide, ref.sides * ref.tilesPerSide);
			var centerStripOffset = Math.floor((spaceToRelativeRotless([this.x, this.y, this.z], ref.strips[trueSideStrip].pos, ref.strips[trueSideStrip].normal)[1] / ref.tileSize) + 0.5);
			centerStripOffset = clamp(centerStripOffset + trueSideStrip, trueSideStrip, trueSideStrip + ref.tilesPerSide - 1);
			var selfTile = Math.floor((relPos[2] / ref.tileSize) - 0.2);
			if (ref.tiles[centerStripOffset][selfTile] != undefined) {
				if (ref.tiles[centerStripOffset][selfTile].constructor.name == "Tile_Plexiglass" || ref.tiles[centerStripOffset][selfTile].constructor.name == "Tile_Crumbling") {
					//if on a bridge tile, boost the bridge strength
					this.personalBridgeStrength += this.bridgeBoost;
					if (this.personalBridgeStrength > 1) {
						this.personalBridgeStrength = 1;
					}
				}
			}
		}
		super.handleSpace();
	}
}



class Runner extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Runner`);

		this.jumpStrength = 2.9;
		this.jumpBoostStrength = 0.1;
		this.friction = 0.92;
		this.speed = 0.12;
		this.dMax = 4;
	}

	tick() {
		//strafe speed is greater on ground
		this.strafeSpeed = this.speed * (1.3 + (0.6 * (this.onGround > 0)));
		super.tick();
	}
}


class Skater extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Skater`);

		this.gravStrength += 0.01;
		this.jumpStrength = 2.5;
		this.jumpBoostStrength = 0.06;
		this.speed = 0.07;
		this.strafeSpeed = this.speed * 1.6;
		this.dMax = 11.1;
		this.fallMax = this.r * 0.5;
	}
}

class Student extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Student`);

		this.jumpStrength = 2.2;
		this.jumpBoostStrength = 0.05;
		this.speed = 0.10;
		this.strafeSpeed = this.speed * 1.3;
		this.dMax = 3.2;
		this.r -= 2;
		this.fallMax = 5.5;

		this.abilityTransformTime = 6;
		this.abilityTimeLimit = 50;
		this.currentAbilityTime = 0;
		this.doAbility = true;

		this.dir_trueDown = this.dir_down;
	}

	tick() {
		super.tick();
	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		//reset ability variables
		if (this.onGround > 0) {
			this.currentAbilityTime = 0;
			this.doAbility = true;
			this.dir_trueDown = [this.dir_down[0], this.dir_down[1]];
		}

		//perform ability
		if (this.currentAbilityTime > 0) {
			//controlling ability timing
			if (controls_spacePressed && this.doAbility) {
				//increase time up to the maximum
				if (this.currentAbilityTime < this.abilityTimeLimit) {
					this.currentAbilityTime += 1;
				} else {
					//if held the ability for too long, force the player to commit to it
					this.currentAbilityTime = 0;
					this.doAbility = false;
					this.dir_trueDown = this.dir_down;
					this.dir_side[1] += Math.PI;


					//changing camera target rotation
					if (this.backwards) {
						world_camera.targetRot = ((Math.PI * 2.5) - this.dir_down[1]) % (Math.PI * 2);
					} else {
						world_camera.targetRot = (this.dir_down[1] + (Math.PI * 1.5)) % (Math.PI * 2);
					}
					
					//if the rotation difference is too great, fix that
					if (Math.abs(world_camera.rot - world_camera.targetRot) > Math.PI) {
						if (world_camera.rot > Math.PI) {
							world_camera.rot -= Math.PI * 2;
						} else {
							world_camera.rot += Math.PI * 2;
						}
					}
				}
			} else {
				if (this.doAbility && this.currentAbilityTime < this.abilityTimeLimit) {
					this.doAbility = false;
					this.currentAbilityTime = 0;
					this.dy *= -1;
				}
			}

			//controlling actual gravity
			this.dir_down = [this.dir_trueDown[0], this.dir_trueDown[1] + Math.PI + 0.01];

			//there's a little fade in to the start of the ability
			if (this.currentAbilityTime < this.abilityTransformTime) {
				this.dir_down[1] = linterp(this.dir_trueDown[1], this.dir_trueDown[1] + Math.PI + 0.01, this.currentAbilityTime / 7);
			}
		}
		super.modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ);
	}

	setCameraPosition() {
		var vertOffset = polToCart(this.dir_trueDown[0], (!data_persistent.settings.altCamera * this.dir_trueDown[1]) + (data_persistent.settings.altCamera * (world_camera.rot + (Math.PI / 2))), 70);
		var horizOffset = polToCart(this.dir_front[0], this.dir_front[1], -95);
		world_camera.targetX = this.x + vertOffset[0] + horizOffset[0];
		world_camera.targetY = this.y + vertOffset[1] + horizOffset[1];
		world_camera.targetZ = this.z + vertOffset[2] + horizOffset[2];
	}

	handleSpace() {
		if (this.onGround > 0) {
			super.handleSpace();
			return;
		}

		if (this.doAbility && this.currentAbilityTime == 0) {
			this.currentAbilityTime = 1;
			this.dy *= -1;
		}
	}
}