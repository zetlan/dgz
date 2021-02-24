//houses all classes
class Camera {
	constructor(x, y, z, xRot, yRot) {
		this.friction = 0.85;

		this.scale = 200;
		this.sens = 0.04;
		this.speed = 0.025;


		this.x = x;
		this.y = y;
		this.z = z;

		this.targetX = x;
		this.targetY = y;
		this.targetZ = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 1;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;


		this.theta = yRot;
		this.phi = xRot;
		this.rot = 0;
		this.targetTheta = 0;
		this.targetRot = 0;
		this.animSteps = 9;

		this.dt = 0;
		this.dp = 0;
	}

	tick() {
		if (!editor_active) {
			//changing with average
			this.x = (this.targetX + (this.x * (this.animSteps - 1))) / this.animSteps;
			this.y = (this.targetY + (this.y * (this.animSteps - 1))) / this.animSteps;
			this.z = (this.targetZ + (this.z * (this.animSteps - 1))) / this.animSteps;
			this.theta = (this.targetTheta + (this.theta * (this.animSteps - 1))) / this.animSteps;
		} else {
			//handling velocity

			//adding
			this.dx += this.ax;

			//binding max
			if (Math.abs(this.dx) > this.dMax) {
				this.dx *= 0.95;
			}

			//friction
			if (this.ax == 0) {
				this.dx *= this.friction;
			}

			this.dz += this.az;
			if (Math.abs(this.dz) > this.dMax) {
				this.dz = clamp(this.dz, -1 * this.dMax, this.dMax);
			}
			if (this.az == 0) {
				this.dz *= this.friction;
			}
			
			if (Math.abs(this.dy) > this.dMax) {
				this.dy *= 0.95;
			}

			//handling position
			var moveCoords = [0, 0, 0];
			if (Math.abs(this.dz) > 0.05) {
				var toAdd = polToCart(this.theta, this.phi, this.speed * 500 * this.dz);
				moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
				
			}
			if (Math.abs(this.dx) > 0.05) {
				var toAdd = polToCart(this.theta + (Math.PI / 2), 0, this.speed * 500 * this.dx);
				moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
			}
			this.x += moveCoords[0];
			this.y += moveCoords[1];
			this.z += moveCoords[2];
			this.theta += this.dt;
		}


		//camera velocity
		this.phi += this.dp;
		//weighted average towards target rotation
		this.rot = (this.targetRot + (this.rot * (this.animSteps - 1))) / this.animSteps;

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * (-0.5 + (this.phi > 0));
		}
	}

	handleSpace() {
		this.targetRot = 0;
	}
}


class Character {
	constructor(x, y, z, spriteDataName) {
		this.dir_down = [0, Math.PI / 2];
		this.dir_side = [0, 0];
		this.dir_front = [Math.PI / 2, 0];
		
		this.gravStrength = physics_gravity;
		this.speed = 0.11;
		this.dMax = 3.4;
		this.fallMax = this.dMax * 1.3;
		this.jumpStrength = 2;
		this.jumpBoostStrength = 0.1;
		this.coyote = 0;

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
		this.texture_walkF = new Texture(getImage(source.sheet), data_sprites.spriteSize, source.frameTime, true, false, source.walkForwards);
		this.texture_walkL = new Texture(getImage(source.sheet), data_sprites.spriteSize, source.frameTime, true, false, source.walkSideways);
		this.texture_walkR = new Texture(getImage(source.sheet), data_sprites.spriteSize, source.frameTime, true, true, source.walkSideways);
		this.texture_jumpF = new Texture(getImage(source.sheet), data_sprites.spriteSize, source.frameTime, false, false, source.jumpForwards);
		this.texture_jumpL = new Texture(getImage(source.sheet), data_sprites.spriteSize, source.frameTime, false, false, source.jumpSideways);
		this.texture_jumpR = new Texture(getImage(source.sheet), data_sprites.spriteSize, source.frameTime, false, true, source.jumpSideways);

		this.texture_current = this.texture_jumpF;
		this.textureRot = 1;

	}

