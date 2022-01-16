/*
	exportAll();
	exportConnections();
	exportZone(zoneObj);


	getDataFor(sourceStr, variableToStoreRateSTR, variableToStoreDataSTR);
	



	importAll();
	importConnections(data);
	importData(arr, character, data);
	importEntities(entityData);
	importZone(zoneLineString);

	starrify(data);
	unstarrify(data);
*/




function exportConnections() {
	var toReturn = ``;
	world_maps.forEach(z => {
		z.connections.forEach(c => {
			toReturn += `${z.name}|${c[0].name}|[${c[1][0]}, ${c[1][1]}]\n`;
		});
	});
	return toReturn;
}

function exportData(data) {
	var finalString = ``;
	var typeString = ``;
	var buffer1 = "";
	for (var type=0; type<10; type++) {
		for (var y=0; y<data.length; y++) {
			for (var x=0; x<data[0].length; x++) {
				buffer1 += "" + (1 * (data[y][x] === "" + type));

				//if buffer1 is long enough, convert to a character
				if (buffer1.length > 5) {
					
					typeString += tileImage_key[Number.parseInt(buffer1, 2)];
					buffer1 = "";
				}
			}
		}

		//if there are blocks remaining, pad the rest with zeroes
		if (buffer1.length > 0) {
			while (buffer1.length <= 5) {
				buffer1 += "0";
			}
			typeString += tileImage_key[Number.parseInt(buffer1, 2)];
			buffer1 = "";
		}

		//remove lagging 0s
		var lagging0s = 0;
		while (typeString[typeString.length-1-lagging0s] === "0") {
			lagging0s += 1;
		}
		typeString = typeString.substring(0, typeString.length - lagging0s);

		//add stars
		typeString = starrify(typeString);

		//add final string
		if (typeString.length > 0) {
			finalString += `|ground~${type}~${typeString}`;
			typeString = ``;
		}
	}

	//return final string
	finalString = finalString.substring(1);
	return finalString;
}

function exportWorld() {
	var maps = ``;
	var connections = ``;

	//each zone, then each exit
	world_maps.forEach(z => {
		maps += exportZone(z) + "\n";
	});

	connections = exportConnections();

	return maps + "\n\n" + connections;
}



//because it's using async, gotta put into a variable instead of just returning
function getDataFor(audioSourceStr, variableToStoreRateSTR, variableToStoreDataSTR) {
	source = atx.createBufferSource();
	var request = new XMLHttpRequest();

	request.open('GET', audioSourceStr, true);

	request.responseType = 'arraybuffer';

	request.onload = function() {
		var audioData = request.response;

		atx.decodeAudioData(audioData, function(buffer) {
			source.buffer = buffer;
			var finalOutput = source.buffer.getChannelData(0);
			eval(`${variableToStoreRateSTR} = ${source.buffer.sampleRate};`);
			eval(`${variableToStoreDataSTR} = [${finalOutput}];`);

			source.connect(atx.destination);
			source.loop = true;
		},
		function(e){console.log("Error with decoding audio data" + e.err);});
	}
	request.send();
}

function importConnections(data) {
	data.forEach(d => {
		var splitTag = d.split("|");
		//part 1 is start map, part 2 is end map, part 3 is offset
		try {
			var startMap = getZone(splitTag[0]);
			var endMap = getZone(splitTag[1]);
			var coordOffset = JSON.parse(splitTag[2]);
			if (endMap != undefined) {
				startMap.connections.push([endMap, coordOffset]);
			} else {
				console.log(`was unable to make connection to map ${splitTag[1]}`);
			}
			
		} catch (er) {
			console.log(`was unable to make connection with data "${d}"!`);
		}
	});
}

//takes in string data and converts it into positions in the array
function importData(arr, character, data) {
	//remove stars
	data = unStarrify(data);

	//first split the data into binary existance
	var expandedData = ``;
	for (var g=0; g<data.length; g++) {
		expandedData += tileImage_map[data[g]].toString(2).padStart(6, 0);
	}

	//map binary data onto array
	var aWidth = arr[0].length;
	for (var c=0; c<expandedData.length; c++) {
		if (expandedData[c] == "1") {
			arr[Math.floor(c / aWidth)][c % aWidth] = character;
		}
	}
}

function importEntities(entityData) {
	var entityArray = [];

	//loop through all entity constructors
	entityData.forEach(e => {
		//split by underscore
		var trueTag = e.split("_");
		switch (trueTag[0]) {
			case "SPK":
				entityArray.push(new Spike(trueTag[1] * 1, trueTag[2] * 1, trueTag[3] * 1))
				break;
		}
	});
	return entityArray;
}

function importMap(mapData) {
	//break up the data by the separator
	var preObj = {
		x: 0,
		y: 0,
		tileDat: [],
		tlWidth: 0,
		tlHeight: 0,
	};


	mapData.split("|").forEach(s => {
		var splitTag = s.split("~");
		switch (splitTag[0]) {
			case "x":
				preObj.x = +splitTag[1];
				break;
			case "y":
				preObj.y = +splitTag[1];
				break;
			case "dims":
				preObj.tlWidth = +splitTag[1];
				preObj.tlHeight = +splitTag[2];
				break;
			case "tiles":
				//unstarrify the tile data first
				var unstarred = unStarrify(splitTag[1]);
				//break by line, then insert into tile data
				preObj.tileDat = unstarred.chop(preObj.tlWidth);
				break;
		}
	});
	return new Map_Climbing(preObj.x, preObj.y, preObj.tileDat);
}

