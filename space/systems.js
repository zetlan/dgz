//wow this is garbage but I'm too lazy to find a way around it
let system_main;

let system_a;
let system_b;
let thingy;




function initWorld() {
	
	system_a = new System(new Star(0, 0, 0, 0, 70, 1.5e5, true, color_star_sun), [], 0);
	system_a.bodies = [
		new Planet(system_a, 700, 700, 0, 0, false, 10, 2e3, false, color_ice),
		new Planet(system_a, 450, 200, Math.PI * 0.666, 0, false, 10, 2e3, true, color_ice),
		new Planet(system_a, 1100, 1100, 0, Math.PI / 3, false, 15, 4e3, true, color_green),
		new Planet(system_a, 1700, 1450, Math.PI, 0, false, 20, 5e3, true, color_water),
	];



	system_b = new System(undefined, [], 0);
	//new Star_Binary(new Star(-40, 0, 0, -6, 20, 4.5e3, color_neutron), new Star(40, 0, 0, 6, 20, 4.5e3, color_neutron));//
	system_b.setCenter(new Star(0, 0, 0, 0, 50, 9e4, true, color_star_neutron));
	system_b.bodies = [
		new Planet(system_b, 4500, 4000, Math.PI / 2, Math.PI / -4, false, 20, 8e3, true, color_purple),
		new Planet(system_b, 3500, 3300, 0, 0, false, 30, 8e3, false, color_ice),
		new Planet(system_b, 1500, 1400, 0, Math.PI * 1.1, false, 25, 1e4, false, color_rocky)
	];



	system_c_a = new System(new Star(0, 0, 0, 0, 35, 1e4, false, color_fuel), [], 0);
	system_c_a.bodies = [
		new Planet(system_c_a, 850, 700, Math.PI * 0.9, 0, false, 10, 4e2, false, color_rocky),
		new Planet(system_c_a, 550, 250, Math.PI * 0.4, Math.PI * 1.2, false, 8, 4e2, false, color_rocky),
		new Planet(system_c_a, 550, 250, Math.PI * 1.4, Math.PI * 1.2, false, 8, 4e2, false, color_rocky),
		new Planet(system_c_a, 1000, 1000, 0, 0, false, 12, 4e2, false, color_rocky),
	];



	system_c = new System(undefined, [], 0);
	system_c.setCenter(new Star(0, 0, 0, 0, 100, 1e5, true, color_star_warm));
	system_c.bodies = [
		system_c_a,
		new Planet(system_c, 2000, 400, Math.PI * 0.6, 0, false, 8, 4e2, false, color_rocky),
		new Planet(system_c, 2000, 400, Math.PI * 1.3, Math.PI, false, 8, 4e2, false, color_rocky),
	];
	system_c_a.setOrbit(system_c, 5500, 4500, Math.PI * 1.3, 0, false);





	system_start = new System(new Star(0, 0, 0, 0, 30, 4e3, false, color_rocky), [], 0);
	system_start.bodies = [
		new Planet(system_start, 800, 800, 0, Math.PI * 1.4, true, 7, 6e2, false, color_ice)
	];



	system_main = new System(new Star(0, 0, 0, 0, 140, 1e6, true, color_black), [], 0);
	system_main.bodies = [
		new Planet(system_main, 1600, 1600, Math.PI / 3, Math.PI / 3, false, 10, 2e4, false, color_rocky),
		new Planet(system_main, 20000, 18000, 0, Math.PI * -0.4, false, 30, 4e3, false, color_rocky),
		system_a,
		system_b,
		system_c
	];
	system_a.setOrbit(system_main, 14000, 14000, Math.PI * 0.8, 0, false);
	system_b.setOrbit(system_main, 30000, 28000, 0, 0, false);
	system_c.setOrbit(system_main, 45000, 42000, Math.PI * 1.2, 0, false);

	system_start.setOrbit(system_main, 20000, 18000, 0, Math.PI * -0.4, false);
}