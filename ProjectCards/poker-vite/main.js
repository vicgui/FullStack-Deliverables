//import "./style.css";
import { Player } from "./modules/player.js";
import { Deck } from "./modules/deck.js";
import { Dealer } from "./modules/dealer.js";
//import * as readline from 'node:readline/promises';
import readline from "readline-promise";

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

class Poker {
  constructor(numPlayers, coinsPlayer, bigBlind, smallBlind) {
    this.numPlayers = numPlayers;
    this.playersStatus = [];
    this.coinsPlayer = coinsPlayer;
    this.listPlayers = [];
    this._bigBlind = bigBlind;
    this._smallBlind = smallBlind;
    this._deck = new Deck();
    this.dealer = new Dealer(this._deck.deckList);
    this.createPlayers();
    this.coinsOnTable = 0;
  }
  createPlayers() {
    for (let p = 0; p < this.numPlayers; p++) {
      let player = new Player("Player" + p, this.coinsPlayer);
      if (p == 0) {
        player.dealer = true;
      }
      this.listPlayers.push(player);
    }
  }
  coinsEnough(toPay, pCoins) {
    return toPay < pCoins;
  }

  giveTwoCards() {
    console.log("########## Deal the cards ##########");
    for (let pl of this.listPlayers) {
      let c1 = this._deck.deckList.pop();
      let c2 = this._deck.deckList.pop();
      let cards = [c1, c2];
      pl.get2Cards(cards);
      console.log(`${cards.length} cards added to ${pl.name}`);
      console.log(`${this._deck.deckList.length} cards left in the deck`);
    }
  }

  getPlayersStatus() {
    this.playersStatus = this.listPlayers.map(function (player) {
      return player.playerStatus;
    });
  }

  payBlinds() {
    let indexDealer = this.listPlayers.findIndex((player) => {
      return player.dealer === true;
    });

    let bigBlindIndex = this.getNextPlayerIndex(indexDealer);
    let smallBlindIndex = this.getNextPlayerIndex(bigBlindIndex);
    for (let p of this.listPlayers) {
      let blindToPay = 0;
      if (this.listPlayers.indexOf(p) == bigBlindIndex) {
        blindToPay = this._bigBlind;
      } else if (this.listPlayers.indexOf(p) == smallBlindIndex) {
        blindToPay = this._smallBlind;
      } else {
        blindToPay = 0;
      }

      if (!this.coinsEnough(blindToPay, p.coins)) {
        let index = this.listPlayers.indexOf(p);
        delete this.listPlayers[index];
        console.log(`Player: ${p.name} has no coins to continue. Eliminated`);
      } else {
        p.setCoins = p.coins - blindToPay;
        p.betCoins = p.getBetCoins + blindToPay;
        this.coinsOnTable += blindToPay;
      }
    }
  }

  startPreFlop() {
    let indexDealer = this.listPlayers.findIndex((player) => {
      return player.dealer === true;
    });

    let maxRounds = 2;
    let round = 1;

    while (round <= maxRounds) {
      let firstToBet = this.getNextPlayerIndex(indexDealer);
    }
  }

  getNextPlayerIndex(index) {
    if (index == this.listPlayers.length - 1) {
      return 0;
    } else {
      return index + 1;
    }
  }

  get players() {
    this.getPlayersStatus();
    return this.playersStatus;
  }
  get status() {
    return [this.players, `Coins on the table: ${this.coinsTable}`];
  }

  get coinsTable() {
    return this.coinsOnTable;
  }

  get listOfPlayers() {
    return this.listPlayers;
  }
  get deck() {
    return this._deck.deckList.map(function (card) {
      return card.cardSuitRank;
    });
  }
}

let poker = new Poker(3, 100, 10, 5);

console.log("Initial Status:");
console.log(poker.status);

poker.payBlinds();

console.log("After paying blinds");
console.log(poker.status);

poker.giveTwoCards();
console.log(poker.status);

/* 

document.querySelector("#app").innerHTML = `
  <h1>Hello ${p.name}!</h1>
  <h2>Cards</h2>
  <p>${cardsNames}</p>
  <h2>Players</h2>
  <p>${playersStatus}</p>
  <h2>Deck</h2>
  <p>${deck_poker}</p>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
 */
