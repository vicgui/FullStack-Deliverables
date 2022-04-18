class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.compSuit;
    this.face;
    this._compString = "";
    this.convertCardToComparable();
    this.visibleToOthers = false;
  }
  get cardSuitRank() {
    return `${this.rank} of ${this.suit} (${this.visibleToOthers})`;
  }
  get compString() {
    return this._compString;
  }
  set visible(v) {
    this.visibleToOthers = v;
  }
  convertCardToComparable() {
    if (this.suit == "clubs") {
      this.compSuit = "C";
    } else if (this.suit == "hearts") {
      this.compSuit = "H";
    } else if (this.suit == "spades") {
      this.compSuit = "S";
    } else if (this.suit == "diamonds") {
      this.compSuit = "D";
    } else {
      this.compSuit = "";
    }
    if (this.rank == "10") {
      this.face = "T";
    } else {
      this.face = this.rank;
    }
    this._compString = this.face + this.compSuit;
  }
  getComparableCard() {
    this.convertCardToComparable();
    return this.face + this.compSuit;
  }
}
/* 
let c = new Card("clubs", "2");
console.log(c.compString);
 */
export { Card };
