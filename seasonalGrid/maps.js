
	var map_def_data = [' AAAAAAAAAAAAAA      AAAAAAAA             AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
						'AaaaaaaaaaaaaaA     AaaaaaaaA         AAAAaaaaa0aaaaaaaaaaaaaaaaaaaaaaaaaA',
						' AAAAAAAAAAAAaA      AaAAAAAaA AAAAAAAAaaAaaAAAAAAAAAAAAAAAAAAAAAaAAAAAAAA',
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
let map_def = new Map("#22FF88", map_def_data, [1, 1], map_def_entities, ["map_wd1"])

	var map_wd1_data = ['        AAAAAAAAA',
						'       AbbbbbbbbA   A',
						'       AbbbbbbbbbA          A',
						'      AbbbbbbbbbbAA   A  A',
						'      Abbbbbbbbbbbbbb',
						'     AbbbbbbbbbbbbbAbb         A',
						'     Abbbbbbbbbbbbb0Abbb  A',
						'     AbbbbbbbbbbbbbAbb',
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

	var map_wd1_entities = [new Text("Welcome", 2, 13), 
							new Text("to the field!", 3, 14), 
							new Text("There are trials", 4, 19.5)];

let map_wd1 = new Map("#22FF88", map_wd1_data, [1, 17], map_wd1_entities, ["map_1_0"]);

	var map_1_0_data = ['        AAAAAAAAA',
						'       AaaaaaaaaA    ',
						'       AaaaaaaaaaA           ',
						'      AaaaaaaaaaaAAAAAAAAAAAAAAAA',
						'      AaaaaaaaaaaaaaaaaaaaaaaaaaaA',
						'     AaaaaaaaaaaaaaAaaaaaaaaaaaaaA',
						'     AaaaaaaaaaaaaaeAaaaaaaaaaaaaaA',
						'     AaaaaaaaaaaaaaAaaaaaaaaaaaaaaA',
						'      AaaaaaaaaaaaaaaaaaaaaaaaaaaaaA',
						'      AaaaaaaaaaaAAaaaaaaaaaaaaaaaaA    AAAAAA',
						'       AaaaaaaaaaA AaaaaaaaaaaaaaaaaA   AaaaaaA',
						'       AaaaaaaaaA AaaaaaaaaaaaaaaaaaA  AaaaaaaA',
						'        AAAAAAAAA AaaaaaaaaaaaaaaaaaaAAAaaaaaaaA',
						'                  AaaaaaaaaaaaaaaaaaaaaaaaaaaaaA',
						'         a A       AaaaaaaaaaaaaaaaaaaaaaaaaaaaaA',
						'       Aaa         AaaaaaaaaaaaaaaaaaaaaaaaaaaaA',
						' AAA AAA            AaaaaaaaaaaaaaaaaaaaaaaaaaaA',
						'Aaaaaaaaaa a  a     AaaaaaaaaaaaaaaaaaaaaaaaaaA',
						' AAAA  AAA aA  A     AaaaaaaaaaaaaaaaaaaaaaaaaaA',
						'          aaAa       AaaaaaaaaaaAAAAAaaaaaaaaaaA',
						'          AaA         AaaaaaaaaaA    AaaaaaaaaaaA',
						'  A AAAAAAaaA A       AaaaaaaaaA     AaaaaaaaaaA',
						'  Aa a aaaaaaAa        AaaaaaaaA      AaaaaaaaaA',
						' AaA aa aaaaAaA        AaaaaaaA       AAAAAAAAA',
						'  Aa  aa  aaa  A  a     AAAAAAA',
						'  A A aaa  a a    a    ',
						'   A A aaaaa A A  a     ',
						'   A A AAAAAA A   a    ',
						'    A         A    a   ',
						'    AAAA    A         ',
						'                   A A',
						'                   AA'];

	var map_1_0_entities = [new Orb("#AAAAFF", 28, 17), new Orb("#FFFFFF", 29, 15), new Orb("#FFAAFF", 30, 14), new Orb("#AAAAFF", 30, 13)];
							
let map_1_0 = new Map("#22FF88", map_1_0_data, [18, 6], map_1_0_entities, [], true);


	var map_1_1_data = ['',
						'         bb',
						'  bbbbbbbbbbbbbbe',
						'         bb'];
	
	var map_1_1_entities = [new Orb("#888", 10, 2)];

let map_1_1 = new Map("#", map_1_1_data, [2, 2], map_1_1_entities, [])

