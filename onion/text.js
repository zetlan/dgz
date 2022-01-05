//all text that any character says goes here, plus the menu text

var menuText = ["Onion Quest", "start"];

var invenText = [["Stats", "Skills", "Items", "Quests"], 
                 ["STR:", "DEF:", "AGI:"],
                 [],
                 ["Equipped:", "Inventory:"],
                 []];

var chatterText = [[["I wonder how the Onion of Peace is doing?",
                     "oh well, I guess I'll never know"], [function() { quitWithJump(-1) }]],
                   [["Sometimes you just have to sit down and think about your life strategy"], [function() { quitWithJump(-1) }]],
                   [["Never take a chill pill. It's important to be passionate about things."], [function() { quitWithJump(-1) }]],
                   [["I enjoy wandering around this town all day, and all night."], [function() { quitWithJump(-1) }]],
                   [["When life gives you lemons..."], [function() { quitWithJump(-1) }]],
                   [["I overheard someone from the Onion Avoidance society talking about bulbs"], [function() { quitWithJump(-1) }]],
                   [["You never really know when the world could end."], [function() { quitWithJump(-1) }]],
                   [["You should get a hobby"], [function() { quitWithJump(-1) }]],
                   [["Don't you have anything better to do?"], [function() { quitWithJump(-1) }]],
                   [["I overheard someone from the Onion Protection society talking about compasses"], [function() { quitWithJump(-1) }]],
                   [["Don't you hate it when a sentence doesn't end the way you think it cactus?"], [function() { quitWithJump(-1) }]],
                   [["I was just like you when I was young. Give me time to remember how I was."], [function() { quitWithJump(-1) }]],
                   [["Cats are better than dogs."], [function() { quitWithJump(-1) }]], 
                   [["Dogs are better than cats."], [function() { quitWithJump(-1) }]],
                   [["And that's a fact."], [function() { quitWithJump(-1) }]],
                   [["I don't know what I said 2 minutes ago. Isn't that interesting?"], [function() { quitWithJump(-1) }]],
                   [["I wouldn't want to live in the North. Nobody else lives there."], [function() { quitWithJump(-1) }]]];

var tutorialText = [[["Hello, you can continue by pressing Z or the numbers"], [1]],
                    [["Glad we got that sorted! Let me tell you about life!",
                       "1. Ok"], [2]],
                    [["I'm sure a smart man like you already knows how to walk around",
                       "1. yes...",
                       "2. what are you talking about?"], [3]],
                    [["And you know to press 'z' to interact with things", "as well as pressing numbers.",
                       "1. Yes",
                       "2. I didn't know that",
                       "3. Are you even listening to me?"], [4, 4, 5]],
                    [["However, did you know that you need to eat to survive?",
                       "1. Yes, of course!",
                       "2. That's strange"], [6, 7]],
                    [["Yes, I am listening."], [4]],
                    [["Good! Eating will fill your Stamina bar, (in yellow)",
                       "Which will allow you to do productive things!",
                       "As time passes, (indicated at the bottom left corner), you will get hungry.",
                       "1. Bottom left corner?",
                       "2. ok"], [8]],
                    [["There's really nothing strange about it, understand?",
                       "1. I feel threatened",
                       "2. I guess so"], [6]],
                    [["The most important thing to remember is that when you don't know what to press,",
                       "press Z!",
                       "It's usually the answer. I don't think people are trying to trick you with this.",
                       "1. I still don't understand, nothing you're saying makes any sense!"], [9]],
                    [["That's okay. I don't think you ever will. Have fun!"], [99]]];
                    
var joinText = [[["Hey! How are you! I haven't seen you in a while!", "1. I'm good"], [1]],
                [["Nice! Now that you're out of school, what do you plan on doing?", "1. I'm not sure"], [2]],
                [["Well then, I'm glad I got to talk to you!", "If you've paid attention in school,", "and I know you have, then you would know", "the Onion Of Peace has been shattered for a while"], [3]],
                [["and you should think about joining the efforts to do something.", "1. What do you mean?", "2. I'll think about it"], [4, 5]],
                [["Well, there's the Onion Protection Society and the Onion Avoidance Society", "Both are doing things about the onion of peace,", "although I personally disagree with the Onion Avoidance Society"], [6]],
                [["Ok cool! I'm sure you already know about the two organizations,", "the Onion Protection Society and the Onion Avoidance Society"], [6]],
                [["You should really join one of them! I hear they pay a good salary,", "and you can have purpose in your life as well!", "1. ..."], [7]],
                [["Questions?", "1. Tell me about the Onion Protection Society", "2. Tell me about the Onion Avoidance Society", "3. What if I don't want to join one?"], [8, 9, 10]],
                [["The Onion Protection Society is dedicated to finding and uniting the different shards", "of the Onion Of Peace.", "Their goal is to bring peace to the land by making the onion whole again."], [12]],
                [["The Onion Avoidance society hopes to bring justice to the land by destroying", "the onion. Their philosophy is that people can't be good if their problems are", "all solved for them."], [13]],
                [["Well that's too bad, but you really should.", "I'm going to keep you here until you know at least something about one of them.", "1. oh", "2. I already know about them"], [7, 11]],
                [["Are you sure?", "1. yes, I'm sure", "2. no, tell me more"], [14, 7]],
                [["They're pretty neat. I used to participate in their forces before I got a new job.", "Now I examine bricks."], [7]],
                [["I personally think that the suffering caused by removing the onion", "would outweigh any good done by removing it.", "However, that's my opinion.", "Think whatever you like."], [7]],
                [["Ok, well this was a good talk! Have a nice day!"], [99]]];

var shopText =    [[["Hey kid, want to buy some... potions? (Press 1 for yes, 2 for no)"], [1, 2]],
                   [["Wow! Thank you, but I don't have any."], [99]],
                   [["Aw, that's too bad"], [99]]];

var questText =   [[["I'm'a give you quest now", "Hunt 4 slimes lol", "1. Yes, 2. No"], [990, 4], [new SlayQuest(1, false, 'slay slime', 'Ground', 4)]],    
                   [["Have you hunted 4 slimes yet?", "1. Yes", "2. No"], [undefined, 2]],
                   [["Come back when you have!"], [1001]],
                   [["Nice! I'm glad you did that for me!"], [99]],
                   [["Guess I can't argue with that"], [1000]]];

questText[1][1][0] = questText[0][2][0];


