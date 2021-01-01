//wow this is garbage but I'm too lazy to find a way around it
let system_main;

let system_a;
let system_b;
let thingy;




function initWorld() {
	
	system_a = new System([], [], 0);
	system_a.centers = [new Body(0, 0, 0, 0, 80, 5e5, true, color_sun)];
	system_a.calibrate();
	system_a.bodies = [
		new Planet(system_a, 600, 600, 0, 0, false, 10, 2e3, false, color_ice),
		new Planet(system_a, 350, 120, Math.PI * 0.666, 0, false, 10, 2e3, true, color_ice),
		new Planet(system_a, 900, 900, 0, Math.PI / 3, false, 15, 4e3, true, color_green),
	];
	system_a.calibrate();


	system_b = new System([], [], 0);
	system_b.centers = [new Body(-40, 0, 0, -6, 20, 9e4, true, color_neutron),
						new Body(40, 0, 0, 6, 20, 9e4, true, color_neutron)];
	system_b.calibrate();
	system_b.bodies = [
		new Planet(system_b, 4500, 4000, Math.PI / 2, Math.PI / -4, false, 20, 8e3, true, color_purple),
		new Planet(system_b, 3500, 3300, 0, 0, false, 30, 8e3, false, color_ice),
		new Planet(system_b, 1500, 1400, 0, Math.PI * 1.1, false, 30, 1e4, false, color_rocky)
	];
	system_b.calibrate();


	system_main = new System([], [], 0);
	system_main.centers = [new Body(0, 0, 0, 0, 100, 1e6, true, color_black)];
	system_main.calibrate();
	system_main.bodies = [
		new Planet(system_main, 16000, 14000, 0, Math.PI * -0.4, false, 30, 4e3, true, color_rocky),
		new Planet(system_main, 800, 800, Math.PI / 3, Math.PI / 3, false, 10, 2e4, false, color_rocky),
		system_a,
		system_b
	];
	system_main.calibrate();
	system_a.setOrbit(system_main, 10000, 10000, Math.PI * 0.8, 0, false);
	system_b.setOrbit(system_main, 30000, 28000, 0, 0, false);
}