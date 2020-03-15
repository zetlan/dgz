window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);
//setting up variables for later
var canvas;
var ctx;
var cornerCoords = [0, 0, 0, 0];


var nextMap = 0.1;
var mapPallete = 1;
var arrayValue;
var centerX;
var centerY;

//player attributes, the ship version has been moved to the class but this is for the in-ship conrols
var cx = 0;
var cy = 0;
var constrainC = [false, false];

//all inventory things
var inventoryPhase = 0;
var inventoryRange = [0, 3];
var inSize = 17;

var invenScPos = [0.1, 0.1, 0.9, 0.8];

/*invenItems and invenEquipped are draw arrays, and they call to the inventory array.
The inventory array has all the items, invenItems and invenEquipped just 
refer to that so the items can be drawn. -1 means no item is there. */
var invenItems = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];
var invenEquipped = [-1, -1, -1, -1, -1, -1];

var stats = [[1],
             [1],
             [1]];

//attack variables
var attackSpeed = 20;
var attackFrame = 0;
var boxSize = 20;
var numOfBoxes = 10;

var timer;
var time = -1;
var dayLength = 12500;

var gameState = -1;
var yes = 0;
var cutsceneTime = 50;
var numPressed = -1;
var timeOfLastPress = [0, 0, 0, 0];
var dashTime = 6;
var dashMult = 12;

var menuPos = 0.8;
var menuBarStart = 0.35;
var menuBarHeight = 0.025;
var shaderOpacity = 0;
var loadingMap = home;

//the greater dt is, the slower the game is.
var dt = 1;
var dtBase = dt;
var dtMult = 8;
var frameTime = 15;

var text = " ";



//classes exist here, oh boy!
let bh;
let character;
let marker;
let textHolder;
let enemies = [];
let statics = [];
let inventory = [];
let quests = [];

//questListener is a class, but not an entity.
class QuestListener {
  constructor() {
    this.collectQuest = false;
    this.slayQuest = false;
    this.talkQuest = false;
  }

  update() {
    this.collectQuest = false;
    this.slayQuest = false;
    this.talkQuest = false;

    for (var ty=0;ty<quests.length;ty++) {
      if (quests[ty] instanceof CollectQuest) {
        this.collectQuest = true;
      }
      if (quests[ty] instanceof SlayQuest) {
        this.slayQuest = true;
      }
    }
  }
}

//The player is an entity, but goes here because it's special.
class Player {

  constructor(x, y) {
    //ax and ay are acceleration, and change dx/dy. Dx/dy are the ones that change the player's position. This system allows for a more realistic feel, as the player cannot "jump" from 1 direction to the other
    this.x = x;
    this.y = y;
    this.lEX = x;
    this.lEY = y;
    this.r = 10;
    this.dx = 0;
    this.dy = 0;
    this.ax = 0;
    this.ay = 0;
    this.speed = entitySpeed;
    this.talking = false;
    this.attackFrame = 0;
    this.tSinAtt = attackSpeed;

    this.transfer = 0;
    this.onSquare = 0;
    this.direction = 0;

    this.h = 10;
    this.mh = this.h;
    this.s = 10;
    this.ms = this.s;
    this.xp = 0;
    this.maxXp = 10;
    this.level = 1;
    this.points = 1;

    //other player attributes
  }

