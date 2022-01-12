
//takes a string and cuts it into equal-sized pieces with a specified length.
//If there is a remainder, it will be added to the end.
function chop(string, length) {
	length = length ?? string.length;
	var bits = [];
	for (var d=0; d<string.length; d+=length) {
		bits.push(string.slice(d, d+length));
	}
	return bits;
}