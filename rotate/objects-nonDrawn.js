//map class, all world objects are contained here
class Map {
    constructor(backgroundColor, objects, connectsToLeft, connectsToRight) {
		this.avoid = false;
		this.bg = backgroundColor;
		this.name;
        this.contains = objects;
        this.leftMap = connectsToLeft;
		this.rightMap = connectsToRight;
		this.goingMap;

		this.angle = 0;
		this.mTime = 0;
        this.aSpeed = 0;
		this.aStart = 0;
		this.rotPercent = 0;
		this.rotating = false;
		this.ableToSwap = false;
		

		//ew
		var self = this;
		window.setTimeout(function() {self.initSides();}, 1);
		window.setTimeout(function() {self.orderObjects();}, 2);
    }

    beRun() {
		this.mTime ++;
		//tick and draw everything
		//player is ticked first but drawn last so that collisions don't look strange
		

		for (var k=0;k<this.contains.length;k++) {
			this.contains[k].beDrawn();
		}

		//only tick if this map is the loading map
		if (this == loadingMap && this.mTime <= 1) {
			this.tick();
		}

		//every once in a while order objects
		if (pTime % 50 == 0 && this.mTime <= 1 && !lEditor.active) {
			this.orderObjects();
		}
		//rotation things go almost last
        if (this.rotating && this.mTime <= 1) {
			this.angle += this.aSpeed;
			this.rotPercent = Math.abs(loadingMap.angle / (Math.PI / 2));
			this.orderObjects();

			//fade in for the map being gone to
			var temp = this.angle;
			if (this.goingMap == this.leftMap) {
				this.angle -= Math.PI / 2;
			} else {
				this.angle += Math.PI / 2;
			}
			ctx.globalAlpha = this.rotPercent;
			try {
				this.goingMap.orderObjects();
				this.goingMap.beRun();
			} catch (error) {}
			
			ctx.globalAlpha = 1;
			this.angle = temp;
			this.mTime = 1;
			
            //if rotated 90 degrees or rotated ~0 degrees, stop rotation
            if (Math.abs(this.aStart - this.angle) > Math.PI / 2 || Math.abs(this.aStart - this.angle) < Math.abs(this.aSpeed * 0.8)) {
				//if rotated 90 degrees, change loadingMap
				if (Math.abs(this.aStart - this.angle) > Math.PI / 2) {
					loadingMap = this.goingMap;

					//change player position to avoid jarring transition
					var nTX = player.x;
					var nTZ = player.z;
					player.x = (nTX * Math.cos(this.angle)) - (nTZ * Math.sin(this.angle));
					player.z = (nTZ * Math.cos(this.angle)) + (nTX * Math.sin(this.angle));
				}

				//rotation cancellation things
				this.rotating = false;
				this.angle = 0;
				this.aSpeed = 0;
				this.rotPercent = 0;
				this.orderObjects();
            }
		}
		
		//finally, player is drawn
		if (this == loadingMap && this.mTime <= 1) {
			player.tick();
			player.beDrawn();
		}

		this.mTime = 0;
	}

	tick() {
		for (var k=this.contains.length-1;k>=0;k--) {
			this.contains[k].tick();
			if (this.avoid) {
				this.avoid = false;
				k = 1;
			}
		}
	}
	
    startRotation(speed) {
        //only start if not already rotating
        if (!this.rotating) {
            this.aStart = this.angle;
            this.aSpeed = speed;
			this.rotating = true;

			if (this.aSpeed > 0) {
				this.goingMap = this.leftMap;
			} else {
				this.goingMap = this.rightMap;
			}
			//set timer for being able to collide, 30 ms I think is a safe guess for frame time
			window.setTimeout(loadingMap.beSwappable, 30);
        }
	}

	beSwappable() {
		loadingMap.ableToSwap = true;
	}
	
	initSides() {
		//converting the name strings into map references and naming adjacent maps
		var temp = this.leftMap;
		this.leftMap = eval(this.leftMap);
		try {
			this.leftMap.name = temp;
		} catch (error) {
			//cry or something
		}

		temp = this.rightMap;
		this.rightMap = eval(this.rightMap);
		try {
			this.rightMap.name = temp;
		} catch (error) {
			//I can understand why this is a thing, but I really don't want to have to have a catch block
		}
		

		//creating walls to block rotation in the case of non-existant sides
		if (Number.isNaN(this.leftMap)) {
			this.contains.push(new Box(-1 * mapSize, 0, 0, 1, mapSize, mapSize));
		}

		if (Number.isNaN(this.rightMap)) {
			this.contains.push(new Box(mapSize, 0, 0, 1, mapSize, mapSize));
		}
	}

