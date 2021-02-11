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
		if (editor_active || !(loading_state instanceof State_Game || loading_state instanceof State_Infinite)) {
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
		} else {
			//changing with average
			this.x = (this.targetX + (this.x * (this.animSteps - 1))) / this.animSteps;
			this.y = (this.targetY + (this.y * (this.animSteps - 1))) / this.animSteps;
			this.z = (this.targetZ + (this.z * (this.animSteps - 1))) / this.animSteps;
			this.theta = (this.targetTheta + (this.theta * (this.animSteps - 1))) / this.animSteps;
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
	constructor(x, y, z, walkForwardsTexture, walkLeftTexture, walkRightTexture, jumpForwardsTexture, jumpLeftTexture, jumpRightTexture) {
		this.dir_down = [0, Math.PI / 2];
		this.dir_side = [0, 0];
		this.dir_front = [Math.PI / 2, 0];
		
		this.gravStrength = physics_gravity;
		this.speed = 0.11;
		this.dMax = 3.4;
		this.fallMax = this.dMax;
		this.jumpStrength = 2;
		this.jumpBoostStrength = 0.1;

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

		this.r = player_radius;
		this.cameraDist = 1000;
		this.drawR = this.r / getDistance(this, world_camera);
		this.color = color_character;

		this.texture_walkF = walkForwardsTexture;
		this.texture_walkL = walkLeftTexture;
		this.texture_walkR = walkRightTexture;
		this.texture_jumpF = jumpForwardsTexture;
		this.texture_jumpL = jumpLeftTexture;
		this.texture_jumpR = jumpRightTexture;

		this.texture_current = undefined;
		this.textureRot = 1;

	}

	modifyDerivitives(activeGravity, activeFriction, naturalFriction, activeAX, activeAZ) {
		//decreasing the time to jump
		this.onGround -= 1;

		//if player has a parent, change gravity based on parent power
		if (this.parent != undefined) {
			this.dy -= linterp(activeGravity * 0.8, activeGravity, this.parent.power);
		} else {
			this.dy -= activeGravity;
		}

		//jump boost
		if (this.dy > 0 && this.onGround <= 0 && controls_spacePressed && this.jumpTime > 0) {
			this.dy += this.jumpBoostStrength;
			this.jumpTime -= 1;
		}
		
		this.dy = clamp(this.dy, -1 * this.fallMax, 1.5 * this.dMax);

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
		//setting camera position
		var vertOffset = polToCart(this.dir_down[0], this.dir_down[1], 70);
		var horizOffset = polToCart(this.dir_front[0], this.dir_front[1], -95);
		world_camera.targetX = this.x + vertOffset[0] + horizOffset[0];
		world_camera.targetY = this.y + vertOffset[1] + horizOffset[1];
		world_camera.targetZ = this.z + vertOffset[2] + horizOffset[2];



		//getting camera distance
		this.cameraDist = Math.max(1, getDistance(this, world_camera) - 20);
		this.drawR = (this.r / this.cameraDist) * world_camera.scale;

		//only do the other tick stuff if camera is close enough
		if (this.cameraDist < 1000 && !editor_active) {
			if (this.parent != undefined && !this.parent.playerIsInTunnel()) {
				//if in the void, change physics
				var voidStrength = spaceToRelative(this.parent.centerPos, [this.x, this.y, this.z], [this.dir_down[0], this.dir_down[1], 0])[2] / this.parent.r;
				if (this.parent.playerTilePos > this.parent.len) {
					voidStrength *= -0.6;
				}
				this.modifyDerivitives(this.gravStrength * 0.7 * (voidStrength), this.friction / 2, this.naturalFriction, this.ax / 2, this.speed / 2);
				//void spin
				this.textureRot += render_voidSpinSpeed;
			} else if (this.onIce) {
				//ice also affects physics
				this.modifyDerivitives(this.gravStrength, Math.min(0.995, this.friction * 1.05), this.naturalFriction, this.ax * 0.8, this.speed);
			} else {
				//restoring proper spin if in tunnel
				if (Math.abs(this.textureRot - this.dir_down[1]) > render_voidSpinSpeed * 3) {
					this.textureRot = (this.textureRot + (render_voidSpinSpeed * 3)) % (Math.PI * 2);
				}
				
				//don't accelerate if dz is too great
				if (Math.abs(this.dz) > this.dMax * 1.1) {
					this.modifyDerivitives(this.gravStrength, this.friction, this.naturalFriction, this.ax, 0);
				} else {
					this.modifyDerivitives(this.gravStrength, this.friction, this.naturalFriction, this.ax, this.speed);
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
			this.texture_current.beDrawn(tX, tY, this.textureRot - (Math.PI * 0.5) - world_camera.rot, this.drawR * 2);


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
			} else if (this.ax < 0) {
				//left
				this.texture_current = this.texture_walkL;
			} else {
				//right
				this.texture_current = this.texture_walkR;
			}
		} else {
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
	}

	syncTextures() {
		//if on the ground, sync all walking animations
		if (this.onGround > 0) {
			//decrement current frame if not moving forwards
			if (this.dz == 0 && Math.abs(this.ax) < 0.02) {
				this.texture_current.currentFrame = 0;
			}
			this.textureRot = this.dir_down[1];
			this.texture_walkF.currentFrame = this.texture_current.currentFrame;
			this.texture_walkL.currentFrame = this.texture_current.currentFrame;
			this.texture_walkR.currentFrame = this.texture_current.currentFrame;
		} else {
			//syncing all jumping animations as well
			this.texture_jumpF.currentFrame = this.texture_current.currentFrame;
			this.texture_jumpL.currentFrame = this.texture_current.currentFrame;
			this.texture_jumpR.currentFrame = this.texture_current.currentFrame;
		}
	}

	handleSpace() {
		if (this.onGround > 0) {
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
			ctx.drawImage(this.sheet, this.size * this.frames[Math.floor(this.currentFrame)][0], this.size * this.frames[Math.floor(this.currentFrame)][1], this.size, this.size, 
							0, 0, size, size);
		}
		ctx.rotate(-1 * rotation);
		ctx.translate(-1 * (x + xOff), -1 * (y + yOff));

		
		if (this.looping) {
			this.currentFrame = (this.currentFrame + this.amount) % this.frames.length;
		} else {
			this.currentFrame += this.amount;
			if (this.currentFrame > this.frames.length - 1) {
				this.currentFrame = this.frames.length - 1;
			}
		}
	}

	reset() {
		this.currentFrame = 0;
	}
}








//characters
//but why are you changing all these properties instead of having them be constructor arguments?
//well, my friendo, mainly readability and I'm lazy. I don't want to have 37 constructor arguments I have to keep track of, I want to know what each individual property is set to.
class Angel extends Character {
	constructor(x, y, z) {
		super(x, y, z, new Texture(getImage(data_sprites.Angel.sheet), data_sprites.spriteSize, data_sprites.Angel.frameTime, true, false, data_sprites.Angel.walkForwards),
					new Texture(getImage(data_sprites.Angel.sheet), data_sprites.spriteSize, data_sprites.Angel.frameTime, true, false, data_sprites.Angel.walkSideways),
					new Texture(getImage(data_sprites.Angel.sheet), data_sprites.spriteSize, data_sprites.Angel.frameTime, true, true, data_sprites.Angel.walkSideways),
					new Texture(getImage(data_sprites.Angel.sheet), data_sprites.spriteSize, data_sprites.Angel.frameTime, false, false, data_sprites.Angel.jumpForwards),
					new Texture(getImage(data_sprites.Angel.sheet), data_sprites.spriteSize, data_sprites.Angel.frameTime, false, false, data_sprites.Angel.jumpSideways),
					new Texture(getImage(data_sprites.Angel.sheet), data_sprites.spriteSize, data_sprites.Angel.frameTime, false, true, data_sprites.Angel.jumpSideways));

		this.speed = 0.06;
		this.dMax = 3.6;
		this.dMaxTrue = 8.5;
		this.naturalFriction = 0.9975;
		this.jumpStrength = 2.6;
		this.jumpBoostStrength = 0.09;

		this.boost = true;
		this.boostStrength = 1.5;
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
			this.dz *= this.boostStrength;
			this.dz = clamp(this.dz, -1 * this.dMaxTrue, this.dMaxTrue);
			this.jumpTime = 0;
		} else {
			this.haltGlide = false;
		}
	}
}

class Bunny extends Character {
	constructor(x, y, z) {
		super(x, y, z, undefined, undefined, undefined,
					new Texture(getImage(data_sprites.Bunny.sheet), data_sprites.spriteSize, data_sprites.Bunny.frameTime, false, false, data_sprites.Bunny.jumpForwards),
					new Texture(getImage(data_sprites.Bunny.sheet), data_sprites.spriteSize, data_sprites.Bunny.frameTime, false, false, data_sprites.Bunny.jumpSideways),
					new Texture(getImage(data_sprites.Bunny.sheet), data_sprites.spriteSize, data_sprites.Bunny.frameTime, false, true, data_sprites.Bunny.jumpSideways));

		this.jumpStrength = 3;
		this.jumpBoostStrength = 0.12;
		this.boostFriction = 0.995;
		this.speed = 0.08;
		this.trueSpeed = 0.6;
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
		super(x, y, z, new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkForwards),
					new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkLeft),
					new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, true, false, data_sprites.Child.walkRight),
					new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpForwards),
					new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpLeft),
					new Texture(getImage(data_sprites.Child.sheet), data_sprites.spriteSize, data_sprites.Child.frameTime, false, false, data_sprites.Child.jumpRight));

		this.gravStrength *= 0.8;
		this.jumpStrength = 2.6;
		this.jumpBoostStrength = 0.06;
		this.speed = 0.03;
		this.dMax = 2.9;
		this.fallMax = 1;

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

