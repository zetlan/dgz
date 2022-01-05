

let worldData_start = {
	getBgColor: function() {
		return [40, 30 + 20 * Math.cos(world_time / 80), 50];
	},
	effects: function(ray, closestObj) {
	},
	sunVector: polToCart(0, 0.7, 1),
	spawn: [1037, 636, -24],
	objects: [
		new Sphere(0, 100, 0, 100, [128, 0, 128]),
		new Cube(1000, 500, 0, 70, [255, 64, 64]),
		new Box(0, 0, 100, 1000, 50, 1000, [64, 255, 150]),
		new Cylinder(500, 300, 0, 100, 200, [128, 128, 255]),
		new Ring(500, 400, 0, 200, 50, [128, 255, 255]),
		new Portal(900, 50, -827, `darkBright`)
	]
}

let worldData_darkBright = {
	getBgColor: function() {
		var val = randomBounded(10, 30);
		return [val, val, val];
	},
	effects: function(ray, closestObj) {
		ray.color[0] += 1;
		ray.color[1] += 1;
		ray.color[2] += 1;
	},
	sunVector: [0, 1, 0],
	objects: [
		new Box(0, -100, 0, 6000, 50, 6000, [0, 0, 64])
	]
}