function importZone(zoneLineString) {
	var zoneProps = {
		connect: [],
		data: [],
		disp: [],
		entities: [],
		music: undefined,
		name: "ERROR: NAME NOT DEFINED",
		path: "",
		x: 0,
		y: 0,
	}
	//first split by tag
	var splitTag = zoneLineString.split("|");

	//parse tags
	splitTag.forEach(s => {
		var superSplit = s.split("~");
		switch (superSplit[0]) {
			case "coords":
				zoneProps.x = superSplit[1] * 1;
				zoneProps.y = superSplit[2] * 1;
				break;
			case "dims":
				zoneProps.data = [];
				zoneProps.disp = [];
				//y size
				for (var b=0; b<superSplit[2]*1; b++) {
					zoneProps.data.push([]);
					zoneProps.disp.push([]);
					for (var a=superSplit[1]*1 - 1; a>=0; a--) {
						zoneProps.data[b][a] = " ";
						zoneProps.disp[b][a] = " ";
					}
				}
				break;
			case "mid":
				//update display array
				superSplit[1] = unStarrify(superSplit[1]);
				var char = 0;
				while (char < superSplit[1].length) {
					zoneProps.disp[Math.floor(char/zoneProps.disp[0].length)][char%zoneProps.disp[0].length] = superSplit[1][char];
					char += 1;
				}
				break;
		}
	});
}




function maps_load() {
	//access file
	fetch('./maps.txt').then(r => r.text()).then((data) => {
		//different spacing determines which are maps and which are connections
		var parts = data.split("\n\n");
		var maps = parts[0].split("\n");
		var connections = parts[1].split("\n");

		//turn the maps into actual maps
		maps.forEach(m => {
			importZone(m);
		});

		//turn the connections into.. actual connections
		importConnections(connections);

		//player stuff
		loading_map = getZone("start");
		loading_map.entities.push(player);
	});
}





// function starrify(data) {
// 	var charBuffer = ["", 0];
// 	var newData = "";
// 	for (var a=0; a<data.length; a++) {
// 		//if the current character is different or the buffer is too long, turn into new string
// 		if (data[a] != charBuffer[0] || charBuffer[1] >= b64_encode.length-1) {
// 			//if it's not long enough to become a star
// 			if (charBuffer[1] < 4) {
// 				for (var b=0; b<charBuffer[1]; b++) {
// 					newData += charBuffer[0];
// 				}
// 			} else {
// 				//if it's long enough to be starred
// 				newData += `${charBuffer[0]}*${b64_encode[charBuffer[1]]}`;
// 			}

// 			//reset buffer
// 			charBuffer[0] = data[a];
// 			charBuffer[1] = 1;
// 		} else {
// 			//add to the star length
// 			charBuffer[1] += 1;
// 		}
// 	}

// 	//final character
// 	if (charBuffer[1] < 4) {
// 		for (var b=0; b<charBuffer[1]; b++) {
// 			newData += charBuffer[0];
// 		}
// 	} else {
// 		newData += `${charBuffer[0]}*${b64_encode[charBuffer[1]]}`;
// 	}

// 	return newData;
// }

function starrify(data) {
	var strStore = "";
	var strFinal = "";
	var repeatTimes = 0;
	var repeatLimit = 0;
	//go through all the characters
	while (data.length > 0) {
		//repeat for all the stars
		for (var starNum=1; starNum<=mapData_starsMax; starNum++) {
			//get initial check value
			strStore = data.slice(0, starNum);

			//jump through and detect how many times that value repeats
			//cap repeatTimes so that there aren't any undefinable repeat times
			while (strStore == data.slice(repeatTimes * starNum, (repeatTimes + 1) * starNum) && repeatTimes < b64_encode.length-1) {
				repeatTimes += 1;
			}

			//if there's only 1 star, it must repeat 4+ times. 2 stars requires 3 repeats, and 3+ stars requires only 2 repeats
			repeatLimit = (starNum == 1) ? 3 : 2;

			//if repeated enough, use the stars and leave the loop. if not, move to the next star number
			if (repeatTimes > repeatLimit) {
				//append to final string
				strFinal += strStore;
				for (var s=0; s<starNum; s++) {
					strFinal += "*";
				}
				strFinal += getKey(tunnel_translation, repeatTimes);
				//leave star loop
				data = data.slice(starNum * repeatTimes);
				starNum = mapData_starsMax + 1;
			} else if (starNum == mapData_starsMax) {
				//if out of star numbers, remove and add the single character
				strFinal += data[0];
				data = data.slice(1);
			}

			//reset to default
			repeatTimes = 0;
		}
	}
	return strFinal;
}

// function unStarrify(data) {
// 	var newData = "";
// 	for (var c=0; c<data.length; c++) {
// 		//if the next character is a star
// 		if (data[c+1] == "*") {
// 			for (var h=0; h<b64_decode[data[c+2]]; h++) {
// 				newData += data[c];
// 			}
// 			c += 2;
// 		} else {
// 			//regular case
// 			newData += data[c];
// 		}
// 	}

// 	return newData;
// }

function unStarrify(data) {
	//loop through all characters of the data
	for (var u=0;u<data.length;u++) {
		//if the character is a star, look forwards for other stars
		if (data[u] == "*") {
			var detectorChar = u+1;
			var starNum = 1;

			//determining number of stars/number of repeats
			while (data[detectorChar] == "*") {
				detectorChar += 1;
				starNum += 1;
			}
			var repeatTimes = b64_decode[data[detectorChar]];

			//removing the stars and indicator number from the original data
			data = spliceOut(data, u, detectorChar+1);

			//extending the data through the duplication process
			var charsToRepeat = data.slice(u-starNum, starNum);
			for (var g=0; g<repeatTimes-1; g++) {
				data = spliceIn(data, u, charsToRepeat);
			}
		}
	}
	return data;
}
