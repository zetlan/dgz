var turnSpeed;
var entitySpeed = 3;
var enemyFollowRange = [5, 1];
var enemyHitTime = 50;
/*I used to think that inheritance was impossible in javascript. Now I know better! 
It was a bit of a hassle to change the system after I learned new info, but it worked 
out in the end. Main is the super class, which is divided into enemy and friend. 
Enemy is the super class for all monsters, while friend is the super class for all NPCs. */


/*handleVelocity exists outside of the main class because I didn't know how to pass multiple different 
this. variables through a function inside the class. */

function handleVelocity(acc, vel, speed) {
  //handling velocity
  vel += acc / dt;

  //when acceleration is 0, it slows down velocity
  if (acc == 0) {
    change = 0.15 / dt;
    vel *= (1 - change);
  } 

  //if the speed is greater than the limit, split into pos and neg, then reduce speed
  if (Math.abs(vel) > speed) {
    if (vel > speed) {
      vel *= 0.8;
    } else {
      vel *= 0.8;
    }
  }
  //return the new velocity
  return vel;
}

class Main {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.ax = 0;
    this.ay = 0;

    this.direction = 0;
    this.minDist = 0.5 * squareSize;
    this.maxDist = 5 * squareSize;

    this.color = enemyColor;
    this.r = size;
    this.speed = entitySpeed / (this.r * 0.25);

    this.wasHit = 0;

    this.pathPhase = 0;
    this.xPD;
    this.yPD;
    this.distToPlayer;
    this.hitTime = 0;
    this.alive = 1;
  }

  beDrawn() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r, this.direction * -1, 0, Math.PI * 2)
    ctx.fill();
  }

  tick() {
    //getting pythagorean distance to player
    this.xPD = this.x - character.x;
    this.yPD = this.y - character.y;
    this.distToPlayer = Math.sqrt((this.xPD * this.xPD) + (this.yPD * this.yPD));

    //updating velocity
    this.dx = handleVelocity(this.ax, this.dx, this.speed);
    this.dy = handleVelocity(this.ay, this.dy, this.speed);
    
    //updating position
    this.x = checkCollision(this.x, this.y, this.dx, 0, 1);
    this.y = checkCollision(this.x, this.y, this.dy, 1, 1);
  }

  collide(entity) {
    var xOffset = this.x - entity.x;
    var yOffset = this.y - entity.y;

    if (Math.abs(xOffset) < this.r * 1.5 && Math.abs(yOffset) < this.r * 1.5) {
      var angle = Math.atan2(xOffset, yOffset) + Math.PI;
      entity.dx = Math.sin(angle);
      entity.dy = Math.cos(angle);
    }
  }
}

class Enemy extends Main {
  constructor(x, y, size, maxHealth, xp) {
    super(x, y, size);
    this.xHome = x;
    this.yHome = y;

    this.mh = maxHealth;
    this.h = maxHealth;
    this.xp = xp;

    this.hitTime = 0;
    this.pathPhase;
    this.dieTime = 2000;
  }

  beDrawn() {
    //handling opacity
    var op;
    if (this.alive >= 1) {
      op = 1;
    } else {
      op = 0;
    }
    ctx.globalAlpha = op;
    super.beDrawn();
    ctx.globalAlpha = 1;
  }

  tick() {
    //getting pathing value. It's 1 if too far away, 0 if in range, and -1 if too close.
    if (this.distToPlayer > this.minDist) {
      if (this.distToPlayer < this.maxDist) {
        this.pathPhase = 0;
      } else {
        this.pathPhase = 1;
      }
    } else {
      this.pathPhase = -1;
    }
    
    //enemies can take damage
    this.h -= this.wasHit;
    this.wasHit = 0;
    //if the enemy is dead, run the die function
    if (this.h <= 0) {
      this.die();
    }

    //push player away if too close
    if (this.distToPlayer < this.r + character.r) {
      //if the player is too close, push the player in the opposite direction of the entity.
      var atP = Math.atan2(this.xPD, this.yPD) + Math.PI;
      character.dx = 0.5 * Math.sin(atP);
      character.dy = 0.5 * Math.cos(atP);
    }
    //finally updating velocity and position, get distance to player
    super.tick();
  }

