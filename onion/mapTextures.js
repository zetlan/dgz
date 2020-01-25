//all the colors used

//terrain colors
var dirtColor = "#755F4D";

var woodColor = "#A5741D";
var lWoodColor = "#BD8420";

var stoneColor = "#708080";
var interStoneColor = "#7B9190";
var lStoneColor = "#899C9C";


var spaceColor = "#85DEF5";
var sunColor = "#FF3300";
var debrisColor = "#8888FF";


var engineColor = "#6666FF";
var shipColor = "#FFFFFF";
var computeColor = "#307529";
var computeWireColor = "#FFEE25";

var brokenHyperColor = "#5D649C";
var repairColor = "#76AA9F";

//player colors
var inventoryHighlightColor1 = "#FFA200";
var inventoryHighlightColor2 = "#FFF288";
var inventoryColor = "#7171A4";

var swordColor = "#575250";

var healthColor = "#EE0000";
var spColor = "#FFE000";
var xpColor = "#00EA00";

var playerColor = "#CCCCFF";

var chatterColor = "#FFEEFF"
var characterColor = "#FF00FF";
var enemyColor = "#FF0000";
var hyperColor = "#3872FF";

var endingColor = "#FF00FF";
var startingColor = "#00FF00";
var stoneColor = "#6F8389";
var blackColor = "#000000";
var boxColor = "#759AB2";

var powerColor = "#FFD800";
var fuelColor = "#FF9300";
var cTemperColor = "#7CBBFA";
var mTemperColor = "#7CFA80";
var hTemperColor = "#FA917C";

var menuColor = "#333366";
var textColor = "#88FFCC";
var finishedTextColor = "#CCFF88";


var spaceColor = "#333333";

//fullEllipse is because I thought it was annoying to write beginPath() and fill() at the end of every ellipse.
//all textures
//pallete 1
var grassyGround = new Image();
grassyGround.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAACVBMVEVBu31Bu36I/7tE62+zAAAAI0lEQVR4AWMgEzAxDDtA2HejjmFkGFmAiXLto7lh1M2jXgMAQOcAEtRZpjQAAAAASUVORK5CYII=";

var dirtWall = new Image();
dirtWall.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEVyUjh1X03ztY/tAAAArklEQVQIHQXBsU2DMRCG4W+DFAyQkjFcMgYFI6RCQpyYICN4DqorUqT0ApEsKpc/kQti5XIvz6MgK1qko0kaGoShE9eCvjm21EfYCOVbnVexP68hynw04beswtOK6FQTnWZiY5rYiCIGWcQTuG4PcJ0TuvYYF0HlS9BiJ9h+huB3NwXTlwrDQ07zVKd6qFF8aaT5XTPwP62FDeUBq+IZK+LIp4nOO8I5IIwXlMYr/700o3VK7vIDAAAAAElFTkSuQmCC";

var dirtWallLeft = new Image();
dirtWallLeft.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAP1BMVEVBu31Bu35WQS9XQS9YSj1ZST1ZSj1bSz5mSzRpVUZpVkZqVkZrV0dwUTdxUThyUjhzXUxzXkx0Xkx1X02I/7sJnylXAAAA5ElEQVR42o3U7RKCQAhA0T6szG27rvT+z1pjMroqIL/PwILI6fEqIgKiMYic9uKeiroAPvvKSTEz9uqCjF3mUMamXb3xDbvw0i27BuqMn6rrSTJyMEqPGVX9osA+TAqj8UxQCMfTH4VlEviwseB5860VCuEbFYZdK0ShP0cEgozzZ8HpOmVVozThpc2yDIbgjbPEgM8VHGC/mQ0UAyYdeLxmPtS/4doeLN1sIAbscg0z1knJLB1vMecIC4e3PTC78Oypk2KXVqL7GF2Kv3NL1zdlhB9nzebe/e1BfHhLZeX8DSeCX2d3Netn+oTkAAAAAElFTkSuQmCC";

