





//bullets for causing damage
class Projectile {
	constructor(x, y, dx, dy, parent) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}
}

//ship class - the main one for shared behaviors
class Ship {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = 0.04;

		//velocity
		this.dx = 0;
		this.dy = 0;

		//angle vars
		this.a = 0;
		this.da = 0;
		this.aa = 0;
		
	}
}


//here are special types of ship