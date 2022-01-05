//all the colors used

//terrain colors
var dirtColor = "#755F4D";

var woodColor = "#A5741D";
var lWoodColor = "#BD8420";

var stoneColor = "#708080";
var interStoneColor = "#7B9190";
var lStoneColor = "#899C9C";

var spaceColor = "#85DEF5";
var sunColor = "#FF3300";
var debrisColor = "#8888FF";

var engineColor = "#6666FF";
var shipColor = "#FFFFFF";
var computeColor = "#307529";
var computeWireColor = "#FFEE25";

var brokenHyperColor = "#5D649C";
var repairColor = "#76AA9F";

//player colors
var inventoryHighlightColor1 = "#FFA200";
var inventoryHighlightColor2 = "#FFF288";
var inventoryColor = "#7171A4";

var swordColor = "#575250";

var healthColor = "#EE0000";
var spColor = "#FFE000";
var xpColor = "#00EA00";

var playerColor = "#CCCCFF";

var chatterColor = "#FFEEFF"
var characterColor = "#FF00FF";
var enemyColor = "#FF0000";
var hyperColor = "#3872FF";

var endingColor = "#FF00FF";
var startingColor = "#00FF00";
var stoneColor = "#6F8389";
var blackColor = "#000000";
var boxColor = "#759AB2";

var powerColor = "#FFD800";
var fuelColor = "#FF9300";
var cTemperColor = "#7CBBFA";
var mTemperColor = "#7CFA80";
var hTemperColor = "#FA917C";

var menuColor = "#333366";
var textColor = "#88FFCC";
var finishedTextColor = "#CCFF88";


var spaceColor = "#333333";

//fullEllipse is because I thought it was annoying to write beginPath() and fill() at the end of every ellipse.
//all textures
//pallete 1
var grassyGround = new Image();
grassyGround.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAACVBMVEVBu31Bu36I/7tE62+zAAAAI0lEQVR4AWMgEzAxDDtA2HejjmFkGFmAiXLto7lh1M2jXgMAQOcAEtRZpjQAAAAASUVORK5CYII=";

var dirtWall = new Image();
dirtWall.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEVyUjh1X03ztY/tAAAArklEQVQIHQXBsU2DMRCG4W+DFAyQkjFcMgYFI6RCQpyYICN4DqorUqT0ApEsKpc/kQti5XIvz6MgK1qko0kaGoShE9eCvjm21EfYCOVbnVexP68hynw04beswtOK6FQTnWZiY5rYiCIGWcQTuG4PcJ0TuvYYF0HlS9BiJ9h+huB3NwXTlwrDQ07zVKd6qFF8aaT5XTPwP62FDeUBq+IZK+LIp4nOO8I5IIwXlMYr/700o3VK7vIDAAAAAElFTkSuQmCC";

var dirtWallLeft = new Image();
dirtWallLeft.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAOVBMVEVBu31Bu35WQS9XQS9YSj1ZST1ZSj1bSz5mSzRpVUZpVkZqVkZrV0dwUTdyUjhzXUxzXkx1X02I/7vKUKQ+AAAArUlEQVR4Aa3U0Q7CIAyFYZyIo0hpef+H1cReaMzGf6HXX044bV26P8zdVdPqV5p9uHkC6wi3TBzKoHQG826oS9rktPX8bk0ys5gjmRuEJaAvoQwKzZHMR/Dys+uAqvyNvPX/5qgKVti6agSenvm293gheqMCWA0FpoJhGy+HoC0CYwjXPeCyDIbSGSy1K0us9t70BJtRPh68QgdQIDz49szjvwK7HnAWt0bLQPgE4P0SCXUsHqEAAAAASUVORK5CYII=";