  beDrawn() {
    if (this.h <= 0) {
        ctx.globalAlpha = 0.2;
    }
    //drawing sword, starts to the left
    var swordStartX = (this.r) * Math.sin(this.direction + (Math.PI * 0.3));
    var swordStartY = (this.r) * Math.cos(this.direction + (Math.PI * 0.3));

    //if the player is in the latter part of the attack, the sword ends in a different spot.
    var swordEndX;
    var swordEndY;

    var eyeStartX;
    var eyeStartY;

    var eyeEndX;
    var eyeEndY;
    //sword and eye positions change based on attack frame
    if (this.attackFrame < 3) {
      //if not attacking, draw the sword to the left of the player
      swordEndX = (this.r * 2) * Math.sin(this.direction + (Math.PI * 0.6));
      swordEndY = (this.r * 2) * Math.cos(this.direction + (Math.PI * 0.6));

      eyeStartX = (this.r*0.5) * Math.sin(this.direction + (Math.PI * 0.2));
      eyeStartY = (this.r*0.5) * Math.cos(this.direction + (Math.PI * 0.2));

      eyeEndX = (this.r*0.5) * Math.sin(this.direction - (Math.PI * 0.2));
      eyeEndY = (this.r*0.5) * Math.cos(this.direction - (Math.PI * 0.2));
    } else if (this.attackFrame >= attackSpeed - 15) {
      //if in the ending portion of attack, have the sword offset by about 130 degrees
      var mult = 0.65 + ((attackSpeed / this.attackFrame) * -0.1);
      swordEndX = (this.r * 2) * Math.sin(this.direction - (Math.PI * mult));
      swordEndY = (this.r * 2) * Math.cos(this.direction - (Math.PI * mult));

      //eyes are offset by about 20 degrees
      eyeStartX = (this.r*0.5) * Math.sin(this.direction + (Math.PI * 0.1));
      eyeStartY = (this.r*0.5) * Math.cos(this.direction + (Math.PI * 0.1));

      eyeEndX = (this.r*0.5) * Math.sin(this.direction - (Math.PI * 0.3));
      eyeEndY = (this.r*0.5) * Math.cos(this.direction - (Math.PI * 0.3));
    } else {
      //if in the middle of the attack, do not draw the sword
      swordEndX = 0;
      swordEndY = 0;

      //eyes drawn about 10 degrees
      eyeStartX = (this.r*0.5) * Math.sin(this.direction + (Math.PI * 0.15));
      eyeStartY = (this.r*0.5) * Math.cos(this.direction + (Math.PI * 0.15));

      eyeEndX = (this.r*0.5) * Math.sin(this.direction - (Math.PI * 0.25));
      eyeEndY = (this.r*0.5) * Math.cos(this.direction - (Math.PI * 0.25));
    }
    
    var swordPos1 = [(this.x - cx) + swordStartX, (this.y - cy) + swordStartY];
    var swordPos2 = [(this.x - cx) + swordEndX, (this.y - cy) + swordEndY];
    
    var eyePos1 = [(this.x - cx) + eyeStartX, (this.y - cy) + eyeStartY];
    var eyePos2 = [(this.x - cx) + eyeEndX, (this.y - cy) + eyeEndY];

    ctx.beginPath();
    ctx.strokeStyle = swordColor;
    ctx.lineWidth = "3";
    ctx.moveTo(swordPos1[0], swordPos1[1]);
    ctx.lineTo(swordPos2[0], swordPos2[1]);
    ctx.stroke();

    //main character circle
    ctx.fillStyle = characterColor;
    ctx.beginPath();
    ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = swordColor;
    ctx.fillRect(eyePos1[0], eyePos1[1], 2, 2);

    ctx.fillStyle = swordColor;
    ctx.fillRect(eyePos2[0], eyePos2[1], 2, 2);
    if (this.h <= 0) {
        ctx.globalAlpha = 1;
    }
  }

