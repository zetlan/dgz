
//returns a pseudo-random number based on the previous random number generated
function PRNG() {
    //use the current RNG seed to generate a random value from the equation, then change the seed
    worldSeed = worldSeed * 3.947 * (1 - worldSeed);
    return worldSeed;
}