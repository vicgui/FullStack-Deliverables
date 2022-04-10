import { Card } from "./card.js";
import { Deck } from "./deck.js";

class Player {
  constructor(name, coins) {
    this._name = name;
    this._coins = coins;
    this._hand = [];
    this._dealer = false;
    this._betCoins = 0;
  }
  get name() {
    return this._name;
  }
  get dealer() {
    return this._dealer;
  }
  get coins() {
    return this._coins;
  }
  get hand() {
    return this._hand;
  }
  get getBetCoins() {
    return this._betCoins;
  }
  get playerStatus() {
    let handStatus = this._hand.map(function (card) {
      return card.cardSuitRank;
    });
    return `Name: ${this._name} | Dealer: ${this._dealer}  | Hand: ${handStatus} | Coins: ${this._coins} | Bet coins: ${this._betCoins}`;
  }
  set hand(newCards) {
    this._hand = newCards;
  }
  set dealer(d) {
    this._dealer = d;
  }
  set betCoins(coins) {
    this._betCoins = coins;
  }

  set setCoins(c) {
    this._coins = c;
  }
  addCoins(c) {
    this._coins += c;
  }
  get2Cards(cards) {
    this._hand = cards;
  }
  //pass
  check() {}
  //equal bet
  call(highestBet) {
    this._coins -= highestBet;
  }
  //bet
  bet(betCoins) {
    if (this._coins - betCoins < 0) {
      console.log("No coins enough to bet this quantity");
    } else {
      this._coins -= betCoins;
    }
  }
}
/* 
let p = new Player("vic", 100);
let p1 = new Player("hec", 123);
let ps = [p, p1];

let d = new Deck();

for (let pl of ps) {
  pl.get2Cards(d.deckList.slice(0, 3));
}
for (let pl of ps) {
  console.log(`${pl.playerStatus}`);
}

p.bet(200);
console.log(p.playerStatus);
 */
export { Player };
