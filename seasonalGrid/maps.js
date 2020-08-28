var map_out_data = ['   AAAA                                             aaaaaaaaaaaaaaaaaaaa e',
					'  AaaaAAAAAAAAAAAAAAAAAAAA A AAAA AA AA A                            a aa',
					'  Aaaaaaaaaaaaaaaa   aa  aaa  aaa  aaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaa   ',
					' Aaa0aaaaaaaaaaaaa  a aaa  aaa  a       a   a     aaaaaaaaaaaaaaaaaa aaaa1aa',
					'  Aaaaaaaaaaaaaaaaaaa   aaaa  a  aaaaaaaaa  aaaaaaaaaaaaaaaaaaaaaaaaaa   ',
					'  AaaaAAAAAAAAAAAAAAA AAA AA A A AA A  A                             a a ',
					'   AAAA                                             aaaaaaaaaaaaaaaaaaaa e',
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
	
	var map_out_entities = [new Switch([75, 3], [72, 5], " ", "a"),
							new Switch([69, 0], [72, 1], " ", "a"),
							new Orb("#FFF", 74, 3), new Text("Something went wrong ):", 11, 16)];

let map_out = new Map("#000000", map_out_data, [4, 3], map_out_entities, ["map_def"]);







	var map_def_data = [' AAAAAAAAAAAAAA      AAAAAAAA             AAAAAAAAAAAAAAAAAAAAAAAA AA  AAAAAAAAAA',
						'AaaaaaaaaaaaaaA     AaaaaaaaA         AAAAaaaaa0aaaaaaaaaaaaaa1aaaaaa a 2aaaaaaaa',
						' AAAAAAAAAAAAaA      AaAAAAAaA AAAAAAAAaaAaaAAAAAAAAAAAAAAAAAAAAAaAA AA aAAAAAAAA',
						'           AaAAAAAAAAAaA  AaaAAaaaaaaaaAaAaaA                    a     a',
						'       AAAAAaAaaaaaaaaaaA AaAaAAaAAAAAAAaAaaA                     a A  aaaaa',
						'      AaaaaaAaAAAAAAAAAA AaAAaAAaA   AaaAAAaA                    a    a   a',
						'      AaAAAAAaA          AAAAAaAAaA  AaAAaaaA        aaaaaaa     a    a   a',
						'     AaaaaaaaA          AaaaaaaAAaA  AaaaAAA        a     a     a    a  a a',
						'      AAAAAAAA      AA  AaAAAAAAAaA   AAAA          a     a     a    a  a a',
						'                   AaA AaA     AaA                 a  aaaa      a    a a  a',
						'                    AaAAaAA    AaA                 a  a  a  aa  aa   a a  a',
						'                    AaaaaaA   AaA                    a   a a a a a  a a   a',
						'                     AaAAAaAAAAaA                    a   aaa  aa  a a a   a',
						'                    AaA AaaaaAaA                 aaaa   a a a a    a a    a',
						'                    AaA AaAAaAaA                 a   a  a   a        a    a',
						'                   AaA AaAAaAaA                 a  a a  a  aaaaaaaaaaaa   a',
						'                    AA AaAAaAaA                 aaaa  a  a a              a',
						'                      AaAaaAaA                 a  a   a  a aaaa  a   a   a',
						'                      AaAAAAaA                 a  a  aaa  a      a   aaaaa ',
						'                     AaaaaaaA                 a  a  a  a aaaaaaaa   a',
						'                      AAAAAAA                 a  a  a  aaa a    a   a',
						'                                                a  a  a a  a   a   a',
						'                                                a  a  a      a     a',
						'                                                  a  a  a   a     a',
						'                                                  a     aaaaa     a',
						'                                                 aaaaaaa   a     a',
						'                                                       a   aaaaaaa',
						'                                                          a'];

	var map_def_entities = [new Text("Use A / D to move", 5, -3),
							new Text("E / Z", 17, 1),
							new Text("W / X", 28, -3),
							new Text("W", 27, 9), new Text("E", 28, 9), new Text("D", 29, 10), new Text("X", 28, 11), new Text("Z", 27, 11), new Text("A", 27, 10),
							new Text("Press Enter to revisit areas", 62, -2.5),
							new Text("that are already completed", 62, -1.5)
							];
let map_def = new Map("#22FF88", map_def_data, [1, 1], map_def_entities, ["map_wd0", "map_wd1", "map_wd2"])








	var map_wd0_data = ['',
						'   bcbbcccccc      CCCCCCCC',
						'   cbbcbcCcccc     CCCC5CCCC    ',
						'  bbabbccccccC    CCCCCCCCCC  C',
						'  bcbbbccccccc    CCC3CCCCCCC C',
						'  ccbcbcccCccc   CC6CCCCCCCCCCCCe',
						'   bcccccccccc   CCCCCCCCC4CCC   ',
						'   cccccccccc   CCCCCCCCCCCCCC  ',
						'    ccccccCcc   2                 ',
						'    cCccCccc   ccccccccc       ',
						'     ccccccc   cc               ',
						'      c       cc                ',
						'       cc0c1cccc'];

	var map_wd0_entities = [new Text("W", 12, 9), new Text("E", 13, 9), new Text("D", 14, 10), new Text("X", 13, 11), new Text("Z", 12, 11), new Text("A", 12, 10),];

let map_wd0 = new Map(color_background_0, map_wd0_data, [4, 3], map_wd0_entities, ["map_0_0", "map_0_1", "map_0_2", "map_0_3", "map_0_4", "map_0_5", "map_0_6"]);



	var map_0_0_data = ['cccccccccccc',
						'          cc',
						'   cccccccc c',
						'  c       c c',
						'  c cccccc c c',
						' c c    c  c c',
						' c c cccc c c c',
						'c ccc   c c ccc',
						' c c c ec c c c',
						' c   c   c   c',
						'  c c cccc c c',
						'  c c    cc c',
						'   c cccccc c',
						'   cc      c',
						'    cccccccc'];

	var map_0_0_entities = [];

let map_0_0 = new Map(color_background_0, map_0_0_data, [0, 0], map_0_0_entities, []);



	var map_0_1_data = ['     ccc  ccc',
						'    cc      c ',
						'    c ccccc  c ',
						'   c ccccccc c ',
						'   c cc   ccc c',
						'  c cc ccc cc c  ',
						'  c cc c  c cc c',
						' eccccc ccc c  e ',
						'  c cc c  c cc c',
						'  c cc ccc cc c   ',
						'     cc   ccc  ',
						'     ccccccc      ',
						'    c  ccccc c',
						'    c      cc',
						'     cccccccc'];

	var map_0_1_entities = [];

let map_0_1 = new Map(color_background_0, map_0_1_data, [8, 7], map_0_1_entities, []);




	var map_0_2_data = [' cccc cccccc cc',
						'  c   c  c    c',
						' cccccccccc ccc ',
						'       c  c  ',
						' cccc cc c cccc   ',
						'c   C   c  c  ',
						' cccCCccccc ccc   ',
						' c   C    e c ',
						' cc cCCcc c ccc    ',
						'  c   c      c ',
						'   cc ccccccccc    '];

	var map_0_2_entities = [];

let map_0_2 = new Map(color_background_0, map_0_2_data, [4, 0], map_0_2_entities, []);



	var map_0_3_data = ['',
						'cccccCCCCC  ',
						'  C CCCCCCCCCe',
						' C C C    C  ',
						' CCCCCCCCCCC  '];

	var map_0_3_entities = [];

let map_0_3 = new Map(color_background_0, map_0_3_data, [0, 1], map_0_3_entities, []);



	var map_0_4_data = ['',
						'cccCCCCCCCCC',
						'    CcCCCCcCC',
						'    CCCCCCCCC',
						'     CCCCCcCCC',
						'     CCCCCCCCC',
						'        C',
						'        C',
						'         e'];

	var map_0_4_entities = [];

let map_0_4 = new Map(color_background_0, map_0_4_data, [0, 1], map_0_4_entities, []);



	var map_0_5_data = ['',
						'cccCCCCCC CC',
						'    CCCCCCCCC',
						'    CCCC CCC ',
						'     CCCCCCCCC',
						'     CCCCCCCCC',
						'        C',
						'        C',
						'         e'];

	var map_0_5_entities = [];

let map_0_5 = new Map(color_background_0, map_0_5_data, [0, 1], map_0_5_entities, []);



	var map_0_6_data = ['              e',
						'           C C',
						'            CC',
						'  ccc       C',
						'  c  CCCCCCCCCCCC',
						' c  CCCCCCCCCC C',
						' c  CCCCCCCCCCCC   ',
						'   CCCCCCCCCCCCccc',
						'    CCCCCCCCCCC   c',
						'    CCCCCCCCCC  Cc',
						'     CCCCCCCCC CCc',
						'  C  CCCCCCCC   Cc C',
						'  CCC CCCCCCC    CCC ',
						' C C      CC    C  C',
						'   CCCC C  CC  CC',
						'  C C CC  CCC   C',
						'    C cC  C Cc',
						'      c     c',
						'       cccccc'];

	var map_0_6_entities = [];

let map_0_6 = new Map(color_background_0, map_0_6_data, [1, 6], map_0_6_entities, []);






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
						'  A1AbbbbbbbA8A   bbbb ',
						'   AbAbbbbbbbAbA  b bbb ',
						'   A2AAAAAAAA7A   bbbb ',
						'    Ab3b4b5b6bA    bbb ',
						'    AAAAAAAAAA     bb ',
						'                   AeA',
						'                   AA'];

	var map_wd1_entities = [new Switch([6, 6], [18, 6], " ", "b"),
							new Orb("#AAAAFF", 19, 4), new Orb("#FFFFFF", 31, 5), new Orb("#FFAAFF", 24, 13), new Orb("#AAAAFF", 25, 3)];

	var map_wd1_connections = ["map_1_0", "map_1_1", "map_1_2", "map_1_3", "map_1_4", "map_1_5", "map_1_6", "map_1_7", "map_1_8"];

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



	var map_1_6_data = ['       bccc         ',
						'      bcccCCCCC     ',
						'      bccccCCCCCCCC  ',
						'     bbcccCCCCC C',
						'      bccccc    CC',
						'      bbccc    e C',
						'       bbcc'];
	
	var map_1_6_entities = [new Stone(6, 3)];

