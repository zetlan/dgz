//all the functions to do with running the shop are here. Some of these are stored as variables so they can be passed around in the shop data arrays

//user input
function shop_handleUp() {
	//cycling through what's selected
	loading_state.response_selected -= 1;
	if (loading_state.response_selected < 0) {
		loading_state.response_selected = loading_state.response_max;
	}
}

function shop_handleDown() {
	loading_state.response_selected += 1;
	if (loading_state.response_selected > loading_state.response_max) {
		loading_state.response_selected = 0;
	}
}

function shop_handleZ() {
	loading_state.data[loading_state.line][1][loading_state.response_selected].execute();
}

//all other shop functions, these ones are stored as classes so they can be executed later but stored with parameters
class Shop_setLine {
	constructor(number) {
		this.ln = number;
	}

	execute() {
		loading_state.updateLine(this.ln);
	}
}

class Shop_addLine {
	constructor(number) {
		this.ln = number;
	}

	execute() {
		loading_state.updateLine(loading_state.line + this.ln);
	}
}

class Shop_storeItem {
	constructor(name, cost, lineActivity, codeToRunWhenBought) {
		this.name = name;
		this.cost = cost;
		this.code = codeToRunWhenBought;
		this.lineAct = lineActivity;
	}

	execute() {
		loading_state.storeItem(this.name, this.cost, this.code);
		this.lineAct.execute();
	}
}

class shop_buyItem {
	constructor(lineActivityIfHas, lineActivityIfNot, extraConditionalCodeOPTIONAL) {
		this.ln = lineActivityIfHas;
		this.lnE = lineActivityIfNot;
		this.conditional = extraConditionalCodeOPTIONAL;
	}

	execute() {
		var toPass = true;
		if (this.conditional != undefined) {
			toPass = eval(this.conditional);
		}
		toPass = toPass && (character.gold >= loading_state.item_cost);

		console.log(toPass);
		//if the player has enough gold and the extra conditional is satisfied
		if (toPass) {
			//buy the item
			character.gold -= loading_state.item_cost;
			eval(loading_state.item_effect);
			this.ln.execute();
		} else {
			//sending the shop to the failed line
			this.lnE.execute();
		}
	}
}

class Shop_escape {
	constructor() {
	}

	execute() {
		loading_state = new State_World();
	}
}


