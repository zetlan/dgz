
//player class
class Player {
	constructor() {
		this.health = 3;
		this.maxHealth = 3;

		this.angle = 0;
		this.angleQueue = [0];
		this.queuePos = 0;
		this.queueProgressSpeed = 5;

		this.cooldown = 0;
		this.shieldOffset = 10;
		this.shieldSize = 7;
		this.shieldCoverAngle = this.shieldSize / (this.shieldOffset * Math.PI);
	}

	tick() {
		//move arm
		if (this.angleQueue.length > 1) {
			//fix distances
			if (Math.abs(this.angleQueue[0] - this.angleQueue[1]) > Math.PI) {
				if (this.angleQueue[0] == 0) {
					this.angleQueue[0] = Math.PI * 2;
				} else if (this.angleQueue[1] == 0) {
					this.angleQueue[0] = Math.PI / -2;
				}
			}


			this.queuePos += 1 / this.queueProgressSpeed;
			this.angle = linterp(this.angleQueue[0], this.angleQueue[1], this.queuePos);
			if (this.queuePos > 0.999) {
				this.queuePos = 0;
				this.angleQueue.splice(0, 1);
			}
		}

		//decrease cooldown
		this.cooldown *= 0.85;
	}

	beDrawn() {
		//actual self
		ctx.beginPath();
		ctx.fillStyle = color_player;
		ctx.ellipse(canvas.width / 2, canvas.height / 2, this.shieldOffset / 2, this.shieldOffset / 2, 0, Math.PI / this.maxHealth, (Math.PI / this.maxHealth) + ((Math.PI * 2) / this.maxHealth) * this.health);
		ctx.fill();
		//offset of arm from center of screen
		var cOffset = [this.shieldOffset * Math.cos(this.angle), this.shieldOffset * Math.sin(this.angle)];
		var aOffset = [this.shieldSize * Math.cos(this.angle + Math.PI / 2), this.shieldSize * Math.sin(this.angle + Math.PI / 2)];

		ctx.beginPath();
		ctx.strokeStyle = cLinterp(color_shield, color_shield_bright, this.cooldown);
		ctx.moveTo((canvas.width / 2) + cOffset[0] + aOffset[0], (canvas.height / 2) + cOffset[1] + aOffset[1]);
		ctx.lineTo((canvas.width / 2) + cOffset[0] - aOffset[0], (canvas.height / 2) + cOffset[1] - aOffset[1]);
		ctx.stroke();
	}
}

//projectile class
class Projectile {
	constructor(direction) {
		this.angle = direction * Math.PI * 0.5;
		this.distance = canvas.width / 2;
		this.destroy = false;
		this.r = 3;
	}

	tick() {
		this.distance -= game_params.bulletSpeed;

		//collide with shield if close enough
		if (this.distance > player.shieldOffset - this.speed && this.distance < player.shieldOffset + this.speed) {
			if (Math.abs(this.angle - player.angle) < player.shieldCoverAngle || Math.PI * 2 - Math.abs(this.angle - player.angle) < player.shieldCoverAngle) {
				//collision case
				this.destroy = true;
				player.cooldown = 1;
				audio_block.play();
			}
			
		}

		if (this.distance < 1) {
			player.health -= 1;
			this.destroy = true;
			audio_damage.play();
		}
	}

	beDrawn() {
		ctx.fillStyle = color_projectile;
		ctx.beginPath();
		ctx.ellipse((canvas.width / 2) + (this.distance * Math.cos(this.angle)), (canvas.height / 2) + (this.distance * Math.sin(this.angle)), this.r, this.r, 0, 0, Math.PI * 2);
		ctx.fill();
	}
}

//modified projectiles