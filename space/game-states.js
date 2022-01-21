//game states!
//all states have a execute function that gets called, and an id for easy identification


//splash state, happens at the beginning, when the website is first loading
class State_Splash {
	constructor() {
		this.id = "splash";
	}

	execute() {
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

	drawBG() {
		//opacity changes with distance to the black hole for a distortion effect
		var bhDist2;
		bhDist2 = (character.x * character.x) + (character.y * character.y);
		bhDist2 = (character.x * character.x) + (character.y * character.y);
		var value = 1 - (system_main.center.r / bhDist2) * system_main.center.r;
		ctx.globalAlpha = value;

		//regular blue space
		ctx.fillStyle = cLinterp(color_space, color_space_blueshift, 1 - value);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;
	}

	iterateSim() {
		//most of these are recursive functions that call for every body when called on loading_system. 
		//The exceptions are the ones with loading_debris, which have forEach loops,
		loading_system.spliceIncorrect();
		loading_system.gravitateAll();
		loading_system.pullChildren();
		
		loading_debris.forEach(a => {
			loading_system.gravitateToArray(a);
		});
		
		loading_system.tick();
		loading_debris.forEach(a => {a.tick();});

		game_time += 1 / dt;
	}

	keepDebrisCount() {
		//remove debris that isn't physical
		for (var u=0; u<loading_debris.length; u++) {
			if (!loading_debris[u].physical && loading_debris[u] != character) {
				loading_debris.splice(u, 1);
				u -= 1;
			}
		}

		//generate new debris
	}

	execute() {
		loading_camera.tick();

		//drawing background, opacity decreases with distance to the black hole
		this.drawBG();

		//ticking everything

		/*dt affects physics timestepping, not just speed, so if it's too low physics will be unstable. 
		To counteract this, low dt has only one draw but multiple physics timesteps. */
		if (dt < 1) {
			var physSteps = Math.floor(1 / dt);
			dt *= physSteps;
			for (var g=0; g<physSteps; g++) {
				this.iterateSim();
			}
			dt /= physSteps;
		} else {
			this.iterateSim();
		}

		//remove / add debris, this doesn't need to be done with super high precision so it goes at the end
		this.keepDebrisCount();


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

	drawBG() {
		ctx.fillStyle = color_space;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	execute() {
		dt *= 1.1;
		super.execute();
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

	drawBG() {
		ctx.fillStyle = color_space;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	execute() {
		menuPos -= menuIncrement * 3;
		if (menuPos < menuLimit) {
			menuPos = menuLimit;
		}

		super.execute();

		//also draw extra navigation things
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

	execute() {
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