  tick() {
    //velocity things
    //getting the square the player is on
    try {
      this.onSquare = loadingMap.data[Math.floor((this.y) / squareSize)][Math.floor((this.x) / squareSize)];
    }
    catch (error) {
      this.onSquare = "/";
    }

    //if the character is on a valid square
    if (this.onSquare != "/" && this.onSquare != undefined) {
      //if the square is a regular terrain block, then set the value of the loadingMap to that exit area.
      if (String(this.onSquare).match(/^\d/)) {
        nextMap = this.onSquare;
        if (shaderOpacity > 0) {
          shaderOpacity -= 0.125;
        }
        if (this.onSquare != "0") {
            this.lEX = this.x;
            this.lEY = this.y;
        }
      } else {
        shaderOpacity = 0;
      }
      
      //actual movement, but first attacking
      if (this.attackFrame > 0 && this.h > 0) {
        this.attack(1, squareSize);
        //if the player is attacking, automatically have them stop
        this.dx = handleVelocity(0, this.dx, this.speed);
        this.dy = handleVelocity(0, this.dy, this.speed);
      } else if (this.talking == false) {
        //updating velocity
        this.dx = handleVelocity(this.ax, this.dx, this.speed);
        this.dy = handleVelocity(this.ay, this.dy, this.speed);
      }
      //let the player go outside of the map if nextMap is not 0 (the same map)
      if (nextMap != 0) {
        this.x = checkCollision(this.x, this.y, this.dx, 0, 0);
        this.y = checkCollision(this.x, this.y, this.dy, 1, 0);
      } else {
        this.x = checkCollision(this.x, this.y, this.dx, 0, 1);
        this.y = checkCollision(this.x, this.y, this.dy, 1, 1);
      }
      //if the player is on an undefined square, set their transfer to 1.
    } else {
      shaderOpacity += 0.0125
      this.transfer = 1;
      dt = 10000;
    }

    //if the player is set to transfer, then attempt to transfer maps
    if (this.transfer == 1 && shaderOpacity >= 1) {
      this.transferMap();
    }


    //health and other combat
    //if alive and less than max health, regenerate health
    if (this.h > 0 && this.h < this.mh) {
      this.h += (Math.abs(Math.sin(time / 90)) / 270) / dt;
      if (this.h > this.mh) {
        this.h = this.mh;
      }
    }
    //if alive and less than max sp, regenerate sp
    if (this.h > 0 &&this.s < this.ms) {
      this.s += (Math.abs(Math.sin(time / 90)) / 180) / dt;
      if (this.s > this.ms) {
        this.s = this.ms;
      }
    }

    //setting direction, I split the if into two ifs because the 1 large if was being funky.
    if (this.talking == false && this.attackFrame == 0 && this.h > 0) {
      if (this.ax != 0 || this.ay != 0) {
        this.direction = Math.atan2(this.dx, this.dy);
      }
    }

    //if the player's health is too low, run the die function.
    if (this.h <= 0) {
        this.die();
    }
  }

  attack(power, range) {
    //increment frames
    this.attackFrame += 1;
    this.tSinAtt += 1;
    //only attack if the player isn't talking
    if (this.talking == false) {
      //turn the direction into an xy offset for the center of the hurt box
      var xOff = (range / numOfBoxes) * Math.sin(this.direction);
      var yOff = (range / numOfBoxes) * Math.cos(this.direction);

      var boxX;
      var boxY;

      var tempBoxSize = boxSize;

      var xDist;
      var yDist;
    
      //loop through all the boxes
      ctx.globalAlpha = 0.2;
      for (var b=0;b<numOfBoxes;b++) {
        boxX = this.x + (xOff * b);
        boxY = this.y + (yOff * b);
        //loop through all the enemies.
        // if they're inside the box and it's frame 3, make them take damage
        for (var en=0;en<loadingMap.enemies.length;en++) {
          xDist = Math.abs(loadingMap.enemies[en].x - boxX);
          yDist = Math.abs(loadingMap.enemies[en].y - boxY);

          if (xDist < tempBoxSize && yDist < tempBoxSize && this.attackFrame == 3) {
            //only attack if it's an enemy
            if (loadingMap.enemies[en] instanceof Enemy) {
              
              /*strength is a measure of power for different things. 
              It is a random value between 0.3 and 1.3 multiplied by a 
              sigmoid of the time since the player last pressed the z button. 
              This is then added to the base power/push of the attack.*/
              var strength = (0.8 + (Math.random() - 0.5)) * sigmoid(this.tSinAtt - 7, 0, 1);
              loadingMap.enemies[en].wasHit = power * strength;
              loadingMap.enemies[en].dx = xOff * strength;
              loadingMap.enemies[en].dy = yOff * strength;
            } else {
                this.talking = true;
                loadingMap.enemies[en].talking = true;
                this.attackFrame = 0;
            }
          } else if (this.attackFrame == 4) {
            //after doing calculations, the number gets reset
            this.tSinAtt = 0;
          }
        }

        //draw the boxes
        if (this.attackFrame > 3 && this.attackFrame < attackSpeed - 15) {
          ctx.beginPath();
          ctx.fillStyle = hyperColor;
          ctx.ellipse((boxX) - cx, (boxY) - cy, tempBoxSize, tempBoxSize, 0, 0, Math.PI * 2);
          ctx.fill();

          //every box gets slightly smaller
          tempBoxSize *= 0.95;
        }
      }
      ctx.globalAlpha = 1;
    }
    

    //exit when the attack has gotten too long
    if (this.attackFrame > attackSpeed) {
      this.attackFrame = 0;
    }
  }

