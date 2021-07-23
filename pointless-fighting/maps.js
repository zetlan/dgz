
let map_start;
let map_demo1;
let map_demo2;


function maps_load() {
	//access file
	fetch('./maps.txt').then(response => response.text()).then((data) => {
		//different spacing determines which are maps and which are connections
		var parts = data.split("\n\n\n");
		var maps = parts[0].split("\n\n");
		var connections = parts[1].split("\n");

		//turn the maps into actual maps
		maps_create(maps);

		//turn the connections into.. actual connections
		maps_connect(connections);
	})
}



function maps_create(data) {

}

function maps_connect(data) {
	data = data.split("\n");

	data.forEach(d => {
		var splitTag = d.split("\n");
		//part 1 is start map, part 2 is end map, part 3 is offset
		try {
			var startMap = eval(`map_${splitTag[0]}`);
			var endMap = eval(`map_${splitTag[1]}`);
			var coordOffset = JSON.parse(splitTag[2]);
			startMap.connections.push([endMap, coordOffset]);
			console.log(startMap.connections);
		} catch (er) {
			console.log(`was unable to make connection with data "${d}"!`);
		}
		
	});
}