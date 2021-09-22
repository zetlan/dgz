

var cyc_scannerArr = [];

class CYC_Scanner {
	constructor(possibleChars, startingVals, requireTheseChars, areaToInsertInto) {
		this.chars = possibleChars;
		this.valArr = startingVals;
		this.charRequires = requireTheseChars;
		this.zone = areaToInsertInto;
		
		this.arrayPos = undefined;
		this.doIncrement = false;
	}
}








function cyc_mainLoop() {

}

cyc_scannerArr.push(new CYC_Scanner("ABCDEFGHIJKLMNOPQRSTUVWXYZ", [0, 0, 0, -1], "", "23"));




var cyc_valArr = [0, 0, 0, -1];
var cyc_doIncrement = false;
var cyc_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
var cyc_charRequires = "";
var cyc_area = "11";
var cyc_animation;


//imitates the checkFlag function. This code was shamelessly stolen but that's ok.
function friend_checkFlag(challenge_id) {
			$.ajax({
				type : 'POST',
				url: "/main/validate/",
				data: {
					csrfmiddlewaretoken: '1qkz8l87QpKr2SGtKBLU0hkFhC3zgJPlswgUB5KG0qM3BuZ7XkoCnFXwSAu4yGI6',
					dataType: 'json',
					challenge_id: challenge_id,
					flag: $("#" + challenge_id).val(),
				},
				success: function(data) {
					if (data.result == "success") {
			console.log('yep that was the right one');                        
					} else {
						cyc_doIncrement = true;
					}
				},
				failure: function() {
					cyc_doIncrement = true
				}
			});
		}


//the main loop that runs
function mainLoop() {
	if (cyc_doIncrement) {
		var newStr = "";
		//increment the checking flag by one
		mainIncrement();
		newStr = mainMakeStr();

		//create new string
		while (!isValid(newStr)) {
			mainIncrement();
			newStr = mainMakeStr();
		}

		//post to value box, value will change depending
		document.getElementById(cyc_area).value = newStr;
		cyc_doIncrement = false;
		friend_checkFlag(cyc_area * 1);
		console.log(`checking ${newStr}`);
	}


	//call self
	cyc_animation = window.requestAnimationFrame(mainLoop);
}

function mainIncrement() {
	var base = cyc_chars.length;
	var len = cyc_valArr.length;
	cyc_valArr[len-1] += 1;

	for (var p=len-1; p>=0; p--) {
		//if the value in the spot is too high, carry the 1
		if (cyc_valArr[p] > base - 1) {
			cyc_valArr[p] = 0;
			//carrying is more complicated for p=0
			if (p == 0) {
				cyc_valArr.splice(0, 0, -1);
				p += 1;
			}
			cyc_valArr[p-1] += 1;	
		}
	}
}

function isValid(string) {
	if (cyc_charRequires.length == 0) {
		return true;
	}
	for (var i=0; i<cyc_charRequires.length; i++) {
		if (string.includes(cyc_charRequires[i])) {
			return true;
		}
	}
	return false;
}

function mainMakeStr() {
	var newStr = "";

	for (var a=0; a<cyc_valArr.length; a++) {
		newStr += cyc_chars[cyc_valArr[a]];
	}
	return newStr;
}

mainLoop(); 
cyc_doIncrement = true;