	orderObjects() {
		//same as ordering faces
		var great = 0;
		let temp = [];
		var times = this.contains.length;
		//make sure objects have updated camera distances
		for (var d=0;d<this.contains.length;d++) {
			this.contains[d].getCameraDist();
		}

		for (var a=0;a<times;a++) {
			
			//running through list to get greatest distance
			for (var b=0;b<this.contains.length;b++) {
				if (this.contains[b].cDist > great) {
					great = this.contains[b].cDist;
				}
			}

			//running through list again, move the greatest distance item to the true object list
			for (var c=0;c<this.contains.length;c++) {
				if (this.contains[c].cDist == great) {
					//remove the item, add it to true object list, exit loop
					temp.push(this.contains[c]);
					
					this.contains.splice(c, 1);
					c = this.contains.length + 1;
				}
			}
			great = 0;
		}

		this.contains = temp;
	}

	giveEnglishConstructor(radians) {
		var leftName;
		try {
			leftName = this.leftMap.name;
		} catch (error) {
			leftName = NaN;
		}

		var rightName;
		try {
			rightName = this.rightMap.name;
		} catch (error) {
			rightName = NaN;
		}
		return `new Map("${this.bg}", [], "${leftName}", "${rightName}"); \n`;
	}
}


//main class, almost all objects extend from here
class Main {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.cDist = this.getCameraDist();
	}

	getCameraDist() {
		var tX;
		var tZ;
		try {
			[tX, tZ] = rotate(this.x, this.z, loadingMap.angle);
		} catch(error) {
			tX = this.x;
			tZ = this.z;
		}
		
		this.cDist = getCameraDist([[tX, this.y, tZ]]);
	}
}

//edit interface, allows for editing of objects in a map
class Editor {
	constructor() {
		this.active = false;
		this.occupies = 0;
		this.crInd = 0;
		this.createList = ["Cube", "Box", "PartialBox", "TiltedBox", "Wall", "Blocker"];
		this.obj;

		this.ncrmnt = 5;
	}

	tick() {
		if (this.occupies > loadingMap.contains.length - 1) {
			this.occupies = loadingMap.contains.length - 1;
		}
		this.obj = loadingMap.contains[this.occupies];
	}

	beDrawn() {
		ctx.strokeStyle = eHighlightColor;
		ctx.lineWidth = 4;
		this.obj.beDrawn();
		ctx.strokeStyle = lnColor;
		ctx.lineWidth = 2;

		ctx.fillStyle = textColor;
		ctx.font = "17px Century Gothic";
		let {x, y, z, rx, ry, rz} = this.obj;
		ctx.fillText("creation object: " + this.createList[this.crInd], canvas.width * 0.5, canvas.height * 0.85);
		ctx.fillText(`Selected object: ` + this.obj.constructor.name, canvas.width * 0.5, canvas.height * 0.89);
		ctx.fillText(`With coords (${x}, ${y}, ${z}) and radii (${rx}, ${ry}, ${rz})`, canvas.width * 0.5, canvas.height * 0.93)
		ctx.fillText("Currently in: " + loadingMap.name, canvas.width * 0.5, canvas.height * 0.97);

		//drawing border
		ctx.strokeStyle = "#F88";
		ctx.lineWidth = 20;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = lnColor;
		ctx.lineWidth = 2;
	}

