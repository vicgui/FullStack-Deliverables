import { Card } from "./card.js";

class Deck {
  constructor() {
    this.numberOfCards = 52;
    this.suits = ["clubs", "hearts", "spades", "diamonds"];
    this.ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    this.deck = [];
    this.createDeck();
  }
  createDeck() {
    for (let suit of this.suits) {
      for (let rank of this.ranks) {
        let card = new Card(suit, rank);
        this.deck.push(card);
      }
    }
  }

  get deckList() {
    return this.deck;
  }
}

let deck = new Deck();
deck.createDeck();

export { Deck };