  transferMap() {
    this.transfer = 0;
    dt = dtBase;
    //figure out the next map based on the current map's values
    //nextMap is a value that points to the map encoded in the current map, if it's zero that means the player entered incorrectly and should not be like that.
    if (nextMap != 0) {
        loadingMap.exits[nextMap-1].run();
    }
  }

  levelUp() {
    this.level += 1;
    this.xp -= this.maxXp;
    this.maxXp *= 1.5;
    this.points += 3;
  }

  die() {
    //increase dt
    dt *= 1.1;
    //after a certain time has passed draw the revive menu
    if (dt > dtBase * 100) {
        
        ctx.beginPath();
        ctx.fillStyle = inventoryColor;
        ctx.fillRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8);
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.font = "30px Century Gothic";
        ctx.fillText("You Died", canvas.width * 0.5, canvas.height * 0.3);
        ctx.font = "20px Century Gothic";
        ctx.fillText("Click Z to be revived at the start of the room", canvas.width * 0.5, canvas.height * 0.5);
        ctx.fillText("with a penalty (-xp 20%)", canvas.width * 0.5, canvas.height * 0.55);
    }
  }
}

window.onload = setup;
// the initializing function.
function setup() {
  setInterval(main, frameTime);
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  centerX = canvas.width / 2;
  centerY = canvas.height / 2;

  character = new Player((loadingMap.data[0].length / 2) * squareSize, (loadingMap.data.length / 2) * squareSize);
  marker = new Marker(0, -2);
  textHolder = new Text();
  constrainC[0] = loadingMap.data[0].length * squareSize > canvas.width;
  constrainC[1] = loadingMap.data.length * squareSize > canvas.height * menuPos;
}

function keyPress(h) {
    switch (h.keyCode) { 
      //arrow keys + WASD
    case 65:
          case 37:
      //in inventory
      if (gameState == 2) {
        if (marker.y == -2) {
          inventoryPhase -= 1;
        } else {
          marker.validatePosition(-1, 0);
        }
      } else {
        //in main game
        character.ax = -0.25 * entitySpeed;
        //dashing
        character.dx = handleDashing(false, 0, false, character.dx);
      }
          break;
    case 87:
    case 38: 
      //inventory
      if (gameState == 2) {
        if (marker.y != -2) {
          marker.validatePosition(0, -1);
        }
      } else {
        //main
        character.ay = -0.25 * entitySpeed;
        //dashing
        character.dy = handleDashing(false, 1, false, character.dy);
      }
      break;
    case 68:
    case 39:
        character.ax = 0.25 * entitySpeed;
      //inventory
      if (gameState == 2) {
        if (marker.y == -2) {
          inventoryPhase += 1;
        } else {
          marker.validatePosition(1, 0);
        }
      } else {
        character.ax = 0.25 * entitySpeed;
        //dashing
        character.dx = handleDashing(false, 2, true, character.dx);
      }
        break;
    case 83:
    case 40:
      //inventory
      if (gameState == 2) {
        marker.validatePosition(0, 1);
      } else {
        character.ay = 0.25 * entitySpeed;
        //dashing
        character.dy = handleDashing(false, 3, true, character.dy);
      }
      break;
    //numbers for inventory selection
    case 49:
    case 50:
    case 51:
      numPressed = h.keyCode - 48;
      break;

    //special operations
    //space
    case 32:
      if (dt == dtBase) {
        dt = dtBase * dtMult;
        gameState = 2;
      }
      break;
    //escape
    case 27:
      break;
    //z
    case 90:
      if (gameState < 0) {
        gameState = 1;
      } 
      if (gameState > 0) {
        interact();
      }
      break;
      //x
      case 88:
        if (gameState == 0) {
          time = 6;
        }
        break;
      }
}
//movement negating. Not much to say here.
function keyNegate(h) {
    switch (h.keyCode) {
    case 65:
    case 37:
      if (gameState == 1) {
        if (character.ax < 0) {
          character.ax = 0;
        }
        handleDashing(true, 0);
      }
      break;
    case 87:
    case 38:
      if (gameState == 1) {
        if (character.ay < 0) {
          character.ay = 0;
        }
        handleDashing(true, 1);
      }
      
      break;
    case 68:
    case 39:
      if (gameState == 1) {
        if (character.ax > 0) {
          character.ax = 0;
        }
        handleDashing(true, 2);
      }
      break;
    case 83:
    case 40:
      if (gameState == 1) {
        if (character.ay > 0) {
          character.ay = 0;
        }
        handleDashing(true, 3);
      }
      
      break;
    case 32:
      if (dt == dtBase * dtMult) {
        dt = dtBase;
        gameState = 1;
        inventoryPos = [0, 0];
      }
      break;
      }
}