	handleInput(u) {
		//switch statement for keys, (WASD ⇪⎇) controls position while (←↑→↓ :/)  controls size
		switch (u.keyCode) {
			//movement controls (WASD ⇪⎇)
			case 65:
				lEditor.obj.x -= lEditor.ncrmnt;
				break;
			case 87:
				lEditor.obj.z += lEditor.ncrmnt;
				break;
			case 68:
				lEditor.obj.x += lEditor.ncrmnt;
				break;
			case 83:
				lEditor.obj.z -= lEditor.ncrmnt;
				break;
			case 16:
				lEditor.obj.y -= lEditor.ncrmnt;
				break;
			case 18:
				lEditor.obj.y += lEditor.ncrmnt;
				break;
			
			//control, for finer editing
			case 17:
				if (lEditor.ncrmnt == 1) {
					lEditor.ncrmnt = 5;
				} else {
					lEditor.ncrmnt = 1;
				}
				lEditor.control = !lEditor.control;
				break;	
			
			//size controls (←↑→↓ '/)
			case 37:
				lEditor.obj.rx -= lEditor.ncrmnt;
				break;
			case 38:
				lEditor.obj.rz += lEditor.ncrmnt;
				break;
			case 39:
				lEditor.obj.rx += lEditor.ncrmnt;
				break;
			case 40:
				lEditor.obj.rz -= lEditor.ncrmnt;
				break;
			case 222:
				lEditor.obj.ry += lEditor.ncrmnt;
				break;
			case 191:
				lEditor.obj.ry -= lEditor.ncrmnt;
				break;

			
			//i, o, and backspace (i creates, o cycles, and backspace deletes the currently selected object)
			case 73:
				lEditor.createObj();
				break;
			case 79:
				lEditor.crInd += 1;
				if (lEditor.crInd > lEditor.createList.length - 1) {
					lEditor.crInd = 0;
				}
				break;
			case 8:
				lEditor.destroyObj();
				break;
			
			//j, k, m, and n, for tilt
			case 74:
				lEditor.obj.XYt += (lEditor.ncrmnt - 3) / 8;
				break;
			case 75:
				lEditor.obj.XZt += (lEditor.ncrmnt - 3) / 8;
				break;
			case 77:
				lEditor.obj.ZXt += (lEditor.ncrmnt - 3) / 8;
				break;
			case 78:
				lEditor.obj.ZYt += (lEditor.ncrmnt - 3) / 8;
				break;
			
			//the ] key
			case 221:
				lEditor.active = false;
				break;
			
			//cycling through which object to edit (- and +)
			case 187:
				lEditor.occupies += 1;
				if (lEditor.occupies > loadingMap.contains.length - 1) {
					lEditor.occupies = 0;
				}
				break;
			case 189:
				lEditor.occupies -= 1;
				if (lEditor.occupies < 0) {
					lEditor.occupies = loadingMap.contains.length - 1;
				}
				break;
			//space, switching editors
			case 32:
				lEditor = new CustomEditor();
				lEditor.active = true;
				lEditor.findCustom();
				break;		
		}

	}

	createObj() {
		let {createList, crInd} = this;
		//javascript constructors just ignore extra arguments passed in, which is great for me
		loadingMap.contains.push(eval(`new ` + this.createList[this.crInd] + `(0, 0, 0, 15, 15, 15, true, true, true, 0, 0, 0, 0)`));
	}

	destroyObj() {
		loadingMap.contains.splice(this.occupies, 1);
		if (this.occupies > loadingMap.contains.length - 1) {
			this.occupies -= 1;
		}
	}
}

//custom editor, for editing individual points/faces in a custom object
//switch statements galore, because I didn't feel like writing 3 seperate classes!
class CustomEditor {
	constructor() {
		this.active = false;
		this.occBody = 0;
		this.occFace = 0;
		this.occPoint = 0;
		this.occLevel = 0;
		this.obj;

		this.colorPart = 0;
		this.colorVals = "0123456789ABCDEF";

		this.ncrmnt = 5;
		this.aSpeed = 0;
	}

	tick() {
		loadingMap.angle += this.aSpeed;
		switch (this.occLevel) {
			case 0:
				this.obj = loadingMap.contains[this.occBody];
				break;
			case 1:
				this.obj = loadingMap.contains[this.occBody].data[this.occFace];
				break;
			case 2:
				this.obj = loadingMap.contains[this.occBody].data[this.occFace][this.occPoint];
				break;
			default:
				this.occLevel = 0;
				break;
		}
	}

