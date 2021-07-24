
let map_start;
let map_demo1;
let map_demo2;


function maps_load() {
	//access file
	fetch('./maps.txt').then(r => r.text()).then((data) => {
		//different spacing determines which are maps and which are connections
		var parts = data.split("\n\n\n");
		var maps = parts[0].split("\n\n");
		var connections = parts[1].split("\n");

		//turn the maps into actual maps
		maps_create(maps);

		//turn the connections into.. actual connections
		maps_connect(connections);

		//player stuff
		loading_map = world_maps["start"];
		loading_map.entities.push(player);
		player.map = loading_map;
	});
}



function maps_create(data) {
	//seperate by double newline
	data.forEach(m => {
		var splitTag = m.split("\n");
		//the first line is always the name + optional starting coordinates
		var name = splitTag[0].split("[")[0];
		var coords = "[" + splitTag[0].split("[")[1];
		if (coords == "[undefined") {
			coords = [0, 0];
		} else {
			try {
				coords = JSON.parse(coords);
			} catch (er) {
				console.error(`was unable to create coordinates for data ${coords}`)
			}
		}
		splitTag.splice(0, 1);
		
		//create the actual zone
		var theZone = new Zone();
		theZone.x = coords[0];
		theZone.y = coords[1];
		theZone.name = name;
		theZone.data = splitTag;
		world_maps[name] = theZone;

	});
}

function maps_connect(data) {
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







function outputConnections() {
	
}

function outputMap() {
	//output the loading map, with all its connections
}

function outputWorld() {

}

