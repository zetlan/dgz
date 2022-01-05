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
		super(0, 0, 1/128, 1/48, 1/1024, 1/512);

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
		this.scale_max = Math.min(canvas.height / (480 * 8), canvas.height / (character.parent.r * 80));
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



//game states!
//all states have a tick function that gets called, and an id for easy identification


//splash state, happens at the beginning, when the website is first loading
class State_Splash {
	constructor() {
		this.id = "splash";
	}

	tick() {
		drawSplash();
	}
}


//death state, like world but make everything slower
class State_World {
	constructor() {
		this.id = "world";
		menuPos = 1.5;
		loading_camera = camera_world;
	}

	tick() {
		loading_camera.tick();

		
		//drawing background, opacity decreases with distance to the black hole
		if (this.id == "world") {
			var bhDist2;
			bhDist2 = (character.x * character.x) + (character.y * character.y);
			bhDist2 = (character.x * character.x) + (character.y * character.y);
			var value = 1 - (system_main.center.r / bhDist2) * system_main.center.r;
			ctx.globalAlpha = value;

			//regular blue space
			ctx.fillStyle = color_space;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
		} else {
			ctx.fillStyle = color_space;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
		}
		
		


		//ticking everything

		/*dt affects physics timestepping, not just speed, so if it's too low physics will be unstable. 
		To counteract this, low dt has only one draw but multiple physics timesteps, so it's accurate as well */
		if (dt < 1) {
			var physSteps = Math.floor(1 / dt);
			dt *= physSteps;
			for (var g=0; g<physSteps; g++) {
				trueMain();
			}
			dt /= physSteps;
		} else {
			trueMain();
		}

		//remove debris that isn't physical
		for (var u=0; u<loading_debris.length; u++) {
			if (!loading_debris[u].physical && loading_debris[u] != character) {
				loading_debris.splice(u, 1);
				u -= 1;
			}
		}

		//generate new debris


		//drawing
		loading_system.beDrawn();
		loading_debris.forEach(a => {a.beDrawn();});
		
		//drawing the menu goes last, because it needs to be on top of everything.
		drawMenu();
	}
}

class State_Death extends State_World {
	constructor() {
		super();
		this.id = "death";
	}

	tick() {
		dt *= 1.1;
		super.tick();
	}
}

class State_Map extends State_World {
	constructor() {
		super();
		this.id = "map";
		if (menuPos > 1) {
			menuPos = 1;
		}
		loading_camera = camera_map;
	}

	tick() {
		menuPos -= menuIncrement * 3;
		if (menuPos < menuLimit) {
			menuPos = menuLimit;
		}

		super.tick();
	}
}

class State_Shop {
	constructor(source, startOnSecondLineBOOLEAN) {
		this.id = "shop";
		this.data = source;
		this.line = 0 + startOnSecondLineBOOLEAN;
		this.text_shop = "";
		this.text_response = "";

		this.response_selected = 0;
		this.response_max = 0;

		this.item_cost = undefined;
		this.item_name = undefined;
		this.item_effect = undefined;

		this.updateLine(this.line);
	}

	tick() {
		drawShopBackground();
		drawShopText();
	}

	updateLine(newLine) {
		this.line = newLine;

		//updating parameters that control what's drawn

		//this code is why we can't have nice things
		this.text_shop = this.data[this.line][0].replaceAll("\t", "").split("|")
		this.text_shop = eval("`" + this.text_shop[0] + "`").split("\n");
		this.text_response = this.data[this.line][0].replaceAll("\t", "").split("|");
		this.text_response.splice(0, 1);

		this.response_selected = 0;
		this.response_max = this.text_response.length - 1;
	}

	storeItem(displayName, cost, codeWhenBought) {
		this.item_cost = cost;
		this.item_name = displayName;
		this.item_effect = codeWhenBought;
	}
}




