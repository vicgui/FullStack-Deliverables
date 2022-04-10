class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
  get cardSuitRank() {
    return `${this.rank} of ${this.suit}`;
  }
}

export { Card };
