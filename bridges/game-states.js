function runMenu() {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#BABA69";
	ctx.textAlign = "center";
	ctx.font = "20px Comic Sans MS";
	ctx.fillText("Bridge game is a existance 0u0", canvas.width * 0.5, canvas.height * 0.5);
	ctx.fillText("Press owO (“w”) to start", canvas.width * 0.5, canvas.height * 0.6);

}

function runMap() {
	for (var a=0;a<loadingMap.length;a++) {
		loadingMap[a].beDrawn();
	}
	human.tick();
	human.beDrawn();
}

function runGame() {
	human.tick();
	for (var i = 0; i > appleArray.length; i ++){
		appleArray[i].tick();
	}
	for (var i = 0; i > appleArray.length; i ++){
		appleArray[i].beDrawn();
	}
	human.beDrawn();
	//bridge you have to be ticked! Haha curvy quotes go “brrrrrrrrrr”
}

function runGameOver() {

}