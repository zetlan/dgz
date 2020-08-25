var map_out_data = ['   AAAA                                             aaaaaaaaaaaaaaaaaaa  e',
					'  AaaaAAAAAAAAAAAAAAAAAAAA A AAAA AA AA A                               a',
					'  Aaaaaaaaaaaaaaaa   aa  aaa  aaa  aaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaa',
					' Aaa0aaaaaaaaaaaaa  a aaa  aaa  a       a   a     aaaaaaaaaaaaaaaaaaaaaa  a',
					'  Aaaaaaaaaaaaaaaaaaa   aaaa  a  aaaaaaaaa  aaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					'  AaaaAAAAAAAAAAAAAAA AAA AA A A AA A  A                                a',
					'   AAAA                                             aaaaaaaaaaaaaaaaaaa  e',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'    aaaaaaaaaaaaaa',
					'    aaaaaaaaaaaaaaa',
					'    aaaaaaaaaaaaaa'];
	
	var map_out_entities = [new Orb("#FFF", 74, 3), new Text("Something went wrong ):", 11, 16)];

let map_out = new Map("#000000", map_out_data, [4, 3], map_out_entities, ["map_def"]);







	var map_def_data = [' AAAAAAAAAAAAAA      AAAAAAAA             AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
						'AaaaaaaaaaaaaaA     AaaaaaaaA         AAAAaaaaa0aaaaaaaaaaaaaaaaaaaaaaaaaA',
						' AAAAAAAAAAAAaA      AaAAAAAaA AAAAAAAAaaAaaAAAAAAAAAAAAAAAAAAAAA1AAAAAAAA',
						'           AaAAAAAAAAAaA  AaaAAaaaaaaaaAaAaaA                    a',
						'       AAAAAaAaaaaaaaaaaA AaAaAAaAAAAAAAaAaaA                     a',
						'      AaaaaaAaAAAAAAAAAA AaAAaAAaA   AaaAAAaA                    a',
						'      AaAAAAAaA          AAAAAaAAaA  AaAAaaaA        aaaaaaa     a',
						'     AaaaaaaaA          AaaaaaaAAaA  AaaaAAA        a     a     a',
						'      AAAAAAAA      AA  AaAAAAAAAaA   AAAA          a     a     a',
						'                   AaA AaA     AaA                 a  aaaa      a',
						'                    AaAAaAA    AaA                 a  a  a  aa  aa',
						'                    AaaaaaA   AaA                    a   a a a a a',
						'                     AaAAAaAAAAaA                    a   aaa  aa  a',
						'                    AaA AaaaaAaA                    a   a a   a',
						'                    AaA AaAAaAaA                     a  a     a',
						'                   AaA AaAAaAaA                      a',
						'                    AA AaAAaAaA                       a',
						'                      AaAaaAaA                        a   aaaaa',
						'                      AaAAAAaA                      aaaa  a',
						'                     AaaaaaaA                      a   a aaaaaaa',
						'                      AAAAAAA                      a   aaa',
						'                                                  a   a a',
						'                                                  a   a  a',
						'                                                     a  a',
						'                                                        a',
						'                                                       a',
						'                                                       a'];

	var map_def_entities = [new Text("Use A / D to move", 5, -3),
							new Text("E / Z", 17, 1),
							new Text("W / X", 28, -3),
							new Text("W", 27, 9), new Text("E", 28, 9), new Text("D", 29, 10), new Text("X", 28, 11), new Text("Z", 27, 11), new Text("A", 27, 10),
							new Text("Press Enter to revisit areas", 62, -2.5),
							new Text("that are already completed", 62, -1.5)
							];
let map_def = new Map("#22FF88", map_def_data, [1, 1], map_def_entities, ["map_wd0", "map_wd1"])








	var map_wd0_data = ['',
						'         b ',
						'  bbbbbbbbbbbbbbe',
						'          b'];
	
	var map_wd0_entities = [new Text("Press R to reset", 10, -2,),
							new Stone(10, 2)];

