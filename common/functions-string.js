
//This file is a little different from my other function files. Instead of creating entirely separate functions, these add themselves to the string class.
//The goal with this was to make it easier to edit strings.


//takes a string and cuts it into equal-sized pieces with a specified length.
//If there is a remainder, it will be added to the end.
if (!String.prototype.chop) {
	String.prototype.chop = function (size) {
		size = size ?? this.length;
		var bits = [];
		for (var d=0; d<this.length; d+=size) {
			bits.push(this.slice(d, d+size));
		}
		return bits;
	}
} else {
	console.error(`Chop conflicts with an existing function!`);
}

//returns a string with characters at a certain spot in it replaced
if (!String.prototype.replaceAt) {
	String.prototype.replaceAt = function (index, newChars) {
		return this.slice(0, index) + newChars + this.slice(index+1);
	}
} else {
	console.error(`ReplaceAt conflicts with an existing function!`);
}