	collide() {
		//get closest tunnel strip
		var tunnelStrip = 0;

		//get the closest strip
		for (var a=0; a<this.parent.strips.length; a++) {
			if (this.parent.strips[a].playerDist < this.parent.strips[tunnelStrip].playerDist) {
				tunnelStrip = a;
			}
		}

		//add in side by side strips and collide with them
		this.parent.strips[tunnelStrip].collideWithEntity(this);
		this.parent.strips[(tunnelStrip - 1 + this.parent.strips.length) % this.parent.strips.length].collideWithEntity(this);
		this.parent.strips[(tunnelStrip + 1) % this.parent.strips.length].collideWithEntity(this);
	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		//decreasing the time to jump
		this.onGround -= 1;
		
		//if player has a parent, change gravity based on parent power
		if (this.onGround < physics_graceTime - 2) { 
			if (this.parent != undefined) {
				this.dy -= linterp(activeGravity * 0.8, activeGravity, this.parent.power);
			} else {
				this.dy -= activeGravity;
			}
		} else {
			//if firmly on the ground, reduce y velocity
		}

		//jump boost
		if (this.dy > 0 && this.onGround <= 0 && controls_spacePressed && this.jumpTime > 0) {
			this.dy += this.jumpBoostStrength;
			this.jumpTime -= 1;
		}
		
		this.dy = clamp(this.dy, -1 * this.fallMax, 3 * this.fallMax);

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
				//colliding with tiles
				this.collide();
				if (!this.parent.playerIsInTunnel()) {
					//if in the void, change physics
					var voidStrength = spaceToRelativeRotless(this.parent.centerPos, [this.x, this.y, this.z], this.dir_down)[2] / this.parent.r;
					if (this.parent.playerTilePos > this.parent.len - 0.5) {
						voidStrength *= -0.6;
						//if the player off the end of the tunnel and is above the midpoint, make them go down faster
						if (voidStrength > 0) {
							voidStrength *= 1.8;
						}
					}
					this.modifyDerivitives(this.gravStrength * 0.7 * (voidStrength), this.friction / 2, this.naturalFriction, this.ax / 2, this.speed / 2);
					//void spin
					this.textureRot += render_voidSpinSpeed;
				} else {
					//restore proper spin if in tunnel
					if (Math.abs(this.textureRot - this.dir_down[1]) > render_voidSpinSpeed * 3) {
						this.textureRot = (this.textureRot + (render_voidSpinSpeed * 3)) % (Math.PI * 2);
					}
					if (!this.onIce) {
						//regular tiles
						//don't accelerate if dz is too great
						if (Math.abs(this.dz) > this.dMax * 1.1) {
							this.modifyDerivitives(this.gravStrength, this.friction, this.naturalFriction, this.ax, 0);
						} else {
							this.modifyDerivitives(this.gravStrength, this.friction, this.naturalFriction, this.ax, this.speed);
						}
					} else {
						//ice tiles
						this.modifyDerivitives(this.gravStrength, Math.min(0.995, this.friction * 1.05), this.naturalFriction, this.ax * 0.8, this.speed);
					}
				}
			}

			//moving according to forces
			var turnForce = polToCart(this.dir_side[0], this.dir_side[1], this.dx);
			var gravForce = polToCart(this.dir_down[0], this.dir_down[1], this.dy);
			var frontForce = polToCart(this.dir_front[0], this.dir_front[1], this.dz);

