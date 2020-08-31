	var map_out_data = ['   AAAA                                             aaaaaaaaaaaaaaaaaa   e',
						'  AaaaAAAAAAAAAAAAAAAAAAAA A AAAA AA AA A                            aaaa',
						'  Aaaaaaaaaaaaaaaa   aa  aaa  aaa  aaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaa   ',
						' Aaa0aaaaaaaaaaaaa  a aaa  aaa  a       a   a     aaaaaaaaaaaaaaaaaa aaaa1aa',
						'  Aaaaaaaaaaaaaaaaaaa   aaaa  a  aaaaaaaaa  aaaaaaaaaaaaaaaaaaaaaaaaaa   ',
						'  AaaaAAAAAAAAAAAAAAA AAA AA A A AA A  A                             aaa ',
						'   AAAA                                             aaaaaaaaaaaaaaaaaa   e',
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
							new Stone(74, 3), 
							new SpecialOrb("#AAF", 68, 0, `if (player.x > 66 && this.x == 68) {this.dir = "R"; this.moveImpulse = true;}`),
							new SpecialOrb("#FAF", 68, 6, `determineEnding();`),
							new Text("Something went wrong ):", 11, 16)];

let map_out = new Map(color_background_out, map_out_data, [4, 3], map_out_entities, ["map_def", "map_tem"]);


		var map_dbg_data = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ',
							'',
							'abcdefghijklmnopqrstuvwxyz'];

	var map_dbg_entities = [];

let map_dbg = new Map("#888", map_dbg_data, [0, 1], map_dbg_entities, []);	







	var map_def_data = [' AAAAAAAAAAAAAA      AAAAAAAA             AAAAAAAAAAAAAAAAAAAAAAAA AA  AAAAAAAAAAA',
						'AaaaaaaaaaaaaaA     AaaaaaaaA         AAAAaaaaa0aaaaaaaaaaaaaa1aaaaaa a 2aaaaaaaaaa        i     i    ',
						' AAAAAAAAAAAAaA      AaAAAAAaA AAAAAAAAaaAaaAAAAAAAAAAAAAAAAAAAAAaAA AA aAAAAAAA   a   aa              a    a    a    a',
						'           AaAAAAAAAAAaA  AaaAAaaaaaaaaAaAaaA                    a     a           a          i       ',
						'       AAAAAaAaaaaaaaaaaA AaAaAAaAAAAAAAaAaaA                     a A  aaaaa        a       i      aaaaaaaaaiaaaaiaaaaaaa a',
						'      AaaaaaAaAAAAAAAAAA AaAAaAAaA   AaaAAAaA                    a    a   a         a    a        a a    a    a    a',
						'      AaAAAAAaA          AAAAAaAAaA  AaAAaaaA        aaaaaaa     a    a   a      aa  aaaa aaaaaaaaa aa   aa   aa   aa        iiii',
						'     AaaaaaaaA          AaaaaaaAAaA  AaaaAAA        a     a     a    a  a a              a        a a    a    a    a       iiiiei',
						'      AAAAAAAA      AA  AaAAAAAAAaA   AAAA          a     a     a    a  a a                 i      aaaaiaaaaaaaaaaaaaaiaaiiaiiiii',
						'                   AaA AaA     AaA                 a  aaaa      a    a a  a                    i      ',
						'                    AaAAaAA    AaA                 a  a  a  aa  aa   a a  a            aa         i    a    a    a    a',
						'                    AaaaaaA   AaA                    a   a a a a a  a a   a                             ',
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
							new Text("that are already completed", 62, -1.5),

							new Switch([88, 2], [88, 5], " ", "a"), new Switch([88, 10], [88, 7], " ", "a"), new Switch([82, 6], [89, 6], " ", "a"),
							new SpecialOrb("#FFF", 81, 6, `if (player.x == 88 && player.y == 6) {this.dir = "R"; this.moveImpulse = true;}`),

							new Orb("#AAF", 87, 10), new Orb("#AAF", 103, 2), new Orb("#AAF", 108, 10), new Orb("#AAF", 113, 10), new Orb("#AAF", 118, 2), 
							new Orb("#FAF", 87, 2), new Orb("#FAF", 103, 10), new Orb("#FAF", 108, 2), new Orb("#FAF", 113, 2), new Orb("#FAF", 118, 10)];
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
						' dddddddddddddddddbb     dddddd',
						'dddddddddddddddddbw0bbbdddddddd',
						' dddddddddddddddddbb     ddddddd',
						'dddddddddddddddddddd     dddddd          bbb',
						' dddddddddddddddddddd      ddd d       ddbbwb',
						' ddddddddddddddddddd           d      d  bbb',
						' dddddddddddddddddddd           ddddd d',
						' dddddddddddddddddddd            ddddd',
						'  dddddddddddddddddddd            ddddd',
						'  ddddddddddddddddddd            dbbdd',
						'  dddddddddddddddddddd           dbwbdd',
						'  dddddddddddddddbddd            dbbdd',
						'    ddddddddddddddbddd            ddd',
						'      dddddddddddbbddd',
						'        ddddddddbbbdddd',
						'        ddddddddbw1ddd',
						'         dddddddbbbbddd',
						'        dddddddddbdbddd',
						'        dddddddddddddddd',
						'        ddddddddddddddddd',
						'        dddddddddddddddddd',
						'       ddddddddddddddddddddd',
						'        bbdddddddddddddddddddddddddd',
						'       bw2ddddddddddddddddddddddddddddd',
						'        bbdddddddddddddddddddddddddddddddd',
						'       dddddddddddddddddddddddbbbbddddddddd',
						'        ddddddddddddddddddddddbwwbbbbdddddddd',
						'        ddddddddddddddddddddddbbwwwbbbddddddd',
						'        ddddddddddddddddddddddddbb5wwbbdddddddd',
						'        ddddddddddbbbdddddddddddbbwwwbbdddddddd',
						'        ddddddddddbwwbbbdddddddddbbwwbbbdddddddd',
						'        ddddddddd3wwwww4dddddddddbbbbbbddddddddb',
						'         ddddddddbbwwwwbddddddddddbbbbbddddddddbw',
						'          dddddddbbbwbbddddddddddddbbbdddddddddbw',
						'           ddddddddbbbdddddddddddddddddddddddddbw',
						'            ddddddddddddddddddddddddddddddddddbbe',
						'             ddddddddddddddddddddddddddddddddddbw',
						'              ddddddddddddddddddddddddddddddddbbw',
						'               ddddddddddddddddddddddddddddddddbw',
						'                dddddddddddddddddddddddddddddddb',
						'                  dddddddddddddddddddddddddddddd',
						'                    dddddddddddddddddddddddddd',
						'                        dddddddddddddddddddd',
						'                         ddddddddddd',
						'                            ddddddd',
						'                             ddddd    ',
						'                               dddd       ',
						'                               dddd',
						'                                 dddd',
						'                                 ddd6'];

	var map_wd2_entities = [new Sandstorm(100, 100)];

	var map_wd2_connections = ["map_2_0", "map_2_1", "map_2_2", "map_2_3", "map_2_4", "map_2_5", "map_2_6"];