let map_1_6 = new Map(color_background_1, map_1_6_data, [8, 3], map_1_6_entities, []);



	var map_1_7_data = ['       bccc     C   ',
						'      CcccC    C    ',
						'  bb  bCcccCCCCC     ',
						' b bbbbCccCC C   ',
						'  b   bcCcccC e   ',
						' bbb  bbCcc C     ',
						' bbbb  bbCc C',
						'bbbbb    C',
						' bbbb     C  ',
						' bbb     cCcc',
						'   b     ccccc',
						'   bbbbbcccccc'];
	
	var map_1_7_entities = [new Stone(12, 10)];

let map_1_7 = new Map(color_background_1, map_1_7_data, [8, 3], map_1_7_entities, []);



	var map_1_8_data = ['       bccc     C   ',
						'      CcccC    C    ',
						'  bb  bCcccCCCCC     ',
						' b bbbbCccCC C   ',
						'  b   bcCcccC e   ',
						' bbb  bbCcc C     ',
						' bbbb  bbCc C',
						'bbbbb    C',
						' bbbb     C  ',
						' bbb     cCcc',
						'         ccccc',
						'        cccccc'];
	
	var map_1_8_entities = [new Switch([3, 7], [8, 4], "C", "c"), new Switch([3, 7], [8, 5], "C", "c"),
							new Stone(12, 10), new Stone(1, 7)];

let map_1_8 = new Map(color_background_1, map_1_8_data, [8, 3], map_1_8_entities, []);








	var map_wd2_data = ['       dddd',
						'    dddddddd',
						'   dddddddddddd  ',
						' ddddddddddddddd',
						' ddddddddddddddddd',
						'ddddddddddddddddddd       ddd',
						' ddddddddddddddddddd     dddddd',
						'ddddddddddddddddddddddddddddddd',
						' ddddddddddddddddddd     ddddddd',
						'dddddddddddddddddddd     dddddd          dd',
						' ddddddddddddddddddd       ddd d       ddddd',
						' dddddddddddddddddd            d      d  dd',
						' ddddddddddddddddddd            ddddd d',
						' dddddddddddddddddd              ddddd',
						'  ddddddddddddddddd       FFF     ddddd',
						'  ddddddddddddddd         DDD    ddddd',
						'  dddddddddddddd          www    dddddd',
						'  dddddddddddd                   ddddd',
						'    ddddddddd                     ddd',
						'      dddd'];

	var map_wd2_entities = [];

	var map_wd2_connections = [];

let map_wd2 = new Map(color_background_2, map_wd2_data, [42, 10], map_wd2_entities, map_wd2_connections);