			this.x += gravForce[0] + turnForce[0] + frontForce[0];
			this.y += gravForce[1] + turnForce[1] + frontForce[1];
			this.z += gravForce[2] + turnForce[2] + frontForce[2];

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
				var cartX = polToCart(this.dir_side[0], this.dir_side[1], 10);
				var cartY = polToCart(this.dir_down[0], this.dir_down[1], 10);
				var cartZ = polToCart(this.dir_front[0], this.dir_front[1], 10);
				var xXY = spaceToScreen([cartX[0] + this.x, cartX[1] + this.y, cartX[2] + this.z]);
				var yXY = spaceToScreen([cartY[0] + this.x, cartY[1] + this.y, cartY[2] + this.z]);
				var zXY = spaceToScreen([cartZ[0] + this.x, cartZ[1] + this.y, cartZ[2] + this.z]);
				ctx.beginPath();
				ctx.strokeStyle = "#F00";
				ctx.moveTo(tX, tY);
				ctx.lineTo(xXY[0], xXY[1]);
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle = "#0F0";
				ctx.moveTo(tX, tY);
				ctx.lineTo(yXY[0], yXY[1]);
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle = "#00F";
				ctx.moveTo(tX, tY);
				ctx.lineTo(zXY[0], zXY[1]);
				ctx.stroke();
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
		var vertOffset = polToCart(this.dir_down[0], this.dir_down[1], 70);
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
				this.texture_current.currentFrame = 0;
			}
			this.textureRot = this.dir_down[1];
			this.texture_walkF.currentFrame = this.texture_current.currentFrame;
			this.texture_walkL.currentFrame = this.texture_current.currentFrame;
			this.texture_walkR.currentFrame = this.texture_current.currentFrame;
			return;
		}
		
		//syncing all jumping animations if not walking
		this.texture_jumpF.currentFrame = this.texture_current.currentFrame;
		this.texture_jumpL.currentFrame = this.texture_current.currentFrame;
		this.texture_jumpR.currentFrame = this.texture_current.currentFrame;
	}

	turnAround() {
		//switch direction and change down angle so the tiles are a w a r e
		this.backwards = !this.backwards;
		haltCollision = false;
		this.dir_down = [this.dir_down[0], this.dir_down[1] + 0.02];
	}

	handleSpace() {
		if (this.coyote == 0) {
			this.coyote = physics_graceTime;
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
		this.currentFrame = 0;
		this.amount = 1 / drawsBeforeImageChange;
	}

	beDrawn(x, y, rotation, size) {
		//change current frame
		if (this.looping) {
			this.currentFrame = (this.currentFrame + this.amount) % this.frames.length;
		} else {
			this.currentFrame += this.amount;
			if (this.currentFrame > this.frames.length - 1) {
				this.currentFrame = this.frames.length - 1;
			}
		}


		//actually draw self
		var xOff = size * 0.7071 * Math.cos(rotation - (Math.PI * 0.75));
		var yOff = size * 0.7071 * Math.sin(rotation - (Math.PI * 0.75));
		//transforming
		ctx.translate(1 * (x + xOff), y + yOff);
		ctx.rotate(rotation);
		if (this.backwards) {
			ctx.scale(-1, 1);
			ctx.drawImage(this.sheet, this.size * (this.frames[Math.floor(this.currentFrame)][0] + 1), this.size * this.frames[Math.floor(this.currentFrame)][1], -1 * this.size, this.size, 
							0, 0, -1 * size, size);
			ctx.scale(-1, 1);
			
		} else {
			try {
			ctx.drawImage(this.sheet, this.size * this.frames[Math.floor(this.currentFrame)][0], this.size * this.frames[Math.floor(this.currentFrame)][1], this.size, this.size, 
							0, 0, size, size);
			} catch (error) {
				console.log(error, `problem trying to draw frame ${Math.floor(this.currentFrame)}, with frames ${JSON.stringify(this.frames)}`);
			}
		}
		ctx.rotate(-1 * rotation);
		ctx.translate(-1 * (x + xOff), -1 * (y + yOff));
	}

	reset() {
		this.currentFrame = 0;
	}
}