	beDrawn() {
		/*this entire function is disgusting and I'm never looking at it ever again. 
		However, this will not be used in regular gameplay so I don't care enough to fix this.
		To anyone reading this, I am truly sorry. */
		//drawing border
		ctx.strokeStyle = "#00F";
		ctx.lineWidth = 20;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = eHighlightColor;
		ctx.lineWidth = 2;

		var text = "";
		var text2 = "";

		switch (this.occLevel) {
			case 0:
				//body mode
				ctx.lineWidth = 4;
				this.obj.beDrawn();
				ctx.lineWidth = 2;

				let {x, y, z} = this.obj;
				text += `Currently occupying custom object at`;
				text2 += `(${x}, ${y}, ${z})`;
				break;
			case 1:
				//face mode
				//not drawing the face object because those get reordered by the parent object

				//instead pulling the data from the parent object and reconstruct that into a drawable face
				//converting to string and then parsing to make a literal instead of a pointer
				var polyPoints = JSON.stringify(this.obj);
				polyPoints = JSON.parse(polyPoints);
				polyPoints.splice(polyPoints.length - 1, 1);

				var output = [];

				

				//converting 3d points to 2d
				for (var u=0;u<polyPoints.length;u++) {
					output.push(spaceToScreen([polyPoints[u][0] + loadingMap.contains[this.occBody].x, polyPoints[u][1] + loadingMap.contains[this.occBody].y, polyPoints[u][2] + loadingMap.contains[this.occBody].z]));
					text2 += `(${[polyPoints[u][0] + loadingMap.contains[this.occBody].x, polyPoints[u][1] + loadingMap.contains[this.occBody].y, polyPoints[u][2] + loadingMap.contains[this.occBody].z]}), `;
				}

				dPoly(output);
				ctx.stroke();

				//text stuffies
				var rText = "";
				var gText = "";
				var bText = "";

				if (this.colorPart == 0) {
					rText = "~";
				} 
				else if (this.colorPart == 1) {
					gText = "~";
				} else {
					bText = "~";
				}
				var colorText = `#${rText}${this.obj[this.obj.length-1][1]}${rText}${gText}${this.obj[this.obj.length-1][2]}${gText}${bText}${this.obj[this.obj.length-1][3]}${bText}`;
				text += `Currently editing face with color ${colorText} points at`;

				
				break;
			case 2:

			//point mode, can't draw point object for same reason, reordered by parent object
			//accounting for parent position
			var point = spaceToScreen([this.obj[0] + loadingMap.contains[this.occBody].x, this.obj[1] + loadingMap.contains[this.occBody].y, this.obj[2] + loadingMap.contains[this.occBody].z]);
			gPoint(point[0], point[1], 3);
			ctx.stroke();

			text += `Currently editing point at`;
			text2 += `(${[this.obj[0] + loadingMap.contains[this.occBody].x, this.obj[1] + loadingMap.contains[this.occBody].y, this.obj[2] + loadingMap.contains[this.occBody].z]})`;
			break;
		}

		//display text
		ctx.strokeStyle = lnColor;
		ctx.fillStyle = textColor;
		ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.9);
		ctx.fillText(text2, canvas.width * 0.5, canvas.height * 0.94);
	}

	findCustom() {
		//searches through all objects in the map for a custom object. If none are found, exit the custom editor
		var found = false;
		var c = 1;
		while (c < loadingMap.contains.length) {
			//going through each object in the map
			var toSearch = (this.occBody + c) % loadingMap.contains.length;

			//if it's a custom object, occupy it and cancel the loop
			if (loadingMap.contains[toSearch].constructor.name == "Custom") {
				found = true;
				this.occBody = toSearch;
				c = loadingMap.contains.length;
			}
			c++;
		}

		//convert editor back to regular mode
		if (!found) {
			lEditor = new Editor();
			lEditor.active = true;
			console.log("no custom objects found");
		}
	}

	levelCycle(value) {
		this.occLevel += value;

		if (this.occLevel > 2 || this.occLevel < 0) {
			if (this.occLevel > 2) {
				this.occLevel = 2;
			} else {
				this.occLevel = 0;
			}
		} 
	}

	occupyCycle(value) {
		switch (this.occLevel) {
			case 0:
				this.findCustom();
				break;
			case 1:
				this.occFace += value;
				if (this.occFace < 0) {
					this.occFace = loadingMap.contains[this.occBody].data.length - 1;
				}
				if (this.occFace > loadingMap.contains[this.occBody].data.length - 1) {
					this.occFace = 0;
				}
				break;
			case 2:
				this.occPoint += value;
				//accounting for out of bounds accesses
				if (this.occPoint < 0) {
					this.occPoint = loadingMap.contains[this.occBody].data[this.occFace].length - 2;
				}
				if (this.occPoint > loadingMap.contains[this.occBody].data[this.occFace].length - 2) {
					this.occPoint = 0;
				}
				break;
		}
	}

	colorCycle(value) {
		//changing the value of the currently selected color channel on the face only if in the face editor
		if (this.occLevel == 1) {
			//defining the string in question for easier reference
			var strong = this.obj[this.obj.length-1];
			//get the position in the color string/array tat the current color channel is in
			var pos = this.colorVals.indexOf(strong[this.colorPart + 1]);
			//increment it by the value
			pos += value;
			//keep pos in bounds
			if (pos > this.colorVals.length - 1) {
				pos = 0;
			}
			if (pos < 0) {
				pos = this.colorVals.length - 1;
			}
			//write new character to the color string
			var newString = strong.substr(0, this.colorPart + 1) + this.colorVals[pos] + strong.substr(this.colorPart + 2);

			//for some strange reason strong becomes a literal instead of a pointer, so I'm using the long form instead
			this.obj[this.obj.length-1] = newString;
		}
	}

	moveObj(x, y, z) {
		switch (this.occLevel) {
			case 0:
				this.obj.x += x;
				this.obj.y += y;
				this.obj.z += z;
				break;
			case 1:
				//the face case is special because unlike the body and the points, faces don't have a specific xyz. Faces are just collections of points.
				//moving all points in the face with a for loop
				for (var q=0;q<this.obj.length-1;q++) {
					this.obj[q][0] += x;
					this.obj[q][1] += y;
					this.obj[q][2] += z;
				}
				break;
			case 2:
				this.obj[0] += x;
				this.obj[1] += y;
				this.obj[2] += z;
				break;
		}
	}

	createObj() {
		switch (this.occLevel) {
			case 0:
				loadingMap.contains.push(new Custom(0, 0, 0, [[[0, 0, 15], [0, 0, 0], [15, 0, 0], "#F0F"]]));
				break;
			case 1:
				loadingMap.contains[this.occBody].data.push([[0, 0, 15], [0, 0, 0], [15, 0, 0], "#F0F"]);
				break;
			case 2:
				loadingMap.contains[this.occBody].data[this.occFace].splice(0, 0, [0, 0, 0]);
				break;
		}
	}

	destroyObj() {
		switch (this.occLevel) {
			case 0:
				loadingMap.contains.splice(this.occBody, 1);
				this.findCustom();
				break;
			case 1:
				loadingMap.contains[this.occBody].data.splice(this.occFace, 1);
				//if out of bounds after the removal, go to the last face available
				if (this.occFace > loadingMap.contains[this.occBody].data.length - 1) {
					this.occFace -= 1;
					//if still out of bounds, create a face
					if (this.occFace < 0) {
						this.createObj();
					}
				}
				break;
			case 2:
				loadingMap.contains[this.occBody].data[this.occFace].splice(this.occPoint, 1);
				//same out of bounds check as before
				if (this.occPoint > loadingMap.contains[this.occBody].data[this.occFace].length -2) {
					this.occPoint -= 1;
					if (this.occPoint < 0) {
						this.createObj();
					}
				}
				break;
		}
	}

	handleInput(u) {
		//switch statement for keys
		switch (u.keyCode) {
			//movement controls (WASD ⇪⎇)
			case 65:
				this.moveObj(-1 * this.ncrmnt, 0, 0);
				break;
			case 87:
				this.moveObj(0, 0, this.ncrmnt);
				break;
			case 68:
				this.moveObj(this.ncrmnt, 0, 0);
				break;
			case 83:
				this.moveObj(0, 0, -1 * this.ncrmnt);
				break;
			case 16:
				this.moveObj(0, -1 * this.ncrmnt, 0);
				break;
			case 18:
				this.moveObj(0, this.ncrmnt, 0);
				break;
			
			//z, x, and c for camera movement
			case 90:
				this.aSpeed += this.ncrmnt / 200;
				break;
			case 67:
				this.aSpeed = 0;
				loadingMap.angle = 0;
				break;
			case 88:
				this.aSpeed -= this.ncrmnt / 200;
				break;
			
			//control, for finer editing
			case 17:
				if (this.ncrmnt == 1) {
					this.ncrmnt = 5;
				} else {
					this.ncrmnt = 1;
				}
				this.control = !this.control;
				break;	
			//arrow keys for color editing
			case 37:
				if (this.colorPart > 0) {
					this.colorPart -= 1;
				}
				break;
			case 38:
				this.colorCycle(1);
				break;	
			case 39:
				if (this.colorPart < 2) {
					this.colorPart += 1;
				}
				break;
			case 40:
				this.colorCycle(-1);
				break;
			
			//i and backspace (i creates and backspace deletes the currently selected object)
			case 73:
				this.createObj();
				break;
			case 8:
				this.destroyObj();
				break;


			//the ] key
			case 221:
				lEditor.active = false;
				break;
			
			//cycling through which object to edit (- and +)
			case 187:
				this.occupyCycle(1);
				break;
			case 189:
				this.occupyCycle(-1);
				break;
			
			//cycling through which level to edit on. (⎋ / ⏎);
			case 27:
				this.levelCycle(-1);
				break;
			case 13:
				this.levelCycle(1);
				break;
			//space for switching to the regular editor
			case 32:
				lEditor = new Editor();
				lEditor.active = true;
				break;
		}
	}
}


//camera stores data about how to render things
class Camera extends Main {
    constructor(x, y, z, scale) {
        super(x, y, z);

		this.scale = scale;
		this.vertical = false;
	}
	
	getCameraDist() {
		
	}
}