class Runner extends Character {
	constructor(x, y, z) {
		super(x, y, z, new Texture(getImage(data_sprites.Runner.sheet), data_sprites.spriteSize, data_sprites.Runner.frameTime, true, false, data_sprites.Runner.walkForwards),
					new Texture(getImage(data_sprites.Runner.sheet), data_sprites.spriteSize, data_sprites.Runner.frameTime, true, false, data_sprites.Runner.walkSideways),
					new Texture(getImage(data_sprites.Runner.sheet), data_sprites.spriteSize, data_sprites.Runner.frameTime, true, true, data_sprites.Runner.walkSideways),
					new Texture(getImage(data_sprites.Runner.sheet), data_sprites.spriteSize, data_sprites.Runner.frameTime, false, false, data_sprites.Runner.jumpForwards),
					new Texture(getImage(data_sprites.Runner.sheet), data_sprites.spriteSize, data_sprites.Runner.frameTime, false, false, data_sprites.Runner.jumpSideways),
					new Texture(getImage(data_sprites.Runner.sheet), data_sprites.spriteSize, data_sprites.Runner.frameTime, false, true, data_sprites.Runner.jumpSideways));

		this.jumpStrength = 2.85;
		this.jumpBoostStrength = 0.09;
		this.speed = 0.11;
		this.dMax = 3.4;
	}
}