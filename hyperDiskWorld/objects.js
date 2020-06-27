class Camera {
    constructor(sphereRadius, sphereHeight, diskRadius) {
        this.sH = sphereHeight;
        this.r = sphereRadius;
        this.dR = diskRadius;
    }
}

class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.dx = 0;
        this.dy = 0;
    }

    tick() {
        this.x += this.dx;
        this.y += this.dy;
    }
}