  die() {
    //starts a timer to be alive
    this.alive = this.dieTime * -1;
    //character gets xp
    character.xp += this.xp;
    if (character.xp >= character.maxXp) {
      character.levelUp();
    }
    //updating quests
    for (var hg=0;hg<quests.length;hg++) {
      if (eval(quests[hg]) instanceof SlayQuest) {
        
        //only update the quest if it's looking for the right enemy
        if (this instanceof eval(eval(quests[hg]).enemy)) {
          eval(quests[hg]).update();
        }
      }
    }
    //restoring the enemy to its defaults
    this.h = this.mh;
    this.hitTime = 0;
    this.pathPhase = 1;

    //only restore position once death time is half over
      this.x = this.xHome;
      this.y = this.yHome;
  }

  attack() {
    character.h -= (this.xp + this.r) / 4;
  }
}

class Ground extends Enemy  {
  //ground enemies get main as well as enemy
  constructor(x, y, size, maxHealth, xp) {
    super(x, y, size, maxHealth, xp);
  }

  beDrawn() {
    var op;
    if (this.alive >= 1) {
      op = 1;
    } else {
      op = 0;
    }
    ctx.globalAlpha = op;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r * (0.5 + (this.hitTime / enemyHitTime)), this.direction * -1, 0, Math.PI * 2)
    ctx.fill();
    if (this.pathPhase < 1) {
      drawMeter(this.x - cx - this.r, this.y - cy - (this.r * 2), this.r * 2, this.r / 2, this.h, 0, this.mh, this.color);
    }
    ctx.globalAlpha = 1;
  }

  tick() {
    //deciding what to do based on pathing value
    switch (this.pathPhase) {
      case -1:
        //stopping
        this.ax = 0;
        this.ay = 0;
        //add 1 to hitTime
        this.hitTime += 1;
        if (this.hitTime >= enemyHitTime) {
          this.hitTime = 0;
          this.attack();
        }
        break;
      case 0:
        //direct towards the player
        this.direction = Math.atan2(this.x - character.x, this.y - character.y) + Math.PI;
        this.ax = (this.speed * 0.125) * Math.sin(this.direction);
        this.ay = (this.speed * 0.125) * Math.cos(this.direction);
        break;
      case 1:
        //random movement
        this.direction += (Math.random() - 0.5) / (4 * dt);
        this.ax = (this.speed * 0.125) * Math.sin(this.direction);
        this.ay = (this.speed * 0.125) * Math.cos(this.direction);
        break;
    }
    //updates velocity + position
    super.tick();
  }
}

class Slime extends Ground {
  constructor(x, y) {
    super(x, y, 7, 3, 1);
  }
}

class Runner extends Enemy {
  constructor(x, y) {
    super(x, y, 10, 7, 3);
    this.minDist = 3 * squareSize;
    this.maxDist = 10 * squareSize;
    this.color = "#E19400";
    this.dieTime = 3000;
  }

  tick() {
    //deciding what to do based on pathing value
    switch (this.pathPhase) {
      case -1:
        //run away from the player if too close
        this.direction = Math.atan2(this.x - character.x, this.y - character.y);
        this.ax = (this.speed * 0.125) * Math.sin(this.direction);
        this.ay = (this.speed * 0.125) * Math.cos(this.direction);
        break;
        case 0:
          //run towards the player when in good zone
          this.direction = Math.atan2(this.x - character.x, this.y - character.y) + Math.PI;
          this.ax = (this.speed * 0.125) * Math.sin(this.direction);
          this.ay = (this.speed * 0.125) * Math.cos(this.direction);

          break;
      case 1:
        //random movement
        this.direction += (Math.random() - 0.5) / (4 * dt);
        this.ax = (this.speed * 0.125) * Math.sin(this.direction);
        this.ay = (this.speed * 0.125) * Math.cos(this.direction);
        break;
    }
    //if close enough, try to attack
    if (this.pathPhase < 1) {
      this.hitTime += 1;
      if (this.hitTime >= enemyHitTime * 1.5) {
        this.hitTime = 0;
        this.attack();
      }
    }
    

    //updating velocity / position
    super.tick();
  }

