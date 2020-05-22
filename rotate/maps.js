/*all map zones:
	J/A -- tutorial

	C -- crossroads

	G/B/Y/R -- zones for Green, blue, yellow, and red

	F -- final
*/

let menuMap;
let defaultMap;
let mapDef_F;
let mapJ1;
let mapJ1_F;
let mapJ2;
let mapJ2_F;

let mapA1;
let mapA2;
let mapA3;
let mapA4;
let mapA5;

let mapC;
let mapCa;
let mapCb;
let mapCaa;
let mapCab;
let mapCba;
let mapCbb;

let mapR1;
let mapR2;
let mapR3;
let mapR4;
let mapR5;
let mapR6;
let mapR7;
let mapR5_F;
let mapR_G;
let mapR_H;

let mapY1;
let mapY2;
let mapY3;
let mapY4;
let mapY5;
let mapY6;
let mapY7;
let mapY8;
let mapY_G;
let mapY_H;

let mapE1;
let mapE2;
let mapE3;
let mapE4;

let mapMT;

//all the map generation is inside a function so I can control when they're defined
//numbers in terms of mapSize for quick reference

function initMaps() {
	//defining some numbers in terms of mapSize for quick reference
	var pH = 0.5 * mapSize;
	var nH = -0.5 * mapSize;
	var pF = mapSize;
	var nF = -1 * mapSize;

	var spaces = "                                      ";

	//intro maps (J+A)
	menuMap = new Map("#A08060", [], "mapE1", "defaultMap"); 
	menuMap.contains = [new Floor(),
						new Box(-125, -112.5, 0, -25, 37.5, 10),
						new Wall(3),
						new Box(0, 0, 0, -100, 150, 10),
						new Text("Press X to Rotate")];
	
	defaultMap = new Map("#A08060", [], "menuMap", "mapJ1");
	defaultMap.contains = [ new Floor(),
							new PartialBox(nF, 0, 0, 1, pF, pF, true, true, true),
							new Box(0, 0, 0, 10, pF, 100),
							new Box(0, -92.5, 125, 10, 57.5, 25),
							new Text(["Use the arrow keys to move"])];

	mapJ1 = new Map("#A08060", [], "mapDef_F", "mapJ2"); 
	mapJ1.contains = [ 	new Floor(), 
						new Box(0, 0, 150, 150, 150, 1), 
						new Box(0, 0, 150, 150, 150, 1), 
						new Box(0, 0, 0, 100, 150, 10), 
						new Box(125, -92.5, 0, 25, 57.5, 10)];

	mapJ2 = new Map("#A08060", [], "mapJ1", NaN); 
	mapJ2.contains = [		new Floor(), 
							new Box(150, 0, 0, 1, 150, 150), 
							new Box(0, 0, 0, 10, 150, 100), 
							new Box(0, -92.5, -125, 10, 57.5, 25), 
							new Text("Press Z to Counter-Rotate")];
	
	mapDef_F = new Map("#E5B25D", [], "menuMap", "mapJ1_F");
	mapDef_F.contains = [new Floor(),
						new PartialBox(nF, 0, 0, 1, pF, pF, true, true, true),
						new Box(0, 0, 0, 10, pF, pF * 0.6666666),
						new Text(["X"])];
	
	mapJ1_F = new Map("#E5B25D", [], "mapDef_F", "mapJ2_F"); 
	mapJ1_F.contains = [	new Floor(),
							new Box(0, 0, 0, 100, 150, 10)];

	mapJ2_F = new Map("#E5B25D", [], "mapJ1_F", "mapA1"); 
	mapJ2_F.contains = [new Floor(), 
						new Box(-5, -125, 125, 15, 25, 25), 
						new Box(25, -115, 140, 15, 15, 10), 
						new Box(0, 0, 0, 10, 150, 100)];
	
	mapA1 = new Map("#E5B25D", [], "mapJ2_F", "mapA2"); 
	mapA1.contains = [ 		new Floor(), 
							new Box(-125, -125, 0, 25, 25, 10), 
							new PartialBox(-35, -145, 85, 115, 10, 70, true, true, true), 
							new Box(0, 0, 0, 100, 150, 10), 
							new Box(125, -125, 0, 25, 25, 10), 
							new Box(140, -115, -25, 10, 15, 15)];

	mapA2 = new Map("#E5B25D", [], "mapA1", "mapA3"); 
	mapA2.contains = [ 	new Floor(), 
						new Box(0, -125, 125, 10, 25, 25), 
						new PartialBox(85, -145, 35, 70, 10, 115, true, true, true), 
						new Box(0, 0, 0, 10, 150, 100), 
						new Box(0, -125, -125, 10, 25, 25), 
						new Box(-25, -115, -140, 15, 15, 10)];

	mapA3 = new Map("#E5B25D", [], "mapA2", "mapA4"); 
	mapA3.contains = [		new Floor(), 
							new Box(-140, -115, 25, 10, 15, 15), 
							new Box(-125, -125, 0, 25, 25, 10), 
							new Box(125, -125, 0, 25, 25, 20), 
							new Box(0, 0, 0, 100, 150, 10), 
							new PartialBox(45, -145, -80, 110, 5, 70, true, true, true)];

	mapA4 = new Map("#E5B25D", [], "mapA3", "mapA5"); 
	mapA4.contains = [ 	new Floor(), 
						new Box(25, -115, 140, 15, 15, 10), 
						new Box(0, -125, 125, 10, 25, 25), 
						new PartialBox(150, 0, 0, 1, 150, 150, true, true, true), 
						new PartialBox(-75, -145, -40, 75, 5, 110, true, true, true), 
						new Box(0, 0, 0, 10, 150, 100), 
						new Box(0, -125, -125, 20, 25, 25)];
						
	mapA5 = new Map("#CCAACC", [], "mapC", "mapC"); 
	mapA5.contains = [		new Floor(),
							new PartialBox(0, 0, nF, 150, 150, 1, true, true, true)];
	//crossroads maps	
	/*
	Ca - blend of red/yellow
	Cb - blend of green/blue

	Caa - red
	Cab - yellow
	Cba - green
	Cbb - blue

	*/
							
	mapC = new Map("#CCAACC", [], "mapCa", "mapCb"); 
	mapC.contains = [ 	new Floor(), 
						new Custom(0, -150, 0, [[[10,220,-10],[-10,220,-10],[-15,135,-15],[5,135,-15],"#852"],[[-10,0,-10],[-10,0,10],[-15,135,5],[-15,135,-15],"#852"],
												[[10,0,-10],[10,0,10],[5,135,5],[5,135,-15],"#852"],[[-10,220,10],[-15,135,5],[-15,135,-15],[-10,220,-10],"#852"],
												[[10,220,10],[5,135,5],[5,135,-15],[10,220,-10],"#852"],[[5,135,-15],[-15,135,-15],[-10,0,-10],[10,0,-10],"#852"]]),
						new Icosahedron(0, 60, 0, 40, 35, 40, 0, "#0F0"),
						new Text(["Welcome to the Crossroads"]),
						new CodeBlock(`gameFlags["atC"] = true;`)];

	mapCa = new Map("#FC9B94", [], "mapCaa", "mapCab"); 
	mapCa.contains = [		new Floor(),
							new Wall(2), 
							new Wall(0),
							new Custom(0, -150, 0, [[[10,220,10],[10,220,-10],[15,135,-15],[15,135,5],"#852"],[[10,0,-10],[-10,0,-10],[-5,135,-15],[15,135,-15],"#852"],
													[[10,0,10],[-10,0,10],[-5,135,5],[15,135,5],"#852"],[[-10,220,-10],[-5,135,-15],[15,135,-15],[10,220,-10],"#852"],
													[[-10,220,10],[-5,135,5],[15,135,5],[10,220,10],"#852"],[[15,135,5],[15,135,-15],[10,0,-10],[10,0,10],"#852"]]), 
							new Icosahedron(0, 60, 0, 40, 35, 40, 1, "#0F0")];
	
	mapCaa = new Map(rZoneColor, [], "mapR1", "mapCa"); 
	mapCaa.contains = [		new Floor(), 
							new Wall(3)];
	
	mapCab = new Map("#F9FFBD", [], "mapCa", "mapY1"); 
	mapCab.contains = [ 	new Floor(),
							new Wall(3)];

	mapCb = new Map("#4096AA", [], "mapCba", "mapCbb"); 
	mapCb.contains = [ 	new Floor(), 
						new Wall(2), 
						new Wall(0),
						new Custom(0, -150, 0, [[[-10,220,-10],[-10,220,10],[-15,135,15],[-15,135,-5],"#852"],[[-10,0,10],[10,0,10],[5,135,15],[-15,135,15],"#852"],
												[[-10,0,-10],[10,0,-10],[5,135,-5],[-15,135,-5],"#852"],[[10,220,10],[5,135,15],[-15,135,15],[-10,220,10],"#852"],
												[[10,220,-10],[5,135,-5],[-15,135,-5],[-10,220,-10],"#852"],[[-15,135,-5],[-15,135,15],[-10,0,10],[-10,0,-10],"#852"]]), 
						new Icosahedron(0, 60, 0, 40, 35, 40, 3, "#0F0")];

	mapCba = new Map(gZoneColor, [], "mapG1", "mapCb"); 
	mapCba.contains = [ new Floor(), 
						new Wall(3)];
	
	mapCbb = new Map("#106BA0", [], "mapCb", "mapB1"); 
	mapCbb.contains = [ new Floor(),
						new Wall(3)];

	//four zones (green: #70C1B3   blue: #106BA0   yellow: #F9FFBD   red: #FF366B)



	//red zone	
	mapR1 = new Map(rZoneColor, [], "mapRS1", "mapR2"); 
	mapR1.contains = [ 	new Floor(), 
						new Wall(0), 
						new TiltedBox(26, -37, 156, 45, 5, 15, false, false, false, -0.5, 0, 0, 0), 
						new Box(60, -150, 120, 45, 25, 0), 
						new PartialBox(140, -100, 6, 25, 5, 70, true, true, true), 
						new Box(30, -130, 6, 0, 11, 107), 
						new Box(-35, -80, 5, 10, 70, 145), 
						new Box(150, -95, -85, 15, 15, 15), 
						new PartialBox(25, -135, -135, 25, 15, 15, true, true, true), 
						new AlphaBox(-35, -80, -145, 10, 70, 5, true), 
						new PartialBox(-10, -25, -135, 15, 15, 15, true, true, true)];
	
	mapR2 = new Map(rZoneColor, [], "mapR1", "mapR3"); 
	mapR2.contains = [ 	new Floor(), 
						new Wall(1), 
						new Box(0, -80, 35, 150, 70, 10), 
						new PartialBox(-135, -25, 10, 15, 15, 15, true, true, true), 
						new PartialBox(-135, -135, -25, 15, 15, 25, true, true, true), 
						new TiltedBox(156, -37, -26, 15, 5, 45, false, false, false, 0, 0, 0, 0.5), 
						new Box(120, -150, -60, 0, 25, 45), 
						new Box(6, -130, -30, 107, 11, 0), 
						new Box(-85, -95, -150, 15, 15, 15), 
						new PartialBox(6, -100, -140, 70, 5, 25, true, true, true)];

	mapR3 = new Map(rZoneColor, [], "mapR2", "mapR4"); 
	mapR3.contains = [ 	new Floor(), 
						new Wall(2), 
						new PartialBox(-25, -135, 135, 25, 15, 15, true, true, true), 
						new PartialBox(10, -25, 135, 15, 15, 15, true, true, true), 
						new Box(-150, -95, 85, 15, 15, 15), 
						new PartialBox(-140, -100, -6, 25, 5, 70, true, true, true), 
						new Box(-30, -130, -6, 0, 11, 107), 
						new Box(32, -80, 0, 5, 70, 150), 
						new Box(-60, -125, -120, 45, 25, 0), 
						new TiltedBox(-26, -32, -156, 45, 5, 15, true, false, false, 0.6, 0, 0, 0.25)];

	mapR4 = new Map(rZoneColor, [], "mapR3", "mapR5"); 
	mapR4.contains = [ 	new Floor(), 
						new Blocker(0), 
						new Wall(3)];


	mapR5 = new Map(rZoneColor, [], "mapR4_F", "mapR6"); 
	mapR5.contains = [ 	new Floor(), 
						new PartialBox(-5, -85, 70, 5, 65, 70, true, true, true), 
						new Box(-75, -80, 0, 75, 70, 5), 
						new Icosahedron(-45, -135, -100, 15, 15, 15, 1, "#F8C")];

	mapR6 = new Map(rZoneColor, [], "mapR5_F", "mapR7"); 
	mapR6.contains = [ 	new Floor(), 
						new PartialBox(-140, -42, -27, 15, 10, 25, true, true, true), 
						new Box(0, -110, -45, 150, 40, 5), 
						new PartialBox(132, -55, -71, 11, 10, 20, true, true, true), 
						new PartialBox(-80, -110, -115, 15, 15, 15, true, true, true)];

	mapR7 = new Map(rZoneColor, [], "mapR6", "mapR4_F"); 
	mapR7.contains = [ 	new Floor(), 
						new PartialBox(-115, -110, 80, 15, 15, 15, true, true, true), 
						new Icosahedron(60, -135, 80, 15, 15, 15, 1, "#F8C"), 
						new Box(-35, -110, 0, 5, 40, 150), 
						new PartialBox(-10, -45, 0, 15, 5, 30, true, true, true), 
						new PartialBox(-60, -55, -141, 12, 10, 11, true, true, true), 
						new Box(-15, -39, -222, 2, 26, 13)];
	
	mapR3_F = new Map(rZoneColor, [], "mapR_G", "mapR4_F"); 
	mapR3_F.contains = [new Floor(), 
						new Wall(0), 
						new Box(75, -80, 0, 75, 70, 5), 
						new PartialBox(5, -80, -75, 5, 70, 75, true, true, true)];				

	mapR4_F = new Map(rZoneColor, [], "mapR3_F", "mapR5"); 
	mapR4_F.contains = [new Floor(), 
						new Wall(1), 
						new PartialBox(-75, -80, -5, 75, 70, 5, true, true, true), 
						new Icosahedron(95, -135, -55, 15, 15, 15, 1, "#F8C"), 
						new Box(0, -80, -75, 5, 70, 75)];

	mapR5_F = new Map(rZoneColor, [], "mapR5", "mapR6"); 
	mapR5_F.contains = [new Floor(), 
						new PartialBox(75, -55, 130, 20, 10, 15, true, true, true), 
						new Icosahedron(-95, -135, 45, 15, 15, 15, 1, "#F8C"), 
						new Box(45, -110, 0, 5, 40, 150), 
						new TiltedBox(51, -59, 4, 17, 15, 75, true, true, true, 0, 0, 0.25, 0), 
						new PartialBox(105, -110, -85, 15, 15, 15, true, true, true), 
						new PartialBox(25, -110, -135, 15, 40, 15, true, true, true), 
						new PartialBox(25, -40, -135, 15, 10, 30, true, true, true)];

	mapR_G = new Map(rZoneColor, [], "mapR_H", "mapR_H"); 
	mapR_G.contains = [	new Floor(), 
						new Wall(3)];

	mapR_H = new Map(rZoneColor, [], "mapR_H", "mapR_H"); 
	mapR_H.contains = [ 	new Floor(), 
						new Custom(-150, 0, 0, [[[75,166,90],[20,166,52],[5,171,25],"#F05"],[[-25,-50,64],[-60,-90,-93],[-50,-5,-105],"#F05"],[[130,36,-20],[75,11,-58],[115,56,-80],"#F05"]]), 
						new Custom(150, 0, 0, [[[5,21,130],[-50,21,92],[-65,26,65],"#F05"],[[85,-5,9],[5,-155,-143],[-25,-5,-90],"#F05"],[[15,71,0],[-40,46,-38],[0,91,-60],"#F05"]]), 
						new TiltedBox(-55, -130, 0, 30, 15, 25, true, true, true, 0.5, 0, 0, 0), 
						new TiltedBox(55, -130, 0, 30, 15, 25, true, true, true, -0.5, 0, 0, 0), 
						new Cube(0, -125, 0, 25), 
						new TiltedBox(0, -130, -55, 25, 15, 25, true, true, true, 0, 0, 0, 0.75), 
						new Particle(-150, 0, -50, rParticleColor),
						new Particle(-50, -50, 150, rParticleColor),
						new Particle(0, 0, -150, rParticleColor),
						new Particle(50, 0, 0, rParticleColor),
						new Particle(150, 150, -50, rParticleColor),
						new Particle(-150, -50, 0, rParticleColor),
						new Particle(-50, 150, 50, rParticleColor),
						new CodeBlock("activate(0);")];
	
						
	mapRS1 = new Map(rZoneColor, [], "mapRS2", "mapR1"); 
	mapRS1.contains = [ 	new Floor(), 
						new Wall(3)];

	mapRS2 = new Map(rZoneColor, [], "mapRS2", "mapRS1"); 
	mapRS2.contains = [ 	new Floor(), 
						new Wall(2), 
						new Wall(2), 
						new Octohedron(-30, 55, -65, 15, 15, 15, undefined), 
						new Track(-80, -100, -175, 15, 0, 0, 140, 0, new Cube(-77, -97, -169, 20)), 
						new Octohedron(-55, -15, -80, 15, 15, 15, undefined), 
						new Octohedron(15, 50, -80, 15, 15, 15, undefined), 
						new Octohedron(-30, 25, -80, 15, 15, 15, undefined), 
						new Icosahedron(10, -90, -100, 25, 25, 25, true, "#F0F"), 
						new AlphaBox(-5, -135, -135, 15, 15, 15, true)];






	//yellow zone
	mapY1 = new Map(yZoneColor, [], "mapY1", "mapY2"); 
	mapY1.contains = [ 	new Floor(), 
						new TiltedBox(120, -125, -5, 30, 15, 70, true, true, true, 0, 0, -0.5, -0.25)];


	mapY2 = new Map(yZoneColor, [], "mapY1", "mapY3"); 
	mapY2.contains = [ 	new Floor(), 
						new Box(-101, -118, -90, 25, 25, 25), 
						new TiltedBox(-5, -125, -120, 70, 15, 30, true, true, true, -0.25, -0.5, 0, 0)];

	mapY3 = new Map(yZoneColor, [], "mapY2", "mapY4"); 
	mapY3.contains = [ 	new Floor(), 
						new Box(-90, -118, 101, 25, 30, 25), 
						new Box(60, -120, 75, 30, 5, 75), 
						new TiltedBox(-120, -125, 5, 30, 15, 70, true, true, true, 0, 0, 0.5, 0.25), 
						new Box(60, -133, -75, 30, 17, 75)];

	mapY4 = new Map(yZoneColor, [], "mapY3", "mapY5"); 
	mapY4.contains = [ 	new Floor(), 
						new Box(101, -118, 105, 25, 30, 25), 
						new TiltedBox(0, -120, 115, 70, 15, 30, true, true, true, 0.25, -0.5, 0, 0), 
						new Box(-75, -133, -60, 75, 17, 30), 
						new Box(75, -120, -60, 75, 5, 30), 
						new PartialBox(-85, -105, -125, 10, 45, 25, true, true, true)];

	mapY5 = new Map(yZoneColor, [], "mapY4", "mapY6"); 
	mapY5.contains = [ 	new Floor(), 
						new PartialBox(-125, -105, 85, 25, 45, 10, true, true, true), 
						new Box(-60, -133, 75, 30, 17, 75), 
						new Box(-20, -115, 25, 5, 35, 125), 
						new TiltedBox(120, -125, -5, 30, 15, 70, true, true, true, 0, 0, -0.5, -0.25), 
						new Box(-60, -120, -75, 30, 5, 75), 
						new Box(90, -118, -101, 25, 30, 25), 
						new PartialBox(-85, -55, -110, 15, 15, 45, true, true, true), 
						new Box(-20, -95, -125, 5, 55, 25)];

	mapY6 = new Map(yZoneColor, [], "mapY5", "mapY7"); 
	mapY6.contains = [ 	new Floor(), 
						new PartialBox(80, -105, 125, 15, 45, 25, true, true, true), 
						new PartialBox(-110, -55, 85, 45, 15, 15, true, true, true), 
						new Box(75, -135, 56, 75, 20, 30), 
						new Box(-75, -120, 56, 75, 5, 30), 
						new Box(-125, -95, 20, 25, 55, 5), 
						new Box(24, -115, 19, 122, 35, 5), 
						new PartialBox(-120, -55, 0, 25, 15, 100, true, true, true), 
						new Box(147, -115, -69, 3, 35, 81), 
						new Box(-101, -118, -90, 25, 30, 25), 
						new TiltedBox(-5, -125, -120, 70, 15, 30, true, true, true, -0.25, -0.5, 0, 0)];

	mapY7 = new Map(yZoneColor, [], "mapY6", "mapY8"); 
	mapY7.contains = [ 	new Floor(), 
						new Wall(1), 
						new Box(20, -95, 125, 5, 55, 25), 
						new Box(-90, -118, 101, 25, 30, 25), 
						new PartialBox(0, -55, 120, 100, 15, 25, true, true, true), 
						new Box(56, -120, 75, 30, 5, 75), 
						new Box(19, -115, 26, 5, 35, 62), 
						new TiltedBox(-130, -125, -5, 30, 15, 70, true, true, true, 0, 0, 0.5, 0.25), 
						new Box(85, -94, 10, 60, 61, 5), 
						new PartialBox(125, -105, -80, 25, 45, 15, true, true, true), 
						new Box(56, -133, -75, 30, 17, 75), 
						new TiltedBox(111, -135, -112, 10, 15, 28, true, true, true, 0, 0, 0.25, 2), 
						new Box(20, -122, -87, 5, 28, 63), 
						new Box(-32, -115, -144, 116, 35, 7)];

	mapY8 = new Map(yZoneColor, [], "mapY7", "mapY_G"); 
	mapY8.contains = [ 	new Floor(), 
						new Wall(2), 
						new TiltedBox(5, -125, 120, 70, 15, 30, true, true, true, -0.25, -0.5, 0, 0), 
						new Box(101, -118, 90, 25, 30, 25), 
						new Box(-146, -115, 32, 4, 35, 118), 
						new PartialBox(125, -50, 0, 25, 15, 100, true, true, true), 
						new Box(125, -95, -20, 25, 55, 5), 
						new Box(-87, -115, -20, 63, 35, 5), 
						new Box(26, -115, -19, 62, 35, 5), 
						new Box(-75, -133, -56, 75, 17, 30), 
						new Box(75, -120, -56, 75, 5, 30), 
						new Box(-20, -75, -90, 5, 75, 60), 
						new PartialBox(-80, -105, -125, 15, 45, 25, true, true, true)];

	mapY_G = new Map(yZoneColor, [], "mapY_H", "mapY_H"); 
	mapY_G.contains = [	new Floor(), 
						new Wall(3)];
	
	mapY_H = new Map(yZoneColor, [], "mapY_H", "mapY_H"); 
	mapY_H.contains = [ 	new Floor(), 
						new Custom(0, -40, 195, [[[285,170,-5],[250,25,-110],[195,141,-60],"#FF0"],[[80,65,-75],[50,60,-70],[85,-14,-95],"#FF0"],[[-265,15,-255],[-285,125,-175],[-200,86,-195],"#FF0"]]), 
						new PartialBox(50, -125, 115, 25, 15, 25, true, true, true), 
						new PartialBox(-120, -125, 80, 25, 15, 45, true, true, true), 
						new Icosahedron(0, 280, 0, 100, 75, 100, true, "#FF0"), 
						new PartialBox(115, -120, 25, 20, 15, 85, true, true, true), 
						new Cube(0, -105, 0, 25), 
						new Custom(0, 50, 0, [[[110,160,140],[135,70,155],[65,126,90],"#FF0"],[[20,45,-75],[-35,45,-70],[0,-29,-85],"#FF0"],[[-120,10,-50],[-95,115,-10],[-75,96,-30],"#FF0"]]), 
						new Custom(130, -150, -150, [[[65,0,0],[-10,0,0],[10,105,0],"#FF0"]]), 
						new Custom(-100, -150, -150, [[[-35,15,5],[-75,95,15],[5,126,0],"#FF0"]]), 
						new Particle(-150, 0, -50, yParticleColor),
						new Particle(-50, -50, 150, yParticleColor),
						new Particle(0, 0, -150, yParticleColor),
						new Particle(50, 0, 0, yParticleColor),
						new Particle(150, 150, -50, yParticleColor),
						new Particle(-150, -50, 0, yParticleColor),
						new Particle(-50, 150, 50, yParticleColor),
						new CodeBlock("activate(1);")];





	//green zone
	mapG1 = new Map(gZoneColor, [], "mapG2", "mapCba"); 
	mapG1.contains = [	new Floor(), 
						new Box(148, -95, 0, 2, 55, 150), 
						new Box(0, -120, 0, 5, 30, 150)];

	mapG2 = new Map(gZoneColor, [], "mapG2_2", "mapG1"); 
	mapG2.contains = [ 	new Floor(), 
						new Box(0, -100, 0, 150, 50, 5), 
						new Box(0, -100, -75, 5, 50, 75)];

	mapG2_2 = new Map(gZoneColor, [], "mapG3", "mapG2"); 
	mapG2_2.contains = [new Floor(), 
						new Box(0, -100, 75, 5, 50, 75), 
						new Box(-75, -100, 0, 75, 50, 5), 
						new Box(75, -100, 0, 75, 50, 5), 
						new PartialBox(0, -100, -75, 5, 50, 75, true, true, true)];

	mapG3 = new Map(gZoneColor, [], "mapG4", "mapG2_2"); 
	mapG3.contains = [ 	new Floor(), 
						new Wall(1), 
						new Box(0, -100, 75, 5, 50, 75), 
						new PartialBox(75, -100, 0, 75, 50, 5, true, true, true), 
						new PartialBox(-10, -100, -75, 5, 50, 75, true, true, true), 
						new Box(0, -100, -75, 5, 50, 75)];

	mapG4 = new Map(gZoneColor, [], "mapG5", "mapG3"); 
	mapG4.contains = [ 	new Floor(), 
						new Box(0, -100, 75, 5, 50, 75), 
						new Box(-75, -100, 0, 75, 50, 5), 
						new Box(75, -100, 0, 75, 50, 5), 
						new PartialBox(75, -100, -10, 75, 50, 5, true, true, true),
						new Wall(0)];

	mapG5 = new Map(gZoneColor, [], "NaN", "mapG6"); 
	mapG5.contains = [ 	new Floor(), 
						new Box(-150, 0, 0, 1, 150, 150), 
						new Wall(3)];

	mapG6 = new Map(gZoneColor, [], "mapG5", "mapG7"); 
	mapG6.contains = [ 	new Floor(), 
						new Box(65, -110, -100, 15, 15, 35), 
						new PartialBox(8, -100, -115, 2, 50, 40, true, true, true), 
						new PartialBox(-7, -60, -115, 2, 30, 35, true, true, true), 
						new Box(0, -90, -130, 5, 60, 20)];

	mapG7 = new Map(gZoneColor, [], "mapG6", "mapG8"); 
	mapG7.contains = [ 	new Floor(), 
						new Box(45, -135, 125, 1, 15, 35), 
						new Box(-30, -120, 120, 1, 30, 30), 
						new Box(95, -135, 90, 56, 20, 1), 
						new Box(-105, -90, 0, 45, 60, 5), 
						new PartialBox(-110, -100, -8, 40, 50, 2, true, true, true), 
						new Box(-95, -150, -80, 55, 0, 70), 
						new Box(75, -120, -76, 75, 30, 1), 
						new Box(-41, -115, -105, 2, 35, 46)];

	mapG8 = new Map(gZoneColor, [], "mapG7_F", "mapG9"); 
	mapG8.contains = [ 	new Floor(), 
						new Wall(1), 
						new Box(50, -120, 100, 1, 30, 50), 
						new Box(100, -120, 50, 50, 30, 1), 
						new Box(-100, -135, -50, 50, 15, 1), 
						new Box(100, -135, -50, 50, 15, 1), 
						new Box(50, -135, -100, 1, 15, 51), 
						new PartialBox(-45, -98, -100, 2, 52, 51, true, true, true)];

	mapG9 = new Map(gZoneColor, [], "mapG8", "mapG_G"); 
	mapG9.contains = [ 	new Floor(), 
						new Wall(2), 
						new Box(-40, -120, 105, 1, 30, 50), 
						new PartialBox(-95, -100, 50, 55, 50, 1, true, true, true), 
						new Box(100, -120, -50, 50, 30, 1), 
						new Box(146, -90, -102, 1, 60, 49), 
						new Box(50, -120, -100, 1, 30, 51), 
						new PartialBox(47, -120, -106, 1, 30, 45, true, true, true), 
						new PartialBox(-39, -103, -135, 1, 47, 19, true, true, true), 
						new Box(-36, -102, -135, 1, 48, 16)];

	mapG7_F = new Map(gZoneColor, [], "mapG_G", "mapG8"); 
	mapG7_F.contains = [new Floor(), 
						new Wall(0), 
						new Box(50, -135, 100, 1, 15, 50), 
						new Box(-40, -120, 75, 1, 30, 76), 
						new PartialBox(-37, -120, 75, 1, 30, 76, true, true, true), 
						new Box(95, -135, 50, 56, 15, 1), 
						new Box(-95, -135, -50, 55, 15, 1), 
						new PartialBox(100, -100, -53, 50, 50, 1, true, true, true), 
						new Box(-40, -120, -75, 1, 30, 76), 
						new PartialBox(-37, -120, -75, 1, 30, 76, true, true, true), 
						new Box(-148, -110, -135, 1, 40, 15), 
						new PartialBox(54, -100, -100, 1, 50, 51, true, true, true), 
						new Box(50, -100, -100, 1, 50, 50)];

	mapG_G = new Map(gZoneColor, [], "NaN", "mapG_H"); 
	mapG_G.contains = [	new Floor(), 
						new Wall(3)];

	mapG_H = new Map(gZoneColor, [], "mapG_H", "mapG_H"); 
	mapG_H.contains = [	new Floor(), 
						new Cube(0, -100, 0, 25), 
						new TiltedBox(0, -130, -20, 25, 15, 25, true, true, true, 0, 0, 0, 1.25), 
						new PartialBox(0, -150, -95, 35, 0, 55, true, true, true), 
						new Box(-30, -95, -75, 1, 55, 76), 
						new Box(30, -95, -75, 1, 55, 76), 
						new Particle(-50, 150, 0, gParticleColor), 
						new Particle(0, 0, 50, gParticleColor), 
						new Particle(0, -150, 0, gParticleColor),
						new Particle(0, 0, 0, gParticleColor),
						new Particle(-150, -50, -50, gParticleColor),
						new Particle(50, 50, 0, gParticleColor),
						new Particle(0, -50, 150, gParticleColor),
						new CodeBlock("activate(2);")];	





						


	//blue zone persistient objects
	blockoTracko = new Track(50, -135, 100, -120, -135, -100, 300, 100, new PartialBox(-39, -135, -4, 20, 20, 20, true, true, true));
	blockoTracko2 = new Track(50, -135, 100, 100, -135, -120, 300, 100, new PartialBox(-39, -135, -4, 20, 20, 20, true, true, true));
	
	//blue zone
	mapB1 = new Map(bZoneColor, [], "mapB1", "mapB2"); 
	mapB1.contains = [ 	new Floor(), 
						new Wall(2), 
						new Box(-145, -95, 0, 5, 55, 150), 
						new Box(30, -105, 0, 5, 45, 150), 
						new Track(0, -135, -50, 0, -65, -50, 250, 0, new Cube(0, -124, -50, 20))];

	mapB2 = new Map(bZoneColor, [], "mapB1_F", "NaN"); 
	mapB2.contains = [ 	new Floor(), 
						new Wall(3)];

	mapB1_F = new Map(bZoneColor, [], "mapB0_F", "mapBS1"); 
	mapB1_F.contains = [new Floor(), 
						new PartialBox(-131, -100, 131, 20, 30, 20, false, true, false), 
						new Box(-45, -149, 0, 105, 1, 150), 
						new AlphaBox(149, 0, 0, 1, 150, 150, 1), 
						new Track(-15, -80, 130, -11, -150, -95, 230, 0, new PartialBox(21, -144, 75, 20, 20, 20, false, true, false))];

	mapB0_F = new Map(bZoneColor, [], "mapB3", "mapB1_F"); 
	mapB0_F.contains = [new Floor(), 
						new Wall(1), 
						new Box(0, -149, -45, 150, 1, 105), 
						new Track(-130, -80, -25, 95, -150, -21, 230, 0, new PartialBox(21, -144, 75, 20, 20, 20, false, true, false)), 
						new PartialBox(-131, -100, -124, 20, 30, 27, false, true, false), 
						new Box(-159, -25, -126, 1, 18, 24), 
						new PartialBox(-131, -71, -124, 20, 5, 27, true, true, true)];

	mapB3 = new Map(bZoneColor, [], "mapB4", "mapB0_F"); 
	mapB3.contains = [ 	new Floor(), 
						new Wall(0), 
						new Box(45, -149, 0, 105, 1, 150), 
						new Track(25, -80, -130, 21, -150, 95, 230, 0, new PartialBox(21, -144, 75, 20, 20, 20, false, true, false)), 
						new PartialBox(124, -100, -131, 27, 30, 20, false, true, false), 
						new PartialBox(124, -71, -131, 27, 5, 20, true, true, true), 
						new Box(126, -25, -159, 24, 18, 1)];

	mapB4 = new Map(bZoneColor, [], "mapB5", "mapB3"); 
	mapB4.contains = [ 	new Floor(), 
						new Wall(3)];

		
	mapB5 = new Map(bZoneColor, [], "mapB6", "mapB4"); 
	mapB5.contains = [ 	new Floor(), 
						new Wall(2), 
						new Box(0, -100, 185, 160, 50, 1),
						new Track(50, -105, -100, 50, -105, 100, 1200, 0, blockoTracko), 
						new CodeBlock("sync(blockoTracko, blockoTracko2, Math.PI / 2);")];

	mapB6 = new Map(bZoneColor, [], "mapB7", "mapB5"); 
	mapB6.contains = [ 	new Floor(), 
						new Wall(1), 
						blockoTracko2,
						new Box(-185, -90, 0, 1, 60, 170),
						new PartialBox(-70, -25, -20, 15, 5, 55, true, true, true), 
						new Track(-68, -75, -129, -68, -35, -129, 300, 150, new Cube(-68, -35, -129, 20)),
						new CodeBlock("sync(blockoTracko, blockoTracko2, Math.PI / 2);")];

	mapB7 = new Map(bZoneColor, [], "mapB_G", "mapB6"); 
	mapB7.contains = [ 	new Floor(), 
						new Wall(0), 
						new Track(129, -75, -68, 129, -35, -68, 300, 150, new Cube(129, -36, -68, 20)), 
						new PartialBox(20, -30, -70, 55, 5, 35, true, true, true), 
						new Box(0, -95, -135, 195, 70, 20)];

	mapB_G = new Map(bZoneColor, [], "mapB_H", "mapB_H"); 
	mapB_G.contains = [	new Floor(), 
						new Wall(3)];

	mapB_H = new Map(bZoneColor, [], "mapB_H", "mapB_H"); 
	mapB_H.contains = [	new Floor(), 
						new Box(-44, -80, 74, 1, 80, 110), 
						new PartialBox(-49, -85, 74, 1, 75, 110, true, true, true), 
						new PartialBox(-5, -65, -120, 30, 25, 25, true, true, true), 
						new Track(-110, -140, 0, -110, -60, 0, 140, 0, new PartialBox(-110, -104, 0, 20, 20, 20, true, true, true)), 
						new CodeBlock("activate(3);"), 
						new Octohedron(-240, 240, 40, 15, 30, 15, true), 
						new Octohedron(125, 165, 115, 15, 30, 15, true), 
						new Octohedron(230, 130, 20, 15, 30, 15, true), 
						new Octohedron(155, 200, 20, 15, 30, 15, true), 
						new Octohedron(-95, 210, 20, 15, 30, 15, true), 
						new Octohedron(-130, 155, 10, 15, 30, 15, true), 
						new Octohedron(195, 165, -40, 15, 30, 15, true), 
						new Octohedron(245, 130, -100, 15, 30, 15, true), 
						new Octohedron(0, 165, -10, 15, 30, 15, true), 
						new Octohedron(-50, 120, -20, 15, 30, 15, true), 
						new Octohedron(-160, 90, -130, 15, 30, 15, true), 
						new Octohedron(110, 40, -190, 15, 30, 15, true), 
						new Particle(-50, 150, 0), 
						new Particle(0, 0, 50), 
						new Particle(0, -150, 0), 
						new Particle(0, 0, 0), 
						new Particle(-150, -50, -50), 
						new Particle(50, 50, 0), 
						new Particle(0, -50, 150)];

	mapBS1 = new Map(bZoneColor, [], "mapB1_F", "mapBS2"); 
	mapBS1.contains = [	new Floor(), 
						new AlphaBox(0, 0, -150, 150, 150, 1, 0),
						new Text("I don't like this zone :(")];

	mapBS2 = new Map(bZoneColor, [], "mapBS1", "mapBS3"); 
	mapBS2.contains = [	new Floor(), 
						new Text("Also sorry about the glitches in the last section")];

	mapBS3 = new Map(bZoneColor, [], "mapBS2", "mapBS3"); 
	mapBS3.contains = [	new Floor(), 
						new Text("maybe I'll fix them eventually")];






						


	//ending maps
	mapE1 = new Map("#75593D", [], "mapE2", "menuMap"); 
	mapE1.contains = [	new Floor(), 
						new Wall(2), 
						new Text("Press X to Rotate" + spaces)];


	mapE2 = new Map("#574635", [], "mapE3", "mapE1"); 
	mapE2.contains = [ 	new Floor(), 
						new Text("Press X to Rotate" + spaces + spaces)];

	mapE3 = new Map("#3B342B", [], "mapE4", "mapE2"); 
	mapE3.contains = [ 	new Floor(), 
						new Text("Press X to Rotate" + spaces + spaces + spaces)];

	mapE4 = new Map(eZoneColor, [], "mapE5", "mapE3"); 
	mapE4.contains = [ 	new Floor(), 
						new AlphaBox(-150, 0, 0, 1, 150, 150, 1), 
						new Box(0, -90, 0, 150, 60, 5), 
						new Text("Press F to fade")];

	mapE5 = new Map(eZoneColor, [], "mapE6", "mapE4"); 
	mapE5.contains = [ 	new Floor(), 
						new Box(-145, -90, 0, 5, 60, 150), 
						new PartialBox(30, -55, -40, 25, 15, 35, true, true, true), 
						new PartialBox(15, -63, -70, 50, 15, 35, true, true, true), 
						new AlphaBox(-15, -100, -118, 25, 45, 38, 0),
						new Text("Press R to counter-fade")];

	mapE6 = new Map(eZoneColor, [], "mapE7", "mapE5"); 
	mapE6.contains = [ 	new Floor(), 
						new Wall(0), 
						new PartialBox(40, -55, 30, 35, 15, 25, true, true, true), 
						new PartialBox(70, -63, 15, 35, 15, 50, true, true, true),
						new Box(0, -90, -131, 150, 60, 20)];

	mapE7 = new Map(eZoneColor, [], "NaN", "mapE6_F"); 
	mapE7.contains = [ 	new Floor(),
						new Wall(3)];

	mapE6_F = new Map(eZoneColor, [], "mapE7", "mapE5_F"); 
	mapE6_F.contains = [new Floor(), 
						new Wall(0), 
						new Wall(2), 
						new Box(20, -95, 0, 15, 55, 150), 
						new AlphaBox(-110, -148, -130, 40, 2, 20, 0), 
						new AlphaBox(-34, -66, -107, 15, 11, 35, 0), 
						new PartialBox(-5, -45, -137, 10, 5, 13, true, true, true)];

	mapE5_F = new Map(eZoneColor, [], "mapE6_F", "mapEC"); 
	mapE5_F.contains = [new Floor(), 
						new Wall(3)];


				

	
	//ending after crossroads
	mapEC = new Map("#222222", [], "mapEC1", "mapEC"); 
	mapEC.contains = [ 	new Floor(), 
						new Icosahedron(90, -110, 25, 40, 30, 50, true, "#8F0"), 
						new Icosahedron(-70, -100, -125, 50, 50, 50, true, "#8F0"), 
						new Icosahedron(30, -110, -160, 5, 30, 25, true, "#8F0"),
						new Text("The crossroads" + spaces + spaces + "Welcome to "),
						new CodeBlock(`gameFlags["atEC"] = true;`)];

	mapEC1 = new Map("#002200", [], "mapEC4", "mapEC2"); 
	mapEC1.contains = [	new Floor(), 
						new Wall(1),
						new Box(0, -85, -75, 5, 65, 75)];

	mapEC2 = new Map("#002200", [], "mapEC1", "mapEC3"); 
	mapEC2.contains = [ 	new Floor(), 
						new Wall(0), 
						new Box(75, -85, 0, 75, 65, 5), 
						new Box(5, -85, -75, 5, 65, 75)];

	mapEC3 = new Map("#002200", [], "NaN", "mapEC5"); 
	mapEC3.contains = [	new Floor(), 
						new Wall(3)];

	mapEC4 = new Map("#002200", [], "mapEC3", "mapEC1"); 
	mapEC4.contains = [ 	new Floor(), 
						new Wall(2), 
						new Box(-75, -85, 0, 75, 65, 5), 
						new Box(-150, -85, -75, 1, 65, 75)];	

	mapEC5 = new Map("#002200", [], "mapEC5", "mapEC6"); 
	mapEC5.contains = [ 	new Floor(), 
						new PartialBox(60, -105, 125, 15, 45, 15, true, true, true), 
						new PartialBox(-148, -73, -1, 1, 77, 151, true, true, true), 
						new Box(-143, -75, 0, 2, 75, 150), 
						new Box(0, -149, 0, 150, 1, 150), 
						new PartialBox(115, -65, -85, 15, 10, 20, true, true, true), 
						new PartialBox(-45, -107, -135, 11, 43, 15, true, true, true)];

	mapEC6 = new Map("#000022", [], "mapEC6", "mapEC7"); 
	mapEC6.contains = [	new Floor(), 
						new PartialBox(55, -95, 125, 15, 5, 15, true, true, true), 
						new PartialBox(-148, -73, -1, 1, 77, 152, true, true, true), 
						new Box(-143, -75, 0, 2, 75, 150), 
						new Box(0, -149, 0, 150, 1, 150), 
						new PartialBox(-45, -107, -135, 11, 43, 15, true, true, true)];

	mapEC7 = new Map("#220000", [], "mapEC6", "mapED1"); 
	mapEC7.contains = [ 	new Floor()];

	mapED1 = new Map("#440022", [], "mapEC7", "mapED2"); 
	mapED1.contains = [new Floor(), new PartialBox(0, -150, 0, 150, 0, 150, true, true, true)];

	mapED2 = new Map("#882244", [], "mapED3", "mapED2"); 
	mapED2.contains = [ 	new Floor(),
							new PartialBox(75, -150, 75, 75, 0, 75, true, true, true), 
							new PartialBox(-75, -150, 75, 75, 0, 75, true, true, true), 
							new PartialBox(75, -150, -75, 75, 0, 75, true, true, true), 
							new PartialBox(-75, -150, -75, 75, 0, 75, true, true, true)];

	mapED3 = new Map("#AA4488", [], "mapED4", "mapED2"); 
	mapED3.contains = [	new Floor(),
						new PartialBox(100, -150, 100, 50, 0, 50, true, true, true), 
						new PartialBox(-100, -150, 100, 50, 0, 50, true, true, true), 
						new PartialBox(0, -150, 100, 50, 0, 50, true, true, true), 
						new PartialBox(100, -150, 0, 50, 0, 50, true, true, true), 
						new PartialBox(-100, -150, 0, 50, 0, 50, true, true, true), 
						new PartialBox(0, -150, 0, 50, 0, 50, true, true, true), 
						new PartialBox(100, -150, -100, 50, 0, 50, true, true, true), 
						new PartialBox(-100, -150, -100, 50, 0, 50, true, true, true), 
						new PartialBox(0, -150, -100, 50, 0, 50, true, true, true)];

	mapED4 = new Map("#AA88AA", [], "mapED5", "mapED3"); 
	mapED4.contains = [ new PartialBox(120, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 0, 30, 0, 30, true, true, true), 
						new PartialBox(120, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, -120, 30, 0, 30, true, false, true),
						new CodeBlock("falseFloor();")];

	mapED5 = new Map("#AACCAA", [], "mapED6", "mapED4"); 
	mapED5.contains = [	new CodeBlock("falseFloor();"), 
						new PartialBox(-120, -151, 60, 35, 0, 35, true, false, true), 
						new PartialBox(-120, -150, 60, 30, 0, 30, true, true, true), 
						new PartialBox(-120, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(120, -151, -120, 35, 0, 35, true, false, true), 
						new PartialBox(120, -150, -120, 30, 0, 30, true, true, true), 
						new PartialBox(-60, -151, -120, 35, 0, 35, true, false, true), 
						new PartialBox(-60, -150, -120, 30, 0, 30, true, true, true), 
						new PartialBox(60, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, -120, 30, 0, 30, true, false, true)];

	mapED6 = new Map("#CCCCAA", [], "mapED7", "mapED5"); 
	mapED6.contains = [	new CodeBlock("falseFloor();"), 
						new PartialBox(120, -151, 120, 35, 0, 35, true, false, true), 
						new PartialBox(120, -150, 120, 30, 0, 30, true, true, true), 
						new PartialBox(60, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -151, 120, 35, 0, 35, true, false, true), 
						new PartialBox(0, -150, 120, 30, 0, 30, true, true, true), 
						new PartialBox(-120, -151, 60, 35, 0, 35, true, false, true), 
						new PartialBox(-120, -150, 60, 30, 0, 30, true, true, true), 
						new PartialBox(-120, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(120, -151, -60, 35, 0, 35, true, false, true), 
						new PartialBox(-120, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -60, 30, 0, 30, true, true, true), 
						new PartialBox(60, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -150, -120, 30, 0, 30, true, false, true)];

	mapED7 = new Map("#CCCCCC", [], "mapED8", "mapED6"); 
	mapED7.contains = [ 	new CodeBlock("falseFloor();"), 
						new PartialBox(60, -151, 120, 35, 0, 35, true, false, true), 
						new PartialBox(60, -150, 120, 30, 0, 30, true, true, true), 
						new PartialBox(60, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -151, 0, 40, 0, 40, true, false, true), 
						new PartialBox(-120, -150, 0, 30, 0, 30, true, true, true), 
						new PartialBox(60, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -120, 30, 0, 30, true, false, true), 
						new AlphaBox(-150, -95, -120, 1, 25, 30, 1), 
						new PartialBox(-60, -151, -120, 40, 0, 40, true, false, true), 
						new PartialBox(-60, -150, -120, 30, 0, 30, true, true, true), 
						new PartialBox(-150, -35, -120, 0, 35, 30, false, false, false), 
						new AlphaBox(0, -149, -120, 15, 1, 15, 1)];

	mapED8 = new Map("#CCCCFF", [], "mapE_H", "mapED7"); 
	mapED8.contains = [	new CodeBlock("falseFloor();"), 
						new PartialBox(-120, -151, 120, 35, 0, 35, true, false, true), 
						new PartialBox(120, -151, 120, 35, 0, 35, true, false, true), 
						new PartialBox(-120, -150, 120, 30, 0, 30, true, true, true), 
						new PartialBox(120, -150, 120, 30, 0, 30, true, true, true), 
						new PartialBox(-120, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 0, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(-60, -151, -120, 35, 0, 35, true, false, true), 
						new PartialBox(-60, -150, -120, 30, 0, 30, true, true, true), 
						new PartialBox(60, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, -120, 30, 0, 30, true, false, true)];

	mapE_H = new Map("#FFFFFF", [], "mapE_H", "mapED8"); 
	mapE_H.contains = [	new CodeBlock("falseFloor();"), 
						new CodeBlock("activateFinalCutscene();"), 
						new PartialBox(-120, -151, 120, 35, 0, 35, true, false, true), 
						new PartialBox(-120, -150, 120, 30, 0, 30, true, true, true), 
						new PartialBox(-60, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -150, 120, 30, 0, 30, true, false, true), 
						new PartialBox(-150, -120, 60, 0, 30, 30, false, false, false), 
						new PartialBox(0, -150, 60, 30, 0, 30, true, false, true), 
						new PartialBox(-120, -151, 0, 35, 0, 35, true, false, true), 
						new PartialBox(-150, -120, 0, 0, 30, 30, false, false, false), 
						new PartialBox(-120, -150, 0, 30, 0, 30, true, true, true), 
						new PartialBox(0, -150, 0, 30, 0, 30, true, false, true), 
						new AlphaBox(0, -123, 0, 30, 27, 30, true), 
						new PartialBox(120, -151, -60, 35, 0, 35, true, false, true), 
						new PartialBox(-150, -120, -60, 0, 30, 30, false, false, false), 
						new PartialBox(-120, -150, -60, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -60, 30, 0, 30, true, true, true), 
						new PartialBox(-150, -60, -90, 0, 30, 60, false, false, false), 
						new PartialBox(-150, -120, -120, 0, 30, 30, false, false, false), 
						new PartialBox(-120, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(120, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(60, -150, -120, 30, 0, 30, true, false, true), 
						new PartialBox(0, -151, -120, 35, 0, 35, true, false, true), 
						new PartialBox(-150, 0, -120, 0, 30, 30, false, false, false), 
						new PartialBox(0, -150, -120, 30, 0, 30, true, true, true)];

	
	mapE_HFinal = new Map("#FFFFFF", [], "mapE_HFinal", "mapE_HFinal");
	mapE_HFinal.contains = [new PartialBox(-120, -2000, 120, 0, 0, 0, true, true, true)];

	mapMT = new Map(bZoneColor, [], "mapMT", "mapMT"); 
	mapMT.contains = [	new Floor(),
						new Custom(0, -150, 0, [[[10,220,-10],[-10,220,-10],[-15,135,-15],[5,135,-15],"#852"],[[-10,0,-10],[-10,0,10],[-15,135,5],[-15,135,-15],"#852"],
												[[10,0,-10],[10,0,10],[5,135,5],[5,135,-15],"#852"],[[-10,220,10],[-15,135,5],[-15,135,-15],[-10,220,-10],"#852"],
												[[10,220,10],[5,135,5],[5,135,-15],[10,220,-10],"#852"],[[5,135,-15],[-15,135,-15],[-10,0,-10],[10,0,-10],"#852"]]),
						new Icosahedron(0, 60, 0, 40, 35, 40, 0, "#0F0"),
						new Track(-130, -130, -130, 130, -130, -130, 400, 10, new Cube(0, 0, 0, 10)),
						new Octohedron(-40, -80, -60, 15, 30, 15, true)
					 ];
}