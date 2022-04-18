import { Card } from "./card.js";
import { Deck } from "./deck.js";

class Player {
  constructor(name, coins) {
    this._name = name;
    this._coins = coins;
    this._hand = [];
    this._dealer = false;
    this._betCoins = 0;
    this._comparableHand = "";
    this._handRank;
    this._playing = true;
  }
  get playing() {
    return this._playing;
  }
  get name() {
    return this._name;
  }
  get getHandRank() {
    return this._handRank;
  }
  get dealer() {
    return this._dealer;
  }
  get coins() {
    return this._coins;
  }
  get compareHand() {
    this.createCompHand();
    return this._comparableHand;
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
    return `Name: ${this._name} | Dealer: ${this._dealer}  | Hand: ${handStatus} (${this.compareHand}) | Coins: ${this._coins} | Bet coins: ${this._betCoins} | Playing: ${this.playing}`;
  }
  set hand(newCards) {
    this._hand = newCards;
  }
  set handRank(rank) {
    this._handRank = rank;
  }
  set dealer(d) {
    this._dealer = d;
  }
  set setPlaying(playing) {
    this._playing = playing;
  }
  set betCoins(coins) {
    this._betCoins = coins;
  }
  createCompHand() {
    this._comparableHand = this._hand.map(function (card) {
      return card.compString;
    });
    this._comparableHand = this._comparableHand.join(" ");
  }
  addCardsToHand(cards) {
    this._hand.push(cards);
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
    this._betCoins += highestBet;
  }
  //bet
  bet(betCoins) {
    if (this._coins - betCoins < 0) {
      console.log("No coins enough to bet this quantity");
    } else {
      this._coins -= betCoins;
      this._betCoins += betCoins;
    }
  }
  fold() {
    this._hand = [];
    this._playing = false;
  }
}

export { Player };