  beDrawn() {
    super.beDrawn();

    if (this.pathPhase < 1) {
      drawMeter(this.x - cx - this.r, this.y - cy - (this.r * 2), this.r * 2, this.r / 2, this.h, 0, this.mh, this.color);
    }
  }

  attack() {
    //fire a projectile at the player
    var playerDirection = Math.atan2(this.x - character.x, this.y - character.y) + Math.PI;
    loadingMap.enemies.push(new Projectile(this.x, this.y, playerDirection, 2, 3));
  }
}

class Projectile extends Enemy {
  constructor(x, y, a, r, force) {
    super(x, y, r, 1, 0);
    this.f = force;
    this.dx = this.speed * Math.sin(a);
    this.dy = this.speed * Math.cos(a);
    this.minDist = character.r;
    this.maxDist = 100 * squareSize;
  }

  beDrawn() {
    super.beDrawn();
  }

  tick() {
    if (this.alive > 0) {
      //store old position
      var oldX = this.x;
      var oldY = this.y;
      //update position
      this.x = checkCollision(this.x, this.y, this.dx, 0, 1);
      this.y = checkCollision(this.x, this.y, this.dy, 1, 1);

      //pathing
      var dTPX = this.x - character.x; 
      var dTPY = this.y - character.y;
      var dTP = Math.sqrt((dTPX * dTPX) + (dTPY * dTPY));
      if (dTP < this.r + character.r) {
        character.h -= this.f;
        this.h = -1;
      }
      //if the bullet has hit a wall, then kill it

      if (this.x == oldX || this.y == oldY) {
        this.h = -1;
      } 
      //other forms of dying
      this.h -= this.wasHit;
      this.wasHit = 0;

      if (this.h <= 0) {
        this.die();
      }
    }
  }

  die() {
    super.die();
    this.alive = -1 * Infinity;
  }
}

//========== NPCS ==========//

class Friend extends Main {
  constructor(x, y, size, color) {
    super(x, y, size);
    this.color = color;

    this.canTalk = 1;
  }

  tick() {
    super.tick();
    //push players away if too close
    if (this.distToPlayer < this.r + character.r) {
      //if the player is too close, push the player in the opposite direction of the entity.
      var atP = Math.atan2(this.xPD, this.yPD) + Math.PI;
      character.dx = Math.sin(atP);
      character.dy = Math.cos(atP);
    }
  }

  beDrawn() {
    super.beDrawn();
  }

  converse() {
    dt = dtBase * dtMult;
    character.ax = 0;
    character.ay = 0;
    character.dx = 0;
    character.dy = 0;
  }
}

class NPC extends Friend {
  constructor(x, y, moveState, color, text, textName) {
    super(x, y, 7, color);
    this.speed = entitySpeed * 0.5;
    this.pathPhase = moveState;

    this.currentLine = 0;
    this.text = text;
    this.textName = textName;
  }

  beDrawn() {
    super.beDrawn();
  }

  tick() {
    //movement, if 0 be still, if 1 move randomly.
    switch (this.pathPhase) {
      case 0:
        break;
      case 1:
        this.direction += (Math.random() - 0.5) / dt;

        this.ax = (this.speed * 0.125) * Math.sin(this.direction);
        this.ay = (this.speed * 0.125) * Math.cos(this.direction);
        break;
    }

    super.tick();
  }