var dirtWallRight = new Image();
dirtWallRight.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAaVBMVEVAMidBMyhBODBBu31Bu35CNChCODBCOTFDNChDOTFFOzJGOzJXQS5XQS9YQS9ZST1ZSj1aSj1bSj1cSz5lSjRmSjRoVUVoVUZpVUZpVkZqVkZwUDdwUTdyUjhyXUtzXUxzXkx1X02I/7uRfSO3AAAA30lEQVR42o3U6xKCIBAFYMvKTEytECg2ivd/yBCdoZue5fc3Z5fLkuULi57jctdz9QX9J6QJmu4QII50qqt4sOcmaia8q27PSzTHLYCjtLIuA4SSrG53AaLiRE41CfoZGNZwjgPExZ3mwGHXiz1u3mDPS+RDfo+qYe5atSWE+QD1/0T/A3tQOkGRZR5CIivFOiRiGEpzYHpmsEcrW+Y5XgT3ro8rBGmELYbjTyGYUNZFgn4B4l1ThDf8HqMja0IiDIzjimB0cWaKOeinwNjkA901RZbmGn/2PR8WPGhO5QsOsDWxhFQuRQAAAABJRU5ErkJggg==";

var dirtWallDown = new Image();
dirtWallDown.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAQlBMVEVBu31UPy5VPy5WRzxWSDxXRzxXSDxZST1ZSj5iSDNkU0NlUkNlU0NmU0RnVEVvUDdwUDdyUjhyXUtzXUx1X02I/7uHMYbDAAAA+0lEQVR4AbzTQUqFQQwE4VyhtN79ryr82jg2YQQXZjU0H2QWnfnjvOZfB1iiLRQopALt1IRfSBO+kk9Cokp+MgwUIoCfEvSE2u8s8oTiKalFCwyox1iyKe6wZcOWoRfYFBa4yobAKg2MSnqBUXc5YSUrgbGHojxjYMlSukG7ELDBiKjIHdK1w4HNFRRGdlc5oyyuIQ9kc/Yf97tq6AOFcgU52nN131DBuIJ9rt1b+ly79AX59VwJC3x/++hRDHAAhEEYOAdDcejM+P9fpSx6LSSXNPE55odHoD6e5diU2xZqP/1MV1Xr6XFXOVhIRLZKLBwNGsWrrUIRdH8B0h5jWPfCpy4AAAAASUVORK5CYII=";

var dirtWallUp = new Image();
dirtWallUp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAOVBMVEVBun1Bu31Bu35SPi1SPi5URjpVRjpWRztiSDJjUkNkUkNlUkNmU0RwUTdyUjhzXUxzXkx1X02I/7st+rJ/AAAAlUlEQVR42t2S0Q6DIAwA26EM6yyj//+xq+hoAslCYvYghyZwuWBQ4Tl7HW7y847Pt+K8m/a5Lo4LXkQLhUDKslIhkKq8PiW8Y4zbFitaBSkl5lTDjQOVjeVMHTIiHtoqLM5ClV/NGSxYqjMo2poqZQUB8DflGYB9WCi9If4/fHTvOEYo13aUIV6P3PATymj/oyF3PMwHejsTv0s0BE4AAAAASUVORK5CYII=";

