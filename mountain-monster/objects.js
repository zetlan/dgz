
//player
class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		
		this.dx = 0;
		this.dy = 0;

		this.dMax = 0.4;
		this.fallMax = 0.9;

		this.ax = 0;
		this.ay = physics_gravity;

		this.hasGlasses = false;
		this.hasLight = false;
	}
	
	beDrawn() {
		//draw as orb
		var coords = spaceToScreen(this.x, this.y);
	}

	tick() {
		//velocity
		this.dx = clamp(this.dx + this.ax, -this.dMax, this.dMax);
		if (this.ax == 0) {
			this.dx *= this.friction;
		}
		this.dy = clamp(this.dy + this.ay,-this.fallMax, this.fallMax);

		//collision!
	}

	interact() {

	}
}

//entity
class Entity {
	constructor(x, y, color, textDat) {
		this.x = x;
		this.y = y;
		this.r = 0.4;

		this.text = textDat;
		this.currentLine = 0;

		this.bgColor = (cBrightness(color) < 0.5) ? "#FFF" : "#000";
		this.color = color;
	}

	beDrawn() {
		//circle
		//adjust for offset into ground
	}

	tick() {
	}
}

//signs, like entity but auto-interacting
class Sign extends Entity {
	constructor(x, y, color, textDat) {
		super(x, y, color, textDat);

		//signs have no concept of current, they are just always on when the player walks by
		delete this.currentLine;
	}

	beDrawn() {
		//draw self

		//draw text above self
	}

	tick() {
		//signs don't actually tick?? They just sort of hang there. Chilling.
	}
}