  converse() {
    super.converse();
    var tempStorage = this.currentLine;
    this.currentLine = drawConversation(this.text, this.currentLine);
    //99 is the special code to quit a conversation
    if (this.currentLine == 99) {
      this.currentLine = tempStorage;
      character.talking = -1;
      dt = dtBase;
    }
    
    //980-989 is the code for summoning entities
    if (this.currentLine >= 980 && this.currentLine < 990) {
      var toPush = this.text[0][2][this.currentLine-980];
      enemies.push(eval(toPush));
      this.currentLine = tempStorage + 1;
      character.talking = -1;
      dt = dtBase;
    } 

    //990-999 is the code for the quests
    if (this.currentLine >= 990 && this.currentLine < 1000) {
      //creates the numbers that reference the quest
      
      var toPush = this.textName + "[" + tempStorage + "]" + "[2][" + String(this.currentLine - 990) + "]";

      //pushes the reference to the quests array
      quests.push(toPush);

      //ending conversation
      this.currentLine = tempStorage + 1;
      character.talking = -1;
      dt = dtBase;
    }

    //1000+ is the code for going to a line while exiting conversation
    if (this.currentLine >= 1000 && this.currentLine < 2000) {
      this.currentLine = this.currentLine - 1000;
      character.talking = -1;
      dt = dtBase;
    }

    if (isNaN(this.currentLine)) {
      //go to the pointed quest and check if it's complete. 
      //if it is, jump ahead 2 lines. If not, only jump ahead 1
      if (this.currentLine.complete) {
        this.currentLine = tempStorage + 2;
      } else {
        this.currentLine = tempStorage + 1;
      }
    } 
  }
}

class Chatter extends Friend {
  constructor(x, y) {
    super(x, y, 7, textColor);
    this.currentLine = -1;

    this.speed = entitySpeed * 0.125;

    this.xPD;
    this.yPD;
  }

  beDrawn() {
    super.beDrawn();
  }

  tick() {
    //chatterers always do random movement
    this.direction += (Math.random() - 0.5) / dt;

    this.ax = (this.speed * 0.125) * Math.sin(this.direction);
    this.ay = (this.speed * 0.125) * Math.cos(this.direction);
    //if engaging in conversation, make sure that they stay still
    if (this.currentLine != -1) {
      this.ax = 0;
      this.ay = 0;
    }

    super.tick(); 
  }

  converse() {
    super.converse();
    if (this.currentLine == -1) {
      var maxLine = chatterText.length;
      this.currentLine = Math.floor(Math.random() * maxLine);
    }
    
    this.currentLine = drawConversation(chatterText, this.currentLine);
    //99 is the special code to quit a conversation
    if (this.currentLine == 99) {
      this.endConversation();
    } 
  }

  endConversation() {
    this.currentLine = -1;
    character.talking = -1;
    dt = dtBase;
  }
}
//the conversation starter starts up a conversation with another entity when the player goes inside a certain distance from them
class ConvoStarter {
  constructor(x, y, size, entity) {
    this.x = x;
    this.y = y;
    this.r = size;
    this.e = entity;
    this.active = true;
    this.alive = 1;
    
    this.dTP = 1;
  }

  tick() {
    //updates increase in frequency the closer the player is, at 1 square away or closer will update every tick
    if (Math.floor(time) % Math.ceil(this.dTP / squareSize) == 0 && this.active) {
      var xDTP = this.x - character.x;
      var yDTP = this.y - character.y;
      this.dTP = Math.sqrt((xDTP * xDTP) + (yDTP * yDTP));

      //if the distance is an invalid state, make it 1
      if (this.dTP <= 0) {
        this.dTP = 1;
      }

      //starts a conversation if the player is too close, then deactivates itself
      if (this.dTP <= this.r) {
        character.talking = this.e;
        this.active = false;
      }
    }
  }
  //these functions are empty because the conversation starter doesn't do a lot. They're just here so that the program doesn't freak out trying to run things that don't exist.
  beDrawn() {

  }