//characters
//but why are you changing all these properties instead of having them be constructor arguments?
//well, my friendo, mainly readability and I'm lazy. I don't want to have 37 constructor arguments I have to keep track of, I want to know what each individual property is set to.
//TODO: refactor the texture getting
class Angel extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Angel`);

		this.speed = 0.07;
		this.dMax = 3.6;
		this.fallMax = 3.4;
		this.dMaxTrue = 8.5;
		this.naturalFriction = 0.9975;
		this.jumpStrength = 2.6;
		this.jumpBoostStrength = 0.09;

		this.boost = true;
		this.boostStrength = 1.35;
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
		if (this.glide && !this.boost && !this.haltGlide && controls_spacePressed) {
			//trade forwards movement for upwards movements
			if (this.dz > this.glideStrength * 8) {
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
		this.jumpBoostStrength = 0.13;
		this.boostFriction = 0.995;
		this.speed = 0.12;
		this.trueSpeed = 0.8;
		this.dMax = 9.2;
		this.dMin = 2;
	}

	//bunny always jumps
	tick() {
		if (this.onGround > 0) {
			this.handleSpace();
			this.dz += this.trueSpeed;
			this.textureRot = this.dir_down[1];
		}

		//space being pressed slows down the bunny
		if (controls_spacePressed && this.dy > 0 && this.dz > this.dMin) {
			this.dz *= this.boostFriction;
		}

		if (this.dz > this.dMin) {
			this.dz -= this.speed;
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
		this.texture_jumpF.currentFrame = this.texture_current.currentFrame;
		this.texture_jumpL.currentFrame = this.texture_current.currentFrame;
		this.texture_jumpR.currentFrame = this.texture_current.currentFrame;
	}
}

class Child extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Child`);
		
		this.texture_walkL = new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkLeft);
		this.texture_walkR = new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkRight);
		this.texture_jumpL = new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpLeft);
		this.texture_jumpR = new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpRight);

		this.gravStrength *= 0.8;
		this.jumpStrength = 2.67;
		this.jumpBoostStrength = 0.07;
		this.speed = 0.04;
		this.dMax = 2.9;
		this.fallMax = 1.1;

		this.jumpBuffer = 0;
	}

	//child has one buffer frame so crumbling tiles will fall
	tick() {
		if (this.jumpBuffer > 0) {
			this.handleSpace();
		}
		super.tick();
	}

	handleSpace() {
		if (this.jumpBuffer > 0) {
			this.jumpBuffer -= 1;
			if (this.jumpBuffer == 0) {
				super.handleSpace();
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
		this.speed = 0.1;
		this.dMax = 3.4;

		this.duplicates = [];
		this.duplicatesMax = 10;
		this.duplicatesMaxDistance = 900;
		this.duplicateGenerationTime = 150;
		this.duplicateGenerationCountup = 0;

		this.addSelfToDuplicateArray();
	}

	//this function exists because constructors are scary
	addSelfToDuplicateArray() {
		this.duplicates.push(this);
	}

	beDrawn() {
		//drawing duplicates, they have a lesser opacity, those fakers >:(
		this.duplicates.forEach(d => {
			if (d == this) {
				ctx.globalAlpha = 1;
				super.beDrawn();
			} else {
				ctx.globalAlpha = linterp(0.5, 0, (getDistance(this, d) / this.duplicatesMaxDistance) + 0.05);
				d.beDrawn();
			}
		});

		ctx.globalAlpha = 1;
	}

	createDuplicate() {
		var friend = new DuplicatorDuplicate(this.x, this.y, this.z);
		//updating properties to function
		friend.parent = this.parent;
		friend.parentPrev = this.parentPrev;
		friend.dx = this.dx + randomBounded(-0.3, 0.3);
		friend.dy = this.dy + randomBounded(0.1, 0.7);
		friend.dz = this.dz + randomBounded(-0.3, 0.3);

		friend.dir_down = this.dir_down;
		friend.dir_side = this.dir_side;
		friend.dir_front = this.dir_front;
		this.duplicates.push(friend);
	}

	tick() {
		if (this.duplicates.length == 0) {
			this.duplicates = [this];
		}
		//only do tick if close enough
		if (this.cameraDist < 1000 && !editor_active) {
			this.duplicateGenerationCountup += 1;

			//if self has fallen out of the world, replace self with a duplicate
			if (this.parent == undefined) {
				var replacement = -1;
				for (var g=this.duplicates.length-1; g>=0; g--) {
					if (replacement == -1 || this.duplicates[g].parent != undefined) {
						replacement = g;
					}
				}

				//only replace if not the placeholder
				if (replacement != -1) {
					replacement = this.duplicates[replacement];
					this.x = replacement.x;
					this.y = replacement.y;
					this.z = replacement.z;

					this.dx = replacement.dx;
					this.dy = replacement.dy;
					this.dz = replacement.dz;

					this.onGround = replacement.onGround;
					this.parent = replacement.parent;

					//kill replaced duplicate
					this.duplicates.splice(replacement, 1);
				}
			}

			//ordering duplicates
			if (world_time % 6 == 0) {
				this.duplicates = orderObjects(this.duplicates, 4);
			}

			//killing duplicates / ticking duplicates
			for (var d=0; d<this.duplicates.length; d++) {
				//only apply to non-self
				if (this.duplicates[d] != this) {
					//kill a duplicate if they fall out of the world and self is also not out of the world
					if (this.duplicates[d].parent == undefined || getDistance(this.duplicates[d], this) > this.duplicatesMaxDistance) {
						this.duplicates.splice(d, 1);
						d -= 1;
					} else {
						//make sure duplicates have the same strafing as self and they're transferring tunnels as well
						if (this.parent != undefined) {
							this.duplicates[d].parent = this.parent;
						}
						this.duplicates[d].ax = this.ax;
						this.duplicates[d].tick();
					}
				}
			}

			
			//creating new duplicates
			if (this.duplicates.length < this.duplicatesMax && this.duplicateGenerationCountup % Math.floor(this.duplicateGenerationTime / this.parentPrev.power) == 10) {
				this.createDuplicate();
			}
		}

		super.tick();
	}

	handleSpace() {
		//if a duplicate is close enough to self, change whether it can jump
		this.duplicates.forEach(d => {
			if (getDistance(this, d) < this.r * 2 && d != this) {
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
			if (d != this) {
				d.handleSpace();
			}
		})
	}
}

//no thoughts in this brian
class DuplicatorDuplicate extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Duplicator`);

		this.jumpStrength = 3;
		this.jumpBoostStrength = 0.095;
		this.speed = 0.14;
		this.dMax = 3.41;
	}

	collide() {
		//get closest tunnel strip
		var tunnelStrip = 0;

		//get the closest strip
		for (var a=0; a<this.parent.strips.length; a++) {
			if (getDistance(this.parent.strips[a], this) < getDistance(this.parent.strips[tunnelStrip], this)) {
				tunnelStrip = a;
			}
		}

		//add in side by side strips and collide with them
		this.parent.strips[tunnelStrip].collideWithEntity(this);
		this.parent.strips[(tunnelStrip - 1 + this.parent.strips.length) % this.parent.strips.length].collideWithEntity(this);
		this.parent.strips[(tunnelStrip + 1) % this.parent.strips.length].collideWithEntity(this);
	}
}


class Gentleman extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Gentleman`);

		this.texture_flyF = new Texture(getImage(data_sprites.Gentleman.sheet), data_sprites.spriteSize, 1e1001, false, false, data_sprites.Gentleman.flyForwards);
		this.texture_flyL = new Texture(getImage(data_sprites.Gentleman.sheet), data_sprites.spriteSize, 1e1001, false, false, data_sprites.Gentleman.flySideways);
		this.texture_flyR = new Texture(getImage(data_sprites.Gentleman.sheet), data_sprites.spriteSize, 1e1001, false, true, data_sprites.Gentleman.flySideways);

		this.jumpStrength = 3.6;
		this.jumpBoostStrength = 0.05;
		this.speed = 0.04;
		this.dMax = 3;
		this.dMaxTrue = 4.5;
		this.naturalFriction = 0.9995;

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
				if (spaceToRelativeRotless([this.parent.freeObjs[h].x, this.parent.freeObjs[h].y, this.parent.freeObjs[h].z], [this.x, this.y, this.z], [this.dir_down[0], (Math.PI * 2) - this.dir_down[1]])[0] > 0) {
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
			var rot = (Math.atan2(this.dy, -(this.dz * 0.8)) + (Math.PI / 2)) / (Math.PI * 2);
			rot = (rot + 2) % 1;
			rot = 1 - rot;

			this.texture_current.currentFrame = Math.floor(rot * 7.99);
			
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
				this.texture_current.currentFrame = 0;
			}
			this.textureRot = this.dir_down[1];
			this.texture_walkF.currentFrame = this.texture_current.currentFrame;
			this.texture_walkL.currentFrame = this.texture_current.currentFrame;
			this.texture_walkR.currentFrame = this.texture_current.currentFrame;
		} else if (this.attracting != undefined) {
			this.texture_flyF.currentFrame = this.texture_current.currentFrame;
			this.texture_flyL.currentFrame = this.texture_current.currentFrame;
			this.texture_flyR.currentFrame = this.texture_current.currentFrame;
		} else {
			//syncing all jumping animations
			this.texture_jumpF.currentFrame = this.texture_current.currentFrame;
			this.texture_jumpL.currentFrame = this.texture_current.currentFrame;
			this.texture_jumpR.currentFrame = this.texture_current.currentFrame;
		}
	}
}


