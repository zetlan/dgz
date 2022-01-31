/*index:

Camera
Camera_Map
Camera_World

State_Splash
State_World
State_Death
State_Map
State_Shop



*/
class Camera {
	constructor(x, y, scale, scaleMax, scaleMin, scaleSpeed) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.scale_max = scaleMax;
		this.scale_min = scaleMin;
		this.scale_speed = scaleSpeed;
		this.scale_d = 0;
	}

	tick() {
		if (loading_state.id != "death") {
			//updating scale and keeping it in bounds
			this.scale += this.scale_d * this.scale_speed;
			if (this.scale > this.scale_max) {
				this.scale = this.scale_max;
			}
			if (this.scale < this.scale_min) {
				this.scale = this.scale_min;
			}
		}
	}
}

class Camera_Map extends Camera {
	constructor() {
		super(0, 0, 1/128, 1e1001, 1/1024, 1/512);

		//the map camera can move around
		this.animSteps = 7;
	}

	tick() {
		//changing scale speed to match camera scaling
		this.scale_speed = this.scale / 16;
		super.tick();
		this.x = ((this.x * this.animSteps) + character.parent.x) / (this.animSteps + 1);
		this.y = ((this.y * this.animSteps) + character.parent.y) / (this.animSteps + 1);

		//setting max scale to a reasonable value based on body
		this.scale_max = Math.min(canvas.height / (480 * 4), canvas.height / (character.parent.r * 10));
	}
}

class Camera_World extends Camera {
	constructor() {
		super(0, 0, 1, 2, 0.75, 1/32);
	}

	tick() {
		super.tick();
		//lock self to player position
		this.x = character.x;
		this.y = character.y;
	}
}