  collide(h) {

  }
}

//========= Passives ========= // 

class Passive extends Main {
  constructor(x, y) {
    super(x, y, squareSize);
    this.color = "#FFFFFF";
    this.h = 1;
  }

  beDrawn() {
    super.beDrawn();
  }

  tick() {
    
  }

  collide(entity) {
    super.collide(entity);
  }
}

class Box extends Passive {
  constructor(x, y, contains) {
    super(x, y);
    this.hasItem = true;
    this.item = contains;
    this.textureClosed = new Image();
    this.textureOpen = new Image();
    this.textureClosed.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAM1BMVEUAAABMNtOwsLD///9MNtOwsLCwsLCwsLBMNtOwsLBMNtNMNtNMNtOwsLAAAABMNtOYiPnM2kuEAAAADnRSTlMAAAAAAQECAwQEBQYKDI+HwD0AAACTSURBVHgB1dJbDsIgEIVhDgfQ1su4/9UKsYlDykURH/o/ki+TIRnDXYtloQL0EyDYzyBFXbB1eE1UCqV3h/eOOEMqYYWGkGrQkNIIHIDSDD/AR5ZsUUHlVH+D+G7i7RT60PtgbKoHI0mQ/AAOfOZA8L41YeJeTjjcPkTTjUCi6RRcUXVOQ4dYkcUuesesBXkveICeo6Q5SW2o8sEAAAAASUVORK5CYII=";
    this.textureOpen.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAM1BMVEUAAABMNtOwsLD///9MNtOwsLCwsLCwsLBMNtOwsLBMNtNMNtNMNtOwsLBAPVJMNtOYiPm4yvaxAAAADnRSTlMAAAAAAQECAwQEBQYKDI+HwD0AAACWSURBVHgB7c/bDsIgEIRhhgW09YDv/7SysYlD3C210QsT/0vyBYYgL01RjAyYPwAh4wI04Ur04VlpNdLzhOdGHFGdMIMhqhsI8rM3apFCkBzHcOA0EHScC69ddUkIkqO+BvHejZdDGcOcS4jaCDaiUGQL3PyZP6ym66DTfohVtwcKVh3B2ZVIDBNaJmudeGPXhL4H/IHufNg3l2ClDGoAAAAASUVORK5CYII=";
  }

  beDrawn() {
    if (this.hasItem) {
      ctx.drawImage(this.textureClosed, this.x - cx, this.y - cy, squareSize, squareSize);
    } else {
      ctx.drawImage(this.textureOpen, this.x - cx, this.y - cy, squareSize, squareSize);
    }
  }

  converse() {
    character.talking = -1;
    this.hasItem = false;
    inventory.push(eval(this.item));
  }
}

class House extends Passive {
  constructor(x, y) {
    super(x, y);
  }

  beDrawn() {
    ctx.drawImage(houseCover, (this.x - cx) - squareSize, (this.y - cy) - squareSize, squareSize * 3, squareSize * 3);
  }
}

//======= Inventory =======//
class Item {
  constructor(id, x, y, equipped) {
    this.x = x;
    this.y = y;
    this.equipped = false;
    this.handled = false;

    this.id = id;
    this.equippable = false;
    this.movable = true;
  }

  beDrawn() {
    var drawX;
    var drawY;
    if (this.equipped) {
      drawX = ((canvas.width * 0.5) - (invenEquipped.length * 16.5)) + (this.x * 40);
      drawY = canvas.height * (invenScPos[1]+0.2);
    } else {
      drawX = (canvas.width * (invenScPos[0]+0.09)) + (this.x * 40);
      drawY = (canvas.height * (invenScPos[1]+0.38)) + (this.y * 40);
    }

    ctx.fillStyle = cTemperColor;
    ctx.fillRect(drawX-5, drawY-5, 10, 10);
    
  }