let map_wd0 = new Map(color_background_0, map_wd0_data, [2, 2], map_wd0_entities, []);






	var map_wd1_data = ['        AAAAAAAAA',
						'       AbbbbbbbbA   A',
						'       AbbbbbbbbbA          A',
						'      AbbbbbbbbbbAA   A  A',
						'      Abbbbbbbbbbbbbb',
						'     Abbbbbbbbbbbb Abb         A',
						'     Abbbbbbbbbbbb 0Abbb  A',
						'     Abbbbbbbbbbbb Abb',
						'      Abbbbbbbbbbbbbb A  A A',
						'      AbbbbbbbbbbAA  ',
						'       AbbbbbbbbbA A ',
						'       AbbbbbbbbA   AA     A',
						'        AbbbAAAAA    ',
						'       AbbbA          A A',
						'        AbbA            A',
						'       AbbA',
						' AAAAAAAbbbAAAAAAA   ',
						'AbbbbbbbbbbbAbbbbbbb ',
						' AAAAAAAAAAbAbAAAAAbb ',
						'         AbbAbA    bb ',
						'          AbAbA    b b ',
						'  AAAAAAAAbbAbA   bbbb ',
						'  AbbbbbbbbbbAbA  b bbb ',
						' AbAbbbbbbbbAbA   bbbb ',
						'  AbAbbbbbbbbAbA  bbb b ',
						'  A1AbbbbbbbAbA   bbbb ',
						'   AbAbbbbbbbAbA  b bbb ',
						'   A2AAAAAAAAbA   bbbb ',
						'    Ab3b4b5b6bA    bbb ',
						'    AAAAAAAAAA     bb ',
						'                   AeA',
						'                   AA'];

	var map_wd1_entities = [new Switch([6, 6], [18, 6], " ", "b"),
							new Orb("#AAAAFF", 19, 4), new Orb("#FFFFFF", 31, 5), new Orb("#FFAAFF", 24, 13), new Orb("#AAAAFF", 25, 3)];

	var map_wd1_connections = ["map_1_0", "map_1_1", "map_1_2", "map_1_3", "map_1_4", "map_1_5"];

let map_wd1 = new Map(color_background_1, map_wd1_data, [1, 17], map_wd1_entities, map_wd1_connections);





	var map_1_0_data = ['        AAAAAAAAA',
						'       AbbbbbbbbA                                            bbbbb',
						'       AbbbbbbbbbA                                          bb    bb',
						'      AbbbbbbbbbbAAAAAAAAAAAAAAAA                         bb       b',
						'      AbbbbbbbbbbbbbbbbbbbbbbbbbbA                        b b  b    bb',
						'     AbbbbbbbbbbbbbAbbbbbbbbbbbbbA                        b b        bbb',
						'     AbbbbbbbbbbbbbeAbbbbbbbbbbbbbA                       bb        b   bb',
						'     AbbbbbbbbbbbbbAbbbbbbbbbbbbbbA                       bbb   b        bb',
						'      AbbbbbbbbbbbbbbbbbbbbbbbbbbbbA                       bbb        b    b',
						'      AbbbbbbbbbbAAbbbbbbbbbbbbbbbbA    AAAAAA              bbb        b   b',
						'       AbbbbbbbbbA AbbbbbbbbbbbbbbbbA   AbbbbbA               bbb    b      b',
						'       AbbbbbbbbA AbbbbbbbbbbbbbbbbbA  AbbbbbbA                b            b',
						'        AAAAAAAAA AbbbbbbbbbbbbbbbbbbAAAbbbbbbbA               b            b',
						'                  AbbbbbbbbbbbbbbbbbbbbbbbbbbbbA              b    b   b    b',
						'         b A       AbbbbbbbbbbbbbbbbbbbbbbbbbbbbA              b            b',
						'       Abb         AbbbbbbbbbbbbbbbbbbbbbbbbbbbA              b  b   b     b',
						' AAA AAA            AbbbbbbbbbbbbbbbbbbbbbbbbbbA              bb            b',
						'Abbbbbbbbb b  b     AbbbbbbbbbbbbbbbbbbbbbbbbbA             bbb b      b   b',
						' AAAA  AAAbbA  A     AbbbbbbbbbbbbbbbbbbbbbbbbbA          bbbbbb       b   b',
						'          bbAb       AbbbbbbbbbbAAAAAbbbbbbbbbbA        bbbbbbb  b  b      b',
						'          AbA         AbbbbbbbbbA    Abbbbbbbbbbbbbbbbbbbbbbbb          bb b',
						'  A AAAAAAbbA A       AbbbbbbbbA     Abbbbbbbbbbbbbbbbbbbbbb        b  b b ',
						'  Ab b bbbbbbAb        AbbbbbbbA  b   Abbbbbbbbbbbbbbbbbbb  b   b  b    b',
						' AbA bb bbbbAbA        AbbbbbbA    b  AAAAAAAAA              b         b',
						'  Ab  bb  bbbb A  b     AAAAAAA           b        b      b    b        b',
						'  A A bbb  b bbbbbbb            b   b                b     b bb bb bbbbb',
						'   A A bbbbb A A  b b     bbb b  bbb    b    b          b    b bb bb b b',
						'   A A AAAAAA A   b b   bb  b  bb  b bb          b        bbb',
						'    A         A    b bb b b b b bb bbb                 b  b b',
						'    AAAA    A         b b b bb b  b  b    b              b',
						'                   A A bb     bb  b                       b ',
						'                   AA  b b   b b bbbbbbbbbbbbbbbbbbbbbbbbb'];

	var map_1_0_entities = [new Switch([6, 6], [74, 21], " ", "b"),
							new Orb("#AAAAFF", 28, 17), new Orb("#FFFFFF", 29, 15), new Orb("#FFAAFF", 30, 14), new Orb("#AAAAFF", 30, 13), new Text("Am I?", 10, 30)];
							