function handleDashing(negatingBOOLEAN, arrayNumber, positiveBOOLEAN, velVar) {
  if (negatingBOOLEAN) {
    //for first press
    if (timeOfLastPress[arrayNumber] != -100) {
      timeOfLastPress[arrayNumber] = time;
    } else {
      timeOfLastPress[arrayNumber] = -99;
    }
  } else {
    //for second press, actual dashing logic
    if (time - timeOfLastPress[arrayNumber] <= dashTime && character.s > character.ms * 0.1) {
      //make the negating happen and remove stamina
      timeOfLastPress[arrayNumber] = -100; 
      character.s -= character.ms * 0.1;
      //update velocity
      if (positiveBOOLEAN) {
        return dashMult;
      } else {
        return -1 * dashMult;
      }
    } else {
      //fallback in case the second press condition does not apply
      return velVar;
    }
  }
}

//this function is the main function that repeats every time the timer goes off. It is very important.
function main() {
    //gamestate -1 is just the splash screen. As such it is entirely text.
  if (gameState == -1) {
    ctx.fillStyle = menuColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.font = "45px Century Gothic";
    ctx.fillText(menuText[0], centerX - 5, 50);
    ctx.font = "30px Century Gothic";
    ctx.fillText(menuText[1], centerX, centerY);
  }

  if (gameState == 0) {
    //always sanitize input
    time = Math.round(time);
    if (time > 5 && time < 10) {
      time = 0;
      gameState = 1;
    } else {
      var effectiveTime;
      //effectiveTime changes between pre-game and post-game, so that's here.
      if (time < 7) {
        effectiveTime = time;
      } else if (time >= 10){
        effectiveTime = time - 4;
      }

      //displaying images
      var toDisplay = new Image();
      toDisplay.src = images[effectiveTime];
      ctx.drawImage(toDisplay, 0, 0, canvas.width, canvas.height);

      //displaying text
      ctx.textAlign = "center";
      ctx.font = "20px Century Gothic";
      for (tx=0;tx<texts[effectiveTime].length;tx++) {
        ctx.fillText(texts[effectiveTime][tx], centerX, canvas.height * (0.84 + (tx * 0.0625)));
      }
    }
  }
  
  if (gameState > 0) {

    //handling camera
    if (gameState == 1) {
      
      cx = character.x - centerX;
      cy = character.y - centerY;

      //if the map is large enough, make sure the camera is in bounds
      if (constrainC[0] == true) {
        //making sure the camera is in bounds
        if (cx < 0) {
          cx = 0;
        } else if (cx + canvas.width > loadingMap.data[0].length * squareSize) {
          cx = (loadingMap.data[0].length * squareSize) - canvas.width;
        }
      }

      if (constrainC[1] == true) {
        if (cy < 0) {
          cy = 0;
        } else if (cy + (canvas.height * menuPos) > loadingMap.data.length * squareSize) {
          cy = (loadingMap.data.length * squareSize) - (canvas.height * menuPos);
        }
      }
    }
     
    //things that happen regardless of gameState
    time += 1 / dt;

    //drawing everything, map first
    drawMap();

    //ticking everything
    var done = false;
    //entities
    var talkingTo = [];
    for (var u=0;u<loadingMap.enemies.length;u++) {
      loadingMap.enemies[u].beDrawn();
      //only tick enemies if they're alive
      if (loadingMap.enemies[u].alive >= 1) {
        loadingMap.enemies[u].tick();
        //if the entity is talking, append it to the talking array
        if (loadingMap.enemies[u].talking) {
          talkingTo.push(u);
        }
      } else {
        loadingMap.enemies[u].alive += 1 / dt;

        //if the dead enemy is a projectile, destroy it
        if (loadingMap.enemies[u].constructor.name == "Projectile") {
            loadingMap.enemies.splice(u, 1);
        }
      }
      

      //enemies can collide with eachother, but only one enemy per frame
      //there is another safety check to make sure that the entity still exists
      if (!done && u < loadingMap.enemies.length) {
        var toPush = Math.floor(Math.random() * (loadingMap.enemies.length));
        //can't collide with projectiles or yourself
        if (toPush != u && loadingMap.enemies[toPush].constructor.name != "Projectile") {
          //colliding
          loadingMap.enemies[u].collide(loadingMap.enemies[toPush]); 
          done = true;
        }
      }
    }
    character.beDrawn();

    //static objects
    for (var u=0;u<loadingMap.statics.length;u++) {
        loadingMap.statics[u].beDrawn();
        loadingMap.statics[u].tick();
    }
    //drawing inventory
    if (gameState == 2) {
      character.ax = 0;
      character.ay = 0;
      character.dx = 0;
      character.dy = 0;

      drawInventory();
    }
    //menu gets drawn second to last so that entities go under it.
	drawMenu();
	
	//conversations handled last so that they're on top of everything
	if (talkingTo.length > 0) {
		//if more than one entity is talking, remove talking flags until only one is
		if (talkingTo.length > 1) {
			while (talkingTo.length > 1) {
				//removing the talking flag from the entity
				loadingMap.enemies[talkingTo[talkingTo.length-1]].talking = false;
				//removing the entity from the array
				talkingTo.splice(talkingTo.length-1, 1);
			}
		}
		//drawing conversation
		loadingMap.enemies[talkingTo[0]].converse();
	}
    //character gets ticked after all drawing/everything else happens so that their movement does not go in between drawing, causing stutter or other issues
    character.tick();
  }
}