var dirtWallRight = new Image();
dirtWallRight.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAATlBMVEVBuXxBunxBun1Bu31CuXxCunxUPy1UPy5WRzxXRzxXSDxaSj5gRjJgRzJiUUFiUUJjUUJjUUNlUkNvUDdyUjhyXUtzXUx1X02I/LmI/7t9DjtKAAAA9ElEQVR42o3UyxKCMAwFUHxitQpKauT/f1QxDLeT6S1koZszaZMmNIdCqKqoiC7xft0cHDOoiNRfacbJAXaXEmx+zsEeMI+J/SUy0qPtdGQ8E+hkurcVCClDLN5xJ5D2m7pQLgbSdA5HuD26Yy/kGw6oCinV9oDKlj4C9mGlPchI3hp0vmMgxUACkqNBMT0b4LOY8aNe8owexrYZeTEofIi84VAimh6kaij7Z08oFhi2oWPL9a8BgTv6CXcwRbZcHnarcH0L+R3HGiRj5iFb15N3UptHAcMqsIzmsFwEwtEPwAJl5tVi4GjGo0Exh284hflbhy+jfUxgamHp2AAAAABJRU5ErkJggg==";

var dirtWallDown = new Image();
dirtWallDown.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAZlBMVEVBun1Bu31Bu35CuHxCuXtCuXxCunxDtnpDt3tDuHtEtnpHsXhUPy5VPy5WRzxWSDxXRzxXSDxZST1ZSj5iSDNkU0NlUkNlU0NmU0RnVEVvUDdwUDdyUjhyXUtzXUx1X02I/bqI/7uDieV4AAAA70lEQVR42t2R4XKCMBCEz8ZEYgVMS6XaE+T9X9LLwRjJVsef6hIu7OYbJrnQp1k8JJrb4Q4IejlweKY9Dk/Uno/3uWsEfbFcFdZaY4wna5bOu5NY56yV4b23hfOFWxMz99dSBwkzYc6ZV/UCIgmUSEAkr6hxBjARquRvgrHMA9IQuAzUU/P/XJYzaYIc/lFXkMM96pRxCE6nnjcCwdRH5rucgsloQXAKKfk4ALyElFay0yduBmKHsz1Td1R1x4PO+i1PtN3hb/SRoX07qmkv2v2ob5qm3amX95e+61CFEDZlVYdahmhbSSm3ZbRhSr/OT8Ff6XkFxeUAAAAASUVORK5CYII=";

var dirtWallUp = new Image();
dirtWallUp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAANlBMVEVBunxBu31SPi1SPi5URjpVRjpWRztiSDJjUkNkUkNlUkNmU0RwUTdyUjhzXUxzXkx1X02I/7tld4x9AAAAtUlEQVR4AdXSXQ7CIBAE4OkPtmgX4f6XlWIzQSZpeJRFzTJ+riEFj9XlNS9uPctd73V283L2efN94eX97rfN59qfnrXl5cv+CvEOIRxHaEojxBjNYlsmGUpoysxaaJzZDPuhBqtCKpFmYFcUv5afQ/6RHWX5RJ1pb9wh1pmO5/EFkjYNokgKpgJFChRJ2gf5eFtoKgXKRWDVsLoIN5DqXmLqKyD1yumfYSIc5zCpe+JwMI14mA/hjDDAqLYWNQAAAABJRU5ErkJggg==";