var dirtWallCornerDL = new Image();
dirtWallCornerDL.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABelBMVEVBu31GPDNHPDNJOCpJPjRKPjRKPjVKPzVLOStLPzVLPzZLQDVMPzZMQDZNOytNOyxNQDZNQTdOOyxOQTdOQjdPOyxPPCxPQjdPQjhQPC1QPSxQQjhQQzhRQzhRQzlRRDhRRDlSRDlTPy1TRTlTRTpUPi5UPy5URTpURjpURjtVPy5VQC5VRjpVRjtVRzpVRztVSDtWQC9WRztWSDtXSDxYSDxYSTxYST1ZSTxZST1ZSj1aSj1bSz5cRDFcTD5cTD9dTT9eTUBeTkBfTkBgRzJgTkBgT0FhUEFiUEFiUEJiUUJjUEJjUUJjUUNjUkNkSTNkUUNlUkRmU0RmU0VmVERnVUVoTDVoVUVoVUZpVkZqV0ZqV0drTjZrV0drWEdsWEdsWEhsWUltWEhtWUhtWUluWUhuWUluWkhuWklvUDdvWklvWkpvW0lwW0pxUThxUjhxXEpxXEtxXUtyUjhyXEtyXUtyXUxzXUxzXkx0Xkx0Xk10X011X02I/7uVRM/hAAAB6klEQVR42oXS+1cSQRQH8CkNIqNgMddqfWIIGpFaQWqiaZqZle8X+QgfFW4l4wbLDv97zF7Xy96lw/cXdu5+zvcO5yzLfDJELZw1izbzpw5W/w+Dk7p0vGllYMKGoqm8A9BdymUaQw77OSB5ojQwLiFIsMKJlFVnBUBYDiESGBfMlz5H6LS6pTzX4MvvtEi4pHQ2HDsRWElL4dIAE3sWgQDIA2vrXStjJaU4ZRF1sYjQIxGyyExBoPRQhOFXX00vdP0XgGpirYQFXomw74sBE5A011DrXrqUim73wo65H2RMJUCl4/0lGXsh56yqaQsX7usTZ6fW2PV4XidvqILV3Z2zOt2FCn5tGI1kTywir4JnCVkofWBS6PnsbJjYNr0OII4k1JYN6igUEirh6dMKcQ0bn9we3TCIa3hHdv/Bu29l4ggUNowrwx/yJep4vQM4GX048vHwwnS9rXcOZJnowMib1bzxy92CzIFsIt73aOjt51zJIhAcQjaV7Lqn9E9v/SyWKwjBIQQaV8JqKruwsnem/y2b5m9hSVaxLAdiku2hkNoTf5FdXN/Z3Tw4zudy+f39o/NCoaAXmStPNTXo8wfV3sFnsbHYUGw0lUylnqdfj08ts0YJB++2tfhb/L5Wn7/1xs1bgUAk8w+LYTodBB/9NQAAAABJRU5ErkJggg==";

var dirtWallCornerDR = new Image();
dirtWallCornerDR.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABxVBMVEVBlWZBlWdBmmpBpXBBq3NBtnpBt3tBuHtBuXxBunxBun1Bu31CkWRCsHdCsnhCs3hCtHlCtXlCtnpCuHtCuHxCuXtCuXxCunxDt3tDuHtEp3JEtntJPjRKPjVLPzRNQDZNQDdNQTZNQjdOQjdPPCtPPCxQQjdQQzhRQzlRRDhSRTpTQC5TRDlUPy5URjpUVkRVQC5VRTpVRjtVRzRVRztVRzxWRzxWSDtWSDxXRzxXSDxXSTxXST1YSDxYSTxYST1YSjxZQjBZSj1ZVkVaQjBbQzBbSz5bTD5bTD9bUUBcSz5dTD9dTz9dUkJeTT9eTUBfTkBgTUBgTkBgTkFgTkJgT0FhRzNhTkNhT0JhUEFhUEJiSDNiUEFiUEJjSTNjUEJjUUJkUkNlUkNlU0RmU0RmVERnVEVoVEVoVUVpTDVpVUZpVkdqVkZqV0drTjZrV0ZrV0hrWEdsTjZsWEdtWEhtWUhuWUhuWUluWkluWz5vUDdvWklwUDdwUTdwVztwW0lwW0pxUThxUjhxXEpxXEtyUjhyUzlyXEtyXUtyZFByZVBzXUxzXkxzYk9zY090Xkx0X010YE50YU51X011YE2H+7iI/7tFC+eGAAACKUlEQVR4AW3T+VfTQBAH8PVQmh0PbTFpvG/xvlFR8cajioeiiFQasYgHHiJ4a4SOjbY26ip/r8luO27Dzg95fTufzvTbl2UwvbgQAgWioCrljyXglAbF/5rsOW6aaMeQnIT9RgjfBTbDsnfYADl8ihhJCe91GFf/ll1EDe5i5tAJWb65lRmzJCS+u7PHAJ232CwRg/xaZsjyA0mi0qWcRXCKZNwjquKXzgJBsOqLRY2W0gf/kAZ5/ZlIIp9vNhOkJEqRVPD56gTkrcoQVTAcXK5DbtM4jca4cmVlBIllKYBWEn5utxpwGdgCa18NMt49tmmhXYeItV/y1ATDB6vSElr47Q8dG2TQu4YDQ0RBzCgnxi+sA2DTByQofri7fZEGzRIRvzw8vQWMUGDTn+j37F1sgCSUEqJS7MhEzjZDpLk/x3N/I2e5DNHkCAbeEQA1EQ2OYOXRyQwHcOVvJEmOYPXFuZ3qVZUQE45g+GrgVBpUMeqRIxi+vn05AwT1rv4drI5e60zTNWHUT7iJ4HHXjrmWdA5ISERzYfmp1z4/FSO3EYYkuTDwRwonWmKWdbMWOA4nSJc+rAb+6HC++2ha3rXGYh2Kj0HJfz82MlQoXOpcql11ZVm1EldQnnz5pOgV+vsGei8eSFkqBDk7gs+Gh4r3B73rZ3LdV2/13Ti/f8GcFg7NjoMDrOvgvt3b2to2rN+4Yt4MNnPWbJ6y5E5nCQduuw7Y3IFW+AeoqEiGxr+NhgAAAABJRU5ErkJggg==";

