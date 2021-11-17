
class System {
	constructor() {
		//create board
		this.board = [];

		//holding panel
		this.hold = undefined;

		//which piece is dropping?
		//[x, y, type, orientation]
		this.dropData = [];

		//difficulty data
		this.level = 1;
		this.framesPerTile = 100;
		this.harsh = false;
		this.palette = 0;
	}

	tick() {

	}

	beDrawn() {
		
	}
}