
let system_main;
let system_start;

let system_a;
let system_b;
let system_c;
let system_c_a;
let system_d;



let shop_start;




2
//initializing function
function initWorld() {
	/*shop data!
	shops consist of text
	the first two lines are always the initial greeting and the return greeting
	a line format is 
	[`text, indented properly | player responsess`, [commands]]
	*/
	shop_start = [
		//intro
		[`"Hi! Welcome to my shop, what can I do for you?" |buy items|talk|leave`, [new Shop_setLine(3), new Shop_setLine(9), new Shop_escape()]],
		[`"Welcome back to my shop! How can I help you this time?" |buy items|talk|leave`, [new Shop_setLine(3), new Shop_setLine(9), new Shop_escape()]],
		[`"Anything else?"|buy items|talk|leave`, [new Shop_setLine(3), new Shop_setLine(9), new Shop_escape()]],
		//item list
		[`"What are you looking for? You have \${character.gold} coins."|nevermind|fuel|→`, [new Shop_setLine(2), new Shop_storeItem('10 fuel', 10, new Shop_addLine(2), `character.fuel += 10;`), new Shop_addLine(1)]],
		[`"What are you looking for? You have \${character.gold} coins."|←|hyperdrive|item4`, [new Shop_addLine(-1), new Shop_addLine(4), new Shop_addLine(1)]],
		//item buying
		[`"\${loading_state.item_name} costs \${loading_state.item_cost} coins, do you want to buy it?"|yes|no`, [new shop_buyItem(new Shop_addLine(1), new Shop_addLine(2)), new Shop_setLine(3)]],
		[`"Alright, you succesfully bought \${loading_state.item_name}"|→`, [new Shop_setLine(2)]],
		[`"Sorry, you don't have enough coins for \${loading_state.item_name},
		it costs \${loading_state.item_cost} coins."|->`, [new Shop_setLine(3)]],
		[`"We actually don't have that item in stock... sorry.
		However, there are other shops nearby, one of them probably has it."|→`, [new Shop_setLine(3)]],
		//talking
		[`"Any topics in mind?"|no|piloting a ship|→`, [new Shop_setLine(11), new Shop_setLine(16), new Shop_addLine(1)]],
		[`"Any topics in mind?"|←|about you|the world`, [new Shop_addLine(-1), 0, 0]],

		//no topic
		[`"I guess that's understandable, there's so much going on 
		these days that it's hard to have a specific topic in mind.
		Did you see the recent sports ball? You like sports?"|yeah|a little|not really`, [new Shop_addLine(1), new Shop_addLine(1), new Shop_addLine(1)]],
		[`"Lots of folks come in here and they talk about the sports 
		ball, it's always this team won or that team lost. 
		Personally, I'm not that interested in it. But it makes 
		sense that a lot of people like it."|I want to change the subject|→`, [new Shop_setLine(9), new Shop_addLine(1)]],
		[`"I'm not boring you, am I? I wouldn't want to talk for too long"|you're fine|I am actually really quite bored`, [new Shop_addLine(1), new Shop_escape()]],
		[`"Oh! This is a strange story. So the other day I'm just 
		standing here, y'know, running the shop, as I'm supposed to, 
		and this pal, this frendo, they walk into my shop, y'know?"|→`, [new Shop_addLine(1)]],
		[`"This person's really sharply dressed, a whole suit, they've
		got their hair greased up which is strange, because usually 
		people spend multiple days in space, but you would think this
		person had just arrived right at my shop. Anyways, this 
		person asks me if I sold hyperdrives, and I do in fact sell 
		hyperdrives, but I had to tell 'em that I was out, they asked 
		when I would get more, they were just a really annoying 
		customer as a whole. Didn't even buy anything else."|huh`, [new Shop_setLine(2)]],

		//talk about piloting
		[`"I've heard the controls aren't that difficult, but 
		getting to your destination is. Anyways, you use the 
		left, up, and right arrows to steer and fire the 
		thrusters. There's also a camera view you can get by
		pressing the M button."|→`, [new Shop_addLine(1)]],
		[`"I don't know that much more about it, you would have to ask other people."|→`, [new Shop_setLine(2)]],

		//talk about money
		[],

		//talk about you
		[],

		//talk about the world
		[]
	];










	//world data
	system_a = new System(new Star(0, 0, 0, 0, 70, 1.5e5, true, color_star_sun), [], 0);
	system_a.bodies = [
		new Planet_Orbiting(system_a, 700, 700, 0, 0, false, 10, 2e3, false, color_ice),
		new Planet_Orbiting(system_a, 450, 200, Math.PI * 0.666, 0, false, 10, 2e3, true, color_ice),
		new Planet_Orbiting(system_a, 1100, 1100, 0, Math.PI / 3, false, 15, 4e3, true, color_green),
		new Planet_Orbiting(system_a, 1700, 1450, Math.PI, 0, false, 20, 5e3, true, color_water),
	];



	system_b = new System(undefined, [], 0);
	//new Star_Binary(new Star(-40, 0, 0, -6, 20, 4.5e3, color_neutron), new Star(40, 0, 0, 6, 20, 4.5e3, color_neutron));//
	system_b.setCenter(new Star(0, 0, 0, 0, 50, 9e4, true, color_star_neutron));
	system_b.bodies = [
		new Planet_Orbiting(system_b, 4500, 4000, Math.PI / 2, Math.PI / -4, false, 20, 8e3, true, color_purple),
		new Planet_Orbiting(system_b, 3500, 3300, 0, 0, false, 30, 8e3, false, color_ice),
		new Planet_Orbiting(system_b, 1500, 1400, 0, Math.PI * 1.1, false, 25, 1e4, false, color_rocky)
	];



	system_c_a = new System(new Planet(0, 0, 0, 0, 35, 1e4, true, color_fuel), [], 0);
	system_c_a.bodies = [
		new Planet_Orbiting(system_c_a, 850, 700, Math.PI * 0.9, 0, false, 10, 4e2, false, color_rocky),
		new Planet_Orbiting(system_c_a, 550, 250, Math.PI * 0.4, Math.PI * 1.2, false, 8, 4e2, false, color_rocky),
		new Planet_Orbiting(system_c_a, 550, 250, Math.PI * 1.4, Math.PI * 1.2, false, 8, 4e2, false, color_rocky),
		new Planet_Orbiting(system_c_a, 1000, 1000, 0, 0, false, 12, 4e2, false, color_rocky),
	];



	system_c = new System(new Star(0, 0, 0, 0, 100, 1e5, true, color_star_warm), [], 0);
	system_c.bodies = [
		system_c_a,
		new Planet_Orbiting(system_c, 2000, 400, Math.PI * 0.6, 0, false, 8, 4e2, false, color_rocky),
		new Planet_Orbiting(system_c, 2000, 400, Math.PI * 1.3, Math.PI, false, 8, 4e2, false, color_rocky),
	];
	system_c_a.setOrbit(system_c, 5500, 4500, Math.PI * 1.3, 0, false);





	system_d_a = new System(new Planet(0, 0, 0, 0, 30, 4e3, false, color_rocky), [], 0);
	system_d_a.bodies = [
		new Planet_Orbiting(system_d_a, 800, 800, 0, Math.PI * 1.4, false, 7, 6e2, false, color_ice),
		new Shop_Entrance(system_d_a, 300, 300, 0, 0, false, shop_start)
	];



	system_d = new System(new Star(0, 0, 0, 0, 60, 9e4, true, color_white), [], 0);
	system_d.bodies = [
		system_d_a,
		new Planet_Orbiting(system_d, 1000, 1500, Math.PI * 1.3, 0, true, 30, 8.5e3, false, color_fuel)
	];
	system_d_a.setOrbit(system_d, 5500, 4500, Math.PI * 1.3, 0, false);



	system_main = new System(new Star(0, 0, 0, 0, 140, 1.5e6, true, color_black), [], 0);
	system_main.bodies = [
		new Planet_Orbiting(system_main, 1800, 1800, Math.PI / 3, Math.PI / 3, false, 10, 2e4, false, color_rocky),
		system_a,
		system_b,
		system_c,
		system_d,
		new Shop_Entrance(system_main, 3000, 3000, 0, 0, false)
	];
	system_a.setOrbit(system_main, 30000, 30000, Math.PI * 0.8, 0, false);
	system_b.setOrbit(system_main, 52000, 50000, 0, 0, false);
	system_c.setOrbit(system_main, 124000, 122000, Math.PI * 1.2, 0, false);
	system_d.setOrbit(system_main, 83000, 82000, 0, Math.PI * -0.4, false);
	
}