//wow this is garbage but I'm too lazy to find a way around it
let system_main;

let system_a;




function initWorld() {
	system_a = new System([], [], 0);
	system_a.centers = [new Body(0, 0, 0, 0, 80, 5e5, true, color_sun)];
	system_a.bodies = [
		new Planet(system_a.centers[0], 600, 600, 0, 0, false, 10, 2e3, false, color_neutron),
		new Planet(system_a.centers[0], 350, 120, Math.PI * 0.666, 0, false, 10, 2e3, true, color_neutron),
		new Planet(system_a.centers[0], 900, 900, 0, Math.PI / 3, false, 15, 4e3, true, color_green),
		//new Ring(system_a.centers[0], 450, 150, Math.PI * 0.666),
	];
	system_a.calibrate();

	system_main = new System([], [], 0);
	system_main.centers = [new Body(0, 0, 0, 0, 100, 1e6, true, color_black)];
	system_main.bodies = [
		new Planet(system_main.centers[0], 16000, 16000, 0, Math.PI / -2, false, 30, 6e4, true, color_neutron),
		new Planet(system_main.centers[0], 20000, 14000, 0, 0, false, 30, 4e3, true, color_rocky),
		new Ring(system_main.centers[0], 10000, 10000, 0),
		new Ring(system_main.centers[0], 16000, 16000, Math.PI / -2),
		new Ring(system_main.centers[0], 20000, 14000, 0),
		system_a
	];

	for (var a=0;a<20;a++) {
		system_main.bodies.push(new Planet(system_main.centers[0], 20000, 14000, 0, (Math.PI / 10) * a, false, 30, 6e4, true, color_neutron));
	}
	system_main.calibrate();
	system_a.setOrbit(system_main.centers[0], 10000, 10000, 0, 0, false);
		
}