let map_wd2 = new Map(color_background_2, map_wd2_data, [42, 10], map_wd2_entities, map_wd2_connections);




	var map_2_0_data = ['   wbdd ddddd ddd',
						'     d  d  d  b ',
						'     ddddd dddbbw',
						'           d  b ',
						'     dddddddd ddd',
						'     d         ',
						'     ddddddddddddde'];
	
	var map_2_0_entities = [new Sandstorm(80, 20)];

let map_2_0 = new Map(color_background_2, map_2_0_data, [4, 0], map_2_0_entities, []);




	var map_2_1_data = ['                 ',
						'C CCCbb    ddd  ',
						' CCCwwbb   dddd  ',
						' CCCwbbdddddddddde',
						' CCCwwbb   dddd  ',
						'C CCCbb    ddd ',
						'                   ',
						'',
						'       bbb',
						'      bbbb',
						'      bbbbbbe ',
						'      bbbb',
						'       bbb'];

var map_2_1_entities = [new Switch([8, 10], [11, 10], " ", "b"),
						new Switch([12, 3], [15, 3], " ", "d"),
						new Orb("#AAF", 6, 10), new Orb("#AAF", 8, 10),
						new Orb("#AAF", 6, 9),
						new Orb("#AAF", 7, 8), new Orb("#AAF", 8, 8), new Orb("#AAF", 9, 8), 
						new Stone(12, 2),
						new Sandstorm(0, 50)];

let map_2_1 = new Map(color_background_2, map_2_1_data, [1, 3], map_2_1_entities, []);



	var map_2_2_data = ['   bdddffffd',
						'  wbdddfdfff',
						'   bddddffff  f',
						'      ffffd  f',
						'      ffdff  f',
						'      ffffffff',
						'       ffdf   f',
						'      f   f   f',
						'    eff    ff'];
	
	var map_2_2_entities = [new Sandstorm(0, 40)];

