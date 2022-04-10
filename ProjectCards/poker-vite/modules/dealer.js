import { Deck } from "./deck.js";

class Dealer {
  constructor(deck) {
    this._deck = deck;
    this.shuffle();
  }
  shuffle() {
    let sorted_arr = this._deck.sort(() => Math.random() - 0.5);
    this._deck = sorted_arr;
  }
  get deck() {
    return this._deck;
  }
}

let deck_ = new Deck();

let deal = new Dealer(deck_.deckList);

//console.log(deal.deck);

export { Dealer };