var dirtWallCornerUL = new Image();
dirtWallCornerUL.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAACLlBMVEVAXkZAZ0lBVkJBsXdBs3hBtHhBtHlBtXlBtnpBuHtBuHxBuXxBunxBun1Bu31CZUdCtHlCtXpCuHtCuXxCunxDeFZDmmpDqHJDt3pDt3tDuHtEYUhEY0ZEclJEtnpEtntFWkVFbE9FeVZFs3lFtHlFtXpGX0dGZEZGcFJGsXZGsnhHPDNHPTRHSjtHSztHTz5Hr3VIPTNIPTRIUD9IrnZIr3dJPzVJXkhJrXZJrnZKPjVKPzZKdlVLOStLPzVLTj9LqXNMQjBMQjdMqHNNQDdNQTZNRztNVkROQjdOY0pOn2tOpHFPQzhRRDhRRjtSRDlSUkJTRTlTRjlTSDtTm2xUPy5URTlURjpUSz1VRjpVTTZXQS9XRzxXVENYRjNYSTxYST1Yk2hZSj1ZTz9ZkWdaSj5aSz1aSz5bSz5bTD9bjmVcRDFcSz5cTD5cTD9cjGVdTT9df1VfRjJfTkBfTkFgTkFgT0BgT0Fgg2BhRzJhUEFhg2BiUUJjUUJkSTNkUUNkUkNkfl1lU0Rle1tmUkVmU0RmVERmVEVmeltnVEVnVUVoVEVoVUVpVkZpdFhpdVhqTTVqVkZqV0ZqV0drV0drsYRsTjZsWEhtWUhtWkluTzZuTzduWUluWklvUDdvWklwW0pwaFJxUThxUjhxVDlxW0pxW0txXEpxXEtxZVByUjhyXEtyXUtyZFByZVBzXUxzXkxzXk10Xkx0Xk10X010YE50YU51X011YE2I/7tnW+UhAAACD0lEQVR4AX3U9XcTQRAH8EMgPW4zSA4J0gNa3N1dKE5xd5ciAYqE4sUFCkUgSPGltOFSurn/Dt69zr3dnSXzQzaZ+bzv5t3tnZWMw3/KsR1gzIFY3+HDxo6xwJWHQSg624xB20mLVu05UXHw0On0lcvpSssDrRjrt3Djts3bU5fuvfjm+7nfubAsjcWdXmsuVNc8rn3jC6U0aHddkc74nHPBeQHIus3a96wOiUK5DO3BO6te1+FIkVyG3XtvqW3Sxrhyaet2Hcuf5rAdyegzgrFWy+5kyZ4cf7VAF+LPZ1Sjk0N56KTE9qPON0YupOoXhDFrx1ccqYILBbaZeANbsiSQDdzwFnsaVaEzP/Vdg0iV/+gs3vrADwNIqbDT6jMZPAikJNhl+rqqd9gtBNmc1MucKCSbGxr+QdZ//f16Iczyz6PDS5ZO8RJJKwB75NFMk/FwNV9fW5JgEJYFUDTtFgaq8ursCT0ZA4Ss9UoMVHbPXxzthgRh0dy0b7jMn0/2AFCgfeCV4dblbw9BErTAWMUH6sSv8QBa4qBj9dSJvZ4O2bgjWeo+loAOnamnPhEndrkEsgXXONfdj6EUOmV3BUp04rgHBNplN6N5tM5LUNhh+RMkkcuXAoV9Nr3HMHTiYbEBjtj9U3/oxblSCAiceTZLTuJkz5BYXkOcGOAa4P4v6CQYN8DKRvp6LXaTBP4FcHjJttfOJXkAAAAASUVORK5CYII=";

