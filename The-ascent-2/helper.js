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
 [9, 5, 5, 9, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [5, 5, 6, 5, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [5, 5, 5, 5, 9, 9, 5, 5, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
 [9, 5, 5, 9, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9],
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
 [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 9, 3, 9, 4, 9, 9, 9],
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

 var usedGelatinColors = [];
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
        this.dTPX;
        this.dTPY;
        this.gravity = 0.5;
        this.onGround = true;
    }

    getPlayerDist() {
        this.dTPX = Math.abs(this.x - character.x);
        this.dTPY = Math.abs(this.y - character.y);
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

        this.doMenu = false;
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
            var textToFill = "P: (" +  (character.x / squareSize).toFixed(2) + ", " + (character.y / squareSize).toFixed(2) + " )";
            textToFill += " C: (" +  (camera.x / squareSize).toFixed(2) + ", " + (camera.y / squareSize).toFixed(2) + ")";
            textToFill += " M: (" +  ((mouseX + camera.x) / squareSize).toFixed(2) + ", " + ((mouseY + camera.y) / squareSize).toFixed(2) + ")";
            ctx.fillText(textToFill, canvas.width * 0.05, canvas.height * 0.97);
        }

        //time
        ctx.fillStyle = "#FF00FF";
        ctx.font = "20px Century Gothic";
        ctx.textAlign = "center";
        ctx.fillText((time / 66.666666666).toFixed(2), centerX, canvas.height * 0.1);
    }
}