let map_2_2 = new Map(color_background_2, map_2_2_data, [3, 1], map_2_2_entities, []);



	var map_2_3_data = ['  wbffdfffdf',
						' bbffdfffdff',
						' ffffddddffff        e',
						'ffffdffffdfff       f',
						' fdddfffffdff fffffff',
						' ffffffffdfd f',
						' fffddddddfdf f ffff',
						'ddfdffffffdff ff   f',
						' fffdffddddff    ff f',
						' ddfdfdfffdf    f ff',
						'  ffdfdfffff    f',
						' fffdfffffff    f',
						'  ffdfdddddd    f',
						'  fdffffffffffff'];
	
	var map_2_3_entities = [new Sandstorm(0, 5)];

let map_2_3 = new Map(color_background_2, map_2_3_data, [2, 1], map_2_3_entities, []);	



	var map_2_4_data = [' fffffffffffffffff ff fffffff  ',
						' d  d  d  d  d  d  d     d  d  ',
						'  d        d  d  d  d  d  d  d ',
						'  ffffffff fffffff fffff ff fffe',
						'  d  d     d  d  d  d  d  d  d ',
						' d     d  d  d  d  d  d  d  d  ',
						' ff ffffffffbffffffff ff ffff  ',
						' d  d  d  d        d  d  d     ',
						'  d  d  d     d  dd d  d  d  d ',
						'  f fff ffffffffff fffff fffff ',
						'  d  d     d  d  d  d  d     d ',
						' d  d  d     d  d  d  d  d  d  ',
						' bffffffffffff dfff fffffffff  ',
						'            d d',
						'             dd'];
	
	var map_2_4_entities = [new Switch([17, 12], [30, 3], "D", "f"), 
							new Stone(5, 10),
							new Sandstorm(0, 200)];

let map_2_4 = new Map(color_background_2, map_2_4_data, [1, 0], map_2_4_entities, []);	


	var map_2_5_data = ['         dddd      ',
						'        d   d      ',
						'  bbddddd   d dd   ',
						' bwbddddd   dd     ',
						'  bbddddd          ',
						'        d    dd  ddde',
						'         d   d d d ',
						'     bb  dddd  d d',
						'     bwbd      d d',
						'     bb ddd ddd d',
						'       d   dd   d',
						'       d     ddd',
						'        dddddd'];
	
	var map_2_5_entities = [new Sandstorm(0, 200)];

let map_2_5 = new Map(color_background_2, map_2_5_data, [1, 3], map_2_5_entities, []);



	var map_2_6_data = ['     ccc                      bb ',
						'    c  c                     bwb',
						'  CCCCCc                     bwwbbbbbbbbbbbbbbb',
						'    C                       bwwwwwbbbbbbbbbbbbe',
						'     C     f  f  f  f  f    dbbbbbbbbbbbbbbbbbb',
						'     C                     dee',
						'      C dddddddedddddeddeddded',
						'      ddddddedddeeddddedededd',
						'        ddddddeddddeddedddded'];
	
	var map_2_6_entities = [new Orb("#AAF", 11, 4), new Orb("#AAF", 14, 4), new Orb("#AAF", 17, 4), new Orb("#AAF", 20, 4),new Orb("#AAF", 23, 4),
							new Sandstorm(0, 350)];

let map_2_6 = new Map(color_background_2, map_2_6_data, [2, 2], map_2_6_entities, []);














	var map_tem_data = ['                       C    C',
						'                       C e C',
						'                        C66C',
						'                        C C',
						'                       45CC54 ',
						'                      3  C  3',
						'                      2 gggg 2',
						'                     1 ggggg 1',
						'                  gg  0gggggg0  gg',
						'                   ggggggggggggg  ',
						'                  gg  gggggggg  gg',
						'                     ggggggggg',
						'     DfDDfD           ggfgggfg',
						'    fDDfDDffD         ggfgggf',
						'   fDDffDfDDfff        fgffgf',
						'  DfffffffffDff        fffff',
						'  DfDfffffDffDDfD   ff ffDfff',
						'  fDfffDffffDfDfD  ffDfffffDf',
						'  fDfffffDDDDffffDf DDDffffff',
						'  fDffffDfDffDDfDffffDfffDf',
						'   fDDffDffffDfDDfDffDffDf',
						'  fDffDDDfffDDfffDffffff',
						'  ffDDfDfDDDDfffDfffDfff',
						'  fffDDfDfDffDffffffff',
						'  fDfDfDfDDfffffDfff',
						' ffDfDDffDff  fff',
						' ffDfffDfff',
						' ffDDffDff',
						' ffffDDfff',
						' fffffDf',
						'  ffffff',
						'   ff'];

	var map_tem_entities = [];

let map_tem = new Map(color_background_3, map_tem_data, [11, 18], map_tem_entities, []);



	var map_tm0_data = ['   wbdd ddddd ddd',
						'     d  d  d  b ',
						'     ddddd dddbbw',
						'           d  b ',
						'     dddddddd ddd',
						'     d         ',
						'     ddddddddddddde'];
	
	var map_tm0_entities = [];