var dirtWallCornerUR = new Image();
dirtWallCornerUR.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABcVBMVEU1Mis5Myw5ODA6OzE7NS08NSo8OjA/Nio/Ni8/Ny4/PDJANChAPTJBOzFBunxBun1Bu31COTBDOjFDOzNDPDJENSlEOjFEOjJEOzNEPjNFNylFOzNGPDJGPTNIPS1IPjRIPjVJPTRJPjVKPjRLOStLOytLPjRLQDZLQDdMOytMPzZMQDVMQDZMQjhNPS1NQDZNRDhOQThPPCtPPC1QQjhQQzhSPS1SRDlSRDpSRTpTRTpURjpWRztXQC9XSDxYSTxaSj1aTD5cTD5dTD9eTT9eTUBeTkBfRTJfRjFgRjJgTkFgT0FiUEFiUEJjUEJjUUNjUkNlVERmVEVnSzRnVEVnVUZoVUZpVUZpVkZqTDZrTjZrVkdsTjZsTzZsWEhsWUhtWEhuWUluWklvUDdvWklvW0lwUTdwW0pwW0twXEpxUThxW0pxXEpxXEtxXUtyUjhyXEtyXExyXUtzXUxzXkxzXk10Xkx0Xk10X011X02I/7slMz1yAAABX0lEQVR42o3TV1PCQBQF4Ng7xoq9YO8VbNgVK2JPVIxYsGsU0Lj59W5uCMtDttyZzUwm35w9yWykcNA/1jvU0yZzRkpo54ehxUBfdYV1a3qoECFk3F/fKpG15ZnBejdCoK4jPN/xq4MlXykdYoclTOrheGOuvZwCdXx1JPpNxk+2RnPdoOWItMJ/1ImczHMzA/GyJSiwSWW+ikQR6FBwIF+1zdkGiQKJhdCnl/1Gd2g61qlqKCPURJAORSg2ToUkFOhRLRMS+bVSyICkKNIv+umQSLyM7QK5kgFBQurzFCMRJg3RWQcPpj9+KlQke2jQzG5652cmEmmE6yBSMnnyMsBPhKqPO018CC21bpGOeN6CZVxo/0e7XjGI1C4utOX7QglAfuSeVxDeDGRDk753YhIgPzLaKgb1aLMIxNt/DvMhnMq/1TwCWWcSRWoA8t/mtEUQqp35YjA2XSwGP9Z9/yG68rx0fzCYAAAAAElFTkSuQmCC";

var dirtStairsVertical = new Image();
dirtStairsVertical.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAD1BMVEVBu31Bu35UPy51X02I/7vdFfaGAAAAMUlEQVR4AWMgE7AwDCtAue+YiAQMTMxEAeIVEm815YBxwKNmNGbonxtGY2aYRQf9AQAivgS26CTanwAAAABJRU5ErkJggg==";

