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