let map_1_0 = new Map(color_background_1, map_1_0_data, [18, 6], map_1_0_entities, [], true);




	var map_1_1_data = ['',
						'         b ',
						'  bbbbbbbbbbbbbbe',
						'          b'];
	
	var map_1_1_entities = [new Text("Press R to reset", 10, -2,),
							new Stone(10, 2)];

let map_1_1 = new Map(color_background_1, map_1_1_data, [2, 2], map_1_1_entities, []);




	var map_1_2_data = ['               ',
						'     bbbbbbbbb  ',
						'  bbbbbbbbbbbbbbe',
						'     bbbbbbbbb '];
	
	var map_1_2_entities = [new Stone(7, 1), new Stone(8, 2), new Stone(7, 3),
							new Stone(9, 1), new Stone(9, 2), new Stone(9, 3),
							new Stone(11, 1), new Stone(12, 2), new Stone(11, 3)];

let map_1_2 = new Map(color_background_1, map_1_2_data, [2, 2], map_1_2_entities, []);


	var map_1_3_data = ['               ',
						' bbbbbbbbb      ',
						'      bbbbb      ',
						'     bbbbbb    ',
						'    bbbbbbbb      ',
						'    bbbbbbbb     ',
						'    bbbbbbbbbbbbbbbe'];
	
	var map_1_3_entities = [new Switch([4, 4], [13, 6], " ", "b"), new Stone(9, 4)];

let map_1_3 = new Map(color_background_1, map_1_3_data, [1, 1], map_1_3_entities, []);


	var map_1_4_data = ['      bb       ',
						' bbbbbbbbb      ',
						'      bbbbbbbbbe ',
						'      bbb b    ',
						'    bbbb          '];
	
	var map_1_4_entities = [new Switch([6, 4], [12, 2], " ", "b"), 
							new Stone(6, 1), new Stone(7, 1), new Stone(6, 2), new Stone(8, 2), new Stone(9, 2), new Stone(6, 3), new Stone(7, 3)];

let map_1_4 = new Map(color_background_1, map_1_4_data, [1, 1], map_1_4_entities, []);


	var map_1_5_data = ['       bbbb    ',
						'      bbbbb     ',
						'      bbbbbb     ',
						'     bbbbbbb   ',
						'      bbbbbb      ',
						'      bbbbbbe',
						'       bbbb',
						'   bbbb  ',
						'   bbbbb  ',
						'  bbbbbb  ',
						'  bbbbbbb b',
						'  bbbbbb  ',
						'   bbbbb  ',
						'   bbbb b'];
	
	var map_1_5_entities = [new Switch([8, 13], [11, 5], " ", "b"),
							new Switch([5, 10], [9, 10], " ", "b"),
							new Switch([10, 10], [7, 13], " ", "b"),
							new Stone(6, 4), new Stone(6, 3)];

let map_1_5 = new Map(color_background_1, map_1_5_data, [8, 3], map_1_5_entities, []);

