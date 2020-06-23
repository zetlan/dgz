function runMenu() {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#BABA69";
	ctx.textAlign = "center";
	ctx.font = "20px Comic Sans MS";
	ctx.fillText("Bridge game is a existance 0u0", canvas.width * 0.5, canvas.height * 0.5);
	ctx.fillText("Press Z to start", canvas.width * 0.5, canvas.height * 0.6);

}

function runMap() {
	//background
	ctx.fillStyle = color_water;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//player ticking
	human.tick();

	//centering camera on player
	camera.xOffset = human.x - ((canvas.width / 2) / camera.scale);
	camera.yOffset = human.y - ((canvas.height / 2) / camera.scale);

	for (var a=0;a<loadingMap.length;a++) {
		loadingMap[a].tick();
		loadingMap[a].beDrawn();
	}

	//drawing player, goes last
	human.beDrawn();	

	//drawing editor things
	if (editor.active) {
		//border
		ctx.beginPath();
		ctx.globalAlpha = 0.5;
		ctx.strokeStyle = color_editor;
		ctx.lineWidth = 20;
		ctx.rect(5, 5, canvas.width - 10, canvas.height - 10);
		ctx.stroke();

		//highlight edit point
		if (editor.object != undefined) {
			ctx.globalAlpha = 1;
			ctx.lineWidth = 5;
			var drawPoint = adjustForCamera(editor.object.p[editor.point]);
			ctx.ellipse(drawPoint[0], drawPoint[1], 2, 2, 0, 0, Math.PI * 2);
			ctx.stroke();
			ctx.lineWidth = 10;
		}
	}
}


function runGame() {
	//background
	ctx.fillStyle = color_background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//player things
	human.tick();
	human.beDrawn();

	//bridge you have to be ticked! `Haha curvy quotes go “brrrrrrrrrr”`
	//drawing bridge
	dBridge();

	//ticking/drawing water
	updateWater();
	dWater();

	//ticking/drawing debris

	

	//ticking/drawing bridge machine
	pTime += 1;
}

function runGameOver() {
	//background
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//text
	ctx.fillStyle = "#BABA69";
	ctx.textAlign = "center";
	ctx.font = "20px Comic Sans MS";
	ctx.fillText("yuo died lol", canvas.width * 0.5, canvas.height * 0.5);
}