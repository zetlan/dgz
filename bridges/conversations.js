//false means spoken by the orb, while true means spoken by the player.

var messages_first = [  ["hey, how's it going?", true], 
                        ["this message goes after the first one", true],
                        ["template? Response?", false],
                        ["What happens if there is a <br> new <br> line?? OuO?", false],
                        ["You know it's not particularly nice to look at other people's thoughts, right?", true],
                        ["I mean, how would you feel if someone looked inside your brain?", true],
                        ["Ah what's the point, I'm not the first person to do something like this, and I won't be the last. How nice of you to put in the effort to get here. (:", true]];

var messages_tutorial = [["Hi! I'm new to the bridge building team, can you help me?", true], 
                        ["Oh sure! The first bridge is next to me. I've taken it that you've already been told how to use the bridge machine?", false],
                        ["Oh yeah, of course! I learned all about it.", true],
                        ["Alright then, head on over to the bridge and you can start. What's your name?", false],
                        ["oh it's Alex.", true],
                        ["Alright, that's a nice name. I'm Jeff, and I guess we'll be working together. I'll see you around, Alex.", false]];

var messages_mainlander =  [["I haven't seen you around here recently.", false], 
                            ["I'm part of the bridge building team, I just arrived here.", true],
                            ["Ok, in that case, continue on. You're doing a great service!", false],
                            ["Thanks!", true]];




var str1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var str2 = "gMNOjzGHSkXstulAPQRBCpqZrhTUVidevFJKEDwxWfmnYoIaybcL";