var dirtStairsHorizontal = new Image();
dirtStairsHorizontal.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAD1BMVEVBu31Bu35UPy51X02I/7vdFfaGAAAAMElEQVQoz2NgAAIlJRQCApSNGBxABAOEgAsyjCBBxkHsTgd6WOQwjGKThZpmomcZADb1KDici0nVAAAAAElFTkSuQmCC";
var houseCover = new Image();
houseCover.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAIVBMVEUAAABmY4R8p9eZx+T///9mY4RmY4R8p9eMi5KZx+SwsLAUK9imAAAABnRSTlMAAAAAAAKAqGa9AAABKklEQVR4Ae3Sa26EMAxF4TJQT+n+F1xPdJFcIsIjj1/nbODTtfxFY1tG9h1gM5t6GFOeUxFeV/vghWphofZ+72BPeA9YqJfBooW3hIWKPYLj8no4LL0Ey/6pTuotWPjv44Q+gdfHeFj6FF7t7tkTKqYOTl0crqWtYNFeGRXbGt700vv2gQ/+bUP7w8IDOgxOhaVj4TW7MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDCwNwZ2KMLTPM8J7wkn9OVF2JuFWw/YNvTlUoCXjyw86S1hmZ6UHJYuvAUsVOYJHHF7DluOnsOipd+HZYotwVmXpl8buuw7h8+ml4fWwrvpR3A2tA0sWrj9h02o2Oaw+DBdQyPZDY7TC0PP4T8thG2IGBtlbgAAAABJRU5ErkJggg==";

var grassyRock = new Image();
grassyRock.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAD1BMVEVBu31wgIB7kZCI/7uJnJxVrEu8AAAAgUlEQVR4AeXUMQ5DMQiDYeNw/zNXqZ4HRDFSx/afvwhPwZcd/HIHc3yCi6WdMW/kMKaoWVYnSXfWSnYoOjmmkTRQUs5IAwfJ1iD5sQ6Dc4IEjqChvBARXCRvgjbBTWYK7isFwzvBhaZOKwsh6OjbSXqKp6gNrNGSVCnqC/j+4ut9ATIKB1uraVhMAAAAAElFTkSuQmCC";

//pallete 2


//pallete 3
var stonyGround = new Image();
stonyGround.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEV7kZCJnJxfDZG/AAAAmElEQVQI1z3PsQ3DMAwEwAcCxKXadFwjRWAuFoSu4tIjeBUFLlJ6BY2gkoUhhlQAN1c9Hv+QCXxALjlMGlJjxchG3VTxEJsLbmITgNMBKvZOONgWQvM8w8hGgaX2cmd9Gjx978LNfymHUkKr7qe7mZ5+u3t3MZVoroLmMg6XoGwlobgDrmxbRmLbK4htVTDFfl5bPFpKGE9/r7R+1/X7GP8AAAAASUVORK5CYII=";

//pallete 4 - desert
var sandyGround = new Image();
sandyGround.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABlBMVEX/1WP/6KtAHo2uAAAAOUlEQVR4AWMYEYARCgirg9JDz38IgFcdCmcERT4RanAGykgKM0YUgE8ZOncUUBba+BVh6MGqaPACAAA9AFs5q6YgAAAAAElFTkSuQmCC";

var sandyWall = new Image();
sandyWall.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEXoxaz20ayPMvXJAAAAGElEQVQI12P4DwIM+Mk/DAwM9kOAJMIvAFccXjnCU69rAAAAAElFTkSuQmCC";

var sandyWallLeft = new Image();
sandyWallLeft.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAgMAAADxkFD+AAAADFBMVEXoxaz20az/1WP/6KtSw2kEAAAASUlEQVQY02NgDV0FBQykM///hzFXv1pNsgn//yFE15PtBlTmfzhz9SsKDFv/H+Q1MBPoyNW/qOAyNObq/xDvg8JhFdC+V6SZAAA+3ehY81IHHAAAAABJRU5ErkJggg==";

var sandyWallUp = new Image();
sandyWallUp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAgMAAADxkFD+AAAADFBMVEXoxaz20az/1WP/6KtSw2kEAAAAU0lEQVQYV5XPsRXAIAwDUS+ZJc+FN8hAHoECpcBJBQ+i6jdXyGy669ueAHg6DAInDKkXb4jTbE5lSUYb8txnS4akYgdvh9kPet03XBBKMNc2e/cAFEj12HQFz1IAAAAASUVORK5CYII=";

