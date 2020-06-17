//globals here
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);

window.onmousemove = handleMouseMove;
window.onmousedown = handleMouseDown;
window.onmouseup = handleMouseUp;

//global vars
var canvas;
var ctx;
var timer;
var gameState = "menu";

var bridgeColor = "#000000";
var bridgeStartColor = "#00FF00";
var bridgeEndColor = "#E65F5C";
var groundColor = "#22DE44";
var beachColor = "#43BD90";
var backgroundColor = "#639BDB";
var playerColor = "#FF00FF";
var editorColor = "#FF8888";

var bridgeHeight;
var waterHeight;

//objectos
let loadingBridge = [];
let loadingMap = [new Island([[-20,-679],[-86,-745],[1,-836],[100,-776],[74,-685]]),
new Island([[80,-385],[-30,-378],[0,-478]]),
new Island([[-749,284],[-862,401],[-962,341],[-954,59],[-959,54],[-964,49],[-969,44],[-974,39],[-979,34],[-984,29],[-989,24],[-869,-123],[-759,-319],[-516,-369],[-256,-313],[-66,-223],[11,-89],[-22,77],[-59,207],[-59,374],[4,521],[-66,687],[-199,744],[-312,867],[-469,931],[-432,796],[-312,686],[-176,479],[-170,282],[-190,142],[-200,32],[-233,-24],[-236,12],[-213,269],[-200,399],[-276,569],[-440,716],[-553,812],[-622,924],[-692,837],[-672,717],[-612,627],[-452,561],[-299,451],[-246,247],[-306,24],[-479,-9],[-636,81],[-716,151]]),
new Island([[169,-892],[292,-860],[329,-962],[245,-1054],[136,-1072],[102,-1004]]),
new Island([[1122,-283],[1156,-119],[1216,-3],[1069,-26],[939,54],[896,-109],[809,-193],[866,-313],[989,-369]]),
new Island([[562,-790],[666,-787],[746,-700],[719,-620],[622,-580],[539,-617],[516,-710]]),
new Island([[-647,171],[-695,268],[-704,359],[-687,372],[-666,345],[-653,249],[-577,182],[-480,162],[-422,209],[-404,294],[-457,383],[-520,414],[-526,431],[-507,439],[-457,423],[-380,354],[-355,234],[-419,118],[-539,113]]),
new Island([[514.9998669306929,1577.0376095177285],[507.7826627446033,1695.3394305555453],[397.78266274460304,1712.0060972222122],[291.1159960779363,1655.3394305555453],[374.4493294112698,1565.3394305555453]]),
new Bridge([[-178.92428124845628,-253.60700684578597],[-12.257614667573648,-393.6070035727839],[199.64650414285728,-75.08701257968184],[76.64650414285728,86.91298742031816],[219.6465040152521,-22.087012753889155]], 5),
new Bridge([[12.997850744134212,-437.0546512652446],[26.331184077467583,-707.054651265245]], 5),
new Bridge([[32.997850744134325,-800.3879845985783],[159.66451741080107,-943.7213179319118]], 5),
new Bridge([[266.3311840774679,-897.0546512652452],[562.9978507441349,-720.3879845985782]], 5),
new Bridge([[672.9978507441351,-640.3879845985782],[919.6645174108019,-327.0546512652445]], 5),
new Bridge([[-598.8146118764818,865.6318440897394],[-438.81461187648443,862.2985107564059]], 5),
new Bridge([[-458.92428133424085,146.39299642721676],[-318.92428133424073,-50.2736702394501]], 3)
				];



let editor = {
				active: false,
				occupies: 0,
				object: undefined,
				point: 0
			};

let camera = {
				scale: 1,
				xOffset: 0,
				yOffset: 0,
				scrollValues: {min: 0.125, max: 4}

};
		
let mouse = {
	x: 0,
	y: 0,
	down: false,
}

let human;

//functions

function setup() {
	canvas = document.getElementById("cucumber");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 10;
	ctx.lineJoin = "round";

	bridgeHeight = 0.75 * canvas.height;
	waterHeight = 0.85 * canvas.height;

	human = new MenuPlayer(0, 0);

	timer = window.requestAnimationFrame(main);
}