class Lizard extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Lizard`);

		this.jumpStrength = 4.3;
		this.jumpBoostStrength = 0.13;
		this.speed = 0.08;
		this.dMax = 2.6;
	}
}

class Pastafarian extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Pastafarian`);

		this.texture_walkL = new Texture(getImage(data_sprites.Pastafarian.sheet), data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, true, false, data_sprites.Pastafarian.walkLeft);
		this.texture_walkR = new Texture(getImage(data_sprites.Pastafarian.sheet), data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, true, false, data_sprites.Pastafarian.walkRight);
		this.texture_jumpL = new Texture(getImage(data_sprites.Pastafarian.sheet), data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, false, false, data_sprites.Pastafarian.jumpLeft);
		this.texture_jumpR = new Texture(getImage(data_sprites.Pastafarian.sheet), data_sprites.spriteSize, data_sprites.Pastafarian.frameTime, false, false, data_sprites.Pastafarian.jumpRight);

		this.jumpStrength = 4.5;
		this.jumpBoostStrength = 0;
		this.speed = 0.12;
		this.dMax = 3.3;
		this.fallMax = 4.5;

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
			this.personalBridgeStrength += this.bridgeBoost;
			if (this.personalBridgeStrength > 1) {
				this.personalBridgeStrength = 1;
			}
		}
		super.handleSpace();
	}
}



class Runner extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Runner`);

		this.jumpStrength = 2.85;
		this.jumpBoostStrength = 0.09;
		this.speed = 0.11;
		this.dMax = 3.4;
	}
}


class Skater extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Skater`);

		this.jumpStrength = 2.5;
		this.jumpBoostStrength = 0.06;
		this.speed = 0.07;
		this.dMax = 10;
		this.fallMax = this.dMax;
	}
}

class Student extends Character {
	constructor(x, y, z) {
		super(x, y, z, `Student`);

		this.jumpStrength = 2.2;
		this.jumpBoostStrength = 0.05;
		this.speed = 0.1;
		this.dMax = 2.74;
		this.r -= 2;
		this.fallMax = 5.5;

		this.abilityTransformTime = 6;
		this.abilityTimeLimit = 50;
		this.currentAbilityTime = 0;
		this.doAbility = true;

		this.dir_trueDown = this.dir_down;
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
					world_camera.targetRot = (this.dir_down[1] + (Math.PI * 1.5)) % (Math.PI * 2);
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
		var vertOffset = polToCart(this.dir_trueDown[0], this.dir_trueDown[1], 70);
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