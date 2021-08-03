/*
INDEX:
	importConnections(data);
	importData(arr, character, data);
	importZone(zoneLineString);

	maps_load();

*/

function importConnections(data) {
	data.forEach(d => {
		var splitTag = d.split("|");
		//part 1 is start map, part 2 is end map, part 3 is offset
		try {
			var startMap = world_maps[splitTag[0]];
			var endMap = world_maps[splitTag[1]];
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

function importZone(zoneLineString) {
	var returnZone = new Zone();
	//first split by tag
	var splitTag = zoneLineString.split("|");

	//parse tags
	splitTag.forEach(s => {
		var superSplit = s.split("~");
		switch (superSplit[0]) {
			case "id":
				returnZone.name = superSplit[1];
				break;
			case "coords":
				returnZone.x = superSplit[1] * 1;
				returnZone.y = superSplit[2] * 1;
				break;
			case "dims":
				returnZone.data = [];
				returnZone.display = [];
				//y size
				for (var b=0; b<superSplit[2]*1; b++) {
					returnZone.data.push([]);
					returnZone.display.push([]);
					for (var a=superSplit[1]*1 - 1; a>=0; a--) {
						returnZone.data[b][a] = " ";
						returnZone.display[b][a] = " ";
					}
				}
				break;
			case "ground":
				importData(returnZone.data, superSplit[1], superSplit[2]);
				break;
			case "display":
				//update display array
				var char = 0;
				while (char < superSplit[1].length) {
					returnZone.display[Math.floor(char/returnZone.display[0].length)][char%returnZone.display[0].length] = superSplit[1][char];
					char += 1;
				}
				break;
		}
	});


	//add zone to world
	world_maps[returnZone.name] = returnZone;
}




function maps_load() {
	//access file
	fetch('./maps.txt').then(r => r.text()).then((data) => {
		//different spacing determines which are maps and which are connections
		var parts = data.split("\n\n\n");
		var maps = parts[0].split("\n\n");
		var connections = parts[1].split("\n");

		//turn the maps into actual maps
		maps.forEach(m => {
			importZone(m);
		});

		//turn the connections into.. actual connections
		importConnections(connections);

		//player stuff
		loading_map = world_maps["start"];
		loading_map.entities.push(player);
		player.map = loading_map;
	});
}







function exportData(data) {
	var finalString = ``;
	var typeString = ``;
	var buffer1 = "";
	for (var type=0; type<10; type++) {
		for (var y=0; y<data.length; y++) {
			for (var x=0; x<data.length; x++) {
				buffer1 += "" + (1 * (data[y][x] === "" + type));

				//if buffer1 is long enough, convert to a character
				if (buffer1.length > 5) {
					typeString += tileImage_key[Number.parseInt(buffer1, 2)];
					buffer1 = "";
				}
			}
		}

		//remove lagging 0s
		var lagging0s = 0;
		while (typeString[typeString.length-1-lagging0s] === "0") {
			lagging0s += 1;
		}
		typeString = typeString.substring(0, typeString.length - lagging0s);

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

function exportZone(zoneObj) {
	var toReturn = ``;
	//standard properties
	toReturn += `id~${zoneObj.name}`;
	toReturn += `|coords~${zoneObj.x}~${zoneObj.y}`;
	toReturn += `|dims~${zoneObj.data[0].length}~${zoneObj.data.length}`;

	//collision data
	toReturn += `|${exportData(zoneObj.data)}`;

	//image data
	toReturn += `|display~`;
	for (var y=0; y<zoneObj.display.length; y++) {
		for (var x=0; x<zoneObj.display[0].length; x++) {
			toReturn += zoneObj.display[y][x];
		}
	}

	return toReturn;
}

function exportConnections() {
	var toReturn = ``;
	Object.values(world_maps).forEach(z => {
		z.connections.forEach(c => {
			toReturn += `${z.name}|${c[0].name}|[${c[1][0]}, ${c[1][1]}]\n`;
		});
	});
	return toReturn;
}