function handleKeyPress(u) {
	switch (u.keyCode) {
		//player controls
		case 90:
			if (gameState == "menu") {
			gameState = "map";
			}
			break;
		case 37:
			human.ax = -1 * human.aSpeed;
			break;
		case 38:
			human.ay = -1 * human.aSpeed;
			break;
		case 39:
			human.ax = human.aSpeed;
			break;
		case 40:
			human.ay = human.aSpeed;
			break;
		//camera controls
		case 16:
			human.dc = human.cSpeed;
			break;
		case 32:
			human.dc = -1 * human.cSpeed;
			break;
		case 221:
			//toggling editor
			editor.active = !editor.active;
			break;
	}

	//controls that only work when the editor is active
	if (editor.active) {
		switch (u.keyCode) {
			//adding / removing a point
			case 32:
				//adds a point with slightly offset coordinates from the currently selected point
				editor.object.p.splice(editor.point, 0, [editor.object.p[editor.point][0] + 5, editor.object.p[editor.point][1] + 5]);
				human.dc = 0;
				break;
			case 16:
				//removes the currently selected point if there are more than 2 points in the object
				if (editor.object.p.length > 2) {
					editor.object.p.splice(editor.point, 1);
					if (editor.point > editor.object.p.length - 1) {
						editor.point -= 1;
					}
				}
				human.dc = 0;
				break;
			
			//adding bodies
			case 90:
				//adding an island
				loadingMap.push(new Island([[0, 0], [50, 50], [50, 0]]));
				break;
			case 88:
				//adding a bridge
				loadingMap.push(new Bridge([[0, 0], [25, 25]], 5));
				break;

		}
	}
}

function handleKeyNegate(u) {
	switch (u.keyCode) {
		case 37:
			if (human.ax < 0) {
			human.ax = 0;
			}
			break;
		case 38:
			if (human.ay < 0) {
			human.ay = 0;
			}
			break;
		case 39:
			if (human.ax > 0) {
			human.ax = 0;
			}
			break;
		case 40:
			if (human.ay > 0) {
			human.ay = 0;
			}
			break;
		//camera controls
		case 16:
			if (human.dc > 0) {
				human.dc = 0;
			}
			break;
		case 32:
			if (human.dc < 0) {
				human.dc = 0;
			}
			break;
	}
}

function handleMouseDown(a) {
	mouse.down = true;

	//if editing, search to change editing point
	if (editor.active) {
		//search through all points to see if the mouse on top of one
		for (var k=0;k<loadingMap.length;k++) {
			for (var m=0;m<loadingMap[k].p.length;m++) {
				console.log(m, k);
				//get point coordinates
				var [px, py] = adjustForCamera(loadingMap[k].p[m]);
				var [mx, my] =[mouse.x, mouse.y];

				//if the point is in a certain range of the mouse position, select it and break out
				if (Math.abs(mx - px) < 10 && Math.abs(my - py) < 10) {
					editor.point = m;
					editor.occupies = k;
					editor.object = loadingMap[editor.occupies];

					k = loadingMap.length + 2;
					break;
				}
			} 
		}
	}
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	mouse.x = Math.round(a.clientX - canvasArea.left);
	mouse.y = Math.round(a.clientY - canvasArea.top);

	//working with edit mode
	if (mouse.down && editor.active) {
		//setting the coordinates of the currently selected point to mouse coordinates offset to match the camera offset
		loadingMap[editor.occupies].p[editor.point] = [(mouse.x / camera.scale) + camera.xOffset, (mouse.y / camera.scale) + camera.yOffset];
	}
}

function handleMouseUp(a) {
	mouse.down = false;
}

function main() {
	//background
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	switch (gameState) {
		case "menu":
			runMenu();
			break;
		case "map":
			runMap();
			break;
		case "game":
			break;
		case "gameover":
			break;
	}

	timer = window.requestAnimationFrame(main);
}