var dirtWallCornerDL = new Image();
dirtWallCornerDL.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAACAVBMVEVBuXxBunxBun1Bu31Bu35CrXVCs3hCtHlCtnpCt3pCt3tCuHtCuHxCuXxCunxDsXhDs3hDs3lDtHlDtXpDtnlDt3tEq3REr3ZEtnpFtHlHOy1HoW9IPjVKPzVLQDZLUDlMQTZNQDZNQDdNQzdOOytOQjhPQjhQQjhQQjlRRDlRRTlRRztRVkRSRDFSRDlSRTpTRDpTRTlTRTpTe1lVRjtVSDtVkGFWQC9WRTJWRztWSTxWSj1WWUZWZk5Wak9XRztXRzxXSDtXSDxYSTxYWUZZST1ZSz5ZkGdaTT9bRDBbSz5bX0JcRDFcSz5cTD5cTD9cT0BcVENcbFJdRDFdTD9dTT9dUUFdimNeTUBeTkBeUkJfTkBfT0FfWkdfe1NgT0FhRzJhSDJhT0FhUEFhUEJhUENiUEJiUUFiUUJjUEJjUUJjUUNjUkJjUkNjfl1kSTNkUUNkUkNkVUVkfVxlUkNlUkRmU0RnU0RnVERnVEVnVUVoVUVoVUZpVUZpVkZqTTVqVkdqV0dqcldqc1drTjZrV0ZrV0drWEdrcVZsWEdsWEhsXkBtWEhuWklvUTdvWklvWkpvaVJwUDdwUTdwW0pxUjhxW0txXEpxXEtyUjhyXEtyXUtyZE9zXUtzXUxzXkxzYk9zY090Xkx0Xk10X010YE50YU50Yk51X011YE2I/7sxuuCcAAACGElEQVR42m3S93vSQBgH8MA5sOTSWvfee++96l51a50oxai4Wq04UGrqRrFVUEqjiQ1Y3/avlJC33HG57095nveT9728OWVlygaAQgFYfhFJlLWvLMHBH00G17+20bGoMrjLsEUH0tG7jWxBlAEZ3PbQrD1j+TUqgyvu5IFJr3n/5Gp9qArrL6cdlGWFT1MkHcOx5ybrhU8fNT8MRNp7AcRjqhJ4Rc95VeDkZz+k5/Uvjghh4BoVIWm8/9ICn/zmhzTe3ueHg29GVOpBBuui0e6SX/577C0zUIXBU7dTktnQ/4DWjiZqLJ73YK0c6NJqYbilNVNy1yxK+HtQ4yG9FOv8gYRJzAWN63j0xnt3k3I52LVxgkaDVHFX8ChpApNivJuiuPfotJ7jf7TgKgG3IwnfSllyiaocRXVnX41nilyVU/gmQhKOJPrEaaiGpUIq2Xk21ctD8doVhmHjhiOJnMM5hEwiJGP3Nsc/WMwJEKqQhPboHYaJTtoRE5h4oE03LHTSM2KGGs49aUtnsS5A/GpM3aGb19/arMg7hJiGzWdaP5lFn/NBEtrXEn2WsRAyhpDPupMXI8luq4gQnQSSSTua9x/vMHq+OswhFDNt+9YlS5sOJ9I9+e9Z2ykxKIaOG7V82fzFa7ZsOnbv6Yvku0zup/kboRhNHU/GzJo6Y9GqhdPnrG46Eb0rhWyzodBoZeS8uTNnL/gP+31mwRidxMkAAAAASUVORK5CYII=";

var houseCover = new Image();
houseCover.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAIVBMVEUAAABmY4R8p9eZx+T///9mY4RmY4R8p9eMi5KZx+SwsLAUK9imAAAABnRSTlMAAAAAAAKAqGa9AAABKklEQVR4Ae3Sa26EMAxF4TJQT+n+F1xPdJFcIsIjj1/nbODTtfxFY1tG9h1gM5t6GFOeUxFeV/vghWphofZ+72BPeA9YqJfBooW3hIWKPYLj8no4LL0Ey/6pTuotWPjv44Q+gdfHeFj6FF7t7tkTKqYOTl0crqWtYNFeGRXbGt700vv2gQ/+bUP7w8IDOgxOhaVj4TW7MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDCwNwZ2KMLTPM8J7wkn9OVF2JuFWw/YNvTlUoCXjyw86S1hmZ6UHJYuvAUsVOYJHHF7DluOnsOipd+HZYotwVmXpl8buuw7h8+ml4fWwrvpR3A2tA0sWrj9h02o2Oaw+DBdQyPZDY7TC0PP4T8thG2IGBtlbgAAAABJRU5ErkJggg==";

//pallete 2