function drawMap() {
  //drawing background
  ctx.fillStyle = spaceColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //to prevent ugly lines from appearing in the map, the coordinates are rounded to the pixel
  cornerCoords[0] = Math.round(cx) - squareSize;
  cornerCoords[1] = Math.round(cy) - squareSize;
  cornerCoords[2] = Math.round(cx) + canvas.width + squareSize;
  cornerCoords[3] = Math.round(cy) + (canvas.height * menuPos) + squareSize;
  var mapCounter = 0;
  var theColor;
  
  var xSquare = Math.round(character.x) / squareSize;
  var ySquare = Math.round(character.y) / squareSize;
  
  /*This is the part that draws the map. It uses two while loops, one for y and one for x. */
  var row = cornerCoords[1] / squareSize;
  var mapRow = 0 - (row - Math.floor(row));
  var counter = 0;
  
  while (row * squareSize < cornerCoords[3]) {    
      counter = cornerCoords[0] / squareSize;
      mapCounter = 0 - (counter - Math.floor(counter));
      while (counter * squareSize < cornerCoords[2]) {
        //this line determines what square to load in. For the rows, it uses counter, and for the number of rows it uses row. The floor and absolute value operations are just to turn the players square coordinates into something that the array can understand.
        var value;
      try {
        value = loadingMap.data[(Math.floor(row))][Math.floor(counter)];
      } 
      catch (error) {
        value = "/";
      }
      //different textures are drawn based on the pallete
      switch (loadingMap.pallete) {
        case 1:
            palleteOneSquare(value, (mapCounter * squareSize) - squareSize, (mapRow * squareSize) - squareSize);
            break;
        case 2:
            palleteTwoSquare(value, (mapCounter * squareSize) - squareSize, (mapRow * squareSize) - squareSize);
            break;
        case 3:
            palleteThreeSquare(value, (mapCounter * squareSize) - squareSize, (mapRow * squareSize) - squareSize);
            break;
        case 4:
            palleteFourSquare(value, (mapCounter * squareSize) - squareSize, (mapRow * squareSize) - squareSize);
            break;
      }  
      counter = counter + 1;
      mapCounter = mapCounter + 1;
    }
    row = row + 1;
    mapRow = mapRow + 1;
  }
}

