//syncs two object's positions together, with rotation

function sync(object1, object2, radians) {
    //step 1, get object 1's position
    var [tX, tY, tZ] = [object1.x, object1.y, object1.z];
    //step 2, apply rotation/rounding
    [tX, tZ] = rotate(tX, tZ, radians);

    //step 3, write to object 2's position
    [object2.x, object2.y, object2.z] = [tX, tY, tZ];
}