//pallete 3
var stonyGround = new Image();
stonyGround.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEV7kZCJnJxfDZG/AAAAmElEQVQI1z3PsQ3DMAwEwAcCxKXadFwjRWAuFoSu4tIjeBUFLlJ6BY2gkoUhhlQAN1c9Hv+QCXxALjlMGlJjxchG3VTxEJsLbmITgNMBKvZOONgWQvM8w8hGgaX2cmd9Gjx978LNfymHUkKr7qe7mZ5+u3t3MZVoroLmMg6XoGwlobgDrmxbRmLbK4htVTDFfl5bPFpKGE9/r7R+1/X7GP8AAAAASUVORK5CYII=";


//textures that aren't for map things specifically



/*mapSquare turns values into textures. Most values are fine, but it processes 
  whole values first. This is because values with decimal points are used to tell 
  the game something. Some values use decimal points to indicate direction, and in
  that case, the decimal point is useful. However, there are cases where the 
  decimal place gets in the way, and removing the decimal place prevents that.

  There are also multiple functions with different textures for different areas. This is to make it easier to store maps, as many different values aren't needed. */

function palleteOneSquare(value, ex, why) {
  ctx.beginPath();
  //ground is special
  var isGround = String(value).match(/^\d/);
  if (isGround) {
    ctx.drawImage(grassyGround, ex, why, squareSize, squareSize);
  } else {
    //drawing all blocks
    switch (value) {
      //drawing wall blocks
      //A is full, B-E is edge, F-I is corners
      case "A":
        ctx.drawImage(dirtWall, ex, why, squareSize, squareSize);
        break;
      case "B":
        ctx.drawImage(dirtWallLeft, ex, why, squareSize, squareSize);
        break;
      case "C":
        ctx.drawImage(dirtWallUp, ex, why, squareSize, squareSize);
        break;
      case "D":
        ctx.drawImage(dirtWallRight, ex, why, squareSize, squareSize);
        break;
      case "E":
        ctx.drawImage(dirtWallDown, ex, why, squareSize, squareSize);
        break;
      case "F":
        ctx.drawImage(dirtWallCornerDL, ex, why, squareSize, squareSize);
        break;
      case "G":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = dirtColor;
        ctx.moveTo(ex+squareSize, why);
        ctx.lineTo(ex+(squareSize*0.5), why);
        ctx.lineTo(ex, why+(squareSize*0.5));
        ctx.lineTo(ex, why+(squareSize));

        ctx.lineTo(ex+(squareSize*0.5), why+(squareSize));
        ctx.lineTo(ex+(squareSize*0.5), why+(squareSize*0.55));
        ctx.lineTo(ex+(squareSize*0.55), why+(squareSize*0.5));
        ctx.lineTo(ex+squareSize, why+(squareSize*0.5));
        ctx.fill();
        break;
      case "H":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = dirtColor;
        ctx.moveTo(ex, why+(squareSize*0.5));
        ctx.lineTo(ex+(squareSize*0.5), why+(squareSize*0.5));
        ctx.lineTo(ex+(squareSize*0.5), why);
        ctx.lineTo(ex+squareSize, why);

        ctx.lineTo(ex+squareSize, why+(squareSize*0.5));
        ctx.lineTo(ex+(squareSize*0.5), why+squareSize);
        ctx.lineTo(ex, why+squareSize);
        ctx.lineTo(ex, why+(squareSize*0.5));
        ctx.fill();
        break;
      case "I":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = dirtColor;
        ctx.moveTo(ex, why);
        ctx.lineTo(ex, why+(squareSize*0.5));
        ctx.lineTo(ex+(squareSize*0.5), why+squareSize);
        ctx.lineTo(ex+squareSize, why+squareSize);

        ctx.lineTo(ex+squareSize, why+(squareSize*0.5));
        ctx.lineTo(ex+(squareSize*0.5), why+(squareSize*0.5));
        ctx.lineTo(ex+(squareSize*0.5), why);
        ctx.lineTo(ex, why);
        ctx.fill();
        break;
      case "J":
        ctx.fillStyle = dirtColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case "K":
        ctx.fillStyle = dirtColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      //stairs
      case "Q":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = dirtColor;
        for (var j=0;j<3;j++) {
          ctx.fillRect(ex+(squareSize*((j+0.5)/4)), why, squareSize*0.1, squareSize);
        }
        break;
      case "R":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = dirtColor;
        for (var j=0;j<3;j++) {
          ctx.fillRect(ex, why+(squareSize*((j+0.5)/4)), squareSize, squareSize*0.1);
        }
        break;
      case "S":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = stoneColor;
        ctx.ellipse(ex+(squareSize*0.5), why+(squareSize*0.5), squareSize*0.5, squareSize*0.5, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = lStoneColor;
        ctx.ellipse(ex+(squareSize*0.3), why+(squareSize*0.55), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.7), why+(squareSize*0.7), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.6), why+(squareSize*0.2), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.5), why+(squareSize*0.25), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        break;
      case "Z":
        palleteThreeSquare("0", ex, why);
        break;
      case "i":
        palleteOneSquare("0", ex, why);
        break;
    }
  }
}