  goToDrawArray(arrayPlace) {
    invenItems[this.y][this.x] = arrayPlace;
  }
}

class Marker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.drawX;
    this.drawY;
  }

  beDrawn() {
    //only draw if in the inventory
    if (this.y != -2) {
      ctx.strokeStyle = inventoryHighlightColor1;
      switch (inventoryPhase) {
        case 0:
          if (this.y >= -1) {
            this.drawX = canvas.width * 0.5;
            this.drawY = (canvas.height * (invenScPos[1]+0.3)) + ((this.y+1) * 40);
            
            ctx.beginPath();
            ctx.rect(this.drawX-30, this.drawY-20, 100, 25);
            ctx.stroke();
          }
          break;
        case 2:
          if (this.y >= 0) {
          this.drawX = (canvas.width * (invenScPos[0]+0.09)) + (this.x * 40);
          this.drawY = (canvas.height * (invenScPos[1]+0.38)) + (this.y * 40);
        } else {
          this.drawX = ((canvas.width * 0.5) - (invenEquipped.length * 16.5)) + (this.x * 40);
          this.drawY = canvas.height * (invenScPos[1]+0.2);
        }
        ctx.moveTo(this.drawX, this.drawY);
        drawOct(this.drawX, this.drawY, inSize, false);
        break;
      }
      
    }
  }

  tick() {
  }

  validatePosition(xChange, yChange) {
    //if the y is not in the top area or the player isn't pressing down
    if (this.y > -2 || yChange == 1) {
      this.x += xChange;
      this.y += yChange;
      //changing collision based on which phase
      switch (inventoryPhase) {
        case 0:
          //in stats, x can only be 0
          this.x = 0;
          //constraining y
          if (this.y > stats.length - 2) {
            this.y = -1;
          }
          break;
        case 1:
          break;
        case 2:
          //while in equip slot
          if (this.y == -1) {
            //constraining x
            if (this.x < 0 || this.x >= invenEquipped.length) {
              if (this.x < 0) {
                this.x = invenEquipped.length - 1;
              } else {
                this.x = 0;
              }
            }
          } else {
            //while in main inventory
            //constraining x
            if (this.x < 0 || this.x >= invenItems[0].length) {
              if (this.x < 0) {
                this.x = invenItems[0].length - 1;
              } else {
                this.x = 0;
              }
            }
            //constraining y
            if (this.y >= invenItems.length) {
              this.y = 0;
            }
          }
          break;
        case 3:
          break;
      }
    }
  }
}

//======= Quests ========//

class Quest {
  constructor(givenById, importanceBOOLEAN, name, number) {
    this.id = givenById;
    this.importance = importanceBOOLEAN;
    this.name = name;
    this.complete = false;
    this.number = number;
    this.currentNumber = 0;
  }

  beDrawn(x, y) {
    if (this.complete) {
      ctx.fillStyle = finishedTextColor;
    } else {
      ctx.fillStyle = textColor;
    }
    ctx.fillText(this.name, x, y);
    ctx.fillText(this.currentNumber + "/" + this.number, x+(0.4*canvas.width), y)
  }

  update() {
    this.currentNumber += 1;
    if (this.currentNumber >= this.number) {
      this.complete = true;
      this.currentNumber = this.number;
    }
  }

  validate(checkId) {
    if (this.id == checkId && this.complete) {
      return true;
    } else {
      return false;
    }
  }
}

class CollectQuest extends Quest {
  constructor() {
    super();
  }
}

class SlayQuest extends Quest {
  constructor(givenById, importanceBOOLEAN, name, enemyClassId, numberOfEnemies) {
    super(givenById, importanceBOOLEAN, name, numberOfEnemies);
    this.enemy = enemyClassId;
  }

  update() {
    super.update();
  }
}

class TalkQuest extends Quest {
  constructor() {
    super();
  }
}