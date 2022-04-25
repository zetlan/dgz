/*
TAGS IN THIS STRUCTURE
question mark before tag name means it's optional

{
	name: [display name]
	url: [not included to start, is gathered from index, don't worry about it]

	?imgType: [the extension the image is stored as. If not provided will be .png]

	?authors: an array, the people or persons who made the card

	?tags: [an array of groups that the card belongs to]

	?notes: a string, for extra notes about a card
}


SEASON 1 CARDS are IDs 0-1131	, made before October 2021
SEASON 2 CARDS are IDs 1132-1517, made in/after October 2021 but before April 2022
SEASON 3 cards are IDs 1518-	, made in/after April 2022
*/


var cardDataFile;

function tagForAll() {
	cardData.forEach(c => {
		if (c.tags == undefined) {
			c.tags = [];
		}

		//check for letters 
		var char = c.name[0].toLowerCase();
		var tags = c.tags;
		
		if (char.match(/[a-z]/i)) {
			//letter
			if (!tags.includes(char.toUpperCase())) {
				tags.splice(0, 0, char.toUpperCase());
			}
		} else if (char.match(/[0-9]/i)) {
			//number
			if (!tags.includes(`number start`)) {
				tags.splice(0, 0, `number start`);
			}
		} else {
			//non-letter
			if (!tags.includes(`non-letter start`)) {
				tags.splice(0, 0, `non-letter start`);
			}
		}
	});
}

//toggles whether or not an object has a certain tag
function tagForObject(object, tag) {
	var index = object.tags.indexOf(tag);
	if (index != -1) {
		//if it includes the tag
		object.tags.splice(index, 1);
	} else {
		object.tags.push(tag);
	}
}

//for downloading
function downloadData() {
	//create data
	var textDat = ``;

	//post to data
	textDat += `[{`;

	//first sort card data
	cardData.sort((a, b) => {
		return (a.id * 1 - b.id * 1);
	});

	//take all nodes and add them
	cardData.forEach(c => {
		//take all keys and add them
		//make sure string delimiter is the grave (`), so that backslashes won't come up and be weird
		var keys = Object.keys(c);
		keys = keys.sort();

		keys.forEach(k => {
			if (k == `authors` || k == "tags") {
				textDat += `\n\t${k}: ${JSON.stringify(c[k])},`;
			} else {
				textDat += `\n\t${k}: \`${c[k]}\`,`;
			}
			
		});

		textDat += `\n}, {`;
	});

	//slice off the final `, {`;
	textDat = textDat.slice(0, -3);
	textDat += `];`;
	
	var fileObj = new Blob([textDat], {type: 'text/plain'});

	//make sure a world file doesn't already exist
	if (cardDataFile != undefined) {
		window.URL.revokeObjectURL(cardDataFile);
	}
	cardDataFile = window.URL.createObjectURL(fileObj);
	var link = document.getElementById('download');
	link.href = cardDataFile;
	link.click();
}

function getCardFromID(id) {
	//search local area before seaching entire deck
	for (var j=Math.max(0, id-10); j<Math.min(cardData.length, id+10); j++) {
		if (cardData[j].id == id) {
			return cardData[j];
		}
	}

	//search entire deck
	for (var j=0; j<cardData.length; j++) {
		if (cardData[j].id == id) {
			return cardData[j];
		}
	}
	console.error(`could not find card~${id} ):`);
	return undefined;
}


var cardPossibleTags = [
	`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`,
	`non-letter start`, `number start`,
	`wide`,
	`multi-colored`,
	`point card`,
	`rule card`
];

