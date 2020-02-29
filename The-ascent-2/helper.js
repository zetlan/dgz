//map

var map = [   
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 6, 6, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 5, 5, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 5, 5, 5, 6, 6, 6, 6, 6, 6, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0, 0, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 9, 6, 9, 9, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 5, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 5, 5, 6, 6, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 9, 9, 9, 9, 9, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 6, 6, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 6, 6, 6, 6, 5, 5, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 9, 9, 9, 9, 9, 9, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 4, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 4, 4, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 4, 9, 4, 9, 9, 9, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 4, 3, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 4, 3, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 4, 3, 3, 4, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 3, 3, 4, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 4, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 6, 6, 6, 5, 5, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 6, 6, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 5, 5, 6, 6, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 6, 4, 6, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 5, 5, 6, 6, 6, 6, 4, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 5, 6, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 3, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 3, 3, 3, 4, 6, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 3, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 5, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 9, 4, 4, 4, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 4, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 6, 9, 9, 9, 9, 9, 3, 4, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 4, 4, 4, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 9, 9, 9, 9, 9, 9, 9, 4, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 3, 4, 4, 1, 9, 9, 9, 9, 9, 9, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 4, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 4, 1, 1, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 3, 3, 3, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 4, 3, 3, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 3, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 4, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 2, 2, 2, 2, 2, 2, 9, 9, 9, 9, 9, 9, 3, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 9, 9, 9, 9, 2, 2, 2, 9, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 9, 9, 9, 3, 3, 4, 9, 9],
 [2, 9, 9, 9, 9, 9, 9, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 2, 1, 1, 1, 2, 1, 1, 2, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 9, 4, 9, 4, 2, 2],
 [1, 2, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 4, 4, 1, 1],
 [1, 1, 2, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 9, 9, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 9, 9, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
 [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 2, 2, 2, 2, 9, 9, 9, 9, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
 [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 9, 9, 9, 9, 9, 9, 2, 2, 1, 1, 1, 1, 2, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [1, 1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 3, 3, 0, 0, 0, 3, 0, 0, 1, 1, 1, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 1, 1, 1, 0, 0, 3, 0, 0, 3, 0, 3, 0, 3, 3, 0, 0, 3, 0, 3, 0, 1, 0, 1, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
 [9, 9, 1, 1, 0, 3, 0, 3, 3, 0, 3, 3, 0, 0, 3, 0, 3, 3, 3, 0, 1, 1, 0, 1, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
 [9, 9, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 0, 1, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 9],
 [9, 9, 9, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 0, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9],
 [9, 9, 9, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9],
 [9, 9, 9, 9, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]];
/*

Objects!

Objects!

Objects!

*/

class Main {    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 10;
        this.dx = 0;
        this.dy = 0;
        this.gravity = 0.5;
        this.onGround = true;
    }

    handlePosition() {
        var arrayValue;
        //applying x and getting array value
        this.x += this.dx;

        //dealing with screen wrapping
        var readXSquare = Math.floor(this.x / squareSize);
        if (readXSquare >= loadingMap[0].length) {
            readXSquare -= loadingMap[0].length;
        } else if (readXSquare < 0) {
            readXSquare += loadingMap[0].length;
        }
        //reading from map
        try {
            arrayValue = loadingMap[Math.floor(this.y / squareSize)][readXSquare];
        }
        catch (error) {
            arrayValue = 9;
        }
        
        
        //check if array value is solid
        for (var l=0; l<solidSurfaces.length; l++) {
            if (arrayValue == solidSurfaces[l]) {
                //if it is, get rid of velocity and reverse change, end loop
                this.x -= this.dx;
                this.dx = 0;
                l = solidSurfaces.length + 1;
            }
        }
        
        //and for y
        this.y += this.dy;

        readXSquare = Math.floor(this.x / squareSize);
        if (readXSquare >= loadingMap[0].length) {
            readXSquare -= loadingMap[0].length;
        } else if (readXSquare < 0) {
            readXSquare += loadingMap[0].length;
        }
        
        try {
            arrayValue = loadingMap[Math.floor(this.y / squareSize)][readXSquare];
        }
        catch (error) {
            arrayValue = 9;
        }

        for (var k=0; k<solidSurfaces.length; k++) {
            if (arrayValue == solidSurfaces[k]) {
                this.y -= this.dy;
                this.dy = 0;
                l = solidSurfaces.length + 1;
                this.onGround = true;
            }
        }
    }
}

//the camera stores important things like squares per screen and position to draw from.
class Camera extends Main {
    constructor(x, y) {
        super(x, y);
        this.xSquaresPerScreen = Math.floor(canvas.width / squareSize) + 2;
        this.ySquaresPerScreen = Math.floor(canvas.height / squareSize) + 2;
        this.cornerX = this.x;
        this.cornerY = this.x;

        this.shaderColor = "#000000";
        this.shaderOpacity = 0;

        this.doMenu = true;
    }

    tick() {
        this.cornerX = this.x;
        this.cornerY = this.y;
    }

    beDrawn() {
        ctx.globalAlpha = this.shaderOpacity;
        ctx.fillStyle = this.shaderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        //menu
        if (this.doMenu) {
            //regular
            ctx.fillStyle = menuColor;
            ctx.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1);

            ctx.fillStyle = textColor;
            ctx.font = "20px Century Gothic";
            ctx.textAlign = "left";
            var textToFill = "(" +  (character.x / squareSize).toFixed(2) + ", " + (character.y / squareSize).toFixed(2) + " )";
            textToFill += " (" +  (camera.x / squareSize).toFixed(2) + ", " + (camera.y / squareSize).toFixed(2) + " )";
            ctx.fillText(textToFill, canvas.width * 0.05, canvas.height * 0.97);
        } else {
            //mouse coordinates
            ctx.fillStyle = textColor;
            ctx.font = "20px Century Gothic";
            ctx.textAlign = "left";
            var textToFill = "(" +  ((mouseX + camera.x) / squareSize).toFixed(2) + ", " + ((mouseY + camera.y) / squareSize).toFixed(2) + " )";
            ctx.fillText(textToFill, canvas.width * 0.05, canvas.height * 0.97);
        }
    }
}

class Player extends Main {
    constructor(x, y) {
        super(x, y);
        this.dx = 0.1;
        this.ax = 0;
        this.ay = 0;
        this.r = squareSize / 4
        this.accRate = 0.3;
        this.slowRate = 0.85;
        this.jumpStrength = 11.5;
        this.onGround = false;
        this.canMove = false;

        this.maxSpeed = 8;
    }

    tick() {
        //updating dx
        this.dx += this.ax;
        if (this.ax == 0) {
            this.dx *= this.slowRate;
        }

        //updating x and y with position handling
        this.handlePosition();

        //making sure x is in bounds
        if (this.x < 0 || this.x > loadingMap[0].length * squareSize) {
            if (this.x < 0) {
                this.x += loadingMap[0].length * squareSize;
            } else {
                this.x -= loadingMap[0].length * squareSize;
            }
        }
    }

    beDrawn() {
        ctx.fillStyle = ballColor;
        ctx.beginPath();
        ctx.ellipse(this.x - camera.x, this.y - camera.y, this.r, this.r, Math.PI, 0, Math.PI * 4);
        ctx.fill();
    }

    handlePosition() {
        //gravity
        this.dy += this.gravity;

        //making sure that dx/dy are not too far out of range

        //dx
        if (Math.abs(this.dx) > this.maxSpeed) {
            if (this.dx > 0) {
                this.dx = this.maxSpeed;
            } else {
                this.dx = this.maxSpeed * -1;
            }
        }

        //dy is positively bounded so that the player never falls through blocks
        if (this.dy > squareSize - 1) {
            this.dy = squareSize - 1;
        }
        //regular collision
        super.handlePosition();
    }
}

class Button {
    constructor(x, y, gelatin, cameraX, cameraY, squaresToModify) {
        this.x = x;
        this.y = y;
        this.active = false;

        /*each button is associated with a gelatin, a camera position, and squares to remove. 
        This is so that the button can have easily accessible functionality when it is activated. */
        this.gelatin = gelatin;
        this.gelatin.color = this.pickGelatinColor();

        //camera position
        this.cameraX = cameraX;
        this.cameraY = cameraY;

        //squares to remove
        this.squaresToModify = squaresToModify;
    }

    tick() {
        //ticking gelatin
        this.gelatin.tick();

        //testing if pressed

        //getting distance to gelatin
        var gelatinDistX = Math.abs(this.x - this.gelatin.x);
        var gelatinDistY = Math.abs(this.y - this.gelatin.y);
        var toSet = -1;

        //if distance is small enough and self is inactive, then be pressed (become active)
        //toSet is which index of the array to set the squares to
        if (gelatinDistX < squareSize * 0.25 && gelatinDistY < squareSize * 0.25) {
            this.active = true;
            toSet = 1;
        } else if (this.active) {
            //if active and the gelatin is too far away, become inactive
            this.active = false;
            toSet = 0;
        }

        //modifying squares
        if (toSet > -1) {
            for (var c=0;c<this.squaresToModify.length;c++) {
                loadingMap[this.squaresToModify[c][1]][this.squaresToModify[c][0]] = this.squaresToModify[c][toSet+2];
            }
        }
    }

    beDrawn() {
        //drawing self
        if (this.active) {
            ctx.fillStyle = pressedButtonColor;
        } else {
            ctx.fillStyle = buttonColor;
        }
        
        ctx.fillRect(this.x - (squareSize * 0.25) - camera.x, this.y - camera.y, squareSize * 0.5, squareSize * 0.25);

        //buttons have a color component of their gelatin
        ctx.fillStyle = this.gelatin.color;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.x - (squareSize * 0.25) - camera.x, this.y - camera.y, squareSize * 0.5, squareSize * 0.25);
        ctx.globalAlpha = 1;

        //drawing associated gelatin
        this.gelatin.beDrawn();
    }

    pickGelatinColor() {
        var letters = "8F";
        var color = "#";
        for (var i=0;i<6;i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }
}

class Gelatin extends Main {
    constructor(x, y) {
        super(x, y);
        this.r = 10;
        this.color = "#000000";
        this.slowRate = 0.85;
    }

    tick() {
        //colliding with players
        var playerDistX = Math.abs(character.x - this.x);
        var playerDistY = Math.abs(character.y - this.y);

        //if the player is close enough to collide, then do
        if (playerDistX < this.r + character.r && playerDistY < (this.r * 2) + character.r) {
            character.dx /= 2;
            this.dx += character.dx;
            character.dy /= 2;
            this.dy += character.dy;
        }

        //gravity / velocity cap
        this.dy += this.gravity;
        if (this.dy > squareSize - 1) {
            this.dy = squareSize - 1;
        }
        //handling collision with blocks
        super.handlePosition();
        //friction
        this.dx *= this.slowRate;
    }

    beDrawn() {
        ctx.beginPath();
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camera.x - this.r, this.y - camera.y - this.r, this.r * 2, this.r * 2);
        ctx.globalAlpha = 1;
    }
}

class Cloud extends Main {
    constructor(x, y) {
        super(x, y);
        this.dx = 1;

        this.playerDistX;
        this.playerDistY;

        this.rw = squareSize;
        this.rh = squareSize / 3;
        this.cloned = false;
        this.toDelete = false;
    }

    tick() {
        //collide with player, slow player's fall and give them momentum
        this.playerDistX = Math.abs(character.x - this.x);
        this.playerDistY = Math.abs(character.y - this.y);

        //if the player is close enough to collide, and the player is not in a forced fall, then collide
        if (this.playerDistX < this.rw + character.r && this.playerDistY < this.rh + character.r && loadingMode.constructor.name != "ForcedFall") {
            //take weighted average of character's x vel and this x vel
            character.dx = ((character.dx * 2) + (this.dx)) / 3;

            //bring character dy closer to matching gravity (-0.5). This causes the player to slowly sink through the cloud.
            if (character.dy > -0.5) {
                character.dy = (character.dy + (-0.5 * 10)) / 11
                character.onGround = true;
            } 
        }

        //update x, y never changes
        this.x += this.dx;

        /*since clouds always move to the right, only backwards wrapping needs to be dealt with.
        If a cloud gets within a screen of the right edge, it will create a clone of it on the opposite side of the map.
        This is to ensure the player can stand on the cloud when the transition happens. 
        When the cloud gets more than a screen out of the map, it is deleted.*/

        //testing for clone time
        if ((loadingMap[0].length * squareSize) - this.x < camera.xSquaresPerScreen * squareSize && this.cloned == false) {
            //set cloned flag to true and create clone
            this.cloned = true;
            entities.push(new Cloud(this.x - (loadingMap[0].length * squareSize), this.y));
        }

        //testing for delete time
        if (this.x > (loadingMap[0].length + 2) * squareSize) {
            this.toDelete = true;
        }
    }

    beDrawn() {
        //only draw them if the player is in the same area as them
        if (this.playerDistX < camera.xSquaresPerScreen * squareSize && this.playerDistY < camera.ySquaresPerScreen * squareSize) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = cloudColor;
            ctx.beginPath();
            //ctx.ellipse(this.x - this.rw - camera.x, this.y - this.rh - camera.y, this.rw * 2, this.rh * 2);
            ctx.ellipse(this.x - camera.x, this.y - camera.y, this.rw, this.rh, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

/*

Game states!

Game states!

Game states!

*/


//helper classes so I don't have to repeat code as much

class GameWorld {
    constructor() {
        this.tileOffset = 0;
    }

    beRun() {
        //drawing sky, map, character, and entities
        //sky
        ctx.fillStyle = skyColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = skySecondaryColor;
        ctx.globalAlpha = 0.2;
        //secondary band scales with height
        // [maxY - playerY] / [maxY] to get the band to go down as Y increases
        var thatPercent = ((loadingMap.length * squareSize) - character.y) / (loadingMap.length * squareSize);
        ctx.fillRect(0, 0, canvas.width, canvas.height * thatPercent);
        ctx.globalAlpha = 1;

        drawMap(this.tileOffset);
        character.beDrawn();

        
        //ticking everything
        for (var g=0;g<entities.length;g++) {
            entities[g].tick();
            entities[g].beDrawn();
            //if it's a cloud and it's to be deleted, delete it
            if (entities[g].constructor.name == "Cloud" && entities[g].toDelete == true) {
                entities.splice(g, 1);
            }
        }
    }
}

class CameraFollow extends GameWorld {
    constructor() {
        super();
    }

    beRun() {
        //drawing main game world things
        super.beRun();

        //having camera follow player
        camera.x = character.x - centerX;
        camera.y = character.y - centerY * 1.1;

        //handling actual camera
        camera.beDrawn();
        camera.tick();
        
    }
}
//main game states

class Menu {
    constructor() {
    }

    beRun() {
        //drawing menu screen
        ctx.fillStyle = menuColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //text
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.font = "40px Century Gothic"; 
        ctx.fillText("The Ascent 2", centerX, canvas.height * 0.3);
        ctx.font = "30px Century Gothic"; 
        ctx.fillText("Press Z", centerX, centerY);

        //getting out of menu
        if (zPressed) {
            zPressed = false;
            loadingMode = new ForcedFall();
        }
    }
}

class Gameplay extends CameraFollow {
    constructor() {
        super();
    }

    beRun() {
        super.beRun();
        character.tick();

        //making sure player is in bounds, if too high fade to black and then reset to starting position
        if (character.y > (loadingMap.length + 10) * squareSize) {
            camera.shaderOpacity += 0.0125;
            if (camera.shaderOpacity >= 1) {
                //reset to starting position, make sure player can't move
                character.x = startingCoords[0];
                character.y = startingCoords[1];
                camera.shaderOpacity = 0;
                loadingMode = new ForcedFall();
            }
        }

        //if the user presses b, enter debug mode
        if (bPressed) {
            bPressed = false;
            camera.doMenu = false;
            loadingMode = new Debug();
        }
    }
}

class ForcedFall extends CameraFollow {
    constructor() {
        super();
    }

    beRun() {
        //set onground to false at the start so that collisions from previous ticks don't count
        character.onGround = false;
        super.beRun();
        //handling position without user input
        character.handlePosition();
        character.dx = 0;

        //detecting if the player should be out of forced fall mode (if they've hit ground)
        if (character.onGround) {
            loadingMode = new Gameplay();
        }
    }
}

class Debug extends GameWorld {
    constructor() {
        super();
        this.tileOffset = Math.floor(squareSize / 16);
    }

    beRun() {
        var perfTime = [performance.now(), 0];
        //drawing everything
        super.beRun();
        
        //in debug mode, the camera steals the player's movement
        camera.x += character.ax * 15;
        camera.y += character.ay * 15;

        //locking the player's movement
        character.dy = 0.1;
        character.dx = 0;

        //camera is drawn second to last
        camera.beDrawn();
        //debug filter
        ctx.strokeStyle = debugFilterColor;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        character.handlePosition();
        camera.tick();

        //placing blocks
        if (clicked) {
            loadingMap[Math.floor((mouseY + camera.y) / squareSize)][Math.floor((mouseX + camera.x) / squareSize)] = numToSet;
            clicked = false;
        }
        //exiting debug mode
        if (bPressed) {
            bPressed = false;
            camera.doMenu = true;
            loadingMode = new Gameplay();
        }

        //output time taken
        perfTime[1] = performance.now();
		console.log("time used: " + (perfTime[1] - perfTime[0]).toFixed(2));
    }
}