class Player extends Main {
    constructor(x, y) {
        super(x, y);
        this.dx = 0.1;
        this.ax = 0;
        this.ay = 0;
        this.r = squareSize / 4
        this.accRate = 2;
        this.slowRate = 0.5;
        this.jumpStrength = 11.5;
        this.onGround = false;
        this.canMove = false;

        this.maxSpeed = 6.5;
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

class Button extends Main {
    constructor(x, y, gelatin, cameraX, cameraY, squaresToModify) {
        super(x, y);
        this.active = false;
        this.drawTips = false;

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
        if (gelatinDistX < squareSize * 0.4 && gelatinDistY < squareSize * 0.25) {
            this.active = true;
            toSet = 3;
        } else if (this.active) {
            //if active and the gelatin is too far away, become inactive
            this.active = false;
            toSet = 2;
        }

        //modifying squares
        if (toSet > -1) {
            for (var c=0;c<this.squaresToModify.length;c++) {
                loadingMap[this.squaresToModify[c][1]][this.squaresToModify[c][0]] = this.squaresToModify[c][toSet];
            }
        }

        //getting distance to player
        super.getPlayerDist();
        //if the player is close enough, display x and c buttons, and trigger their effects if the player has pressed them.
        //in addition to being close enough, the player also has to be above or equal in height to the button.
        if (this.dTPX < squareSize * 2 && this.dTPY < squareSize * 2 && character.y <= this.y) {
            this.drawTips = true;
            //triggering button effects
            if (xPressed) {
                this.resetGelatin();
                xPressed = false;
            }

            if (cPressed && loadingMode.constructor.name != "CameraPan") {
                loadingMode = new CameraPan(this.cameraX, this.cameraY);
                cPressed = false;
            }

        } else {
            this.drawTips = false;
        }
    }

    beDrawn() {
        //drawing self
        if (this.active) {
            ctx.fillStyle = pressedButtonColor;
        } else {
            //if inactive, color the switch the color of the gelatin
            ctx.fillStyle = this.gelatin.color;
        }
        
        ctx.fillRect(this.x - (squareSize * 0.25) - camera.x, this.y - camera.y, squareSize * 0.5, squareSize * 0.25);

        //drawing associated gelatin
        this.gelatin.beDrawn();

        //drawing hotkey tips
        if (this.drawTips) {
            ctx.fillStyle = tipColor;
            ctx.beginPath();
            //drawing circles 
            ctx.ellipse((this.x - (squareSize / 2)) - camera.x, (this.y - squareSize) - camera.y, squareSize / 3, squareSize / 3, 0, 0, Math.PI * 2);
            ctx.ellipse((this.x + (squareSize / 2)) - camera.x, (this.y - squareSize) - camera.y, squareSize / 3, squareSize / 3, 0, 0, Math.PI * 2);
            ctx.fill();

            //drawing text
            ctx.font = "20px Century Gothic";
            ctx.textAlign = "center";
            ctx.fillStyle = textColor;
            ctx.fillText("x", (this.x - (squareSize / 2)) - camera.x, (this.y - (squareSize * 0.9)) - camera.y);
            ctx.fillText("c", (this.x + (squareSize / 2)) - camera.x, (this.y - (squareSize * 0.9)) - camera.y)
        }
    }

    pickGelatinColor() {
        //possible hex values for red green and blue
        var letters = "08F";
        var tolerance = 100;
        //start with hash sign
        var color = "#";
        var goodColor = false;
        //run for 100 iterations max and make sure color hasn't been used before
        while (tolerance > 0 && goodColor == false) {

            //choose red, green, and blue values
            for (var i=0;i<3;i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
            }

            //start with good color assumption
            goodColor = true;

            //search through used colors array
            for (var g=0;g<usedGelatinColors.length;g++) {
                //if color matches, it is a bad color
                if (color == usedGelatinColors[g]) {
                    goodColor = false;
                }
            }

            //if still a good color, push it to the gelatin colors array and use it
            if (goodColor) {
                usedGelatinColors.push(color);
                return color;
            }
            //if not, remove 1 from tolerance, reset color, and try again
            color = "#";
            tolerance -= 1;
        }
        
        //if no possible colors can be generated, then return yellow
        color = "#FF0";
        return color;
    }

    resetGelatin() {
        //reset gelatin x, y, dx, and dy
        this.gelatin.x = this.gelatin.homeX;
        this.gelatin.y = this.gelatin.homeY;

        this.gelatin.dx = 0;
        this.gelatin.dy = 0;
    }
}

class Gelatin extends Main {
    constructor(x, y) {
        super(x, y);
        this.homeX = this.x;
        this.homeY = this.y;
        this.r = 10;
        this.color = "#000000";
        this.slowRate = 0.8;
        this.airSlowRate = 0.9;
    }

    tick() {
        //colliding with players
        super.getPlayerDist();

        //if the player is close enough to collide, then do
        if (this.dTPX < this.r + character.r && this.dTPY < (this.r * 2) + character.r) {
            this.dx += character.dx / 3;
            character.dx /= 8;
            character.dy *= 0.47;
            this.dy += character.dy * 1.2;

            //if dy is great enough, the gelatin must not be on the ground
            if (Math.abs(this.dy) > this.gravity) {
                this.onGround = false;
            }
        }

        //gravity / velocity cap
        this.dy += this.gravity;
        if (this.dy > squareSize - 1) {
            this.dy = squareSize - 1;
        }
        //handling collision with blocks
        super.handlePosition();
        
        //friction
        if (this.onGround) {
            this.dx *= this.slowRate;
        } else {
            this.dx *= this.airSlowRate;
        }
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

        this.rw = squareSize;
        this.rh = squareSize / 3;
        this.cloned = false;
        this.toDelete = false;
    }

    tick() {
        //collide with player, slow player's fall and give them momentum
        super.getPlayerDist();

        //if the player is close enough to collide, and the player is not in a forced fall, then collide
        if (this.dTPX < this.rw + character.r && this.dTPY < this.rh + character.r && loadingMode.constructor.name != "ForcedFall") {
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
        if (this.x > (loadingMap[0].length + camera.xSquaresPerScreen) * squareSize) {
            this.toDelete = true;
        }
    }

    beDrawn() {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = cloudColor;
        ctx.beginPath();
        //ctx.ellipse(this.x - this.rw - camera.x, this.y - this.rh - camera.y, this.rw * 2, this.rh * 2);
        ctx.ellipse(this.x - camera.x, this.y - camera.y, this.rw, this.rh, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Orb extends Main {
    constructor(x, y) {
        super(x, y);
        this.redValue = 2.5;
        this.greenValue = 2.5;
		this.possibleHex = ["A", "B", "C", "D", "E", "F"];
		this.points = 14;
    }

    tick() {
        //getting player distance
        this.getPlayerDist();

        //if the player is within 1 square, set the gamemode to a winning mode
    }

    beDrawn() {
        //updating red and green values, can be minimum of 0 and maximum of 7 for index of possibleHex
        this.redValue += (Math.random() - 0.5) * 0.5;
        this.greenValue += (Math.random() - 0.5) * 0.5;

        //keeping red in bounds
        if (this.redValue > 5.99 || this.redValue < 0) {
            if (this.redValue < 0) {
                this.redValue = 0;
            } else {
                this.redValue = 5.99;
            }
        }

        //keeping green in bounds
        if (this.greenValue > 5.99 || this.greenValue < 0) {
            if (this.greenValue < 0) {
                this.greenValue = 0;
            } else {
                this.greenValue = 5.99;
            }
        }


        //actually drawing the thing
        ctx.fillStyle = "#" + this.possibleHex[Math.floor(this.redValue)] + this.possibleHex[Math.floor(this.greenValue)] + "0";
        //drawing star-shape thing
        ctx.beginPath();
        for (var an=0;an<this.points;an++) {
            var rad;
            if (an % 2 === 0) {
                rad = squareSize * 0.4;
            } else {
                rad = squareSize * 0.2;
            }
        	var trueAngle = ((an/this.points) * (Math.PI * 2)) + (((time / 200) % 100) * (Math.PI * 2));
            var xOff = rad * Math.sin(trueAngle);
            var yOff = rad * Math.cos(trueAngle);
            ctx.lineTo((this.x + xOff) - camera.x, (this.y + yOff) - camera.y)
        }
        ctx.fill();
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

        
        //ticking everything except player
        for (var g=0;g<entities.length;g++) {
            entities[g].tick();
            //only draw the entity if they're close enough to the player
            if (entities[g].dTPX < camera.xSquaresPerScreen * squareSize && entities[g].dTPY < camera.ySquaresPerScreen * squareSize) {
                entities[g].beDrawn();
            }
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
            camera.doMenu = true;
            loadingMode = new Debug();
        }

        //setting special button presses to false
        xPressed = false;
        cPressed = false;

        //add to time
        time += 1;
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
		
		//add to time
		time += 1;
    }
}

//camera pan happens when the player presses c next to a button
class CameraPan extends GameWorld {
    constructor(cameraEndX, cameraEndY) {
        super();
        this.age = 0;
        this.cameraStart = [camera.x, camera.y];
        this.cameraEnd = [cameraEndX, cameraEndY];
    }

    beRun() {
        //main game world
        super.beRun();

        //handling camera
        camera.beDrawn();
        camera.tick();

        //changing age so camera pans instead of staying static
        if (this.age < 100) {
            this.age ++;
            //changing camera position, formula for a line is start + (percentTime * (end - start))
            camera.x = this.cameraStart[0] + ((this.age / 100) * (this.cameraEnd[0] - this.cameraStart[0]));
            camera.y = this.cameraStart[1] + ((this.age / 100) * (this.cameraEnd[1] - this.cameraStart[1]));
        }

        //testing for leaving back to the regular gameplay
        if (cPressed) {
            cPressed = false;
            loadingMode = new Gameplay();
        }
    }
}

class Ending extends GameWorld {
    constructor() {
        super();
		this.age = 0;
		this.finalAge = 1000;
		this.centerPos = [loadingMap[0].length * squareSize / 2, loadingMap.length * squareSize / 2];
		this.amount = 0.01;
    }

    beRun() {
		
        //main game world
        super.beRun();

        //handling camera
        camera.beDrawn();
        camera.tick();

        //changing age so camera pans instead of staying static
        if (this.age < this.finalAge) {
			//changing camera position, moves a little bit of the way towards the center of the map
			//change = [camera position now] - [camera position final, which is the center - centerX]
			this.centerPos = [(loadingMap[0].length * squareSize / 2) - centerX, (loadingMap.length * squareSize / 2) - centerY];
			var totalChangeX = camera.x - this.centerPos[0];
			var totalChangeY = camera.y - this.centerPos[1];
			var nowChangeX = totalChangeX * -1 * this.amount;
			var nowChangeY = totalChangeY * -1 * this.amount;
			camera.x -= totalChangeX;
			camera.y -= totalChangeY;
			/*
			//expanding camera field of view
			if (squareSize > 10) {
				squareSize -= 1;
				camera.xSquaresPerScreen = Math.floor(canvas.width / squareSize) + 2;
				camera.ySquaresPerScreen = Math.floor(canvas.height / squareSize) + 2;
				camera.shaderOpacity += 1 / this.finalAge;
			} */
			
			//changing age
			this.age ++;
			//console.log(camera.x, camera.y, nowChangeX, nowChangeY);
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
        camera.x += character.ax * 10;
        camera.y += character.ay * 10;

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
            camera.doMenu = false;
            loadingMode = new Gameplay();
        }

        //output time taken
        perfTime[1] = performance.now();
        console.log("time used: " + (perfTime[1] - perfTime[0]).toFixed(2));
        //if the player is in debug mode, set time to 1 year
        time = 31536000000;
    }
}