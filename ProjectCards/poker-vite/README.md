# Texas Poker

A library that implements Texas Holde'm poker game in the console.
The decision of each player is given to the console, and possible options are: check, call, bet and fold.
Resolution of the hands is computed by the getHandRank in ./module/cardsComparison.js

To create a game it is needed to create an instance of the class TexasPoker, with the paramaters numberOfPlayers, coinsPerPlayer, bigBlind, smallBlind:
```js
let poker = new TexasPoker(3, 100, 10, 5);
```

The game will continue until one player gets all the coins and the rest loses all the coins.

## Example
```js
let poker = new TexasPoker(3, 100, 10, 5);

poker.play();
```
After this method is launched, the console asks for decision for each player, and the decisions can be check, fold, bet and call. 
These mehtods are defined in the module player.js (./module/player.js).