function drawMenu() {
  //main box
  ctx.fillStyle = menuColor;
  ctx.fillRect(0, canvas.height * menuPos, canvas.width, canvas.height * (1 - menuPos));

  //health
  drawMeter(canvas.width * menuBarStart, canvas.height * (1 - (menuPos * menuBarHeight * 5.5)), canvas.width * 0.5, canvas.height * menuBarHeight, character.h, 0, character.mh, healthColor);
  
  //sp
  drawMeter(canvas.width * menuBarStart, canvas.height * (1 - (menuPos * menuBarHeight * 3.75)), canvas.width * 0.5, canvas.height * menuBarHeight, character.s, 0, character.ms, spColor);

  //xp
  drawMeter(canvas.width * menuBarStart, canvas.height * (1 - (menuPos * menuBarHeight * 2)), canvas.width * 0.5, canvas.height * menuBarHeight, character.xp, 0, character.maxXp, xpColor);

  //text
  var dayPercent = time % dayLength / dayLength;
  var hour = Math.floor(dayPercent * 24);
  var minute = Math.floor(((dayPercent * 24) - hour) * 60);

  ctx.font = "20px Century Gothic";
  ctx.textAlign = "left";
  ctx.fillStyle = textColor;
  if (minute < 10) {
      ctx.fillText("it is " + hour + ":0" + minute, 15, canvas.height * 0.95);
  } else {
      ctx.fillText("it is " + hour + ":" + minute, 15, canvas.height * 0.95);
  } 

  //shader for between levels
  if (shaderOpacity > 1) {
    shaderOpacity = 1;
  }
  ctx.globalAlpha = shaderOpacity;
  ctx.fillStyle = blackColor;
  ctx.beginPath();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
}

function drawInventory() {
  //inventory background
  ctx.fillStyle = inventoryColor;
  ctx.fillRect(canvas.width * invenScPos[0], canvas.height * invenScPos[1], canvas.width * (invenScPos[2] - invenScPos[0]), canvas.height * (invenScPos[3] - invenScPos[1]));

  var totalRange = inventoryRange[1] - (inventoryRange[0]-1);
  var totalXRange = invenScPos[2] - invenScPos[0];
  var xPos = invenScPos[0] + 0.04;
  

  //phase markers at top of screen
  for (var n=0;n<totalRange;n++) {
    if (n == inventoryPhase) {
      ctx.fillStyle = inventoryHighlightColor2;
    } else {
      ctx.fillStyle = inventoryHighlightColor1;
    }
    //boxes
    ctx.fillRect((canvas.width * xPos) + (n*(canvas.width*totalXRange/(totalRange+0.2))), canvas.height * 0.15, (canvas.width*totalXRange/totalRange) * 0.7, 30);

    //text
    ctx.fillStyle = spaceColor;
    ctx.fillText(invenText[0][n], (canvas.width * (xPos+0.025)) + (n*(canvas.width*totalXRange/(totalRange+0.2))), canvas.height * 0.2);
  }
  //handling all items in inventory that haven't been handled yet
  for (var t=0;t<inventory.length;t++) {
    if (inventory[t].handled == false) {
      inventory[t].handled = true;
      inventory[t].goToDrawArray(t);
    }
  }

  //drawing different things for each phase
  var drawX;
  var drawY;
  switch (inventoryPhase) {
    case 0:
      //stats
      for (var st=0;st<stats.length;st++) {
        drawX = canvas.width * 0.5;
        drawY = (canvas.height * (invenScPos[1]+0.3)) + (st * 40);

        //text
        ctx.fillStyle = textColor;
        ctx.fillText(invenText[inventoryPhase+1][st], drawX-20, drawY);
        ctx.fillText(stats[st][0], drawX+20, drawY);
      }
      break;
    case 1:
      //inventory items
      //drawing all inventory boxes
      ctx.fillStyle = spaceColor;
      for (var hi=0;hi<invenItems.length;hi++) {
        for (var wi=0;wi<invenItems[0].length;wi++) {
          //drawing a box
          drawX = (canvas.width * (invenScPos[0]+0.09)) + (wi * 40);
          drawY = (canvas.height * (invenScPos[1]+0.38)) + (hi * 40);
          ctx.moveTo(drawX, drawY);
          drawOct(drawX, drawY, inSize, true);
        }
      }
      //drawing equipped boxes 
      for (var wi=0;wi<invenEquipped.length;wi++) {
        //drawing a box
        drawX = ((canvas.width * 0.5) - (invenEquipped.length * 16.5)) + (wi * 40);
        drawY = canvas.height * (invenScPos[1]+0.2);
        ctx.moveTo(drawX, drawY);
        drawOct(drawX, drawY, inSize, true);
      }

      //drawing all items
      for (var d=0;d<inventory.length;d++) {
        inventory[d].beDrawn();
      }
      break;
    case 2:
      //quests
      for (var qo=0;qo<3;qo++) {
        //drawing 1 quest box
        
        drawX = (canvas.width * (invenScPos[0]+0.09));
        drawY = (canvas.height * (invenScPos[1]+0.38)) + (qo * 40);

        ctx.fillStyle = spaceColor;
        ctx.fillRect(drawX, drawY, canvas.width * 0.5, 30);

        if (qo<quests.length) {
          eval(quests[qo]).beDrawn(drawX, drawY+23);
        }
      }
      break;
    }
  //drawing marker
  marker.beDrawn();
  marker.tick();

  //adjust inventory phase to be within range
  if (inventoryPhase < inventoryRange[0]) {
    inventoryPhase = inventoryRange[1];
  }
  if (inventoryPhase > inventoryRange[1]) {
    inventoryPhase = inventoryRange[0];
  }
}