function palleteTwoSquare(value, ex, why) {
  var isGround = String(value).match(/^\d/);
  if (isGround) {
    ctx.fillStyle = woodColor;
    ctx.fillRect(ex, why, squareSize, squareSize);
    ctx.fillStyle = lWoodColor;
    ctx.fillRect(ex, why + (squareSize * 0.166), squareSize, squareSize * 0.1);
    ctx.fillRect(ex, why + (squareSize * 0.5), squareSize, squareSize * 0.1);
    ctx.fillRect(ex, why + (squareSize * 0.833), squareSize, squareSize * 0.1);
  } else {
    switch (value) {
      case "A":
        ctx.fillStyle = dirtColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case 2:
        ctx.fillStyle = debrisColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case 3:
        ctx.fillStyle = computeColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        ctx.strokeStyle = computeWireColor;
        ctx.lineWidth = "1";
        var num = 4;
        for (cl = 0; cl < num; cl++) {
          ctx.beginPath();
          ctx.moveTo(ex, why + (squareSize * (1 / (2 * num))) + (squareSize * cl / num));
          ctx.lineTo(ex + squareSize, why + (squareSize * (1 / (2 * num))) + (squareSize * cl / num));
          ctx.stroke();
        }
        break;
      case 4:
        mapSquare(1, ex, why);
        ctx.globalAlpha = 0.7 + (Math.sin(time / 90) * 0.3);
        ctx.fillStyle = brokenHyperColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        ctx.globalAlpha = 1;
        break;
      case 5:
        mapSquare(1, ex, why);
        ctx.globalAlpha = 0.7 + (Math.sin(time / 90) * 0.3);
        ctx.fillStyle = hyperColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        ctx.globalAlpha = 1;
        break;
      case 6.5:
        mapSquare(1, ex, why);
        ctx.fillStyle = repairColor;
        ctx.fillRect(ex + (squareSize / 2), why, squareSize / 2, squareSize);
        break;
      case 6:
        mapSquare(6.5, ex, why);
        ctx.fillRect(ex, why, squareSize / 3, squareSize);
      case 9:
      default:
        break;
    }
  }

}

function palleteThreeSquare(value, ex, why) {
  var isGround = String(value).match(/^\d/);
  if (isGround) {
    ctx.drawImage(stonyGround, ex, why, squareSize, squareSize);
  } else {
    switch (value) {
      case "A":
        ctx.fillStyle = stoneColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case "S":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = stoneColor;
        ctx.ellipse(ex+(squareSize*0.5), why+(squareSize*0.5), squareSize*0.5, squareSize*0.5, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = lStoneColor;
        ctx.ellipse(ex+(squareSize*0.3), why+(squareSize*0.55), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.7), why+(squareSize*0.7), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.6), why+(squareSize*0.2), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.5), why+(squareSize*0.25), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        break;
    }
  }
}