/*
	when adding a card, append it with possible tags:
		what does the name start with?
		is it a points card or a rules card?
		is it wide?
		is it multi-colored?
*/
var cardData = [{
	id: `0`,
	name: `______ in another world`,
	tags: ["non-letter start","point card"],
}, {
	id: `1`,
	name: `_______`,
	tags: ["non-letter start"],
}, {
	id: `2`,
	name: `[math]`,
	tags: ["non-letter start","point card"],
}, {
	id: `3`,
	name: `[unnamed]`,
	tags: ["non-letter start"],
}, {
	id: `4`,
	name: `[untranslatable] 2`,
	tags: ["non-letter start","point card"],
}, {
	id: `5`,
	name: `[untranslatable]`,
	tags: ["non-letter start","point card"],
}, {
	id: `6`,
	name: `}finally}finally{system.out.print("Done! Ok!");})`,
	tags: ["non-letter start","point card"],
}, {
	id: `7`,
	name: `@everyone`,
	tags: ["non-letter start"],
}, {
	id: `8`,
	name: `/b/`,
	tags: ["non-letter start","point card"],
}, {
	id: `9`,
	name: `/gamerule randomtickspeed`,
	tags: ["non-letter start"],
}, {
	id: `10`,
	name: `/r/2dank4u`,
	tags: ["non-letter start","multi-colored","point card"],
}, {
	id: `11`,
	name: `#closefcps`,
	tags: ["non-letter start","point card"],
}, {
	id: `12`,
	name: `+500 points`,
	tags: ["non-letter start","number start","point card"],
}, {
	id: `13`,
	imgType: `jpg`,
	name: `+1500 points`,
	tags: ["non-letter start","number start","point card"],
}, {
	id: `14`,
	name: `1-KILOGRAM FEATHER`,
	tags: ["number start"],
}, {
	id: `15`,
	name: `1,000 Blank White Cards Star`,
	tags: ["number start","multi-colored"],
}, {
	id: `16`,
	name: `1,000 Blank White Cards`,
	tags: ["number start"],
}, {
	id: `17`,
	name: `1K BLANK WHITE CARDS RULES`,
	tags: ["number start"],
}, {
	id: `18`,
	name: `1K BWC rules!`,
	tags: ["number start"],
}, {
	id: `19`,
	name: `1KBWC-ISNOTABOUTWINNING`,
	tags: ["number start","point card"],
}, {
	authors: ["Anish G.","Pizza Squirrel"],
	id: `20`,
	name: `2's Day`,
	tags: ["number start","multi-colored","point card"],
}, {
	id: `21`,
	name: `3:05 Friday`,
	tags: ["number start"],
}, {
	id: `22`,
	name: `3-bit address decoder`,
	tags: ["number start"],
}, {
	id: `23`,
	name: `3-Star Review`,
	tags: ["number start","multi-colored","point card"],
}, {
	id: `24`,
	name: `3D Printer 20mm Calibration Cube`,
	tags: ["number start","multi-colored","point card"],
}, {
	id: `25`,
	name: `3D Tetris`,
	tags: ["number start","multi-colored","point card"],
}, {
	id: `26`,
	name: `4 Million Points`,
	tags: ["number start","point card"],
}, {
	id: `27`,
	name: `4-dimensional cube`,
	tags: ["number start"],
}, {
	id: `28`,
	name: `4th Dimension`,
	tags: ["number start","point card"],
}, {
	id: `29`,
	name: `05 Access Keycard`,
	tags: ["number start","wide"],
}, {
	id: `30`,
	name: `5 DARK`,
	tags: ["number start","point card"],
}, {
	id: `31`,
	name: `5-card hand`,
	tags: ["number start"],
}, {
	id: `32`,
	name: `23.5°`,
	tags: ["number start","point card"],
}, {
	id: `33`,
	name: `64-bit address`,
	tags: ["number start"],
}, {
	id: `34`,
	name: `84 IQ`,
	tags: ["number start","point card"],
}, {
	authors: `Vincent T.`,
	id: `35`,
	name: `420 IS DIVISIBLE BY 7`,
	tags: ["number start","multi-colored","point card"],
}, {
	id: `36`,
	name: `a`,
	tags: ["A","point card"],
}, {
	id: `37`,
	name: `A bag of catnip`,
	tags: ["A","point card"],
}, {
	id: `38`,
	name: `A bud Grade`,
	tags: ["A","point card"],
}, {
	id: `39`,
	name: `A fast cat`,
	tags: ["A","point card"],
}, {
	id: `40`,
	name: `A FREAKING BAZOOKA`,
	tags: ["A","point card"],
}, {
	id: `41`,
	name: `A Mob of Cats`,
	tags: ["A","point card"],
}, {
	id: `42`,
	name: `A PRICKLY SITUATION`,
	tags: ["A","multi-colored","point card"],
}, {
	authors: "Cynthia C.",
	id: `43`,
	name: `a strange face tendriu`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `44`,
	name: `A Tiny Sphere which annihilates every card touching whichever card that adds a bomb to your left toenail (aka freshmen cards are best cards)`,
	tags: ["A","point card"],
}, {
	id: `45`,
	name: `A`,
	tags: ["A","point card"],
}, {
	id: `46`,
	name: `AAAAaaaaarrghhh`,
	tags: ["A","point card"],
}, {
	id: `47`,
	name: `AAHRT`,
	tags: ["A","point card"],
}, {
	id: `48`,
	name: `Abandoned Shop`,
	tags: ["A","point card"],
}, {
	id: `49`,
	name: `Abraham Lincoln`,
	tags: ["A","point card"],
}, {
	id: `50`,
	name: `Abstract Art 2`,
	tags: ["A"],
}, {
	id: `51`,
	name: `Abstract Art`,
	tags: ["A","point card"],
}, {
	id: `52`,
	name: `Acoin`,
	tags: ["A","point card"],
}, {
	id: `53`,
	name: `ACTIVE TRANSPORT`,
	tags: ["A"],
}, {
	id: `54`,
	name: `ADC -> DAC`,
	tags: ["A","multi-colored"],
}, {
	id: `55`,
	name: `Advent`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `56`,
	name: `Airless Vacuum of Space`,
	tags: ["A"],
}, {
	id: `57`,
	name: `ALASKA CARD`,
	tags: ["A","wide"],
}, {
	id: `58`,
	name: `Aleph-null guantlet`,
	tags: ["A"],
}, {
	id: `59`,
	name: `Alexander Graham Bell`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `60`,
	name: `ALTERNATIVE FACTS`,
	tags: ["A","point card"],
}, {
	id: `61`,
	name: `Altocumulus`,
	tags: ["A","point card"],
}, {
	id: `62`,
	name: `AMERICAN Government`,
	tags: ["A","multi-colored"],
}, {
	id: `63`,
	name: `Amplifier`,
	tags: ["A"],
}, {
	id: `64`,
	name: `An Extremely Fluffy Dog`,
	tags: ["A","point card"],
}, {
	id: `65`,
	name: `An Honest Email`,
	tags: ["A"],
}, {
	id: `66`,
	name: `and Hobbes`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `67`,
	name: `Andrew Carnage-e`,
	tags: ["A","point card"],
}, {
	id: `68`,
	name: `Andrew Carnegie`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `69`,
	name: `Angry cat`,
	tags: ["A","point card"],
}, {
	id: `70`,
	name: `Another non-Noah Card`,
	tags: ["A","point card"],
}, {
	id: `71`,
	name: `ANTI DERIVATIVE`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `72`,
	name: `Anti-Bias Training`,
	tags: ["A"],
}, {
	id: `73`,
	name: `Anti-Pen warfare`,
	tags: ["A"],
}, {
	id: `74`,
	name: `Anti-Peridoxifier`,
	tags: ["A"],
}, {
	id: `75`,
	name: `Anti-vaxxer`,
	tags: ["A"],
}, {
	id: `76`,
	name: `Anvil`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `77`,
	name: `AP° Calculus`,
	tags: ["A","point card"],
}, {
	id: `78`,
	name: `Aquaculture`,
	tags: ["A","point card"],
}, {
	authors: "Garrett Phlegar",
	id: `79`,
	name: `Arachnophobia`,
	tags: ["A","multi-colored","point card"],
}, {
	id: `80`,
	name: `Arc Welding`,
	tags: ["A"],
}, {
	id: `81`,
	name: `Array->Pointer Degradation`,
	tags: ["A","point card"],
}, {
	id: `82`,
	name: `Art #1`,
	tags: ["A","point card"],
}, {
	id: `83`,
	name: `Art #2`,
	tags: ["A","point card"],
}, {
	id: `84`,
	name: `Art #3`,
	tags: ["A","point card"],
}, {
	id: `85`,
	name: `Art #4`,
	tags: ["A","point card"],
}, {
	id: `86`,
	name: `Art #5`,
	tags: ["A","point card"],
}, {
	id: `87`,
	name: `Art #6`,
	tags: ["A","point card"],
}, {
	id: `88`,
	name: `Art #7`,
	tags: ["A","point card"],
}, {
	id: `89`,
	name: `Art #8`,
	tags: ["A","point card"],
}, {
	authors: "Joseph R.",
	id: `90`,
	imgType: `jpg`,
	name: `Artificial Intelligence`,
	tags: ["A"],
}, {
	id: `91`,
	name: `Ash Ketchum and his Pikachu`,
	tags: ["A"],
}, {
	id: `92`,
	name: `At least 5 cats`,
	tags: ["A","point card"],
}, {
	id: `93`,
	name: `Attempt and get Fatally Wounded`,
	tags: ["A","point card"],
}, {
	id: `94`,
	name: `Australlian Card`,
	tags: ["A"],
}, {
	id: `95`,
	name: `Auto<span style="text-decoration: line-through;">Correct</span>Insurance`,
	tags: ["A"],
}, {
	id: `96`,
	name: `Automation: 64`,
	tags: ["A","point card"],
}, {
	id: `97`,
	name: `Average treasure hunt`,
	tags: ["A","point card"],
}, {
	id: `98`,
	name: `Azinoazide Azide`,
	tags: ["A","point card"],
}, {
	id: `99`,
	name: `Babelicious`,
	tags: ["B","point card"],
}, {
	id: `100`,
	name: `Backpack of Knapsacks`,
	tags: ["B"],
}, {
	id: `101`,
	name: `Bad Card I`,
	tags: ["B","point card"],
}, {
	id: `102`,
	name: `Bad Card II`,
	tags: ["B","point card"],
}, {
	id: `103`,
	name: `Bad Card III`,
	tags: ["B","point card"],
}, {
	id: `104`,
	name: `Bad Card IV`,
	tags: ["B","point card"],
}, {
	authors: "Aadarsh Natarajan",
	id: `105`,
	imgType: `jpg`,
	name: `Bad Grade`,
	tags: ["B","point card"],
}, {
	id: `106`,
	name: `Bad Idea`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `107`,
	name: `BAG OF TRICKS`,
	tags: ["B"],
}, {
	id: `108`,
	name: `Bail-Out`,
	tags: ["B","point card"],
}, {
	id: `109`,
	name: `Bakugo`,
	tags: ["B","point card"],
}, {
	id: `110`,
	name: `Balled Fist`,
	tags: ["B","point card"],
}, {
	id: `111`,
	name: `BAN`,
	tags: ["B"],
}, {
	id: `112`,
	name: `BAR TOOLS`,
	tags: ["B"],
}, {
	authors: "Aadarsh Natarajan",
	id: `113`,
	imgType: `jpg`,
	name: `Basic Math`,
	tags: ["B","point card"],
}, {
	authors: `Derek C.`,
	id: `114`,
	name: `Battle Potion`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `115`,
	name: `Beginner's Pitfall`,
	tags: ["B","point card"],
}, {
	authors: "Alex Boezer",
	id: `116`,
	imgType: `jpg`,
	name: `Beherit`,
	tags: ["B","point card"],
}, {
	id: `117`,
	name: `Ben Shapiro`,
	tags: ["B","point card"],
}, {
	id: `118`,
	name: `Better worded dis-card`,
	tags: ["B","point card"],
}, {
	hide: true,
	id: `119`,
	name: `Between 2 and 2 or more`,
	tags: ["B"],
}, {
	id: `120`,
	name: `beyond the firmament`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `121`,
	name: `Big Boy Jay`,
	tags: ["B","point card"],
}, {
	id: `122`,
	name: `Big Tabasco`,
	tags: ["B"],
}, {
	id: `123`,
	name: `Big Toe`,
	tags: ["B","point card"],
}, {
	id: `124`,
	name: `bill wurtz`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `125`,
	name: `Billy la Bufanda`,
	tags: ["B","point card"],
}, {
	id: `126`,
	name: `BLACK HOLE`,
	tags: ["B"],
}, {
	id: `127`,
	name: `BLAST FURNACE`,
	tags: ["B","point card"],
}, {
	id: `128`,
	name: `Blessed By The Physics Gods`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `129`,
	name: `BLOOD MANOS`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `130`,
	name: `Bloody Hands`,
	tags: ["B"],
}, {
	id: `131`,
	name: `BLUE LIZARD`,
	tags: ["B","point card"],
}, {
	id: `132`,
	name: `Blue Shell`,
	tags: ["B","multi-colored","point card"],
}, {
	authors: `Derek C.`,
	id: `133`,
	name: `Blue Slime`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `134`,
	name: `Bode's Rule`,
	tags: ["B","point card"],
}, {
	id: `135`,
	name: `Bold Face`,
	tags: ["B","point card"],
}, {
	id: `136`,
	name: `Bomb Man`,
	tags: ["B","point card"],
}, {
	id: `137`,
	name: `Bomb Transmutation`,
	tags: ["B","point card"],
}, {
	id: `138`,
	name: `Bombed the test`,
	tags: ["B","point card"],
}, {
	id: `139`,
	name: `Bomkar's attendance`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `140`,
	name: `Bomkar's wisdom`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `141`,
	name: `Boneful Pizza`,
	tags: ["B","point card"],
}, {
	id: `142`,
	name: `Boneless Fossil`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `143`,
	name: `Boneless Pizza`,
	tags: ["B","point card"],
}, {
	authors: "Alex Boezer",
	id: `144`,
	imgType: `jpg`,
	name: `Bonfire`,
	tags: ["B"],
}, {
	id: `145`,
	name: `Bonjourno`,
	tags: ["B","point card"],
}, {
	id: `146`,
	name: `Borat [I'm not translating this one either, sorry]`,
	tags: ["B","point card"],
}, {
	id: `147`,
	name: `BOSS OF THIS GYM`,
	tags: ["B","point card"],
}, {
	id: `148`,
	name: `Bozo 1`,
	tags: ["B","point card"],
}, {
	id: `149`,
	name: `BRAIN ON DRUGS`,
	tags: ["B"],
}, {
	id: `150`,
	name: `Brass Section`,
	tags: ["B","multi-colored","point card"],
}, {
	authors: "Tushar Rangaswamy",
	id: `151`,
	imgType: `jpg`,
	name: `Break-Out Rooms`,
	tags: ["B","point card"],
}, {
	id: `152`,
	name: `Buckets`,
	tags: ["B"],
}, {
	id: `153`,
	name: `Build A WALL!`,
	tags: ["B"],
}, {
	id: `154`,
	name: `Bulgarian Slap Dance`,
	tags: ["B","point card"],
}, {
	id: `155`,
	name: `Bully Pulpit`,
	tags: ["B","point card"],
}, {
	id: `156`,
	name: `Burn at Both Ends`,
	tags: ["B","point card"],
}, {
	id: `157`,
	name: `Burn the Books`,
	tags: ["B","point card"],
}, {
	id: `158`,
	name: `Burnt Resistor`,
	tags: ["B","multi-colored","point card"],
}, {
	id: `159`,
	name: `Burnt Pan`,
	tags: ["B","point card"],
}, {
	id: `160`,
	name: `burp`,
	tags: ["B","point card"],
}, {
	id: `161`,
	name: `C O V E R`,
	tags: ["C"],
}, {
	id: `162`,
	name: `Cactus Emoji`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `163`,
	name: `CAKE`,
	tags: ["C","point card"],
}, {
	id: `164`,
	name: `CalculuS`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `165`,
	name: `Calvin`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `166`,
	name: `CaLViNbaLL`,
	tags: ["C","multi-colored"],
}, {
	id: `167`,
	name: `Campaign Donations`,
	tags: ["C","point card"],
}, {
	id: `168`,
	name: `Candidate Centered Campaigns`,
	tags: ["C","point card"],
}, {
	id: `169`,
	name: `Capitalism`,
	tags: ["C","point card"],
}, {
	id: `170`,
	name: `Capture The Flag`,
	tags: ["C","point card"],
}, {
	id: `171`,
	name: `CARAMEL`,
	tags: ["C","point card"],
}, {
	id: `172`,
	name: `CARD 2`,
	tags: ["C"],
}, {
	id: `173`,
	name: `card castle`,
	tags: ["C","point card"],
}, {
	id: `174`,
	name: `Card Shortage`,
	tags: ["C","point card"],
}, {
	id: `175`,
	name: `CARD`,
	tags: ["C","point card"],
}, {
	id: `176`,
	name: `Cardboard Tube`,
	tags: ["C","point card"],
}, {
	id: `177`,
	name: `CARDS AGAINST governmentality`,
	tags: ["C"],
}, {
	id: `178`,
	name: `Cat`,
	tags: ["C","point card"],
}, {
	id: `179`,
	name: `CAT 2`,
	tags: ["C","point card"],
}, {
	id: `180`,
	name: `CAT BELL`,
	tags: ["C"],
}, {
	id: `181`,
	name: `CAT`,
	tags: ["C","point card"],
}, {
	id: `182`,
	name: `CATACLYSM`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `183`,
	name: `CATHARTIC REONION`,
	tags: ["C"],
}, {
	id: `184`,
	name: `Caution Wet Floor`,
	tags: ["C","multi-colored"],
}, {
	id: `185`,
	name: `CELL TO CELL TRANSPORT`,
	tags: ["C"],
}, {
	id: `186`,
	name: `CENSORED`,
	tags: ["C","point card"],
}, {
	id: `187`,
	name: `Centrol Balance`,
	tags: ["C","point card"],
}, {
	id: `188`,
	name: `Ceph OSD failure`,
	tags: ["C","point card"],
}, {
	id: `189`,
	name: `Chaos Emeralds`,
	tags: ["C","multi-colored"],
}, {
	id: `190`,
	name: `Chester Arthur`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `191`,
	name: `Chibi`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `192`,
	name: `Choose one`,
	tags: ["C","multi-colored"],
}, {
	id: `193`,
	name: `Chose uOwen AdvEnturE`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `194`,
	name: `Chris Christoph Christopher Christopherson`,
	tags: ["C","point card"],
}, {
	id: `195`,
	name: `CHRISTIAN MINECRAFT`,
	tags: ["C"],
}, {
	id: `196`,
	imgType: `jpg`,
	name: `Cirrocumulus`,
	tags: ["C", "point card"],
}, {
	id: `197`,
	name: `Cirrostratus`,
	tags: ["C"],
}, {
	id: `198`,
	name: `Cirrus`,
	tags: ["C"],
}, {
	id: `199`,
	name: `Civil Rights Act of 1964`,
	tags: ["C","point card"],
}, {
	id: `200`,
	name: `ClF3`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `201`,
	name: `Cloud in a Bottle`,
	tags: ["C"],
}, {
	authors: `Liam B.`,
	id: `202`,
	name: `CMD ACCESS Granted`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `203`,
	name: `COASTER`,
	tags: ["C","point card"],
}, {
	id: `204`,
	name: `Combo-Wombo`,
	tags: ["C","point card"],
}, {
	id: `205`,
	name: `Comedian`,
	tags: ["C","point card"],
}, {
	id: `206`,
	name: `Communism strikes`,
	tags: ["C"],
}, {
	id: `207`,
	name: `Communism v2`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `208`,
	name: `Communism`,
	tags: ["C","multi-colored"],
}, {
	id: `209`,
	name: `Communist Takeover`,
	tags: ["C"],
}, {
	id: `210`,
	name: `Companion Cube`,
	tags: ["C","point card"],
}, {
	id: `211`,
	name: `Composite Gang`,
	tags: ["C","multi-colored"],
}, {
	id: `212`,
	name: `Computer table`,
	tags: ["C","wide","point card"],
}, {
	id: `213`,
	name: `Computer Vision`,
	tags: ["C","point card"],
}, {
	authors: "Cynthia C.",
	id: `214`,
	name: `Concern`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `215`,
	name: `congratulations, you broke time`,
	tags: ["C"],
}, {
	id: `216`,
	name: `Congressional Hearing`,
	tags: ["C","point card"],
}, {
	id: `217`,
	name: `Conical Pendulum`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `218`,
	name: `CONSOLATION PRIZE`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `219`,
	name: `Consoltation Prize`,
	tags: ["C","point card"],
}, {
	id: `220`,
	name: `Constitutional Democracy`,
	tags: ["C","point card"],
}, {
	id: `221`,
	name: `CONSTRUCTION ZONE`,
	tags: ["C","multi-colored"],
}, {
	id: `222`,
	name: `Cool math James`,
	tags: ["C","point card"],
}, {
	authors: "Cynthia C.",
	id: `223`,
	name: `Coping mechanisms`,
	tags: ["C","multi-colored"],
}, {
	id: `224`,
	name: `Copper Pickaxe`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `225`,
	name: `Copywrited`,
	tags: ["C","point card"],
}, {
	id: `226`,
	name: `Cornelius Vanderbilt`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `227`,
	name: `Corrin's Side Special`,
	tags: ["C","point card"],
}, {
	id: `228`,
	name: `Counter spell`,
	tags: ["C","point card"],
}, {
	id: `229`,
	name: `Counter-counter spell`,
	tags: ["C","point card"],
}, {
	id: `230`,
	name: `Counter-Counterspell Counter`,
	tags: ["C","point card"],
}, {
	id: `231`,
	name: `Counterfeit points`,
	tags: ["C","point card"],
}, {
	id: `232`,
	name: `Cozy Mine craft home`,
	tags: ["C","point card"],
}, {
	id: `233`,
	name: `CRAB RAVE (BASS BOOSTED)`,
	tags: ["C","point card"],
}, {
	id: `234`,
	name: `Cram time`,
	tags: ["C"],
}, {
	id: `235`,
	name: `CRAYON CARD`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `236`,
	name: `Crazy Hand`,
	tags: ["C","point card"],
}, {
	authors: "Cynthia C.",
	id: `237`,
	name: `crd o edm`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `238`,
	name: `CREEPER! Aw man`,
	tags: ["C","point card"],
}, {
	id: `239`,
	name: `Creeper`,
	tags: ["C","point card"],
}, {
	id: `240`,
	name: `CREEPY JEFFERSON MASCOT`,
	tags: ["C","point card"],
}, {
	id: `241`,
	name: `Crowdsourcing`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `242`,
	name: `Crusty sean, destroyer of worlds`,
	tags: ["C"],
}, {
	id: `243`,
	name: `Cryptocurrency`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `244`,
	name: `Crystal Heart`,
	tags: ["C","multi-colored","point card"],
}, {
	id: `245`,
	name: `Ctrl + S`,
	tags: ["C","multi-colored"],
}, {
	id: `246`,
	name: `Cumulocirroaltonimbostratocirronumbus`,
	tags: ["C"],
}, {
	id: `247`,
	name: `Cumulus`,
	tags: ["C","point card"],
}, {
	id: `248`,
	name: `Cursive whoof`,
	tags: ["C","point card"],
}, {
	id: `249`,
	name: `Cyber Jaw`,
	tags: ["C"],
}, {
	id: `250`,
	name: `CYKA блять`,
	tags: ["C","point card"],
}, {
	id: `251`,
	name: `ↃT`,
	tags: ["non-letter start"],
}, {
	id: `252`,
	name: `DANCE PARTY`,
	tags: ["D","point card"],
}, {
	id: `253`,
	name: `DANGER`,
	tags: ["D"],
}, {
	id: `254`,
	name: `Dante's Matchstick™`,
	tags: ["D","point card"],
}, {
	id: `255`,
	name: `DARK KERMIT`,
	tags: ["D","point card"],
}, {
	id: `256`,
	imgType: `jpg`,
	name: `Dark Money`,
	tags: ["D","point card"],
}, {
	id: `257`,
	name: `Dark Sacrifice`,
	tags: ["D","point card"],
}, {
	id: `258`,
	name: `Dash Crystal`,
	tags: ["D","multi-colored","point card"],
}, {
	authors: "Cynthia C.",
	id: `259`,
	name: `Dated Reference`,
	tags: ["D","point card"],
}, {
	id: `260`,
	name: `DAWN of the IRON AGE`,
	tags: ["D","point card"],
}, {
	authors: `Kaiden W.`,
	id: `261`,
	name: `DAY`,
	tags: ["D"],
}, {
	id: `262`,
	name: `DEAD on the Inside`,
	tags: ["D"],
}, {
	id: `263`,
	name: `DEATH BY BLEED THROUGH`,
	tags: ["D"],
}, {
	id: `264`,
	name: `DEATH NOTE 2`,
	tags: ["D","point card"],
}, {
	id: `265`,
	name: `DEATH NOTE`,
	tags: ["D"],
}, {
	id: `266`,
	name: `Deathspacito`,
	tags: ["D","point card"],
}, {
	id: `267`,
	name: `DEBT`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `268`,
	name: `DEGENERATE`,
	tags: ["D"],
}, {
	id: `269`,
	name: `Delayed reaction`,
	tags: ["D"],
}, {
	id: `270`,
	name: `Delegate`,
	tags: ["D","point card"],
}, {
	id: `271`,
	name: `DelSaurus`,
	tags: ["D","point card"],
}, {
	id: `272`,
	name: `Development Card`,
	tags: ["D"],
}, {
	id: `273`,
	name: `Diamond Shovel`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `274`,
	name: `Dictionary`,
	tags: ["D"],
}, {
	id: `275`,
	name: `Did Not Strike Oil`,
	tags: ["D","point card"],
}, {
	id: `276`,
	name: `DIE BUTTER IST ALLE`,
	tags: ["D"],
}, {
	id: `277`,
	name: `DIE, DYE, DIE!`,
	tags: ["D","point card"],
}, {
	id: `278`,
	name: `Die`,
	tags: ["D"],
}, {
	id: `279`,
	name: `Differential Equations 2`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `280`,
	name: `DIFFERENTIAL equations`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `281`,
	name: `Difficult Search`,
	tags: ["D","point card"],
}, {
	id: `282`,
	name: `Diglet`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `283`,
	name: `Dimple`,
	tags: ["D","point card"],
}, {
	id: `284`,
	name: `Direct Democracy`,
	tags: ["D","point card"],
}, {
	id: `285`,
	name: `Dis-cord`,
	tags: ["D","point card"],
}, {
	id: `286`,
	name: `Disintegration`,
	tags: ["D"],
}, {
	id: `287`,
	name: `DISOBEDIENCE`,
	tags: ["D"],
}, {
	id: `288`,
	name: `Disproportionate Features`,
	tags: ["D","point card"],
}, {
	id: `289`,
	name: `dissapointment`,
	tags: ["D","point card"],
}, {
	id: `290`,
	name: `Dissenting Opinion`,
	tags: ["D","point card"],
}, {
	id: `291`,
	name: `DISTUWBINGWY DETAWED UWU`,
	tags: ["D","point card"],
}, {
	id: `292`,
	name: `DL;Discord or TS;Discard`,
	tags: ["D"],
}, {
	id: `293`,
	name: `DN?`,
	tags: ["D","point card"],
}, {
	id: `294`,
	name: `Doesn't Make it onto the Docket`,
	tags: ["D","point card"],
}, {
	id: `295`,
	name: `Dog Ate your Homework`,
	tags: ["D"],
}, {
	id: `296`,
	name: `DOG`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `297`,
	name: `Dominator`,
	tags: ["D","point card"],
}, {
	id: `298`,
	name: `Domo`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `299`,
	name: `Don't know where your 8th period is`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `300`,
	name: `Donke mee-mee`,
	tags: ["D","point card"],
}, {
	id: `301`,
	name: `Dot`,
	tags: ["D","point card"],
}, {
	id: `302`,
	name: `Double Jeopardy`,
	tags: ["D"],
}, {
	id: `303`,
	name: `Double Trouble`,
	tags: ["D","multi-colored","point card"],
}, {
	id: `304`,
	name: `DOUBLE VAMPIRE CARD`,
	tags: ["D","point card"],
}, {
	id: `305`,
	name: `Double-Jointed`,
	tags: ["D"],
}, {
	id: `306`,
	name: `Doubt card`,
	tags: ["D","point card"],
}, {
	id: `307`,
	name: `Dragons!!`,
	tags: ["D","point card"],
}, {
	id: `308`,
	name: `Draw Card Curse`,
	tags: ["D","multi-colored"],
}, {
	id: `309`,
	name: `DRONE STRIKE`,
	tags: ["D","point card"],
}, {
	id: `310`,
	name: `DRUNKEN TIGER`,
	tags: ["D","point card"],
}, {
	id: `311`,
	name: `Dscore:dt`,
	tags: ["D","point card"],
}, {
	id: `312`,
	name: `Duck Rabbit`,
	tags: ["D","point card"],
}, {
	id: `313`,
	name: `Dungeons and...`,
	tags: ["D"],
}, {
	id: `314`,
	name: `Dungeons, Dungeons, and more Dungeons`,
	tags: ["D","point card"],
}, {
	id: `315`,
	name: `Dut dut dut`,
	tags: ["D","point card"],
}, {
	id: `316`,
	name: `Dwayne the "Block" Johnson`,
	tags: ["D","point card"],
}, {
	id: `317`,
	name: `Earl Warren`,
	tags: ["E","point card"],
}, {
	id: `318`,
	name: `Ecchi`,
	tags: ["E","point card"],
}, {
	id: `319`,
	name: `Egad`,
	tags: ["E","point card"],
}, {
	id: `320`,
	name: `Eggfacts dot fun`,
	tags: ["E","point card"],
}, {
	id: `321`,
	imgType: `jpg`,
	name: `Eidos manipulation`,
	tags: ["E"],
}, {
	id: `322`,
	name: `el niño 2`,
	tags: ["E","multi-colored"],
}, {
	id: `323`,
	name: `El niño`,
	tags: ["E","multi-colored","point card"],
}, {
	authors: "Alex Boezer",
	id: `324`,
	imgType: `jpg`,
	name: `Eldritch Horror`,
	tags: ["E","point card"],
}, {
	id: `325`,
	name: `Electric Arc Furnace`,
	tags: ["E","point card"],
}, {
	id: `326`,
	name: `ELON DUSK`,
	tags: ["E","point card"],
}, {
	id: `327`,
	name: `Empty Check`,
	tags: ["E","point card"],
}, {
	id: `328`,
	name: `Enchilada of Magic and Justice`,
	tags: ["E","multi-colored","point card"],
}, {
	id: `329`,
	name: `Ene`,
	tags: ["E","point card"],
}, {
	id: `330`,
	name: `Engage in unliving`,
	tags: ["E","point card"],
}, {
	id: `331`,
	name: `enots emit`,
	tags: ["E"],
}, {
	id: `332`,
	name: `EPIPLECTIC BIKE`,
	tags: ["E","point card"],
}, {
	id: `333`,
	name: `ERERRORREORRRERRORRORERROR`,
	tags: ["E","point card"],
}, {
	id: `334`,
	imgType: `jpg`,
	name: `Everybody Hates Noah`,
	tags: ["E","point card"],
}, {
	id: `335`,
	name: `Everyone is here!`,
	tags: ["E"],
}, {
	id: `336`,
	name: `Evil Platypus`,
	tags: ["E","multi-colored","point card"],
}, {
	id: `337`,
	name: `EXE`,
	tags: ["E"],
}, {
	id: `338`,
	name: `EXEcutive Order`,
	tags: ["E","point card"],
}, {
	id: `339`,
	name: `Existence Trophy`,
	tags: ["E","point card"],
}, {
	id: `340`,
	name: `Exit Poll`,
	tags: ["E","point card"],
}, {
	id: `341`,
	name: `Expand Protector A`,
	tags: ["E"],
}, {
	id: `342`,
	name: `Expand Protector B`,
	tags: ["E"],
}, {
	id: `343`,
	name: `EXPAND`,
	tags: ["E"],
}, {
	authors: "Tushar Rangaswamy",
	id: `344`,
	name: `Explosion Magic`,
	tags: ["E","multi-colored"],
}, {
	id: `345`,
	name: `Expo Marker`,
	tags: ["E","point card"],
}, {
	id: `346`,
	name: `Extreme Range High Capacity Self-charging swapper`,
	tags: ["E","point card"],
}, {
	id: `347`,
	name: `Extremophile`,
	tags: ["E","point card"],
}, {
	id: `348`,
	name: `Eye of Corruption`,
	tags: ["E"],
}, {
	id: `349`,
	name: `Eyjafjallajokull`,
	tags: ["E","point card"],
}, {
	id: `350`,
	name: `F^-1(x)`,
	tags: ["F","point card"],
}, {
	id: `351`,
	name: `fancy wireframe cube`,
	tags: ["F","point card"],
}, {
	id: `352`,
	name: `Fault Line`,
	tags: ["F"],
}, {
	id: `353`,
	name: `FCPSON`,
	tags: ["F","point card"],
}, {
	id: `354`,
	name: `Federalism`,
	tags: ["F","point card"],
}, {
	id: `355`,
	name: `FERACTAL`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `356`,
	name: `Fermata Rest`,
	tags: ["F"],
}, {
	id: `357`,
	name: `Filming vertically`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `358`,
	name: `Find all of the parts of the TI-84 to get 10000pts! (BR)`,
	tags: ["F","point card"],
}, {
	id: `359`,
	name: `Find all of the parts of the TI-84 to get 10000pts! (TL)`,
	tags: ["F","point card"],
}, {
	id: `360`,
	name: `Find all of the parts of the TI-84 to get 10000pts! (TR)`,
	tags: ["F","point card"],
}, {
	id: `361`,
	name: `Find all the parts of the TI-84 to get 10000pts! (BL)`,
	tags: ["F","point card"],
}, {
	id: `362`,
	name: `finite glove`,
	tags: ["F","point card"],
}, {
	id: `363`,
	name: `Fire Emoji`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `364`,
	name: `Fire Flower`,
	tags: ["F","point card"],
}, {
	id: `365`,
	name: `Fire Roasted Fire`,
	tags: ["F","multi-colored"],
}, {
	id: `366`,
	name: `Fireworks!!`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `367`,
	name: `Fish Bunjin's Down Special`,
	tags: ["F","point card"],
}, {
	id: `368`,
	name: `FishBinjin's Neutral Special`,
	tags: ["F","point card"],
}, {
	id: `369`,
	name: `Flash Stopper`,
	tags: ["F"],
}, {
	id: `370`,
	name: `Flip Badge`,
	tags: ["F"],
}, {
	authors: "Cynthia C.",
	id: `371`,
	name: `floating point precision error`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `372`,
	name: `Flow Chart`,
	tags: ["F","point card"],
}, {
	id: `373`,
	name: `Flowey the Flower`,
	tags: ["F","point card"],
}, {
	id: `374`,
	name: `Flux Capacitor`,
	tags: ["F"],
}, {
	id: `375`,
	name: `Fog`,
	tags: ["F","point card"],
}, {
	id: `376`,
	name: `Fool's Gold`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `377`,
	name: `for (int i=1; i≤playerCount; i++) {cardEffect(i, effect)}`,
	tags: ["F","point card"],
}, {
	id: `378`,
	name: `for loop`,
	tags: ["F","point card"],
}, {
	id: `379`,
	name: `FOREST FIRE`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `380`,
	name: `FCPSON`,
	tags: ["F","point card"],
}, {
	id: `381`,
	name: `Franklin D. Roosevelt`,
	tags: ["F","point card"],
}, {
	id: `382`,
	name: `Free Or Reduced Price Lunch`,
	tags: ["F","multi-colored"],
}, {
	authors: "Tushar Rangaswamy",
	id: `383`,
	name: `Freeze Sign`,
	tags: ["F","point card"],
}, {
	id: `384`,
	name: `Freezing Rain`,
	tags: ["F","point card"],
}, {
	id: `385`,
	name: `Freshman Robot`,
	tags: ["F","multi-colored","point card"],
}, {
	id: `386`,
	name: `Frostbite`,
	tags: ["F"],
}, {
	id: `387`,
	name: `Frozen / creepy mario`,
	tags: ["F","multi-colored"],
}, {
	id: `388`,
	name: `Future Value`,
	tags: ["F","point card"],
}, {
	id: `389`,
	name: `GADSBY`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `390`,
	name: `Game Over`,
	tags: ["G","point card"],
}, {
	id: `391`,
	name: `Garbage Truck`,
	tags: ["G","point card"],
}, {
	id: `392`,
	name: `Gecko Farmers State of the Union`,
	tags: ["G","multi-colored","point card"],
}, {
	authors: `Pi R.`,
	id: `393`,
	imgType: `jpg`,
	name: `Generational Divide`,
	tags: ["G"],
}, {
	id: `394`,
	name: `generic POINT CARD`,
	tags: ["G","point card"],
}, {
	id: `395`,
	name: `George A. Custer`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `396`,
	name: `Gerald Beaver`,
	tags: ["G","point card"],
}, {
	id: `397`,
	name: `German Immigrant`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `398`,
	name: `Germaphobe`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `399`,
	name: `Gerrymandering`,
	tags: ["G","point card"],
}, {
	id: `400`,
	name: `Get slapped by guy to left`,
	tags: ["G"],
}, {
	id: `401`,
	name: `Ghost of Imaginary sidekick`,
	tags: ["G"],
}, {
	id: `402`,
	name: `Glass Swap`,
	tags: ["G"],
}, {
	id: `403`,
	name: `GLASSWARE`,
	tags: ["G","point card"],
}, {
	id: `404`,
	name: `GLOO`,
	tags: ["G","multi-colored"],
}, {
	id: `405`,
	name: `Gold Bus`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `406`,
	name: `Good Card I`,
	tags: ["G"],
}, {
	id: `407`,
	name: `Good Card II`,
	tags: ["G","point card"],
}, {
	id: `408`,
	name: `Good Card III`,
	tags: ["G","point card"],
}, {
	id: `409`,
	name: `Good Card IV`,
	tags: ["G","point card"],
}, {
	id: `410`,
	name: `Good Card V`,
	tags: ["G","point card"],
}, {
	id: `411`,
	name: `Good Card VI`,
	tags: ["G"],
}, {
	id: `412`,
	name: `Good Card VII`,
	tags: ["G"],
}, {
	id: `413`,
	name: `Good Card`,
	tags: ["G"],
}, {
	id: `414`,
	name: `Good Citizen`,
	tags: ["G","point card"],
}, {
	id: `415`,
	name: `Goomba`,
	tags: ["G","point card"],
}, {
	id: `416`,
	name: `Gotem`,
	tags: ["G","point card"],
}, {
	id: `417`,
	name: `Government cover-up`,
	tags: ["G","multi-colored"],
}, {
	id: `418`,
	name: `Greco-Russian Cyrillic Alphabet`,
	tags: ["G","point card"],
}, {
	id: `419`,
	name: `Greed`,
	tags: ["G","multi-colored","point card"],
}, {
	authors: `Liam B.`,
	id: `420`,
	name: `Green Light`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `421`,
	name: `GREEN NEW DEAL`,
	tags: ["G","multi-colored","point card"],
}, {
	id: `422`,
	name: `Grover Cleveland`,
	tags: ["G","multi-colored"],
}, {
	id: `423`,
	name: `Grumpy Cat`,
	tags: ["G","point card"],
}, {
	id: `424`,
	name: `Ha, You were under the presumption that this card would be usefull`,
	tags: ["H"],
}, {
	id: `425`,
	name: `Half Finished Card`,
	tags: ["H"],
}, {
	id: `426`,
	name: `Hand-drawn Italics`,
	tags: ["H","point card"],
}, {
	id: `427`,
	name: `Happy Birthday! (not really)`,
	tags: ["H","point card"],
}, {
	id: `428`,
	name: `Hats`,
	tags: ["H","point card"],
}, {
	id: `429`,
	name: `Haunted Hourglass`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `430`,
	name: `Heads or Guillotines`,
	tags: ["H","point card"],
}, {
	id: `431`,
	name: `Heart Locket`,
	tags: ["H","point card"],
}, {
	id: `432`,
	name: `help me makecards`,
	tags: ["H","point card"],
}, {
	id: `433`,
	name: `Herm`,
	tags: ["H","point card"],
}, {
	id: `434`,
	name: `Hermes Boots`,
	tags: ["H","multi-colored"],
}, {
	id: `435`,
	name: `Hg`,
	tags: ["H","point card"],
}, {
	id: `436`,
	name: `Hidden Reinforcements`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `437`,
	name: `High Effort Card`,
	tags: ["H","point card"],
}, {
	id: `438`,
	name: `Hindsight`,
	tags: ["H"],
}, {
	id: `439`,
	name: `Holiday Spirit(?)`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `440`,
	name: `Hole Puncher Cut Card`,
	tags: ["H","point card"],
}, {
	id: `441`,
	name: `holy purge`,
	tags: ["H","multi-colored"],
}, {
	id: `442`,
	name: `Hot Chocolate`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `443`,
	name: `Hot Dogs & Cats`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `444`,
	name: `Hot Glue`,
	tags: ["H"],
}, {
	id: `445`,
	name: `Huff and Puff`,
	tags: ["H"],
}, {
	id: `446`,
	name: `Hungry Node`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `447`,
	name: `Hunter`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `448`,
	name: `Hydration Nation`,
	tags: ["H","multi-colored","point card"],
}, {
	id: `449`,
	name: `Hydraulic Engineering`,
	tags: ["H","multi-colored"],
}, {
	id: `450`,
	name: `I Saw Mommy Kissing Santa Claus`,
	tags: ["I","point card"],
}, {
	id: `451`,
	name: `I want you, to join the PILE`,
	tags: ["I","point card"],
}, {
	id: `452`,
	name: `I'M ALREADY TRACER`,
	tags: ["I","point card"],
}, {
	id: `453`,
	name: `I've run out of creativity`,
	tags: ["I","point card"],
}, {
	id: `454`,
	name: `IBET Teachers`,
	tags: ["I","point card"],
}, {
	id: `455`,
	name: `ICEBERG`,
	tags: ["I"],
}, {
	id: `456`,
	name: `Idk, I just wanted to draw Garfield`,
	tags: ["I","point card"],
}, {
	id: `457`,
	name: `IF YOU Take off TWO articles of clothing`,
	tags: ["I","point card"],
}, {
	id: `458`,
	name: `Illuminati`,
	tags: ["I"],
}, {
	id: `459`,
	name: `Imaginary Contract`,
	tags: ["I","multi-colored","point card"],
}, {
	id: `460`,
	name: `Imagine playing the game`,
	tags: ["I","point card"],
}, {
	authors: `Liam B.`,
	id: `461`,
	name: `Immediate Distribution`,
	tags: ["I","multi-colored"],
}, {
	id: `462`,
	name: `Impeachment and Indictment`,
	tags: ["I","multi-colored","point card"],
}, {
	id: `463`,
	name: `IMPERIAL PRESIDENCY`,
	tags: ["I","point card"],
}, {
	id: `464`,
	name: `Improper yet Humorous Punctuation`,
	tags: ["I","point card"],
}, {
	id: `465`,
	name: `IN CASE OF EMERGENCY`,
	tags: ["I","multi-colored"],
}, {
	id: `466`,
	name: `Incredibly Inconsistent Amount of Points`,
	tags: ["I","point card"],
}, {
	id: `467`,
	name: `INDEFINΛTE INTEGRΛL`,
	tags: ["I","point card"],
}, {
	id: `468`,
	name: `Index Card`,
	tags: ["I"],
}, {
	id: `469`,
	name: `Indian 2`,
	tags: ["I","multi-colored","point card"],
}, {
	id: `470`,
	name: `Indian Mother`,
	tags: ["I","point card"],
}, {
	id: `471`,
	name: `Indian`,
	tags: ["I","multi-colored","point card"],
}, {
	id: `472`,
	name: `Individual Donations`,
	tags: ["I","point card"],
}, {
	id: `473`,
	name: `INFERIOR SIEGE WEAPON`,
	tags: ["I","point card"],
}, {
	id: `474`,
	name: `Infinigon`,
	tags: ["I","point card"],
}, {
	id: `475`,
	name: `Infinity^2 Gauntlet`,
	tags: ["I","multi-colored","point card"],
}, {
	id: `476`,
	name: `Inflation`,
	tags: ["I","point card"],
}, {
	id: `477`,
	name: `Infusion`,
	tags: ["I","point card"],
}, {
	id: `478`,
	name: `iNite MC`,
	tags: ["I","point card"],
}, {
	id: `479`,
	name: `Inktober`,
	tags: ["I","multi-colored"],
}, {
	id: `480`,
	name: `Inkwell`,
	tags: ["I","point card"],
}, {
	authors: `Kaiden W.`,
	id: `481`,
	name: `INSPECTION`,
	tags: ["I","multi-colored"],
}, {
	id: `482`,
	name: `Inspirationally Deficient Card`,
	tags: ["I","point card"],
}, {
	id: `483`,
	name: `INTERGNAT`,
	tags: ["I","point card"],
}, {
	id: `484`,
	name: `INTERSTATE HIGHWAY SYSTEM`,
	tags: ["I","multi-colored"],
}, {
	id: `485`,
	name: `INTO THE GOOD KNIGHT`,
	tags: ["I"],
}, {
	id: `486`,
	name: `Intrusive Advertising`,
	tags: ["I","point card"],
}, {
	id: `487`,
	imgType: `jpg`,
	name: `Iowa Caucuses`,
	tags: ["I","point card"],
}, {
	id: `488`,
	name: `Irish Immigrant`,
	tags: ["I","multi-colored","point card"],
}, {
	id: `489`,
	name: `Is that even sustainable?`,
	tags: ["I","point card"],
}, {
	authors: `Kaiden W.`,
	id: `490`,
	name: `IS`,
	tags: ["I"],
}, {
	id: `491`,
	name: `It slices`,
	tags: ["I","point card"],
}, {
	id: `492`,
	name: `It's ok dude`,
	tags: ["I","point card"],
}, {
	id: `493`,
	name: `It's time to d-d-d-d-duel`,
	tags: ["I","point card"],
}, {
	id: `494`,
	name: `James Handlon #1`,
	tags: ["J","point card"],
}, {
	id: `495`,
	name: `James Handlon #2`,
	tags: ["J"],
}, {
	id: `496`,
	name: `James Handlon #3`,
	tags: ["J","point card"],
}, {
	id: `497`,
	name: `James Playlist - Separate Ways`,
	tags: ["J","multi-colored","point card"],
}, {
	id: `498`,
	name: `James`,
	tags: ["J","point card"],
}, {
	id: `499`,
	name: `James's Artistic Talent`,
	tags: ["J","point card"],
}, {
	id: `500`,
	name: `Jewish`,
	tags: ["J","point card"],
}, {
	id: `501`,
	name: `Joe`,
	tags: ["J","point card"],
}, {
	id: `502`,
	name: `Joeseph's literally trolling #2`,
	tags: ["J","point card"],
}, {
	id: `503`,
	name: `Joeseph's literally trolling`,
	tags: ["J","point card"],
}, {
	id: `504`,
	name: `John F. Kennedy`,
	tags: ["J","point card"],
}, {
	id: `505`,
	name: `John Marshall`,
	tags: ["J","point card"],
}, {
	id: `506`,
	name: `Jones Big @$$ BBQ + Foot Massage`,
	tags: ["J","point card"],
}, {
	id: `507`,
	name: `Joseph Joestar`,
	tags: ["J","point card"],
}, {
	id: `508`,
	imgType: `jpeg`,
	name: `Joseph Stallin'`,
	tags: ["J"],
}, {
	id: `509`,
	name: `Jotaro Kujo`,
	tags: ["J","point card"],
}, {
	id: `510`,
	name: `jsFiddle`,
	tags: ["J"],
}, {
	id: `511`,
	name: `Judicial Review`,
	tags: ["J","point card"],
}, {
	id: `512`,
	name: `Jumping Jacks`,
	tags: ["J","point card"],
}, {
	id: `513`,
	name: `JUMPING, JUMPING`,
	tags: ["J","point card"],
}, {
	id: `514`,
	name: `Just an average F`,
	tags: ["J","point card"],
}, {
	id: `515`,
	name: `Just Breathe`,
	tags: ["J","point card"],
}, {
	id: `516`,
	name: `Just like in real life!`,
	tags: ["J"],
}, {
	id: `517`,
	name: `Just normal Kirby`,
	tags: ["J","point card"],
}, {
	id: `518`,
	name: `Just Your Imagination`,
	tags: ["J","point card"],
}, {
	id: `519`,
	name: `karel.explode();`,
	tags: ["K","point card"],
}, {
	id: `520`,
	name: `Karma (sorta)`,
	tags: ["K","multi-colored"],
}, {
	id: `521`,
	name: `KARMA`,
	tags: ["K","multi-colored"],
}, {
	authors: "Alexander",
	id: `522`,
	name: `Keeling Curve`,
	tags: ["K","point card"],
}, {
	id: `523`,
	name: `Keeling curve`,
	tags: ["K","point card"],
}, {
	id: `524`,
	name: `KERCHOO`,
	tags: ["K"],
}, {
	id: `525`,
	name: `Ketchup`,
	tags: ["K","point card"],
}, {
	id: `526`,
	name: `KGB Hit`,
	tags: ["K","point card"],
}, {
	id: `527`,
	name: `Killer Queen`,
	tags: ["K"],
}, {
	id: `528`,
	name: `Kind Cat Lady`,
	tags: ["K","point card"],
}, {
	id: `529`,
	name: `KING CRIMSON`,
	tags: ["K","point card"],
}, {
	id: `530`,
	name: `KING LEAR`,
	tags: ["K","point card"],
}, {
	id: `531`,
	name: `Kira Yoshikage`,
	tags: ["K","point card"],
}, {
	id: `532`,
	name: `Kirby's special`,
	tags: ["K"],
}, {
	id: `533`,
	name: `Kirkland Signature`,
	tags: ["K","point card"],
}, {
	id: `534`,
	name: `L'Hôpital's card`,
	tags: ["L","point card"],
}, {
	id: `535`,
	name: `lämp`,
	tags: ["L"],
}, {
	id: `536`,
	name: `LASER GUIDED LASER`,
	tags: ["L"],
}, {
	id: `537`,
	name: `Last Christmas`,
	tags: ["L"],
}, {
	id: `538`,
	name: `Late Bus Pass`,
	tags: ["L","point card"],
}, {
	id: `539`,
	name: `LaTex`,
	tags: ["L","point card"],
}, {
	id: `540`,
	name: `QKLBQQMESIQBWIIHIHEQNOBEAILYEFDEASNQOB STUACLMATHRASPIQRACREIYONCLILLOLMOUB RFVMQAZLPRYFTNBNAMOMMBBALMQPCFRPDACLM`,
	tags: ["Q","wide","multi-colored","point card"],
}, {
	id: `541`,
	name: `LEATHERMAN`,
	tags: ["L","point card"],
}, {
	id: `542`,
	name: `Legs`,
	tags: ["L","point card"],
}, {
	id: `543`,
	name: `LEO`,
	tags: ["L","multi-colored","point card"],
}, {
	id: `544`,
	name: `Lesser Healing Potion`,
	tags: ["L","multi-colored"],
}, {
	id: `545`,
	name: `Level II Loot Crate`,
	tags: ["L","point card"],
}, {
	id: `546`,
	name: `Li'l Macho Legs Cat`,
	tags: ["L","point card"],
}, {
	authors: `Liam B.`,
	id: `547`,
	imgType: `jpg`,
	name: `Liam`,
	tags: ["L","point card"],
}, {
	id: `548`,
	name: `Light-Emitting Capacitor`,
	tags: ["L","multi-colored","point card"],
}, {
	id: `549`,
	name: `Lightning Strike!`,
	tags: ["L","multi-colored"],
}, {
	id: `550`,
	name: `Limited Time Offer!`,
	tags: ["L"],
}, {
	id: `551`,
	name: `Line-Item veto`,
	tags: ["L","multi-colored","point card"],
}, {
	id: `552`,
	imgType: `jpg`,
	name: `Liquid DEATH`,
	tags: ["L", "point card"],
}, {
	id: `553`,
	name: `little toe`,
	tags: ["L"],
}, {
	id: `554`,
	name: `LIVING LIFE TO THE FULLEST`,
	tags: ["L","multi-colored"],
}, {
	id: `555`,
	name: `LOCK PICK SET`,
	tags: ["L"],
}, {
	id: `556`,
	name: `LOCKDOWN`,
	tags: ["L","multi-colored"],
}, {
	id: `557`,
	name: `Long Sock`,
	tags: ["L","point card"],
}, {
	id: `558`,
	name: `Loophole finder`,
	tags: ["L"],
}, {
	id: `559`,
	name: `Loot Crate`,
	tags: ["L","multi-colored","point card"],
}, {
	id: `560`,
	name: `Loss`,
	tags: ["L"],
}, {
	id: `561`,
	name: `Lucas`,
	tags: ["L","point card"],
}, {
	id: `562`,
	name: `Lucky Charms`,
	tags: ["L","multi-colored","point card"],
}, {
	authors: "Joseph R.",
	id: `563`,
	name: `Luigi in da Femur Breaker`,
	tags: ["L","point card"],
}, {
	id: `564`,
	name: `Lvl. 35 Mafia Boss`,
	tags: ["L","point card"],
}, {
	id: `565`,
	name: `MACCHIATO`,
	tags: ["M"],
}, {
	id: `566`,
	name: `Mairo's coinless challenge`,
	tags: ["M","point card"],
}, {
	id: `567`,
	name: `MAJORITY RULE`,
	tags: ["M"],
}, {
	id: `568`,
	name: `Mako Mankanshoku`,
	tags: ["M","point card"],
}, {
	id: `569`,
	name: `MANY CATS`,
	tags: ["M","point card"],
}, {
	id: `570`,
	name: `Mario Maker stacking trick`,
	tags: ["M"],
}, {
	id: `571`,
	name: `Marketing`,
	tags: ["M","point card"],
}, {
	id: `572`,
	name: `Mary Poppins`,
	tags: ["M","point card"],
}, {
	authors: `Vincent T.`,
	id: `573`,
	imgType: `jpg`,
	name: `MATH BOMB`,
	tags: ["M","multi-colored","point card"],
	notes: `This card was initially in the deck unfinished. To view the unfinished version, click <a href="./all-card-images/card~573.png">here</a>.`,
}, {
	id: `574`,
	name: `Math Team A`,
	tags: ["M","point card"],
}, {
	id: `575`,
	name: `Matthew Cox??`,
	tags: ["M","point card"],
}, {
	id: `576`,
	name: `Mayoi Hachikoji`,
	tags: ["M","point card"],
}, {
	id: `577`,
	name: `Me Me Big Boy`,
	tags: ["M","point card"],
}, {
	id: `578`,
	name: `MEDIC!!!`,
	tags: ["M","point card"],
}, {
	id: `579`,
	name: `Mediocre Card 2`,
	tags: ["M","point card"],
}, {
	id: `580`,
	name: `Mediocre Card 3`,
	tags: ["M","point card"],
}, {
	id: `581`,
	name: `Mediocre Card 4`,
	tags: ["M","point card"],
}, {
	id: `582`,
	name: `Mediocre Card 5`,
	tags: ["M","point card"],
}, {
	id: `583`,
	name: `Mediocre Card 6`,
	tags: ["M","point card"],
}, {
	id: `584`,
	name: `Meditation`,
	tags: ["M"],
}, {
	id: `585`,
	name: `Medusa`,
	tags: ["M","point card"],
}, {
	id: `586`,
	name: `Memory Theft`,
	tags: ["M","point card"],
}, {
	id: `587`,
	name: `MEMORY.`,
	tags: ["M"],
}, {
	id: `588`,
	name: `MENACE TO SOCIETY`,
	tags: ["M","point card"],
}, {
	id: `589`,
	name: `Message in a Bottle`,
	tags: ["M"],
}, {
	id: `590`,
	name: `Mettaton Neo`,
	tags: ["M","point card"],
}, {
	id: `591`,
	name: `Mia Mamma pet the goat again`,
	tags: ["M"],
}, {
	id: `592`,
	name: `Midas Touch`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `593`,
	name: `Middle Finger of Exodia`,
	tags: ["M"],
}, {
	id: `594`,
	name: `Midiocre Card 1`,
	tags: ["M","point card"],
}, {
	id: `595`,
	name: `Midnight Baseball`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `596`,
	name: `Mikiri Counter`,
	tags: ["M","multi-colored"],
}, {
	id: `597`,
	name: `Minecraft Shovel (unpixelated)`,
	tags: ["M","point card"],
}, {
	id: `598`,
	name: `MINISCULE GLYPH`,
	tags: ["M","point card"],
}, {
	id: `599`,
	name: `Mirror Temple Crystal`,
	tags: ["M","point card"],
}, {
	id: `600`,
	name: `Missile Silo`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `601`,
	name: `Missle Launcher Missle Launcher`,
	tags: ["M"],
}, {
	id: `602`,
	name: `Mitosis, when cells divide`,
	tags: ["M"],
}, {
	id: `603`,
	name: `MLM`,
	tags: ["M","point card"],
}, {
	id: `604`,
	name: `Mobile Hotspot`,
	tags: ["M"],
}, {
	id: `605`,
	name: `Module Modular Modulest`,
	tags: ["M","point card"],
}, {
	id: `606`,
	name: `Moment of Bruh`,
	tags: ["M"],
}, {
	id: `607`,
	name: `Mono`,
	tags: ["M","point card"],
}, {
	id: `608`,
	name: `Monty Mole`,
	tags: ["M","point card"],
}, {
	id: `609`,
	name: `MONUMENTAL OSBORNE`,
	tags: ["M","point card"],
}, {
	id: `610`,
	name: `Mowing the lawn`,
	tags: ["M","multi-colored"],
}, {
	id: `611`,
	name: `Mozart's K231`,
	tags: ["M","point card"],
}, {
	id: `612`,
	name: `Mr. Minecraft`,
	tags: ["M","point card"],
}, {
	id: `613`,
	name: `Ms. Kucko`,
	tags: ["M","point card"],
	notes: `The name is pronounced kʊsko`
}, {
	id: `614`,
	name: `MTT Cooking Show`,
	tags: ["M","point card"],
}, {
	id: `615`,
	name: `MTT Opera`,
	tags: ["M","point card"],
}, {
	id: `616`,
	name: `MTT Quiz Show`,
	tags: ["M","point card"],
}, {
	id: `617`,
	name: `Muckrakers`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `618`,
	name: `Multi-coin block`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `619`,
	name: `MUSE`,
	tags: ["M"],
}, {
	authors: "Alexander",
	id: `620`,
	name: `Mutually Assured Destruction`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `621`,
	name: `Mutually Assured Destruction`,
	tags: ["M"],
}, {
	id: `622`,
	name: `Mutually Assured Thano-cycling`,
	tags: ["M"],
}, {
	id: `623`,
	name: `My art representation of Ash Ketchum`,
	tags: ["M","point card"],
}, {
	id: `624`,
	name: `Mystery Goo`,
	tags: ["M"],
}, {
	id: `625`,
	name: `Mystery Slicer`,
	tags: ["M","multi-colored"],
}, {
	id: `626`,
	name: `Mystery Smoosher`,
	tags: ["M","multi-colored","point card"],
}, {
	id: `627`,
	name: `Name That Tune`,
	tags: ["N","point card"],
}, {
	id: `628`,
	name: `Name Thief`,
	tags: ["N","multi-colored","point card"],
}, {
	authors: "Alex Boezer",
	id: `629`,
	imgType: `jpg`,
	name: `Nanite Swarm`,
	tags: ["N","multi-colored"],
}, {
	id: `630`,
	name: `Nation Park Quarter Collection`,
	tags: ["N","point card"],
}, {
	id: `631`,
	name: `NEGATIVE WORMHOLE`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `632`,
	name: `NEOSTEEL ENTHUSIASTS`,
	tags: ["N","point card"],
}, {
	id: `633`,
	name: `Nerf Gun`,
	tags: ["N"],
}, {
	id: `634`,
	name: `New South`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `635`,
	name: `Nice Cream`,
	tags: ["N","point card"],
}, {
	id: `636`,
	name: `Nikola Tesla`,
	tags: ["N","point card"],
}, {
	id: `637`,
	name: `Nimbostratus`,
	tags: ["N"],
}, {
	id: `638`,
	name: `No more pies!`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `639`,
	name: `No one likes you`,
	tags: ["N"],
}, {
	id: `640`,
	name: `No point in it`,
	tags: ["N","point card"],
}, {
	id: `642`,
	name: `No U`,
	tags: ["N"],
}, {
	id: `643`,
	name: `Noah's Balance`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `644`,
	name: `Noah's Hair`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `645`,
	name: `Noah's Left Eye`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `646`,
	name: `Noah's Left Leg`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `647`,
	name: `Noah's Right Leg`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `648`,
	name: `Noah's Super Synergy`,
	tags: ["N","multi-colored"],
}, {
	id: `649`,
	name: `Noah's Synergy`,
	tags: ["N","multi-colored","point card"],
}, {
	authors: "Tushar Rangaswamy",
	id: `650`,
	name: `Noisy Sign`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `651`,
	name: `NOODLE`,
	tags: ["N","point card"],
}, {
	id: `652`,
	name: `Nope`,
	tags: ["N","multi-colored"],
}, {
	id: `653`,
	name: `NOT A NOAH CARD`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `654`,
	name: `Not on Eggplant`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `655`,
	name: `Not yours, anyway`,
	tags: ["N","point card"],
}, {
	id: `656`,
	name: `NSA rootkit`,
	tags: ["N"],
}, {
	id: `657`,
	name: `Nugget`,
	tags: ["N","multi-colored","point card"],
}, {
	id: `658`,
	name: `Nuke`,
	tags: ["N"],
}, {
	id: `659`,
	name: `O-qué, so now what?`,
	tags: ["O","multi-colored"],
}, {
	id: `660`,
	name: `Obamacare`,
	tags: ["O","point card"],
}, {
	id: `661`,
	name: `Observer`,
	tags: ["O"],
}, {
	id: `662`,
	name: `Obviously Not a Card`,
	tags: ["O","point card"],
}, {
	id: `663`,
	name: `Oddball`,
	tags: ["O","multi-colored","point card"],
}, {
	id: `664`,
	name: `Office Home and Student 2007`,
	tags: ["O","point card"],
}, {
	id: `665`,
	name: `OILY MACARONI`,
	tags: ["O","point card"],
}, {
	authors: "Aaron Liu",
	id: `666`,
	name: `Old Potion`,
	tags: ["O","point card"],
}, {
	id: `667`,
	name: `OMNI CARD`,
	tags: ["O"],
}, {
	id: `668`,
	name: `On any music player, listen to all of Moral Kombat theme by Misterious-theme`,
	tags: ["O","point card"],
}, {
	id: `669`,
	name: `One Blank White Card`,
	tags: ["O"],
}, {
	id: `670`,
	name: `One Ring to Rule Them All`,
	tags: ["O","multi-colored","point card"],
}, {
	id: `671`,
	name: `One Time Use`,
	tags: ["O","wide","point card"],
}, {
	id: `672`,
	name: `Oops! Hah!`,
	tags: ["O","point card"],
}, {
	id: `673`,
	name: `ORANGE LIZARD`,
	tags: ["O","point card"],
}, {
	id: `674`,
	name: `Oregon Trail`,
	tags: ["O","multi-colored","point card"],
}, {
	id: `675`,
	name: `ORONAMIN C`,
	tags: ["O","point card"],
}, {
	id: `676`,
	name: `Out With A Bang`,
	tags: ["O"],
}, {
	id: `677`,
	imgType: `jpg`,
	name: `Overcompensation`,
	tags: ["O", "point card"],
}, {
	id: `678`,
	name: `Overstuffed Piñata`,
	tags: ["O","point card"],
}, {
	id: `679`,
	name: `Package Manager`,
	tags: ["P","point card"],
}, {
	id: `680`,
	name: `Paper Scissors Rock`,
	tags: ["P","point card"],
}, {
	id: `681`,
	name: `Paper Tax!`,
	tags: ["P"],
}, {
	id: `682`,
	name: `Parched Desert`,
	tags: ["P","multi-colored"],
}, {
	id: `683`,
	name: `Pardis Sabeti`,
	tags: ["P","point card"],
}, {
	id: `684`,
	name: `Parry`,
	tags: ["P"],
}, {
	id: `685`,
	name: `PAS UNE PIPE`,
	tags: ["P"],
}, {
	id: `686`,
	name: `Paspyr`,
	tags: ["P","point card"],
}, {
	id: `687`,
	name: `Pass Go`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `688`,
	name: `Pass-Through Gate`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `689`,
	name: `Pass!`,
	tags: ["P","point card"],
}, {
	id: `690`,
	name: `Passive Observation`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `691`,
	name: `PASSIVE TRANSPORT`,
	tags: ["P"],
}, {
	id: `692`,
	name: `Patent`,
	tags: ["P","point card"],
}, {
	id: `693`,
	name: `pay2win`,
	tags: ["P"],
}, {
	id: `694`,
	name: `Pedestrian Mall Restaurant`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `695`,
	name: `Peer Pressure`,
	tags: ["P","point card"],
}, {
	id: `696`,
	name: `Pelosi at the 2020 SOTU`,
	tags: ["P"],
}, {
	authors: `Kaiden W.`,
	id: `697`,
	name: `PEN`,
	tags: ["P","ELEMENT","multi-colored"],
}, {
	id: `698`,
	name: `Pet Preferences`,
	tags: ["P"],
}, {
	id: `699`,
	name: `Philisphical Fence`,
	tags: ["P","point card"],
}, {
	id: `700`,
	name: `Pi`,
	tags: ["P","point card"],
}, {
	id: `701`,
	name: `Pickpocket`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `702`,
	name: `Pig Latin`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `703`,
	name: `Plausable deniability`,
	tags: ["P","point card"],
}, {
	id: `704`,
	name: `Player's Trap`,
	tags: ["P"],
}, {
	id: `705`,
	name: `Playlist #1 - 911 : Mr. Lonely`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `706`,
	name: `Playlist #1 - Deep Web`,
	tags: ["P","multi-colored"],
}, {
	id: `707`,
	name: `Playlist #1 - don't play your card`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `708`,
	name: `Playlist #1 - Flamingo`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `709`,
	name: `Playlist #1 - Mr. Lonely`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `710`,
	name: `Playlist #1 - narashite`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `711`,
	name: `Playlist #1 - Playlist Pack #1`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `712`,
	name: `Playlist #1 - Say It Ain't So`,
	tags: ["P","multi-colored"],
}, {
	id: `713`,
	name: `Playlist #1 - Self Care`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `714`,
	name: `Playlist #1 - Solo`,
	tags: ["P","multi-colored"],
}, {
	id: `715`,
	name: `Playlist #1 - SWEET`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `716`,
	name: `Playlist #1 - あふれる`,
	tags: ["P","multi-colored"],
}, {
	id: `717`,
	name: `Playlist #2 - Battle Lines`,
	tags: ["P","multi-colored"],
}, {
	id: `718`,
	name: `Playlist #2 - EARFQUAKE`,
	tags: ["P","multi-colored"],
}, {
	id: `719`,
	name: `Playlist #2 - Hacker`,
	tags: ["P"],
}, {
	id: `720`,
	name: `Playlist #2 - Magic Ways`,
	tags: ["P","multi-colored"],
}, {
	id: `721`,
	name: `Playlist #2 - Playlist Pack #2`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `722`,
	name: `Playlist #2 - PONPONPON`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `723`,
	name: `Playlist #2 - Run`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `724`,
	name: `Playlist #2 - RUNAWAY`,
	tags: ["P","multi-colored"],
}, {
	id: `725`,
	name: `Playlist #2 - Sunflower`,
	tags: ["P","multi-colored"],
}, {
	id: `726`,
	name: `Playlist #2 - The Prawn Song`,
	tags: ["P","multi-colored"],
}, {
	id: `727`,
	name: `Playlist #2 - 真っ黒`,
	tags: ["P"],
}, {
	id: `728`,
	name: `Playlist #3`,
	tags: ["P","point card"],
}, {
	id: `729`,
	name: `please stop`,
	tags: ["P","multi-colored"],
}, {
	id: `730`,
	name: `Plot Armor`,
	tags: ["P","point card"],
}, {
	id: `731`,
	name: `Pocket Veto`,
	tags: ["P","point card"],
}, {
	id: `732`,
	name: `Poetic Gyre`,
	tags: ["P"],
}, {
	id: `733`,
	name: `Pointer`,
	tags: ["P"],
}, {
	id: `734`,
	name: `Pokeball 2`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `735`,
	name: `Pokeball`,
	tags: ["P","multi-colored"],
}, {
	id: `736`,
	name: `Pokémon GUN`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `737`,
	name: `Political Action Committee`,
	tags: ["P","point card"],
}, {
	id: `738`,
	name: `Politically Correct Period of Wintertime Festivities and Celebration`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `739`,
	name: `Politico`,
	tags: ["P","point card"],
}, {
	id: `740`,
	name: `POPSTAR`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `741`,
	name: `Port-rait`,
	tags: ["P","point card"],
}, {
	id: `742`,
	name: `POSITIVE WORMHOLE`,
	tags: ["P","point card"],
}, {
	id: `743`,
	name: `Powered Minecart`,
	tags: ["P","point card"],
}, {
	authors: "Anish G.",
	id: `744`,
	name: `Prawn Begone`,
	tags: ["P","multi-colored","point card"],
}, {
	authors: "Anish G.",
	id: `745`,
	name: `Prawns Against Humanity`,
	tags: ["P","multi-colored","point card"],
}, {
	id: `746`,
	name: `Presidential Democracy`,
	tags: ["P","point card"],
}, {
	id: `747`,
	name: `Presidential Veto`,
	tags: ["P","point card"],
}, {
	id: `748`,
	name: `PRETZELS IN A pringle can`,
	tags: ["P","multi-colored"],
}, {
	id: `749`,
	name: `Price is Right`,
	tags: ["P"],
}, {
	id: `750`,
	name: `Prime Line`,
	tags: ["P","point card"],
}, {
	id: `751`,
	name: `Proactive Voting`,
	tags: ["P"],
}, {
	authors: `Vincent T.`,
	id: `752`,
	name: `PROBABILITY`,
	tags: ["P","point card"],
}, {
	id: `753`,
	name: `PROCRASTINATION GIANT`,
	tags: ["P","point card"],
}, {
	id: `754`,
	name: `Procrastination`,
	tags: ["P","multi-colored"],
}, {
	id: `755`,
	name: `PROXY PYLON`,
	tags: ["P"],
}, {
	id: `756`,
	name: `Pure Nail`,
	tags: ["P","point card"],
}, {
	id: `757`,
	name: `Purple Man learns Fractions`,
	tags: ["P"],
}, {
	id: `758`,
	name: `Pzkpwf VI Tiger`,
	tags: ["P","point card"],
}, {
	id: `759`,
	name: `Q`,
	tags: ["Q"],
}, {
	id: `760`,
	name: `Qurantine`,
	tags: ["Q"],
}, {
	id: `761`,
	name: `Quest`,
	tags: ["Q","point card"],
}, {
	id: `762`,
	name: `Quintuple Helix`,
	tags: ["Q","multi-colored","point card"],
}, {
	id: `763`,
	name: `r/Iamverysmartcard`,
	tags: ["R","wide","multi-colored"],
}, {
	id: `764`,
	name: `r/whooooosh`,
	tags: ["R","point card"],
}, {
	id: `765`,
	name: `Rabid Animal`,
	tags: ["R"],
}, {
	id: `766`,
	name: `Racoon`,
	tags: ["R","point card"],
}, {
	id: `767`,
	name: `Rags to Riches`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `768`,
	name: `Ratthew's Wrath`,
	tags: ["R","point card"],
}, {
	id: `769`,
	name: `Real Knife`,
	tags: ["R"],
}, {
	id: `770`,
	name: `Recursion`,
	tags: ["R","point card"],
}, {
	id: `771`,
	name: `Recycle Bin`,
	tags: ["R","multi-colored"],
}, {
	id: `772`,
	name: `Recycling Bin v2`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `773`,
	imgType: `jpg`,
	name: `RECYCLING INITIATIVE`,
	tags: ["R"],
}, {
	id: `774`,
	name: `Recycling`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `775`,
	name: `Red Berry`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `776`,
	name: `Red Mushroom`,
	tags: ["R","point card"],
}, {
	id: `777`,
	name: `Redstone comparator`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `778`,
	name: `Redstone Repeater`,
	tags: ["R"],
}, {
	id: `779`,
	name: `REEEEEEEEEEEEMAN SUM`,
	tags: ["R","multi-colored"],
}, {
	id: `780`,
	name: `Reminder 2`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `781`,
	name: `Reminder`,
	tags: ["R"],
}, {
	id: `782`,
	name: `Representative Democracy 2`,
	tags: ["R"],
}, {
	id: `783`,
	name: `Representative Democracy`,
	tags: ["R","point card"],
}, {
	id: `784`,
	name: `Republican Party`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `785`,
	name: `Research Statistics`,
	tags: ["R","point card"],
}, {
	id: `786`,
	name: `Reservation`,
	tags: ["R","multi-colored","point card"],
}, {
	authors: `James H.`,
	id: `787`,
	name: `Reset the game`,
	tags: ["R","point card"],
}, {
	id: `788`,
	name: `Reset the power supply`,
	tags: ["R","multi-colored"],
}, {
	id: `789`,
	name: `Retroactive Voting`,
	tags: ["R"],
}, {
	id: `790`,
	name: `Riffle Force`,
	tags: ["R","multi-colored"],
}, {
	id: `791`,
	name: `RIP`,
	tags: ["R","multi-colored"],
}, {
	id: `792`,
	name: `RNGesus`,
	tags: ["R"],
}, {
	id: `793`,
	name: `ROACH POP`,
	tags: ["R","point card"],
}, {
	id: `794`,
	name: `Robbit Royale`,
	tags: ["R"],
}, {
	id: `795`,
	name: `Robin Hood`,
	tags: ["R"],
}, {
	id: `796`,
	name: `Roblox kid`,
	tags: ["R"],
}, {
	id: `797`,
	imgType: `jpeg`,
	name: `Rod of Discord`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `798`,
	name: `ROLY POLY`,
	tags: ["R","point card"],
}, {
	id: `799`,
	name: `Rotation card `,
	tags: ["R","wide","point card"],
}, {
	id: `800`,
	name: `ROUGE MILL`,
	tags: ["R","point card"],
}, {
	id: `801`,
	name: `Rube Goldberg Card`,
	tags: ["R"],
}, {
	id: `802`,
	name: `Rubik's cube`,
	tags: ["R","point card"],
}, {
	id: `803`,
	name: `Rule Breaker`,
	tags: ["R","multi-colored"],
}, {
	id: `804`,
	name: `Rule of 3`,
	tags: ["R","point card"],
}, {
	id: `805`,
	name: `Rules Lawyer`,
	tags: ["R","point card"],
}, {
	id: `806`,
	name: `Runic Shielding XI`,
	tags: ["R","multi-colored","point card"],
}, {
	id: `807`,
	name: `Rusthead`,
	tags: ["R","point card"],
}, {
	authors: "Charles M.",
	id: `808`,
	imgType: `jpg`,
	name: `Sadism`,
	tags: ["S","point card"],
}, {
	id: `809`,
	name: `Sadness`,
	tags: ["S","point card"],
}, {
	id: `810`,
	name: `Sams Undergtaggle`,
	tags: ["S","point card"],
}, {
	id: `811`,
	name: `SAMURAI SWORD`,
	tags: ["S","point card"],
}, {
	id: `812`,
	name: `Sands Undertale`,
	tags: ["S","point card"],
}, {
	id: `813`,
	name: `Sanic`,
	tags: ["S","point card"],
}, {
	id: `814`,
	name: `Sans Deltarune`,
	tags: ["S","point card"],
}, {
	id: `815`,
	name: `SASQUATCH!`,
	tags: ["S","point card"],
}, {
	id: `816`,
	name: `SATAN'S FLIP`,
	tags: ["S","multi-colored"],
}, {
	authors: "Garrett Phlegar",
	id: `817`,
	name: `Scavenging Ooze`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `818`,
	name: `Scenic Vista`,
	tags: ["S"],
}, {
	id: `819`,
	name: `School Spirit`,
	tags: ["S","point card"],
}, {
	id: `820`,
	name: `SCP-500`,
	tags: ["S"],
}, {
	id: `821`,
	name: `Scream`,
	tags: ["S"],
}, {
	id: `822`,
	name: `Sea Plane`,
	tags: ["S","point card"],
}, {
	id: `823`,
	name: `Search Engine`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `824`,
	name: `Sehr Lecker`,
	tags: ["S","point card"],
}, {
	//just duplicated this one, whoops!
	hide: true,
	id: `825`,
	name: `Self-Distruct`,
	tags: ["S","point card"],
}, {
	id: `826`,
	name: `Self-important cat`,
	tags: ["S","point card"],
}, {
	id: `827`,
	name: `SEM;COL;N`,
	tags: ["S","point card"],
}, {
	id: `828`,
	name: `Senior Class T-Shirt`,
	tags: ["S","point card"],
}, {
	id: `829`,
	name: `Senior Lab Pre-reqs`,
	tags: ["S","multi-colored"],
}, {
	id: `830`,
	name: `Senior Lab`,
	tags: ["S","point card"],
}, {
	hide: true,
	authors: "Charles Morse",
	id: `831`,
	name: `Senioritis`,
	tags: ["S","point card"],
}, {
	id: `832`,
	name: `separate but equal`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `833`,
	name: `Sett, The Boss`,
	tags: ["S","point card"],
}, {
	id: `834`,
	name: `Sexy Chicken`,
	tags: ["S","point card"],
}, {
	id: `835`,
	name: `SGA is ASTUDY Hall`,
	tags: ["S","point card"],
}, {
	id: `836`,
	name: `Shape s`,
	tags: ["S","point card"],
}, {
	id: `837`,
	name: `Share the Wealth`,
	tags: ["S"],
}, {
	id: `838`,
	name: `Sharecropping`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `839`,
	name: `Shoot The Moon`,
	tags: ["S"],
}, {
	id: `840`,
	name: `SHOULDER`,
	tags: ["S","point card"],
}, {
	id: `841`,
	name: `Sideways Illuminati`,
	tags: ["S","wide","point card"],
}, {
	id: `842`,
	name: `Significant Figures`,
	tags: ["S","point card"],
}, {
	id: `843`,
	name: `Silence the idiot or send them away`,
	tags: ["S","point card"],
}, {
	id: `844`,
	name: `SILENT SPRING`,
	tags: ["S"],
}, {
	id: `845`,
	name: `Silver Spoon`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `846`,
	name: `Silver Telescope`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `847`,
	name: `SIM Card`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `848`,
	name: `Singing Contest`,
	tags: ["S"],
}, {
	id: `849`,
	name: `Singularity`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `850`,
	name: `Skin`,
	tags: ["S","point card"],
}, {
	id: `851`,
	name: `Skip Day`,
	tags: ["S","point card"],
}, {
	id: `852`,
	name: `Smart Card`,
	tags: ["S","point card"],
}, {
	id: `853`,
	name: `Smash Ball`,
	tags: ["S","multi-colored"],
}, {
	id: `854`,
	name: `Smeared Ink`,
	tags: ["S","point card"],
}, {
	id: `855`,
	name: `Smile Box`,
	tags: ["S","point card"],
}, {
	id: `856`,
	name: `SMOKE SCREEN`,
	tags: ["S"],
}, {
	id: `857`,
	name: `Smug Penguin`,
	tags: ["S","point card"],
}, {
	id: `858`,
	name: `Snake`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `859`,
	name: `Snow Day 2`,
	tags: ["S","point card"],
}, {
	id: `860`,
	name: `SNOW DAY`,
	tags: ["S","point card"],
}, {
	id: `861`,
	name: `Snowman`,
	tags: ["S","point card"],
}, {
	id: `862`,
	name: `Social Anxiety Girl`,
	tags: ["S","point card"],
}, {
	id: `863`,
	name: `Solar Energy`,
	tags: ["S","point card"],
}, {
	id: `864`,
	name: `Sole stone`,
	tags: ["S"],
}, {
	id: `865`,
	name: `SOLID Of REVOLUTION`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `866`,
	name: `Solve`,
	tags: ["S"],
}, {
	id: `867`,
	name: `Sonia Sotomayor`,
	tags: ["S","point card"],
}, {
	id: `868`,
	name: `Sooper Smesh Brus`,
	tags: ["S"],
}, {
	id: `869`,
	name: `Sooz`,
	tags: ["S","point card"],
}, {
	id: `870`,
	name: `Spaceport Academy`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `871`,
	name: `spaghett`,
	tags: ["S"],
}, {
	id: `872`,
	name: `Sparknotes`,
	tags: ["S","point card"],
}, {
	authors: "Cynthia C.",
	id: `873`,
	name: `Speedrun`,
	tags: ["S","multi-colored"],
}, {
	id: `874`,
	name: `Spelling Bee`,
	tags: ["S","point card"],
}, {
	id: `875`,
	name: `Spin-2-Win`,
	tags: ["S"],
}, {
	authors: "Tushar Rangaswamy",
	id: `876`,
	name: `Spirit Sign`,
	tags: ["S","multi-colored"],
}, {
	id: `877`,
	name: `spooderman`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `878`,
	name: `Squigles`,
	tags: ["S","point card"],
}, {
	id: `879`,
	name: `Squirrel`,
	tags: ["S","point card"],
}, {
	id: `880`,
	name: `Stable Equilibrium`,
	tags: ["S","multi-colored","point card"],
}, {
	authors: "Derek C.",
	id: `881`,
	name: `Stage Fright`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `882`,
	name: `STALINGRAD CARD`,
	tags: ["S","wide"],
}, {
	id: `883`,
	name: `Stampede`,
	tags: ["S","multi-colored"],
}, {
	id: `884`,
	name: `STAPLES Blank Index Cards`,
	tags: ["S","wide","multi-colored","point card"],
}, {
	id: `885`,
	name: `State Of The Union`,
	tags: ["S","point card"],
}, {
	id: `886`,
	name: `Stealth Mode`,
	tags: ["S","point card"],
}, {
	id: `887`,
	name: `Stick`,
	tags: ["S","point card"],
}, {
	id: `888`,
	name: `Stongest card`,
	tags: ["S","point card"],
}, {
	id: `889`,
	name: `Stonks`,
	tags: ["S","point card"],
}, {
	id: `890`,
	name: `Stool on head`,
	tags: ["S","point card"],
}, {
	id: `891`,
	name: `STOOL ON TABLE`,
	tags: ["S","point card"],
}, {
	id: `892`,
	name: `STORK`,
	tags: ["S","point card"],
}, {
	id: `893`,
	name: `Strange Purple Thing`,
	tags: ["S","point card"],
}, {
	id: `894`,
	imgType: `jpg`,
	name: `Stratocumulus`,
	tags: ["S", "point card"],
}, {
	id: `895`,
	name: `Stratus`,
	tags: ["S"],
}, {
	id: `896`,
	name: `Strength in Numbers`,
	tags: ["S"],
}, {
	id: `897`,
	name: `Stretchy Arms`,
	tags: ["S"],
}, {
	id: `898`,
	name: `Strike!!!`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `899`,
	name: `Struck Oil`,
	tags: ["S","point card"],
}, {
	id: `900`,
	name: `Student Loans`,
	tags: ["S","point card"],
}, {
	id: `901`,
	name: `STUDY CARD`,
	tags: ["S"],
}, {
	id: `902`,
	name: `Study Hall`,
	tags: ["S","point card"],
}, {
	id: `903`,
	name: `Stylish Scarf`,
	tags: ["S","point card"],
}, {
	authors: `Derek C.`,
	id: `904`,
	name: `Subito`,
	tags: ["S"],
}, {
	id: `905`,
	name: `Subpoena`,
	tags: ["S","point card"],
}, {
	id: `906`,
	name: `Subscribe to PewDiePie`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `907`,
	name: `Subscription To A Corporate-Run, For-Profit Educational System Which Harms Lower-Income Students And Creates An Atmosphere Less Attuned To Individuals And Life Skills And Instead Focused On Rote Memorization And Extensive Standardized Testing`,
	tags: ["S","point card"],
}, {
	id: `908`,
	name: `Suicide Burn`,
	tags: ["S","multi-colored","point card"],
}, {
	authors: "Anish G.",
	id: `909`,
	name: `Sumday`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `910`,
	name: `Summoning Runes`,
	tags: ["S","point card"],
}, {
	id: `911`,
	name: `Super Dimentid`,
	tags: ["S"],
}, {
	id: `912`,
	name: `Super Hardcore`,
	tags: ["S","point card"],
}, {
	id: `913`,
	name: `Super P.A.C`,
	tags: ["S","point card"],
}, {
	id: `914`,
	name: `Super-heat snowball`,
	tags: ["S","point card"],
}, {
	id: `915`,
	name: `Super`,
	tags: ["S"],
}, {
	id: `916`,
	name: `Supportive Friends`,
	tags: ["S","point card"],
}, {
	id: `917`,
	name: `Supreme Bee Yeeter`,
	tags: ["S","point card"],
}, {
	id: `918`,
	name: `Supreme Court Superiority`,
	tags: ["S","point card"],
}, {
	id: `919`,
	name: `Supreme Court`,
	tags: ["S","point card"],
}, {
	authors: `Liam B.`,
	id: `920`,
	name: `Swapper : Pythonic swap.py`,
	tags: ["S","multi-colored","point card"],
}, {
	id: `921`,
	name: `Switzerland`,
	tags: ["S","point card"],
}, {
	id: `922`,
	name: `SWORD BEHIND INAPPROPRIATE PREPOSITIONS`,
	tags: ["S","point card"],
}, {
	id: `923`,
	name: `T HERE C AN ONLY BE ONE`,
	tags: ["T"],
}, {
	id: `924`,
	name: `T`,
	tags: ["T","point card"],
}, {
	id: `925`,
	name: `TAINT!`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `926`,
	name: `Tall-nut`,
	tags: ["T"],
}, {
	id: `927`,
	name: `TARDIS`,
	tags: ["T"],
}, {
	id: `928`,
	name: `Teaming in Solo Mode`,
	tags: ["T"],
}, {
	id: `929`,
	name: `Tear up speech paper`,
	tags: ["T","point card"],
}, {
	id: `930`,
	name: `Technobabble`,
	tags: ["T"],
}, {
	id: `931`,
	name: `Technology is the future of learning`,
	tags: ["T","point card"],
}, {
	id: `932`,
	name: `Teemo Mushroom`,
	tags: ["T","point card"],
}, {
	id: `933`,
	name: `Teenage boy after doing literally anything`,
	tags: ["T","point card"],
}, {
	id: `934`,
	name: `TELL ME WHY ~`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `935`,
	name: `Tem Shop`,
	tags: ["T","point card"],
}, {
	id: `936`,
	name: `Temmie`,
	tags: ["T","point card"],
}, {
	id: `937`,
	name: `TEMPORAL RESOLUTION`,
	tags: ["T","point card"],
}, {
	id: `938`,
	name: `Tenement`,
	tags: ["T","multi-colored"],
}, {
	id: `939`,
	name: `TETRIS 99`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `940`,
	name: `Tetris`,
	tags: ["T"],
}, {
	id: `941`,
	name: `THANOS CARD`,
	tags: ["T"],
}, {
	id: `942`,
	name: `Thanos Snap`,
	tags: ["T"],
}, {
	id: `943`,
	name: `Thanos v4`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `944`,
	name: `That one card whose title is too long but whose description makes you read the entire title alou`,
	tags: ["T","point card"],
}, {
	id: `945`,
	name: `The Anime Eye`,
	tags: ["T","point card"],
}, {
	id: `946`,
	name: `The Bass-Boosted Eye, Back for Revenge`,
	tags: ["T","point card"],
}, {
	id: `947`,
	name: `The Challenge`,
	tags: ["T","point card"],
}, {
	id: `948`,
	name: `The Clock`,
	tags: ["T"],
}, {
	id: `949`,
	name: `The Count!!!`,
	tags: ["T","point card"],
}, {
	id: `950`,
	name: `THE CREATOR`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `951`,
	name: `The Crude Eye`,
	tags: ["T"],
}, {
	id: `952`,
	name: `The DESTROYER`,
	tags: ["T"],
}, {
	id: `953`,
	name: `THE DOME`,
	tags: ["T"],
}, {
	id: `954`,
	name: `The end of the world as we k`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `955`,
	name: `The Eye, Unflawed`,
	tags: ["T","point card"],
}, {
	id: `956`,
	name: `The Flaming Eye`,
	tags: ["T"],
}, {
	id: `957`,
	name: `The Frog of Evil Crosses your path`,
	tags: ["T"],
}, {
	id: `958`,
	name: `The Future is NOW`,
	tags: ["T"],
}, {
	authors: "Joseph R.",
	id: `959`,
	name: `The Gamble`,
	tags: ["T","point card"],
}, {
	id: `961`,
	name: `The Geometric`,
	tags: ["T","point card"],
}, {
	id: `962`,
	name: `The Good One`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `963`,
	name: `The Grinch`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `964`,
	name: `the happiest birthday`,
	tags: ["T"],
}, {
	id: `965`,
	name: `The Harcut That Changed Me™`,
	tags: ["T"],
}, {
	id: `966`,
	name: `The Hat`,
	tags: ["T","point card"],
}, {
	id: `967`,
	name: `The House of Representatives`,
	tags: ["T","point card"],
}, {
	id: `968`,
	name: `The Invisible Eye`,
	tags: ["T"],
}, {
	id: `969`,
	name: `THE INVISIBLE HAND OF`,
	tags: ["T","point card"],
}, {
	id: `970`,
	name: `The Light, it burns`,
	tags: ["T"],
}, {
	id: `971`,
	name: `The Locket`,
	tags: ["T","point card"],
}, {
	id: `972`,
	name: `The Monitor monitor is a monitor`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `973`,
	name: `The Night King`,
	tags: ["T"],
}, {
	id: `974`,
	name: `The Osborne`,
	tags: ["T","point card"],
}, {
	id: `975`,
	name: `The PACIFIER`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `976`,
	name: `The Reverse Parrot`,
	tags: ["T","point card"],
}, {
	id: `977`,
	name: `The Rich get Richer`,
	tags: ["T"],
}, {
	id: `978`,
	name: `The rocky thing, BUT BACKWARDS`,
	tags: ["T","point card"],
}, {
	id: `979`,
	name: `The smudge`,
	tags: ["T"],
}, {
	id: `980`,
	name: `The WEEB!`,
	tags: ["T"],
}, {
	id: `981`,
	name: `The White Whale`,
	tags: ["T","point card"],
}, {
	id: `982`,
	name: `Theodore Roosevelt 2`,
	tags: ["T","point card"],
}, {
	id: `983`,
	name: `Theodore Roosevelt`,
	tags: ["T","point card"],
}, {
	authors: "Cynthia C.",
	id: `984`,
	name: `They're assimilated`,
	tags: ["T","multi-colored"],
}, {
	authors: "Cynthia C.",
	id: `985`,
	name: `They're here`,
	tags: ["T","multi-colored"],
}, {
	authors: "Cynthia C.",
	id: `986`,
	name: `They're malicious`,
	tags: ["T","multi-colored"],
}, {
	id: `987`,
	name: `This card intentionally left blank`,
	tags: ["T"],
}, {
	id: `988`,
	name: `This card is upside-down`,
	tags: ["T","point card"],
}, {
	id: `989`,
	name: `This Card`,
	tags: ["T","point card"],
}, {
	id: `990`,
	name: `This cool stick`,
	tags: ["T","point card"],
}, {
	id: `991`,
	name: `This sad Man I drew`,
	tags: ["T","point card"],
}, {
	id: `992`,
	name: `Thomas Jefferson`,
	tags: ["T","point card"],
}, {
	id: `993`,
	name: `THUNDER TOWER`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `994`,
	name: `Ticking Time Bomb`,
	tags: ["T","point card"],
}, {
	id: `995`,
	name: `TIME BOMB`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `996`,
	name: `Time Machine`,
	tags: ["T"],
}, {
	authors: "Tushar Rangaswamy",
	id: `997`,
	name: `Time Sign`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `998`,
	name: `Tinsel Barbed Wire`,
	tags: ["T","point card"],
}, {
	id: `999`,
	name: `Tippi`,
	tags: ["T"],
}, {
	id: `1000`,
	name: `Tipsy`,
	tags: ["T","point card"],
}, {
	id: `1001`,
	name: `TITANIC`,
	tags: ["T","point card"],
}, {
	id: `1002`,
	name: `TJ """"""""""Henry"""""""""" Yoshi`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1003`,
	name: `TJ Football`,
	tags: ["T"],
}, {
	authors: "Sahishnu H.",
	id: `1004`,
	name: `TJ HIGH SCHOOL FOR SCIENCE AND TECHNOLOGY`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1005`,
	name: `TJ Star`,
	tags: ["T","point card"],
}, {
	id: `1006`,
	name: `TJ1KBWC Discord`,
	tags: ["T","point card"],
}, {
	id: `1007`,
	name: `TNT Minecart`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1008`,
	name: `Toll`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1009`,
	name: `Tongue Twisted`,
	tags: ["T","point card"],
}, {
	id: `1010`,
	name: `Too complicated!`,
	tags: ["T","point card"],
}, {
	id: `1011`,
	name: `Tootsie Re-Roll®`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1012`,
	name: `Totem of Undying`,
	tags: ["T","point card"],
}, {
	id: `1013`,
	name: `Tough Gloves`,
	tags: ["T","point card"],
}, {
	id: `1014`,
	name: `Tough Phoenix`,
	tags: ["T","point card"],
}, {
	id: `1015`,
	name: `TOWER N`,
	tags: ["T","point card"],
}, {
	id: `1016`,
	name: `Toxic Waste`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1017`,
	name: `Tracking poll`,
	tags: ["T","point card"],
}, {
	id: `1018`,
	name: `Trade Policy`,
	tags: ["T","point card"],
}, {
	id: `1019`,
	name: `Train (blue)`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1020`,
	name: `Train (red)`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1021`,
	name: `Train (brown)`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1022`,
	name: `Train (green)`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1023`,
	name: `Tranquilizer Dart`,
	tags: ["T"],
}, {
	id: `1024`,
	name: `Transmute`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1025`,
	name: `Trap card`,
	tags: ["T"],
}, {
	id: `1026`,
	name: `Trick up your (Sle)eve`,
	tags: ["T","point card"],
}, {
	id: `1027`,
	name: `Trump 2020`,
	tags: ["T","point card"],
}, {
	id: `1028`,
	name: `TRUMP CARD`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1029`,
	name: `Trumpet`,
	tags: ["T","point card"],
}, {
	id: `1030`,
	name: `Trust Bust`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1031`,
	name: `Trustee`,
	tags: ["T","point card"],
}, {
	id: `1032`,
	name: `Try Jumping`,
	tags: ["T","point card"],
}, {
	id: `1033`,
	name: `TUNNEL AUS DEUTSCH`,
	tags: ["T","wide","point card"],
}, {
	id: `1034`,
	name: `Turban Man`,
	tags: ["T"],
}, {
	id: `1035`,
	name: `Twelve`,
	tags: ["T"],
}, {
	id: `1036`,
	name: `Twins`,
	tags: ["T","point card"],
}, {
	id: `1037`,
	name: `Twins`,
	tags: ["T","point card"],
}, {
	id: `1038`,
	name: `twitch simp`,
	tags: ["T","point card"],
}, {
	id: `1039`,
	name: `Two Drops per Quarter`,
	tags: ["T"],
}, {
	id: `1040`,
	name: `u tried`,
	tags: ["U","point card"],
}, {
	id: `1041`,
	name: `uh oh you boosted banoko, you've just been BEANED`,
	tags: ["U","point card"],
}, {
	id: `1042`,
	name: `ULA's Altas-V`,
	tags: ["U"],
}, {
	id: `1043`,
	name: `Ultra Olympics`,
	tags: ["U"],
}, {
	id: `1044`,
	name: `ULTRAWIDE DISPLAY`,
	tags: ["U","wide","point card"],
}, {
	id: `1045`,
	name: `Un-BEAR-able Pun`,
	tags: ["U"],
}, {
	id: `1046`,
	name: `Unblank White card`,
	tags: ["U","point card"],
}, {
	id: `1047`,
	name: `Undo`,
	tags: ["U","multi-colored"],
}, {
	id: `1048`,
	name: `Unexpected GNOME`,
	tags: ["U","multi-colored","point card"],
}, {
	id: `1049`,
	name: `Unfair Trade Deal`,
	tags: ["U"],
}, {
	id: `1050`,
	name: `Unhandled Exception`,
	tags: ["U","multi-colored"],
}, {
	id: `1051`,
	name: `Unification Failed`,
	tags: ["U","point card"],
}, {
	id: `1052`,
	name: `United Airlines`,
	tags: ["U","point card"],
}, {
	id: `1053`,
	name: `Unknown Chaos`,
	tags: ["U"],
}, {
	id: `1054`,
	name: `Uno Reverse Card`,
	tags: ["U"],
}, {
	id: `1055`,
	name: `UNO®`,
	tags: ["U","multi-colored"],
}, {
	id: `1056`,
	name: `Unplanned card`,
	tags: ["U","point card"],
}, {
	id: `1057`,
	name: `UNREALISTIC IDEALISM`,
	tags: ["U","multi-colored"],
}, {
	id: `1058`,
	name: `UNSCREWABLE POMMEL`,
	tags: ["U","point card"],
}, {
	id: `1059`,
	name: `Unstable Time Loop`,
	tags: ["U","point card"],
}, {
	id: `1060`,
	name: `Unwarmness`,
	tags: ["U","multi-colored","point card"],
}, {
	id: `1061`,
	name: `Ur mom`,
	tags: ["U","point card"],
}, {
	id: `1062`,
	name: `US of A`,
	tags: ["U","multi-colored"],
}, {
	id: `1063`,
	name: `USA PATRIOT Act`,
	tags: ["U","point card"],
}, {
	id: `1064`,
	name: `Used Car Salesman`,
	tags: ["U","multi-colored","point card"],
}, {
	id: `1065`,
	name: `Usopp Usoland Black`,
	tags: ["U","point card"],
}, {
	id: `1066`,
	name: `UTILITARIANISM`,
	tags: ["U"],
}, {
	id: `1067`,
	name: `UwU, not made on enough cards`,
	tags: ["U","point card"],
}, {
	id: `1068`,
	name: `Van Darkholme`,
	tags: ["V","point card"],
}, {
	id: `1069`,
	name: `Violin`,
	tags: ["V","point card"],
}, {
	id: `1070`,
	name: `Voice Augmentation`,
	tags: ["V","point card"],
}, {
	id: `1071`,
	name: `Voodoo Card`,
	tags: ["V","multi-colored","point card"],
}, {
	id: `1072`,
	name: `Voronoi`,
	tags: ["V","multi-colored","point card"],
}, {
	id: `1073`,
	name: `Vowel Scowl`,
	tags: ["V","point card"],
}, {
	id: `1074`,
	name: `W.E.B. Du Bois`,
	tags: ["W","multi-colored","point card"],
}, {
	id: `1075`,
	name: `WAIT. That's illegal.`,
	tags: ["W"],
}, {
	id: `1076`,
	name: `walcc`,
	tags: ["W","point card"],
}, {
	id: `1077`,
	name: `Walrus operator`,
	tags: ["W","point card"],
}, {
	id: `1078`,
	name: `Water Sleighing`,
	tags: ["W","multi-colored","point card"],
}, {
	id: `1079`,
	name: `Water to Wine`,
	tags: ["W"],
}, {
	id: `1080`,
	name: `water`,
	tags: ["W","point card"],
}, {
	id: `1081`,
	name: `Waterflower`,
	tags: ["W","multi-colored","point card"],
}, {
	id: `1082`,
	name: `Wave Dash (celeste)`,
	tags: ["W","point card"],
}, {
	id: `1083`,
	name: `We Need To Go Deeper`,
	tags: ["W","point card"],
}, {
	id: `1084`,
	name: `Weeb-inator 9000®™`,
	tags: ["W","point card"],
}, {
	id: `1085`,
	name: `WEIRD FLEX`,
	tags: ["W"],
}, {
	id: `1086`,
	name: `Well-meaning Lobbyist`,
	tags: ["W","point card"],
}, {
	id: `1087`,
	name: `What the heck?`,
	tags: ["W","point card"],
}, {
	id: `1088`,
	name: `What's a webpage, something ducks walk on?`,
	tags: ["W","multi-colored","point card"],
}, {
	id: `1089`,
	name: `Wheel of Fortune`,
	tags: ["W"],
}, {
	id: `1090`,
	name: `WHEN I'm GRANDMASTER`,
	tags: ["W"],
}, {
	id: `1091`,
	name: `White Elephant`,
	tags: ["W"],
}, {
	id: `1092`,
	name: `WHITE TO MOVE, MATE IN THREE`,
	tags: ["W"],
}, {
	id: `1093`,
	name: `Whoa! This is worthless!`,
	tags: ["W"],
}, {
	id: `1094`,
	name: `WHOEVER SMELT IT, DEALT IT`,
	tags: ["W","point card"],
}, {
	id: `1095`,
	name: `Whose Line is it Anyway?`,
	tags: ["W","point card"],
}, {
	id: `1096`,
	name: `Wiki Master`,
	tags: ["W","point card"],
}, {
	id: `1097`,
	name: `WIN-ter`,
	tags: ["W"],
}, {
	id: `1098`,
	name: `Winter cap`,
	tags: ["W","point card"],
}, {
	id: `1099`,
	name: `Winter Gloves`,
	tags: ["W","point card"],
}, {
	id: `1100`,
	name: `WInter Jacket`,
	tags: ["W","multi-colored","point card"],
}, {
	authors: "Paul Appler",
	id: `1101`,
	name: `With`,
	tags: ["W","point card"],
}, {
	id: `1102`,
	name: `Wolverine`,
	tags: ["W","point card"],
}, {
	id: `1103`,
	name: `WONDER VICTORY`,
	tags: ["W"],
}, {
	id: `1104`,
	name: `WTF.....?`,
	tags: ["W","point card"],
}, {
	id: `1105`,
	name: `WWII Italy`,
	tags: ["W","multi-colored","point card"],
}, {
	id: `1106`,
	name: `YAH YEET (yuh... ayy...)`,
	tags: ["Y","point card"],
}, {
	id: `1107`,
	name: `yearbook`,
	tags: ["Y","point card"],
}, {
	id: `1108`,
	name: `Yearning`,
	tags: ["Y","wide","point card"],
}, {
	id: `1109`,
	name: `Yeetus Yeetus Ctrl+Alt+Deletus`,
	tags: ["Y","point card"],
}, {
	id: `1110`,
	name: `YELLOW LIZARD`,
	tags: ["Y","point card"],
}, {
	id: `1111`,
	name: `YI PACKET`,
	tags: ["Y","point card"],
}, {
	id: `1112`,
	name: `Yos`,
	tags: ["Y","point card"],
}, {
	id: `1113`,
	name: `You Can Hold 1 Card In Your Pocket`,
	tags: ["Y"],
}, {
	id: `1114`,
	name: `You have 2 seconds to moan`,
	tags: ["Y","point card"],
}, {
	id: `1115`,
	name: `You have 2 seconds to mow`,
	tags: ["Y","point card"],
}, {
	id: `1116`,
	name: `You have died of dysentery`,
	tags: ["Y"],
}, {
	id: `1117`,
	name: `You have started Studying for your test`,
	tags: ["Y","multi-colored","point card"],
}, {
	authors: "Tushar Rangaswamy",
	id: `1118`,
	name: `You Know the Rules, Say Goodbye`,
	tags: ["Y"],
}, {
	id: `1119`,
	name: `You Lose`,
	tags: ["Y","multi-colored"],
}, {
	id: `1120`,
	name: `You Touch My Tralala`,
	tags: ["Y"],
}, {
	id: `1121`,
	name: `YOU WIN!!!`,
	tags: ["Y","point card"],
}, {
	id: `1122`,
	name: `You've triggered your trap card`,
	tags: ["Y","point card"],
}, {
	id: `1123`,
	name: `Your Lucky Card`,
	tags: ["Y","point card"],
}, {
	id: `1124`,
	name: `YOUR MUSIC TASTE SUCKS™`,
	tags: ["Y"],
}, {
	id: `1125`,
	name: `Yus`,
	tags: ["Y"],
}, {
	id: `1126`,
	name: `Zombie Apocalypse`,
	tags: ["Z"],
}, {
	id: `1127`,
	name: `Zookeeper`,
	tags: ["Z","point card"],
}, {
	id: `1128`,
	name: `イマクニ？のドードー`,
	tags: ["non-letter start","multi-colored","point card"],
}, {
	id: `1129`,
	name: `ひらがな`,
	tags: ["non-letter start","point card"],
}, {
	id: `1130`,
	imgType: `jpeg`,
	name: `The Day of Prophecy`,
	tags: ["T","multi-colored","point card"],
}, {
	id: `1131`,
	imgType: `jpeg`,
	name: `Pi Day`,
	tags: ["P","multi-colored","point card"],
}, {
	authors: "Joseph R.",
	id: `1132`,
	name: `Pitt Greensburg`,
	tags: ["P"],
}, {
	id: `1133`,
	name: `PLANTERN`,
	tags: ["P","point card", "multi-colored"],
}, {
	id: `1134`,
	name: `GUARDIAN`,
	tags: ["G","point card"],
}, {
	id: `1135`,
	name: `gay`,
	tags: ["G", "wide","point card", "multi-colored"],
}, {
	authors: `Cynthia C.`,
	id: `1136`,
	name: `Dated Reference`,
	tags: ["D","point card"],
	notes: `This one most likely toes the line of hate speech. My justification for this is that you lose points, but I'm not the person who decides the validity of cards.`
}, {
	id: `1137`,
	name: `Power Play I`,
	tags: ["P","point card"],
}, {
	authors: `Cynthia C.`,
	hide: true,
	id: `1138`,
	name: `Ferris the catgirl`,
	tags: ["F","point card"],
	notes: `Banned due to percieved malicious intent.`
}, {
	authors: `Cynthia C.`,
	id: `1139`,
	name: `Ferris the catgirl`,
	tags: ["F","point card"],
	notes: `I put a lot of work into this drawing, I'm not letting it just get thrown away. <a href="./all-card-images/card~1138.png">Unredacted version</a>`
}, {
	id: `1140`,
	name: `Headless <span style="text-decoration: line-through;">Horseman</span> TJ kid`,
	tags: ["H"],
}, {
	//shameful. Missed the F at the end and so accidentally repeated this one.
	hide: true,
	id: `1141`,
	name: `Cursive whoof`,
	tags: ["C","point card"],
}, {
	id: `1142`,
	name: `Mummy W(rap)`,
	tags: ["M"],
}, {
	id: `1143`,
	name: `GourdChat 1.0`,
	tags: ["G","point card"],
}, {
	id: `1144`,
	name: `Self-loathing peanut`,
	tags: ["S", "multi-colored"],
}, {
	id: `1145`,
	name: `Gourdcop`,
	tags: ["G","point card"],
}, {
	id: `1146`,
	name: `Uneasy Observers`,
	tags: ["U", "point card", "wide", "multi-colored"],
}, {
	id: `1147`,
	name: `Monopoints`,
	tags: ["M", "point card", "wide", "multi-colored"],
}, {
	id: `1148`,
	name: `DA»«`,
	tags: ["D", "point card", "wide", "multi-colored"],
}, {
	id: `1149`,
	name: `Cut! a card in 2.`,
	tags: ["C", "rule card", "multi-colored"],
}, {
	id: `1150`,
	name: `Radio Silence`,
	tags: ["R", "rule card", "multi-colored"],
}, {
	id: `1151`,
	name: `Reverse All`,
	tags: ["R", "rule card"],
}, {
	id: `1152`,
	name: `REDACT Light`,
	tags: ["R", "rule card", "wide", "multi-colored"],
}, {
	authors: `Cynthia C.`,
	id: `1153`,
	name: `Pipis`,
	tags: ["P", "point card", "multi-colored"],
}, {
	authors: `Cynthia C.`,
	id: `1154`,
	name: `Grandpa`,
	tags: ["G", "point card", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1155`,
	name: `Breadth-First Search`,
	tags: ["B", "rule card"],
}, {
	id: `1156`,
	name: `Vaccine`,
	tags: ["V", "point card"],
}, {
	id: `1157`,
	name: `DEEP STATE`,
	tags: ["D", "rule card", "multi-colored"],
}, {
	id: `1158`,
	name: `Encroaching Stun`,
	tags: ["E", "point card"],
}, {
	id: `1159`,
	name: `Fortnite (Celeste)`,
	tags: ["F", "point card"],
}, {
	id: `1160`,
	name: `Mistletoe Mine`,
	tags: ["M", "point card", "multi-colored"],
}, {
	authors: `Kaiden W.`,
	id: `1161`,
	name: `10 Blank White Card`,
	tags: ["number start", "rule card"],
}, {
	authors: `Derek C.`,
	id: `1162`,
	name: `Hidden Power`,
	tags: ["H", "point card"],
}, {
	id: `1163`,
	name: `drip shoes`,
	tags: ["D", "point card"],
}, {
	authors: `Sophia F.`,
	id: `1164`,
	name: `Existensial CRISIS`,
	tags: ["E", "point card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1165`,
	name: `Swarm Missiles`,
	tags: ["S", "point card", "rule card"],
}, {
	authors: `Liam B.`,
	id: `1166`,
	name: `Private Defense Contractor`,
	tags: ["P", "point card", "wide"],
}, {
	authors: `Cynthia C.`,
	id: `1167`,
	name: `Between 2 and 2 or more`,
	tags: ["B", "rule card"],
}, {
	authors: `Pi R.`,
	id: `1168`,
	name: `The Test (form 1)`,
	tags: ["T", "rule card"],
}, {
	authors: `Pi R.`,
	id: `1169`,
	name: `Augment`,
	tags: ["A", "rule card"],
}, {
	authors: `Pi R.`,
	id: `1170`,
	name: `Contact Tracing`,
	tags: ["C", "point card"],
}, {
	id: `1171`,
	name: `On any music player, listen to allof Mortal Kombat theme by Misterious-theme`,
	tags: ["O", "point card"],
}, {
	id: `1172`,
	name: `Mono`,
	tags: ["M", "point card"],
}, {
	id: `1173`,
	name: `What the heck?`,
	tags: ["W", "point card", "wide"],
}, {
	authors: `Aadarsh N.`,
	id: `1174`,
	name: `Regret`,
	tags: ["R", "point card"],
}, {
	id: `1175`,
	name: `Spongeboy me bob!`,
	tags: ["S", "point card"],
}, {
	id: `1176`,
	name: `HAND TURKEY PART 3`,
	tags: ["H", "point card"],
	notes: `I really wish people would stop making these types of set cards. They never apply in the actual game. A distinction is made between cards in a set and cards that give points when the set is united, because cards in a set can be cool when you discover one at a time, but cards that only give points / have an effect triggered when they're united will simply never have their effects triggered.`
}, {
	id: `1177`,
	name: `Self-Distruct`,
	tags: ["S", "point card"],

}, {
	id: `1178`,
	name: `LONG SANTA`,
	tags: ["L"],
}, {
	id: `1179`,
	name: `ABOLISH THE ELECTORAL COLLEGE`,
	tags: ["A", "point card"],
}, {
	authors: `Aadarsh N.`,
	id: `1180`,
	name: `Caltrops`,
	tags: ["C", "multi-colored"],
}, {
	id: `1181`,
	name: `DEEP DARK SEA`,
	tags: ["D", "point card"],
}, {
	id: `1182`,
	name: `My 1st Semester grades`,
	tags: ["M", "point card"],
}, {
	id: `1183`,
	name: `Suspicious Imitator`,
	tags: ["S", "point card", "multi-colored"],
}, {
	authors: `James H.`,
	id: `1184`,
	name: `It's my card`,
	tags: ["I", "point card"],
}, {
	id: `1185`,
	name: `Five Night Funking`,
	tags: ["F", "point card", "multi-colored"],
}, {
	id: `1186`,
	name: `Friday Nights at Freddy's`,
	tags: ["F", "point card", "multi-colored"],
}, {
	id: `1187`,
	name: `Imposter (from Among us)`,
	tags: ["I", "point card"],
}, {
	authors: `Cynthia C.`,
	id: `1188`,
	name: `capture card`,
	tags: ["C", "point card"],
}, {
	id: `1189`,
	name: `Wrong side of the card card.`,
	tags: ["W", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1190`,
	name: `Three Angles`,
	tags: ["T", "point card"],
}, {
	id: `1191`,
	name: `GRADE BOMB`,
	tags: ["G", "point card", "multi-colored"],
}, {
	id: `1192`,
	name: `4' 33"`,
	tags: ["number start", "point card"],
}, {
	id: `1193`,
	name: `Bongo Cat`,
	tags: ["B", "point card", "multi-colored"],
}, {
	id: `1194`,
	name: `eval();`,
	tags: ["E", "point/rules type?"],
}, {
	authors: `Manny V.`,
	id: `1195`,
	name: `Consult the Grave`,
	tags: ["C"],
}, {
	authors: `Pi R.`,
	id: `1196`,
	name: `Duplication Glitch`,
	tags: ["D", "point card"],
}, {
	authors: `Pi R.`,
	id: `1197`,
	name: `Triforce`,
	tags: ["T", "point card"],
}, {
	authors: `Pi R.`,
	id: `1198`,
	imgType: `jpg`,
	name: `Draw a card`,
	tags: ["D", "point card"],
}, {
	authors: `Anish G.`,
	id: `1199`,
	imgType: `jpg`,
	name: `Rats`,
	tags: ["R", "point card", "multi-colored"],
}, {
	authors: `Cynthia C.`,
	id: `1200`,
	imgType: `jpg`,
	name: `Technically, it's "4 or fewer"`,
	tags: ["T", "rule card", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1201`,
	imgType: `jpg`,
	name: `Frozen Fractals`,
	tags: ["F", "point card", "multi-colored"],
}, {
	id: `1202`,
	imgType: `jpg`,
	name: `LIL NAS X CONCERT EXPERIENCE`,
	tags: ["L", "rule card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1203`,
	imgType: `jpg`,
	name: `Power Play XI`,
	tags: ["P", "point card"],
}, {
	authors: `Joseph R.`,
	id: `1204`,
	imgType: `jpg`,
	name: `Joseph, CEO of Card`,
	tags: ["J", "point card"],
}, {
	id: `1205`,
	imgType: `jpg`,
	name: `Cappy`,
	tags: ["C", "point card"],
}, {
	id: `1206`,
	imgType: `jpg`,
	name: `Government Control`,
	tags: ["G"],
}, {
	id: `1207`,
	imgType: `jpg`,
	name: `RICK ASTLEY`,
	tags: ["R", "point card"],
}, {
	id: `1208`,
	imgType: `jpg`,
	name: `Signed 0`,
	tags: ["S"],
}, {
	id: `1209`,
	imgType: `jpg`,
	name: `Sinister Lobbyist`,
	tags: ["S", "point card"],
}, {
	id: `1210`,
	imgType: `jpg`,
	name: `EGOCENTRIC`,
	tags: ["E"],
}, {
	id: `1211`,
	imgType: `jpg`,
	name: `STAB`,
	tags: ["S", "point card"],
}, {
	id: `1212`,
	imgType: `jpg`,
	name: `HI-POLYMER® ERASER`,
	tags: ["H", "point card", "wide", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1213`,
	imgType: `jpg`,
	name: `DRY NANO MACHINES`,
	tags: ["D", "wide"],
	notes: `These types of cards are annoying to document.`
}, {
	id: `1214`,
	imgType: `jpg`,
	name: `Card Gator`,
	tags: ["C", "wide"],
}, {
	authors: `Satik K.`,
	id: `1215`,
	imgType: `jpg`,
	name: `DRY NANO MACHINES (2)`,
	tags: ["D", "wide"],
}, {
	authors: `Liam B.`,
	id: `1216`,
	imgType: `jpg`,
	name: `DRY NANO MACHINES (3)`,
	tags: ["D", "wide"],
}, {
	id: `1217`,
	imgType: `jpg`,
	name: `Laser sweep`,
	tags: ["L", "wide", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1218`,
	imgType: `jpg`,
	name: `DRY NANO MACHININES (4)`,
	tags: ["D", "point card", "wide"],
}, {
	id: `1219`,
	imgType: `jpg`,
	name: `HAND TURKEY PART 2`,
	tags: ["H", "point card", "wide"],
}, {
	id: `1220`,
	imgType: `jpg`,
	name: `Long word`,
	tags: ["L", "wide"],
}, {
	authors: `Cynthia C.`,
	id: `1221`,
	imgType: `jpg`,
	name: `Little Dark Age - Are you having fun?`,
	tags: ["L", "point card", "wide"],
}, {
	id: `1222`,
	imgType: `jpg`,
	name: `Acquired Resources`,
	tags: ["A", "point card", "wide"],
}, {
	authors: `Pi R.`,
	id: `1223`,
	imgType: `jpg`,
	name: `The Bit Bucket`,
	tags: ["T", "point card"],
}, {
	authors: `Liam B.`,
	id: `1224`,
	imgType: `jpg`,
	name: `Bullet Card`,
	tags: ["B", "multi-colored"],
}, {
	id: `1225`,
	imgType: `jpg`,
	name: `DOODOOMCHIT`,
	tags: ["D", "rule card"],
}, {
	id: `1226`,
	imgType: `jpg`,
	name: `Tsundere`,
	tags: ["T", "multi-colored"],
}, {
	id: `1227`,
	imgType: `jpg`,
	name: `Boomerang Cutter from megaman`,
	tags: ["B"],
}, {
	authors: `Liam B.`,
	id: `1228`,
	imgType: `jpg`,
	name: `Manequinn Suite Suit`,
	tags: ["M", "point card", "rule card"],
}, {
	id: `1229`,
	imgType: `jpg`,
	name: `Poll`,
	tags: ["P"],
}, {
	id: `1230`,
	imgType: `jpg`,
	name: `Sunflower`,
	tags: ["S", "point card", "multi-colored"],
}, {
	id: `1231`,
	imgType: `jpg`,
	name: `FOLLOW YOUR DREAMS`,
	tags: ["F"],
}, {
	id: `1232`,
	imgType: `jpg`,
	name: `Moon but scary`,
	tags: ["M", "point card"],
}, {
	authors: `Pi R.`,
	id: `1233`,
	imgType: `jpg`,
	name: `Power Play VI`,
	tags: ["P", "point card"],
}, {
	id: `1234`,
	imgType: `jpg`,
	name: `Dust warfare`,
	tags: ["D", "point card"],
}, {
	id: `1235`,
	imgType: `jpg`,
	name: `Your mother was a hamster and your father smelt of elderberries! - Guy (French)`,
	tags: ["Y", "point card", "multi-colored"],
}, {
	id: `1236`,
	imgType: `jpg`,
	name: `The City of Dis`,
	tags: ["T", "point card"],
}, {
	authors: `Anish G.`,
	id: `1237`,
	imgType: `jpg`,
	name: `No Video Today`,
	tags: ["N", "point card", "multi-colored"],
}, {
	id: `1238`,
	imgType: `jpg`,
	name: `Game of Chance`,
	tags: ["G", "rule card"],
}, {
	id: `1239`,
	imgType: `jpg`,
	name: `A CURSE`,
	tags: ["A"],
}, {
	authors: `Cynthia C.`,
	id: `1240`,
	imgType: `jpg`,
	name: `Angel`,
	tags: ["A", "multi-colored"],
}, {
	id: `1241`,
	imgType: `jpg`,
	name: `Defeat`,
	tags: ["D", "point card", "multi-colored"],
}, {
	id: `1242`,
	imgType: `jpg`,
	name: `Purple Imposter running with Undertale music playing in the background whilst holding a large ham`,
	tags: ["P", "point card", "multi-colored"],
}, {
	id: `1243`,
	imgType: `jpg`,
	name: `Tiky`,
	tags: ["T", "point card", "multi-colored"],
}, {
	id: `1244`,
	imgType: `jpg`,
	name: `SCP-914`,
	tags: ["S"],
}, {
	id: `1245`,
	imgType: `jpg`,
	name: `Australia`,
	tags: ["A"],
}, {
	id: `1246`,
	imgType: `jpg`,
	name: `Set yourself on fire`,
	tags: ["S"],
}, {
	id: `1247`,
	imgType: `jpg`,
	name: `Bottomless Pit`,
	tags: ["B", "rule card"],
}, {
	id: `1248`,
	imgType: `jpg`,
	name: `<span style="text-decoration: line-through;">Death Note</span> Autograph Card`,
	tags: ["D", "point card", "multi-colored"],
}, {
	id: `1249`,
	imgType: `jpg`,
	name: `Unfinished Card`,
	tags: ["U", "point card"],
}, {
	id: `1250`,
	imgType: `jpg`,
	name: `D.I.Y. card`,
	tags: ["D", "point card", "multi-colored"],
}, {
	id: `1251`,
	imgType: `jpg`,
	name: `Time Bomb`,
	tags: ["T", "multi-colored"],
}, {
	id: `1252`,
	imgType: `jpg`,
	name: `Hard to read card`,
	tags: ["H", "point card"],
}, {
	authors: `Liam B.`,
	id: `1253`,
	imgType: `jpg`,
	name: `Responding Ion Cannon`,
	tags: ["R", "multi-colored"],
}, {
	id: `1254`,
	imgType: `jpg`,
	name: `Sample card`,
	tags: ["S"],
}, {
	id: `1255`,
	imgType: `jpg`,
	name: `Triangle`,
	tags: ["T", "point card"],
}, {
	id: `1256`,
	imgType: `jpg`,
	name: `Everyone discards down to zero cards.`,
	tags: ["E"],
	notes: `Everyone discards down to 0 cards.`,
}, {
	authors: `Manny V.`,
	id: `1257`,
	imgType: `jpg`,
	name: `Third Eye`,
	tags: ["T"],
}, {
	id: `1258`,
	imgType: `jpg`,
	name: `Blessed by bean`,
	tags: ["B"],
}, {
	id: `1259`,
	imgType: `jpg`,
	name: `CPS Test`,
	tags: ["C", "point card", "multi-colored"],
}, {
	id: `1260`,
	imgType: `jpg`,
	name: `Score Card`,
	tags: ["S"],
}, {
	authors: `Derek C.`,
	id: `1261`,
	imgType: `jpg`,
	name: `Charitable Soul`,
	tags: ["C", "point card", "multi-colored"],
}, {
	id: `1262`,
	imgType: `jpg`,
	name: `Birthday Card`,
	tags: ["B", "multi-colored"],
}, {
	id: `1263`,
	imgType: `jpg`,
	name: `Horribly Creased Card`,
	tags: ["H", "point card"],
}, {
	authors: `Derek C.`,
	id: `1264`,
	imgType: `jpg`,
	name: `Snow Week!`,
	tags: ["S", "point card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1265`,
	imgType: `jpg`,
	name: `Burst Laser II`,
	tags: ["B", "point card"],
}, {
	id: `1266`,
	imgType: `jpg`,
	name: `ドドドドド`,
	tags: ["non-letter start", "point card"],
}, {
	authors: `Derek C.`,
	id: `1267`,
	imgType: `jpg`,
	name: `Puff-Shroom`,
	tags: ["P", "point card", "multi-colored"],
}, {
	id: `1268`,
	imgType: `jpg`,
	name: `Tuize`,
	tags: ["T", "point card"],
}, {
	id: `1269`,
	imgType: `jpg`,
	name: `Second Deal`,
	tags: ["S"],
}, {
	id: `1270`,
	imgType: `jpg`,
	name: `Life Ender`,
	tags: ["L"],
}, {
	id: `1271`,
	imgType: `jpg`,
	name: `All I want for Christmas`,
	tags: ["A"],
}, {
	id: `1272`,
	imgType: `jpg`,
	name: `We are not the same`,
	tags: ["W", "point card"],
}, {
	id: `1273`,
	imgType: `jpg`,
	name: `Shrödinger's Country`,
	tags: ["S", "multi-colored"],
}, {
	id: `1274`,
	imgType: `jpg`,
	name: `Joe "Rogan" Biden`,
	tags: ["J", "point card", "multi-colored"],
}, {
	id: `1275`,
	imgType: `jpg`,
	name: `Literally Big Brother`,
	tags: ["L"],
}, {
	id: `1276`,
	imgType: `jpg`,
	name: `Big Brother`,
	tags: ["B", "point card"],
}, {
	id: `1277`,
	imgType: `jpg`,
	name: `Mystery Goo`,
	tags: ["M"],
}, {
	id: `1278`,
	imgType: `jpg`,
	name: `Strongest card`,
	tags: ["S", "point card"],
}, {
	authors: `Derek C.`,
	id: `1279`,
	imgType: `jpg`,
	name: `Rude Buster`,
	tags: ["R", "point card", "multi-colored"],
}, {
	id: `1280`,
	imgType: `jpg`,
	name: `MIRROR CARD`,
	tags: ["M"],
}, {
	authors: `Cynthia C.`,
	id: `1281`,
	imgType: `jpg`,
	name: `based`,
	tags: ["B", "point card"],
}, {
	authors: `Derek C.`,
	id: `1282`,
	imgType: `jpg`,
	name: `Minor Perturbation`,
	tags: ["M", "point/rules type?", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1283`,
	imgType: `jpg`,
	name: `toast`,
	tags: ["T", "point card"],
}, {
	authors: `Derek C.`,
	id: `1284`,
	imgType: `jpg`,
	name: `drip`,
	tags: ["D", "point card", "multi-colored"],
}, {
	id: `1285`,
	imgType: `jpg`,
	name: `Infinite Fun`,
	tags: ["I", "rule card", "multi-colored"],
}, {
	id: `1286`,
	imgType: `jpg`,
	name: `Filibuster`,
	tags: ["F", "point card"],
}, {
	authors: `Manny V.`,
	id: `1287`,
	imgType: `jpg`,
	name: `Snowmaniac`,
	tags: ["S", "point card"],
}, {
	id: `1288`,
	imgType: `jpg`,
	name: `Play this card to die instantly`,
	tags: ["P", "point card"],
}, {
	authors: `Pi R.`,
	id: `1289`,
	imgType: `jpg`,
	name: `Power Play X`,
	tags: ["P", "point card"],
}, {
	id: `1290`,
	imgType: `jpg`,
	name: `Raisin Crayon`,
	tags: ["R", "point card", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1291`,
	imgType: `jpg`,
	name: `Massive Meteor`,
	tags: ["M", "point card", "multi-colored"],
}, {
	id: `1292`,
	imgType: `jpg`,
	name: `Rom`,
	tags: ["R", "point card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1293`,
	imgType: `jpg`,
	name: `Automated Reloader`,
	tags: ["A", "point card"],
}, {
	authors: `Joseph R.`,
	id: `1294`,
	imgType: `jpg`,
	name: `U Mich`,
	tags: ["U", "point card", "multi-colored"],
}, {
	id: `1295`,
	imgType: `jpg`,
	name: `Simp Police`,
	tags: ["S", "point card"],
}, {
	id: `1296`,
	imgType: `jpg`,
	name: `Spamton G. Spamton`,
	tags: ["S", "point card", "multi-colored"],
}, {
	id: `1297`,
	imgType: `jpg`,
	name: `Ultimate Succ`,
	tags: ["U"],
}, {
	id: `1298`,
	imgType: `jpg`,
	name: `MARIAH CAREY`,
	tags: ["M", "point card"],
}, {
	authors: `Manny V.`,
	id: `1299`,
	imgType: `jpg`,
	name: `Dwayne "Barack" Johnson`,
	tags: ["D", "point card"],
}, {
	id: `1300`,
	imgType: `jpg`,
	name: `The Wall`,
	tags: ["T"],
}, {
	id: `1301`,
	imgType: `jpg`,
	name: `KID IN A CANDY STORE`,
	tags: ["K", "multi-colored"],
	notes: `I am so upset, I just want to know who's writing this type of cards`
}, {
	id: `1302`,
	imgType: `jpg`,
	name: `Carles`,
	tags: ["C"],
}, {
	authors: `Liam B.`,
	id: `1303`,
	imgType: `jpg`,
	name: `pencil`,
	tags: ["P", "multi-colored"],
}, {
	authors: `Aadarsh N.`,
	id: `1304`,
	imgType: `jpg`,
	name: `Injury`,
	tags: ["I", "multi-colored"],
}, {
	id: `1305`,
	imgType: `jpg`,
	name: `Pencil`,
	tags: ["P"],
}, {
	id: `1306`,
	imgType: `jpg`,
	name: `Congressional Oversight`,
	tags: ["C", "point card", "multi-colored"],
}, {
	id: `1307`,
	imgType: `jpg`,
	name: `U.S. Military`,
	tags: ["U", "rule card", "multi-colored"],
}, {
	id: `1308`,
	imgType: `jpg`,
	name: `Alternating Current`,
	tags: ["A", "point card"],
}, {
	authors: `Liam B.`,
	id: `1309`,
	imgType: `jpg`,
	name: `Disturbed Circles`,
	tags: ["D", "point card"],
}, {
	id: `1310`,
	imgType: `jpg`,
	name: `Virus`,
	tags: ["V", "point card"],
}, {
	id: `1311`,
	imgType: `jpg`,
	name: `Super Sonic`,
	tags: ["S"],
}, {
	authors: `Liam B.`,
	id: `1312`,
	imgType: `jpg`,
	name: `bean (calculus)`,
	tags: ["B", "point card"],
}, {
	id: `1313`,
	imgType: `jpg`,
	name: `Practically Your Birthday`,
	tags: ["P", "point card"],
}, {
	authors: `Liam B.`,
	id: `1314`,
	imgType: `jpg`,
	name: `Straight Edged Rift Investment`,
	tags: ["S"],
}, {
	id: `1315`,
	imgType: `jpg`,
	name: `Robber Barron`,
	tags: ["R", "point card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1316`,
	imgType: `jpg`,
	name: `The people's blade`,
	tags: ["T"],
	notes: `Please don't do this.`
}, {
	authors: `Pi R.`,
	id: `1317`,
	imgType: `jpg`,
	name: `DAVIS`,
	tags: ["D", "point card", "multi-colored"],
	notes: `I considered just removing this one, but decided against it for now.`
}, {
	authors: `Liam B.`,
	id: `1318`,
	imgType: `jpg`,
	name: `Anti Bio Rifle`,
	tags: ["A"],
}, {
	authors: `Pi R.`,
	id: `1319`,
	imgType: `jpg`,
	name: `What the refrance?`,
	tags: ["W", "point card"],
}, {
	authors: `Pi R.`,
	id: `1320`,
	imgType: `jpg`,
	name: `Missile Ammo (B)`,
	tags: ["M", "point card"],
}, {
	authors: `Charles M.`,
	id: `1321`,
	imgType: `jpg`,
	name: `Senioritis`,
	tags: ["S", "point card"],
}, {
	id: `1322`,
	imgType: `jpg`,
	name: `Winter Horrorland`,
	tags: ["W", "point card"],
}, {
	authors: `Anish G.`,
	id: `1323`,
	imgType: `jpg`,
	name: `Super Donkey Kong Shake`,
	tags: ["S", "point card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1324`,
	imgType: `jpg`,
	name: `Swapper`,
	tags: ["S", "point card"],
}, {
	authors: `Liam B.`,
	id: `1325`,
	imgType: `jpg`,
	name: `[unnamed] 2`,
	tags: ["non-letter start", "multi-colored"]
}, {
	id: `1326`,
	imgType: `jpg`,
	name: `Perfectly Legitimate Speedrun`,
	tags: ["P"],
}, {
	id: `1327`,
	imgType: `jpg`,
	name: `Central Balance`,
	tags: ["C", "point card"],
}, {
	id: `1328`,
	imgType: `jpg`,
	name: `Dream`,
	tags: ["D"],
}, {
	id: `1329`,
	imgType: `jpg`,
	name: `AMOGUS WHITEBOARD INFECTION`,
	tags: ["A"],
}, {
	id: `1330`,
	imgType: `jpg`,
	name: `Monkey Bandit`,
	tags: ["M", "point card"],
}, {
	id: `1331`,
	imgType: `jpg`,
	name: `Charge!!!`,
	tags: ["C", "point card"],
}, {
	id: `1332`,
	imgType: `jpg`,
	name: `I Forgor`,
	tags: ["I"],
}, {
	authors: `Liam B.`,
	id: `1333`,
	imgType: `jpg`,
	name: `2D vector`,
	tags: ["number start", "point card", "rule card"],
}, {
	authors: `Aadarsh N.`,
	id: `1334`,
	imgType: `jpg`,
	name: `You'll Never Take Me Alive`,
	tags: ["Y"],
}, {
	id: `1335`,
	imgType: `jpg`,
	name: `MOMMY SON`,
	tags: ["M", "point card"],
}, {
	authors: `Liam B.`,
	id: `1336`,
	imgType: `jpg`,
	name: `Out of Mothballs`,
	tags: ["O", "point card", "multi-colored"],
}, {
	id: `1337`,
	imgType: `jpg`,
	name: `Rubik's Cube`,
	tags: ["R", "point card"],
}, {
	authors: `Liam B.`,
	id: `1338`,
	imgType: `jpg`,
	name: `Bidirectional Draws`,
	tags: ["B"],
}, {
	id: `1339`,
	imgType: `jpg`,
	name: `Black Hole`,
	tags: ["B", "rule card"],
}, {
	authors: `Liam B.`,
	id: `1340`,
	imgType: `jpg`,
	name: `YACN`,
	tags: ["Y", "multi-colored"],
}, {
	id: `1341`,
	imgType: `jpg`,
	name: `Non AmongUs® Card`,
	tags: ["N", "point card", "multi-colored"],
}, {
	id: `1342`,
	imgType: `jpg`,
	name: `Rose-gram`,
	tags: ["R", "point card", "multi-colored"],
}, {
	id: `1343`,
	imgType: `jpg`,
	name: `Not the Point`,
	tags: ["N", "point card", "rule card"],
}, {
	authors: `Liam B.`,
	id: `1344`,
	imgType: `jpg`,
	name: `Specialized Reloader`,
	tags: ["S"],
}, {
	authors: `Pi R.`,
	id: `1345`,
	imgType: `jpg`,
	name: `Ion Stunner`,
	tags: ["I", "point card"],
}, {
	id: `1346`,
	imgType: `jpg`,
	name: `2 + 2 = ?`,
	tags: ["number start", "point card"],
}, {
	authors: `Aadarsh N.`,
	id: `1347`,
	imgType: `jpg`,
	name: `Warcry`,
	tags: ["W"],
}, {
	authors: `Derek C.`,
	id: `1348`,
	imgType: `jpg`,
	name: `Oops!`,
	tags: ["O", "point card"],
}, {
	id: `1349`,
	imgType: `jpg`,
	name: `Neutral route sans`,
	tags: ["N", "point card"],
}, {
	id: `1350`,
	imgType: `jpg`,
	name: `Polysemy (it's a word)`,
	tags: ["P"],
}, {
	authors: `Pi R.`,
	id: `1351`,
	imgType: `jpg`,
	name: `Hull Missile`,
	tags: ["H", "point card"],
}, {
	id: `1352`,
	imgType: `jpg`,
	name: `Dusttale Sans`,
	tags: ["D"],
}, {
	id: `1353`,
	imgType: `jpg`,
	name: `PACK OF PRUNES`,
	tags: ["P", "point card"],
}, {
	id: `1354`,
	imgType: `jpg`,
	name: `Letter to Santa`,
	tags: ["L", "point card", "multi-colored"],
}, {
	id: `1355`,
	imgType: `jpg`,
	name: `Nut`,
	tags: ["N", "point card"],
}, {
	authors: `Pi R.`,
	id: `1356`,
	imgType: `jpg`,
	name: `Pike Beam`,
	tags: ["P", "point card"],
}, {
	authors: `Pi R.`,
	id: `1357`,
	imgType: `jpg`,
	name: `Missile Ammo (C)`,
	tags: ["M"],
}, {
	authors: `Pi R.`,
	id: `1358`,
	imgType: `jpg`,
	name: `Missile Ammo (A)`,
	tags: ["M", "point card"],
}, {
	id: `1359`,
	imgType: `jpg`,
	name: `Very Hateful Anti-Freshman Card`,
	tags: ["V", "point card"],
}, {
	id: `1360`,
	imgType: `jpg`,
	name: `Noticable lack of snow`,
	tags: ["N", "multi-colored"],
}, {
	authors: `Aadarsh N.`,
	id: `1361`,
	imgType: `jpg`,
	name: `Dualcast`,
	tags: ["D"],
}, {
	id: `1362`,
	imgType: `jpg`,
	name: `1 BLAnk White CArd (8th period club)`,
	tags: ["number start", "point card"],
}, {
	id: `1363`,
	imgType: `jpg`,
	name: `one point perspective`,
	tags: ["O", "point card"],
}, {
	authors: `Pi R.`,
	id: `1364`,
	imgType: `jpg`,
	name: `Ion Blast Mk. 2`,
	tags: ["I", "point card"],
}, {
	authors: `Anish G.`,
	id: `1365`,
	imgType: `jpg`,
	name: `Donkey Kong December`,
	tags: ["D", "point card", "multi-colored"],
}, {
	id: `1366`,
	imgType: `jpg`,
	name: `Time Freeze`,
	tags: ["T", "point card"],
}, {
	id: `1367`,
	imgType: `jpg`,
	name: `A slow cat`,
	tags: ["A"],
}, {
	id: `1368`,
	imgType: `jpg`,
	name: `Sex`,
	tags: ["S", "point card"],
}, {
	id: `1369`,
	imgType: `jpg`,
	name: `Haunted CARD`,
	tags: ["H"],
}, {
	id: `1370`,
	imgType: `jpg`,
	name: `Sample Card`,
	tags: ["B", "point card"],
}, {
	id: `1371`,
	imgType: `jpg`,
	name: `Chem Class`,
	tags: ["C", "point card"],
}, {
	authors: `Aadarsh N.`,
	id: `1372`,
	imgType: `jpg`,
	name: `Democratic Socialism`,
	tags: ["D"],
}, {
	id: `1373`,
	imgType: `jpg`,
	name: `NNN`,
	tags: ["N", "point card"],
}, {
	id: `1374`,
	imgType: `jpg`,
	name: `Hats`,
	tags: ["H", "point card", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1375`,
	imgType: `jpg`,
	name: `d$ / dt > 0`,
	tags: ["D", "point card", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1376`,
	imgType: `jpg`,
	name: `Global Targetting Drone`,
	tags: ["G", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1377`,
	imgType: `jpg`,
	name: `Borifyer`,
	tags: ["B", "rule card", "multi-colored"],
}, {
	id: `1378`,
	imgType: `jpg`,
	name: `CLUE`,
	tags: ["C", "rule card", "multi-colored"],
}, {
	id: `1379`,
	imgType: `jpg`,
	name: `The Paper Tiger`,
	tags: ["T", "point card", "multi-colored"],
}, {
	id: `1380`,
	imgType: `jpg`,
	name: `Luck o' the Irish`,
	tags: ["L", "point card", "multi-colored"],
}, {
	id: `1381`,
	imgType: `jpg`,
	name: `The Pyramids`,
	tags: ["T", "point card", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1382`,
	imgType: `jpg`,
	name: `[calculus]`,
	tags: ["non-letter start", "point card"],
}, {
	authors: `Liam B.`,
	id: `1383`,
	imgType: `jpg`,
	name: `nessessicated strategy`,
	tags: ["N"],
}, {
	authors: `Liam B.`,
	id: `1384`,
	imgType: `jpg`,
	name: `Sun Flyers`,
	tags: ["S", "point card"],
}, {
	authors: `Liam B.`,
	id: `1385`,
	imgType: `jpg`,
	name: `Rotate Play areas`,
	tags: ["R"],
}, {
	authors: `Liam B.`,
	id: `1386`,
	imgType: `jpg`,
	name: `Discard Swap`,
	tags: ["D"],
}, {
	authors: `Liam B.`,
	id: `1387`,
	imgType: `jpg`,
	name: `ME 2`,
	tags: ["M"],
}, {
	authors: `Liam B.`,
	id: `1388`,
	imgType: `jpg`,
	name: `[math nonsense]`,
	tags: ["non-letter start", "point card"],
}, {
	authors: `Pi R.`,
	id: `1389`,
	imgType: `jpg`,
	name: `bifurcate`,
	tags: ["B", "point card", "multi-colored"],
}, {
	id: `1390`,
	imgType: `jpg`,
	name: `Counterfeit Points`,
	tags: ["C", "point card"],
}, {
	id: `1391`,
	imgType: `jpg`,
	name: `Counterfeit Points`,
	tags: ["P", "point card"],
}, {
	id: `1392`,
	imgType: `jpg`,
	name: `Funky Kong`,
	tags: ["F", "point card"],
}, {
	id: `1393`,
	imgType: `jpg`,
	name: `Potato Mine`,
	tags: ["P", "multi-colored"],
}, {
	id: `1394`,
	imgType: `jpg`,
	name: `SeeK OR Destroy`,
	tags: ["S"],
}, {
	id: `1395`,
	imgType: `jpg`,
	name: `Anime Transmorgifier`,
	tags: ["A"],
}, {
	id: `1396`,
	imgType: `jpg`,
	name: `Finish the Line for +200 points`,
	tags: ["F", "point card", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1397`,
	imgType: `jpg`,
	name: `Revive Ballistial Laser`,
	tags: ["R"],
}, {
	id: `1398`,
	imgType: `jpg`,
	name: `Ion web drea`,
	tags: ["I"],
}, {
	authors: `Aadarsh N.`,
	id: `1399`,
	imgType: `jpg`,
	name: `Ice Monkey`,
	tags: ["I", "multi-colored"],
}, {
	authors: `Liam B.`,
	id: `1400`,
	imgType: `jpg`,
	name: `Unwanted Shifter Eliminator`,
	tags: ["U", "point card"],
}, {
	authors: `Liam B.`,
	id: `1401`,
	imgType: `jpg`,
	name: `Any time`,
	tags: ["A"],
}, {
	authors: `Liam B.`,
	id: `1402`,
	imgType: `jpg`,
	name: `Pointy Shield`,
	tags: ["P", "point card"],
}, {
	authors: `Aadarsh N.`,
	id: `1403`,
	imgType: `jpg`,
	name: `Unkillable`,
	tags: ["U", "rule card"],
}, {
	authors: `Pi R.`,
	id: `1404`,
	imgType: `jpg`,
	name: `Shields`,
	tags: ["S", "point card"],
}, {
	authors: `Liam B.`,
	id: `1405`,
	imgType: `jpg`,
	name: `Freedom Units`,
	tags: ["F", "point card", "multi-colored"],
}, {
	id: `1406`,
	imgType: `jpg`,
	name: `Crude mockery`,
	tags: ["C", "multi-colored"],
}, {
	id: `1407`,
	imgType: `jpg`,
	name: `HAND TURKEY PART 1`,
	tags: ["H", "point card"],
}, {
	id: `1408`,
	imgType: `jpg`,
	name: `Blitzcrank, The Steam Golem`,
	tags: ["B"],
}, {
	id: `1409`,
	imgType: `jpg`,
	name: `Self deprication`,
	tags: ["S", "point card"],
}, {
	id: `1410`,
	imgType: `jpg`,
	name: `GRIP`,
	tags: ["G", "multi-colored"],
}, {
	id: `1411`,
	imgType: `jpg`,
	name: `SALAMANDER`,
	tags: ["S", "point card", "multi-colored"],
}, {
	id: `1412`,
	imgType: `jpg`,
	name: `Candy Cane Laser Gun`,
	tags: ["C", "point card", "multi-colored"],
}, {
	authors: `Mikhail K.`,
	id: `1413`,
	imgType: `jpg`,
	name: `NFT Blockchain`,
	tags: ["N", "point card", "multi-colored"],
}, {
	id: `1414`,
	imgType: `jpg`,
	name: `Irish Immigrant`,
	tags: ["I", "point card", "multi-colored"],
}, {
	id: `1415`,
	imgType: `jpg`,
	name: `GF (Whitty)`,
	tags: ["G", "point card", "multi-colored"],
}, {
	id: `1416`,
	imgType: `jpg`,
	name: `Homestuck`,
	tags: ["H", "point card"],
}, {
	id: `1417`,
	imgType: `jpg`,
	name: `The Haircut That Changed Me™`,
	tags: ["T"],
}, {
	authors: `Liam B.`,
	id: `1418`,
	imgType: `jpg`,
	name: `Charge Redirector`,
	tags: ["C", "point card"],
}, {
	id: `1419`,
	imgType: `jpg`,
	name: `Half (James) Life, but Snow`,
	tags: ["S", "point card"],
}, {
	id: `1420`,
	imgType: `jpg`,
	name: `Clone Bay`,
	tags: ["C", "point card"],
}, {
	authors: `Pi R.`,
	id: `1421`,
	imgType: `jpg`,
	name: `Explosive Replicator`,
	tags: ["E", "point card"],
}, {
	id: `1422`,
	imgType: `jpg`,
	name: `Santa isn'tn't real?!`,
	tags: ["S", "point card"],
}, {
	authors: `Derek C.`,
	id: `1423`,
	imgType: `jpg`,
	name: `Power Reap`,
	tags: ["P", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1424`,
	imgType: `jpg`,
	name: `Flak Gun`,
	tags: ["F", "point card"],
}, {
	id: `1425`,
	imgType: `jpg`,
	name: `Complex Plane`,
	tags: ["C", "point card"],
}, {
	id: `1426`,
	imgType: `jpg`,
	name: `Burst L. III`,
	tags: ["B", "point card"],
}, {
	id: `1427`,
	imgType: `jpg`,
	name: `Dwayne the "Block" Johnson`,
	tags: ["D", "point card"],
}, {
	authors: `Joseph R.`,
	id: `1428`,
	imgType: `jpg`,
	name: `Christmas Playlist`,
	tags: ["C", "point card"],
}, {
	id: `1429`,
	imgType: `jpg`,
	name: `Weapon Pre-Igniter`,
	tags: ["W", "point card"],
}, {
	id: `1430`,
	imgType: `jpg`,
	name: `Democratic Party`,
	tags: ["D", "point card", "multi-colored"],
}, {
	id: `1431`,
	imgType: `jpg`,
	name: `Finish Lunch`,
	tags: ["F", "point card", "multi-colored"],
}, {
	id: `1432`,
	imgType: `jpg`,
	name: `giga chad santa`,
	tags: ["G", "point card", "multi-colored"],
}, {
	id: `1433`,
	imgType: `jpg`,
	name: `Hacking`,
	tags: ["H", "point card"],
}, {
	id: `1434`,
	imgType: `jpg`,
	name: `Teleporter`,
	tags: ["T", "point card"],
}, {
	id: `1435`,
	imgType: `jpg`,
	name: `Among Us`,
	tags: ["A", "point card"],
}, {
	authors: `Cynthia C.`,
	id: `1436`,
	imgType: `jpg`,
	name: `Pendulum approximation`,
	tags: ["P", "point card", "multi-colored"],
}, {
	id: `1437`,
	imgType: `jpg`,
	name: `Snowgrave`,
	tags: ["S", "point card"],
}, {
	authors: `Liam B.`,
	id: `1438`,
	imgType: `jpg`,
	name: `Tick Tock ypm approaches`,
	tags: ["T", "rule card", "multi-colored"],
}, {
	id: `1439`,
	imgType: `jpg`,
	name: `Green Bean`,
	tags: ["G", "multi-colored"],
}, {
	id: `1440`,
	imgType: `jpg`,
	name: `Benign Tumor`,
	tags: ["B", "point card"],
}, {
	id: `1441`,
	imgType: `jpg`,
	name: `Mark`,
	tags: ["M"],
}, {
	id: `1442`,
	imgType: `jpg`,
	name: `NFT`,
	tags: ["N"],
}, {
	authors: `Liam B.`,
	id: `1443`,
	imgType: `jpg`,
	name: `Speed Installation`,
	tags: ["S"],
}, {
	authors: `Liam B.`,
	id: `1444`,
	imgType: `jpg`,
	name: `Post Offensive Countermeasures`,
	tags: ["P", "point card"],
}, {
	authors: `Aadarsh N.`,
	id: `1445`,
	imgType: `jpg`,
	name: `Flat Earth`,
	tags: ["F", "multi-colored"],
}, {
	id: `1446`,
	imgType: `jpg`,
	name: `Festive Gifting`,
	tags: ["F", "point card", "multi-colored"],
}, {
	id: `1447`,
	imgType: `jpg`,
	name: `Poorly Lit Card`,
	tags: ["P", "point card", "multi-colored"],
}, {
	id: `1448`,
	imgType: `jpg`,
	name: `Scrap card`,
	tags: ["S"],
}, {
	authors: `Pi R.`,
	id: `1449`,
	imgType: `jpg`,
	name: `Empty Vial`,
	tags: ["E", "point card"],
}, {
	authors: `Manny V.`,
	id: `1450`,
	imgType: `jpg`,
	name: `Monkey Typewriter`,
	tags: ["M", "point card", "multi-colored"],
}, {
	id: `1451`,
	imgType: `jpg`,
	name: `THE CREATOR`,
	tags: ["T", "point card", "multi-colored"],
}, {
	id: `1452`,
	imgType: `jpg`,
	name: `Life note`,
	tags: ["L", "point card", "multi-colored"],
}, {
	id: `1453`,
	imgType: `jpg`,
	name: `A Nice Deed`,
	tags: ["A", "point card"],
}, {
	authors: `Pi R.`,
	id: `1454`,
	imgType: `jpg`,
	name: `Power Play VIII`,
	tags: ["P"],
}, {
	authors: `Pi R.`,
	id: `1455`,
	imgType: `jpg`,
	name: `Power Play IV`,
	tags: ["P", "point card"],
}, {
	authors: `Pi R.`,
	id: `1456`,
	imgType: `jpg`,
	name: `Power Play IX`,
	tags: ["P", "point card"],
}, {
	authors: `Pi R.`,
	id: `1457`,
	imgType: `jpg`,
	name: `Power Play III`,
	tags: ["P", "point card"],
}, {
	authors: `Pi R.`,
	id: `1458`,
	imgType: `jpg`,
	name: `Power Play VII`,
	tags: ["P"],
}, {
	authors: `Pi R.`,
	id: `1459`,
	imgType: `jpg`,
	name: `Power Play II`,
	tags: ["P", "point card", "multi-colored"],
}, {
	authors: `Pi R.`,
	id: `1460`,
	imgType: `jpg`,
	name: `Power Play V`,
	tags: ["P"],
}, {
	authors: `Liam B.`,
	id: `1461`,
	imgType: `jpg`,
	name: `Certified .py moment`,
	tags: ["C", "point card"],
}, {
	id: `1462`,
	imgType: `jpg`,
	name: `Quantum Computer`,
	tags: ["Q", "point card"],
}, {
	id: `1463`,
	imgType: `jpg`,
	name: `Nikku`,
	tags: ["N", "point card"],
}, {
	authors: `Anish G.`,
	id: `1464`,
	imgType: `jpg`,
	name: `Zone of Death`,
	tags: ["Z", "multi-colored"],
}, {
	id: `1465`,
	imgType: `jpg`,
	name: `The Piece of Resistance`,
	tags: ["T", "point card"],
}, {
	id: `1466`,
	imgType: `jpg`,
	name: `Vanishing point`,
	tags: ["V", "point card"],
}, {
	authors: `Cynthia C.`,
	id: `1467`,
	imgType: `jpg`,
	name: `Quantum Ordinator`,
	tags: ["Q", "point card"],
}, {
	id: `1468`,
	imgType: `jpg`,
	name: `Two point perspective`,
	tags: ["T", "point card"],
}, {
	id: `1469`,
	imgType: `jpg`,
	name: `Time Bomb`,
	tags: ["T", "point card", "multi-colored"],
}, {
	authors: `Manny V.`,
	id: `1470`,
	imgType: `jpg`,
	name: `Sleight of Hand`,
	tags: ["S"],
}, {
	authors: `Liam B.`,
	id: `1471`,
	imgType: `jpg`,
	name: `Generic Production Facility`,
	tags: ["G"],
}, {
	authors: `Liam B.`,
	id: `1472`,
	imgType: `jpg`,
	name: `Kritauk`,
	tags: ["K", "point card"],
}, {
	authors: `Liam B.`,
	id: `1473`,
	imgType: `jpg`,
	name: `Quat2`,
	tags: ["Q"],
}, {
	id: `1474`,
	imgType: `jpg`,
	name: `Yasowo`,
	tags: ["Y", "point card"],
}, {
	id: `1475`,
	imgType: `jpg`,
	name: `*deck.add(discard;):;`,
	tags: ["non-letter start"],
}, {
	id: `1476`,
	imgType: `jpg`,
	name: `Never Ending`,
	tags: ["N"],
}, {
	id: `1477`,
	imgType: `jpg`,
	name: `Cat-powered tank`,
	tags: ["C", "point card"],
}, {
	id: `1478`,
	imgType: `jpg`,
	name: `Mediocre Card 1`,
	tags: ["M", "point card"],
}, {
	id: `1479`,
	imgType: `jpg`,
	name: `Bees?`,
	tags: ["B", "point card"],
}, {
	id: `1480`,
	imgType: `jpg`,
	name: `Googol`,
	tags: ["G", "point card"],
}, {
	authors: `Cynthia C.`,
	id: `1481`,
	imgType: `jpg`,
	name: `Revolution lover`,
	tags: ["R", "point card", "multi-colored"],
}, {
	id: `1482`,
	imgType: `jpg`,
	name: `201`,
	tags: ["number start", "point card", "multi-colored"],
}, {
	id: `1483`,
	imgType: `jpg`,
	name: `An eye for an eye`,
	tags: ["A", "multi-colored"],
}, {
	id: `1484`,
	imgType: `jpg`,
	name: `Card #2`,
	tags: ["C", "point card"],
}, {
	id: `1485`,
	imgType: `jpg`,
	name: `Direct Democracy`,
	tags: ["D", "point card"],
}, {
	id: `1486`,
	imgType: `jpg`,
	name: `The Light, it burns`,
	tags: ["T"],
}, {
	id: `1487`,
	imgType: `jpg`,
	name: `JUDGED BY BEAN`,
	tags: ["J"],
}, {
	authors: `Cynthia C.`,
	id: `1488`,
	imgType: `jpg`,
	name: `Swampy Boots`,
	tags: ["S"],
}, {
	id: `1489`,
	imgType: `jpg`,
	name: `Ice Missile`,
	tags: ["I", "point card"],
}, {
	id: `1490`,
	imgType: `jpg`,
	name: `Carbuncle`,
	tags: ["C", "point card", "multi-colored"],
}, {
	id: `1491`,
	imgType: `jpg`,
	name: `Bank-Loan`,
	tags: ["B", "point card", "multi-colored"],
}, {
	id: `1492`,
	imgType: `jpg`,
	name: `The Funny Rat`,
	tags: ["T", "point card", "multi-colored"],
}, {
	id: `1493`,
	imgType: `jpg`,
	name: `National Park Quarter Collection`,
	tags: ["N", "point card"],
}, {
	id: `1494`,
	imgType: `jpg`,
	name: `Swap Deck`,
	tags: ["S"],
}, {
	id: `1495`,
	imgType: `jpg`,
	name: `BM`,
	tags: ["B"],
}, {
	id: `1496`,
	imgType: `jpg`,
	name: `Cool Cat`,
	tags: ["C", "point card"],
}, {
	id: `1497`,
	imgType: `jpg`,
	name: `Polyglot`,
	tags: ["P", "point card"],
}, {
	authors: `Liam B.`,
	id: `1498`,
	imgType: `jpg`,
	name: `Advanced Energy Efficieny Booster (Tech)`,
	tags: ["A", "point card"],
}, {
	id: `1499`,
	imgType: `jpg`,
	name: `Happy Birthday! (not really)`,
	tags: ["H", "point card"],
}, {
	authors: `Derek C.`,
	id: `1500`,
	imgType: `jpg`,
	name: `Mana`,
	tags: ["M", "point card", "multi-colored"],
}, {
	//1501-1506 and 1513 were made all on the same day for a card contest - the theme was "Boards"
	id: `1501`,
	imgType: `jpg`,
	name: `Bore-D`,
	tags: ["B", "point card"],
}, {
	id: `1502`,
	name: `Bored`,
	tags: ["B", "point card"],
}, {
	id: `1503`,
	imgType: `jpg`,
	name: `30-50 wild boars`,
	tags: ["number start", "point card", "multi-colored"],
}, {
	id: `1504`,
	imgType: `jpg`,
	name: `I'm bo[r|a][e|r]d`,
	tags: ["I", "point card", "multi-colored"],
}, {
	authors: `Cynthia C.`,
	id: `1505`,
	imgType: `jpg`,
	name: `Just a board game`,
	tags: ["J"],
}, {
	id: `1506`,
	imgType: `jpg`,
	name: `Board of Directors`,
	tags: ["B", "multi-colored"],
}, {
	id: `1507`,
	imgType: `jpg`,
	name: `Unit Circle`,
	tags: ["U", "point card"],
}, {
	id: `1508`,
	imgType: `jpg`,
	name: `Senate Fillibuster`,
	tags: ["S", "point card"],
}, {
	authors: `Liam B.`,
	id: `1509`,
	imgType: `jpg`,
	name: `Questionable Reactor Stabilizer`,
	tags: ["Q", "point card"],
}, {
	id: `1510`,
	imgType: `jpg`,
	name: `Knowledge is Power`,
	tags: ["K", "point card", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1511`,
	imgType: `jpg`,
	name: `Depth-First Search`,
	tags: ["D", "multi-colored"],
}, {
	authors: `Derek C.`,
	id: `1512`,
	imgType: `jpg`,
	name: `nails on a chalkboard`,
	tags: ["N", "point card", "wide", "multi-colored"],
}, {
	authors: `Anish G.`,
	id: `1513`,
	imgType: `jpg`,
	name: `BOARDING PASS`,
	tags: ["B", "wide"],
}, {
	authors: `Cynthia C.`,
	id: `1514`,
	imgType: `jpg`,
	name: `Do you understand how large 1000 is?`,
	tags: ["D",  "point card"],
}, {
	id: `1515`,
	imgType: `jpg`,
	name: `Depression`,
	tags: ["D", "point card"],
}, {
	id: `1516`,
	imgType: `jpg`,
	name: `Georgia Tussy`,
	tags: ["G", "point card"],
}, {
	id: `1517`,
	imgType: `jpg`,
	name: `The Worst Way to Hold a Drink`,
	tags: ["T", "point card"],
}, {
	//season 3 starts here
	id: `1518`,
	imgType: `jpeg`,
	name: `Noah's Right Eye`,
	tags: ["N", "point card", "multi-colored"]
}, {
	authors: `Aadarsh N.`,
	id: `1519`,
	imgType: `jpg`,
	name: `I hardly know 'er!`,
	tags: ["I", "point card"],
}];



/*
, {
	authors: ``,
	id: ``,
	imgType: `jpg`,
	name: ``,
	tags: [starts with? point/rules type? wide? color?],
}


*/