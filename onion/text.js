//all text that any character says goes here, plus the menu text

/*text codes:
0-98, 100-979 - go to line number 
99 - end conversation
980-989 - spawn monsters, IDs located in text, end convo
990-999 - give quests, IDs located in text, end convo
1000-1999 - go to line (number - 1000), end convo
2000+ - check quest ID (number-2000), go to next line if successful, go to second next line if not
*/
var menuText = ["Onion Quest", "start"];

var invenText = [["Stats", "Skills", "Items", "Quests"], 
                 ["STR:", "DEF:", "AGI:"],
                 [],
                 ["Equipped:", "Inventory:"],
                 []];

var chatterText = [[["I wonder how the Onion of Peace is doing?",
                     "oh well, I guess I'll never know"], [99]],
                   [["Sometimes you just have to sit down and think about your life strategy"], [99]],
                   [["Never take a chill pill. It's important to be passionate about things."], [99]],
                   [["I enjoy wandering around this town all day, and all night."], [99]],
                   [["When life gives you lemons..."], [99]],
                   [["I overheard someone from the Night Onion society talking about bulbs"], [99]],
                   [["You never really know when the world could end."], [99]],
                   [["You should get a hobby"], [99]],
                   [["Don't you have anything better to do?"], [99]],
                   [["I overheard someone from the Light Onion society talking about compasses"], [99]],
                   [["Don't you hate it when a sentence doesn't end the way you think it cactus?"], [99]],
                   [["I was just like you when I was young. Give me time to remember how I was."], [99]],
                   [["Cats are better than dogs."], [99]], 
                   [["Dogs are better than cats."], [99]],
                   [["And that's a fact."], [99]],
                   [["I don't know what I said 2 minutes ago. Isn't that interesting?"], [99]],
                   [["I wouldn't want to live in the North. Nobody else lives there."], [99]]];

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

var shopText =    [[["Hey kid, want to buy some... potions? (Press 1 for yes, 2 for no)"], [1, 2]],
                   [["Wow! Thank you, but I don't have any."], [99]],
                   [["Aw, that's too bad"], [99]]];

var questText =   [[["I'm'a give you quest now", "Hunt 4 slimes lol", "1. Yes, 2. No"], [990, 2], ["new SlayQuest(1, false, 'slay slime', 'Ground', 4)"]],    
                   [["Have you hunted 4 slimes yet?", "1. Yes", "2. No"], [2001, 3]],
                   [["Guess I can't argue with that"], [1000]],
                   [["Well then, come back when you have!"], [1001]]];

