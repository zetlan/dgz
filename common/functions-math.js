/* INDEX

boolToSigned(boolValue);
clamp(num, min, max);
getPercentage(val1, val2, checkVal);
linterp(a, b, percentage);
randomBounded(min, max);




A WARNING TO MY FUTURE SELF:
do not rename these functions. Just don't. It may seem like a good idea. It's not. 
There are projects that rely on these names that you have forgotten about. 
Save yourself the time!!
*/

//converts true to 1, and false to -1
function boolToSigned(boolValue) {
	return boolValue * 2 - 1;
}

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

//returns the percentage from val1 to val2 that the checkVal is in
//example: 0, 10, 5, returns 0.5)
function getPercentage(val1, val2, checkVal) {
	return (checkVal - val1) / (val2 - val1);
}

//performs a linear interpolation between 2 values
function linterp(a, b, percentage) {
	return a + ((b - a) * percentage);
}

//returns a random value between the min value and max values, using the default javascript randomizer
function randomBounded(min, max) {
	return (Math.random() * (max - min)) + min;
}