var sandyWallRight = new Image();
sandyWallRight.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAADFBMVEXoxaz20az/1WP/6KtSw2kEAAAAUUlEQVR4Ae3PwQqAIBAG4a3v/d85CA+2YEpdWmguIoz+TOwTtpOI0qLGTKSdxar13Iik2MXp0iJY/ZHK1e9FF4Yi0vXB9C/qGIogv5FE8OHqAxELC0UU5pVjAAAAAElFTkSuQmCC";

var sandyWallDown = new Image();
sandyWallDown.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAgMAAADxkFD+AAAADFBMVEXoxaz20az/1WP/6KtSw2kEAAAAH0lEQVQY02NYBQcMpDP//4cxV79aTYy2UDgYKUwaAQDlmYxh6TpyAAAAAABJRU5ErkJggg==";

var sandyWallDR = new Image();
sandyWallDR.src = "";

var sandyWallDL = new Image();
sandyWallDL.src = "";

var sandyWallUR = new Image();
sandyWallUR.src = "";

var sandyWallUL = new Image();
sandyWallUL.src = "";

//pallete 5 - desert temple
//textures that aren't for map things specifically




/*mapSquare turns values into textures. Most values are fine, but it processes 
  whole values first. This is because values with decimal points are used to tell 
  the game something. Some values use decimal points to indicate direction, and in
  that case, the decimal point is useful. However, there are cases where the 
  decimal place gets in the way, and removing the decimal place prevents that.

  There are also multiple functions with different textures for different areas. This is to make it easier to store maps, as many different values aren't needed. */

function palleteOneSquare(value, ex, why) {
  ctx.beginPath();
  //ground is special
  var isGround = String(value).match(/^\d/);
  if (isGround) {
    ctx.drawImage(grassyGround, ex, why, squareSize, squareSize);
    if (value > 0) {
      ctx.fillStyle = "#00FF00";
      ctx.globalAlpha = 0.3;
      ctx.fillRect(ex, why, squareSize, squareSize);
      ctx.globalAlpha = 1;
    }
  } else {
    //drawing all blocks
    switch (value) {
      //drawing wall blocks
      //A is full, B-E is edge, F-I is corners
      case "A":
        ctx.drawImage(dirtWall, ex, why, squareSize, squareSize);
        break;
      case "B":
        ctx.drawImage(dirtWallLeft, ex, why, squareSize, squareSize);
        break;
      case "C":
        ctx.drawImage(dirtWallUp, ex, why, squareSize, squareSize);
        break;
      case "D":
        ctx.drawImage(dirtWallRight, ex, why, squareSize, squareSize);
        break;
      case "E":
        ctx.drawImage(dirtWallDown, ex, why, squareSize, squareSize);
        break;
      case "F":
        ctx.drawImage(dirtWallCornerDL, ex, why, squareSize, squareSize);
        break;
      case "G":
        ctx.drawImage(dirtWallCornerUL, ex, why, squareSize, squareSize);
        break;
      case "H":
        ctx.drawImage(dirtWallCornerUR, ex, why, squareSize, squareSize);
        break;
      case "I":
        ctx.drawImage(dirtWallCornerDR, ex, why, squareSize, squareSize);
        break;
      case "J":
        ctx.fillStyle = dirtColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case "K":
        ctx.fillStyle = dirtColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      //stairs
      case "Q":
        ctx.drawImage(dirtStairsHorizontal, ex, why, squareSize, squareSize);
        break;
      case "R":
        ctx.drawImage(dirtStairsVertical, ex, why, squareSize, squareSize);
        break;
      case "S":
        ctx.drawImage(grassyRock, ex, why, squareSize, squareSize);
        break;
      case "Z":
        palleteThreeSquare("0", ex, why);
        break;
      case "Y":
        palleteFourSquare("0", ex, why);
        break;
      case "i":
        palleteOneSquare("0", ex, why);
        break;
    }
  }
}