let map_tm0 = new Map(color_background_3, map_tm0_data, [4, 0], map_tm0_entities, []);






	var map_free_data = ['         bbb',
						'       bbb b',
						'       bbbb  bbb',
						'      bbbbb  bbbbbb',
						'      bbbbb  bbbbbbbb',
						'      bbbbb    bbbbbb',
						'       bbbbbb    bbbbbbbb',
						'      bbbbbbb    bbbbbbbbbbb',
						'       bbbbbbb     bbbbbbbbbbb',
						'      bbbbbbbb     bbbbbbbbbbbb',
						'      bbbbbbbbb     bbbbbbbbbbbbbb',
						'     bbbbbbbbbbb     bbbbbbbbbbbbb',
						'      bbbbbbbbbbb     bbbbbbbbbbbbbb',
						'     bbbbbbbbbbbb     bbbbbbbbbbbbbb',
						'      bbbbbbbbbbbb      bbbbbbbbbbbbb',
						'     bbbbbbbbbbbbbb      bbbbbbccccc',
						'      bbbbbbbfbbfbbbbbb     bbbccCCCccc',
						'     fbbfbbfffbbfbbbbbb       cCCCCCCcc',
						'      fffbfbffffbbfbbbbbbb          Ccccc',
						'      ffffffffffbbbbbbbbbbb         Ccccc',
						'       ffbfffffffffbbbbbbbbb         Cccc',
						'      ffbbbbffDfffbffbbbbbbbc       Ccccc',
						'       ffb bbfffDfffbbbbbbbbcCC      Ccccc',
						'       ffb  bfffffffffbbbbbbccC     Ccccc',
						'       DffbbbffffDfffffffbbbbccCC   CCcccc',
						'       fffffffDffffffffbbbbbccccCCCCCcccc',
						'        ffffffffffffffbffbbbbccccccCCcccc',
						'         DfffDfffDfDfffbfbbbbccccccCcccc',
						'            fDfffffffffffbbbbcccccccccc',
						'             fffDffffffffbbbbccccccccc',
						'               Dfffffffbfbbbbbccccccccc',
						'                 Dffffffbbbbbccccccccc',
						'                      ffbbbb  ccccccc',
						'                                ccc'];
	
	var map_free_entities = [];

let map_free = new Map(color_water, map_free_data, [8, 4], map_free_entities, []);







	var map_rn1_data = ['     AAAAAA',
						'    AaaaaaA',
						'    AaaaaaaA',
						'   AaaaaaaaA',
						'   AaaaaaaaaA',
						'  AaaaaeaaaaA',
						'   AaaaaaaaaA',
						'   AaaaaaaaA',
						'    AaaaaaaA',
						'    AaaaaaA',
						'     AAAAAA'];

let map_rn1 = new Map(color_background_out, map_rn1_data, [7, 5], [], []);



	var map_rn2_data = ['     AA AAA',
						'    Aaaaa A',
						'     aa aa A',
						'   Aaaaaaaa ',
						'   A aaaaaaaA',
						'  A aaaeaa aA',
						'   Aaaaaaaa  ',
						'    aa aaaaA',
						'    Aaaaa  A',
						'     a aa A',
						'     AAA A '];

let map_rn2 = new Map(color_background_out, map_rn2_data, [7, 5], [], []);



	var map_rn3_data = ['        A  ',
						'      aa   ',
						'         a A',
						'   Aa  aa a ',
						'   A a aa aaA',
						'  A a aea  aA',
						'   Aa aaa    ',
						'    a  a  aA',
						'    Aaa    A',
						'     a  a A',
						'     AA  A '];

let map_rn3 = new Map(color_background_out, map_rn3_data, [7, 5], [], []);



	var map_rn4_data = ['           ',
						'      a    ',
						'         a A',
						'   Aa     a ',
						'   A a  a a A',
						'      aea  aA',
						'      aaa    ',
						'       a  aA',
						'     aa    A',
						'     a  a  ',
						'     AA    '];

let map_rn4 = new Map(color_background_out, map_rn4_data, [7, 5], [], []);



	var map_rn5_data = ['           ',
						'           ',
						'         a  ',
						'            ',
						'     a  a a  ',
						'      ae     ',
						'        a    ',
						'       a   A',
						'      a     ',
						'           ',
						'           '];

let map_rn5 = new Map(color_background_out, map_rn5_data, [7, 5], [], []);

let map_rn6 = new Map(color_background_out, [''], [7, 5], [new SpecialOrb("#000", 0, 0, `player.r *= 0.95;`)], []);

