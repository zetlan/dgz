/* INDEX

boolToSigned(boolValue);
clamp(num, min, max);
getPercentage(val1, val2, checkVal);
linterp(a, b, percentage);
modulate(n, modulus);
randomBounded(min, max);
sigmoid(input, outputLowerBound, outputUpperBound);
easerp(a, b, percentage);





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
	return a + (b - a) * percentage;
}

//like the modulo operator, but keeps the number in bounds both ways
function modulate(n, modulus) {
	return (n > 0) ? (n % modulus) : (modulus + (n % modulus)) % modulus;
}

//returns a random value between the min value and max values, using the default javascript randomizer
function randomBounded(min, max) {
	return (Math.random() * (max - min)) + min;
}

function sigmoid(input, outputLowerBound, outputUpperBound) {
	//haha good luck reading this ;)
	return (1 / (1 + (Math.E ** input))) * (outputLowerBound - outputUpperBound) + outputUpperBound;
}

//an interpolation, but with an ease in + out
function easerp(a, b, percentage) {
	if (percentage < 0.5) {
		return a + (b - a) * 2 * percentage * percentage;
	}
	return a + (b - a) * (1 - 2 * (percentage - 1) * (percentage - 1));
}