function checkCollision(xVar, yVar, velocity, toChange, constrain) {
  //checkCollision only does 1 direction at a time to save space.

  var arrayValue;
  //modifying coordinates
  if (toChange == 0) {
    xVar += velocity / dt;
  } else {
    yVar += velocity / dt;
  }

  //getting the value of the current square
  try {
    arrayValue = loadingMap.data[Math.floor((yVar) / squareSize)][Math.floor((xVar) /  squareSize)];
  }
  catch (error) {
    arrayValue = "/";
  }

  var ground = String(arrayValue).match(/^\d/);
  var problem = 0;
  //if the player passes any of the checks in the following code, there is a problem with the position and the change should be reversed.

  //start by saying all spaces are problem spaces except for ground
  if (!ground) {
    problem = 1;
  }
  
  /*check the exception surfaces list. If the block matches an exception, 
  the entity can walk on it. */
  try {
    arrayValue.startsWith(3);
  } catch (error) {
    arrayValue = "/"
  }
  
  for (var l=0; l<exceptSurfaces.length; l++) {
      if (arrayValue.startsWith(exceptSurfaces[l])) {
        problem = 0;
      }
  }

  //checking the constrain surfaces, If the block matches that, the entity cannot walk on it.
  if (constrain) {
    for (var l=0; l<constrainSurfaces.length; l++) {
        if (arrayValue.startsWith(constrainSurfaces[l])) {
        problem = 1;
        }
    }
  }
  //if the player is not on a ground block, set problem to 1
  //changing the variables back if there is a problem
  if (problem == 1) {
    if (toChange == 0) {
      xVar -= velocity / dt;
    } else {
      yVar -= velocity / dt;
    }
  }

  if (toChange == 0) {
    return xVar;
  } else {
    return yVar;
  }
}

function interact() {
	//revive
  	if (character.h < 0 && dt > dtBase * 100) {
    	//restoring character to normal stats
    	dt = dtBase;
    	character.h = character.mh;
    	character.s = character.ms;
    	//penalties
    	character.xp *= 0.8;
    	character.x = character.lEX;
    	character.y = character.lEY;

      	//returning true so the rest of the function does not occur
      	return true;
  	}
  	//attack
  	if (character.talking == false && gameState != 2) {
      	if (character.attackFrame == 0) {
        	character.attackFrame = 1;
      	} else {
    		//log if the player tried to attack while attacking
        	character.tSinAtt = 0;
    	}
  	}
}

//helper functions, names should explain themselves
function sigmoid(input, lowerBound, upperBound) {
  //un-adjusted value is between 0 and 1
  var gottenValue = 1 / (1+Math.pow(Math.E, -input));

  // adjusts to be within the range
  var range = upperBound - lowerBound;
  gottenValue += lowerBound;
  gottenValue *= range;

  return gottenValue;
}

function drawOct(xCenter, yCenter, radius, fill) {
  ctx.beginPath();
  for (var an=0;an<9;an++) {
    var trueAngle = ((an/8) * (Math.PI * 2)) + (Math.PI / 8);
    var xAdd = radius * Math.sin(trueAngle);
    var yAdd = radius * Math.cos(trueAngle);
    ctx.lineTo(xCenter + xAdd, yCenter + yAdd)
  }
  if (fill) {
    ctx.fill();
  } else {
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}