function palleteTwoSquare(value, ex, why) {
  var isGround = String(value).match(/^\d/);
  if (isGround) {
    ctx.fillStyle = woodColor;
    ctx.fillRect(ex, why, squareSize, squareSize);
    ctx.fillStyle = lWoodColor;
    ctx.fillRect(ex, why + (squareSize * 0.166), squareSize, squareSize * 0.1);
    ctx.fillRect(ex, why + (squareSize * 0.5), squareSize, squareSize * 0.1);
    ctx.fillRect(ex, why + (squareSize * 0.833), squareSize, squareSize * 0.1);
  } else {
    switch (value) {
      case "A":
        ctx.fillStyle = dirtColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case 2:
        ctx.fillStyle = debrisColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case 3:
        ctx.fillStyle = computeColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        ctx.strokeStyle = computeWireColor;
        ctx.lineWidth = "1";
        var num = 4;
        for (cl = 0; cl < num; cl++) {
          ctx.beginPath();
          ctx.moveTo(ex, why + (squareSize * (1 / (2 * num))) + (squareSize * cl / num));
          ctx.lineTo(ex + squareSize, why + (squareSize * (1 / (2 * num))) + (squareSize * cl / num));
          ctx.stroke();
        }
        break;
      case 4:
        mapSquare(1, ex, why);
        ctx.globalAlpha = 0.7 + (Math.sin(time / 90) * 0.3);
        ctx.fillStyle = brokenHyperColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        ctx.globalAlpha = 1;
        break;
      case 5:
        mapSquare(1, ex, why);
        ctx.globalAlpha = 0.7 + (Math.sin(time / 90) * 0.3);
        ctx.fillStyle = hyperColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        ctx.globalAlpha = 1;
        break;
      case 6.5:
        mapSquare(1, ex, why);
        ctx.fillStyle = repairColor;
        ctx.fillRect(ex + (squareSize / 2), why, squareSize / 2, squareSize);
        break;
      case 6:
        mapSquare(6.5, ex, why);
        ctx.fillRect(ex, why, squareSize / 3, squareSize);
      case 9:
      default:
        break;
    }
  }

}

function palleteThreeSquare(value, ex, why) {
  var isGround = String(value).match(/^\d/);
  if (isGround) {
    ctx.drawImage(stonyGround, ex, why, squareSize, squareSize);
  } else {
    switch (value) {
      case "A":
        ctx.fillStyle = stoneColor;
        ctx.fillRect(ex, why, squareSize, squareSize);
        break;
      case "S":
        palleteOneSquare("0", ex, why);
        ctx.fillStyle = stoneColor;
        ctx.ellipse(ex+(squareSize*0.5), why+(squareSize*0.5), squareSize*0.5, squareSize*0.5, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = lStoneColor;
        ctx.ellipse(ex+(squareSize*0.3), why+(squareSize*0.55), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.7), why+(squareSize*0.7), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.6), why+(squareSize*0.2), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex+(squareSize*0.5), why+(squareSize*0.25), squareSize*0.1, squareSize*0.1, 0, 0, Math.PI*2);
        ctx.fill();
        break;
    }
  }
}

function palleteFourSquare(value, ex, why) {
    var isGround = String(value).match(/^\d/);
    if (isGround) {
        ctx.drawImage(sandyGround, ex, why, squareSize, squareSize);
    } else {
        switch(value) {
            case "A":
                ctx.drawImage(sandyWall, ex, why, squareSize, squareSize);
                break;
            case "B":
                ctx.drawImage(sandyWallLeft, ex, why, squareSize, squareSize);
                break;
            case "C":
                ctx.drawImage(sandyWallUp, ex, why, squareSize, squareSize);
                break;
            case "D":
                ctx.drawImage(sandyWallRight, ex, why, squareSize, squareSize);
                break;
            case "E":
                ctx.drawImage(sandyWallDown, ex, why, squareSize, squareSize);
                break;
            default:
                break;
        }
    }
}