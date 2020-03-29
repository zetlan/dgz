/*north = +X
east = +Z
south = -X
west = -Z 

up = +y
down = -y
*/



class Map {
    constructor(objects, connectsToLeft, connectsToRight) {
        this.contains = objects;
        this.leftMap = connectsToLeft;
        this.rightMap = connectsToRight;
    }

    tick() {


    }


}

//camera stores data about how to render things
class Camera {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


}

class Character {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
    }

    tick() {

    }

    beDrawn() {


    }
}

//in a cube, the points go NW, NE, SE, SW (clockwise starting from northwest point)
class Cube {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.r = r;

        this.upperPoints = [];
        this.lowerPoints = [];
        this.generatePoints();
    }

    generatePoints() {
        //this code is a bit of a mess, but hopefully it will never need to be touched.
        //each point is an array of 3 coordinates
        this.upperPoints = [];
        this.lowerPoints = [];

        //upper points
        this.upperPoints.push([this.x + this.r, this.y + this.r, this.z - this.r]);
        this.upperPoints.push([this.x + this.r, this.y + this.r, this.z + this.r]);
        this.upperPoints.push([this.x - this.r, this.y + this.r, this.z + this.r]);
        this.upperPoints.push([this.x - this.r, this.y + this.r, this.z - this.r]);

        //lower points
        this.lowerPoints.push([this.x + this.r, this.y - this.r, this.z - this.r]);
        this.lowerPoints.push([this.x + this.r, this.y - this.r, this.z + this.r]);
        this.lowerPoints.push([this.x - this.r, this.y - this.r, this.z + this.r]);
        this.lowerPoints.push([this.x - this.r, this.y - this.r, this.z - this.r]);

    }

    beDrawn() {

    }

}