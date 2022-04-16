//import "./style.css";
import { Player } from "./modules/player.js";
import { Deck } from "./modules/deck.js";
import { Dealer } from "./modules/dealer.js";
import { getHandRank } from "./modules/cardsComparison.js";
import readlineSync from "readline-sync";

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
    this._cardsOnTable = [];
    this._listOfBets = [];
  }
  setListOfBets() {
    let listBets = [];
    for (let p of this.listPlayers) {
      listBets.push(p.getBetCoins);
    }
    this._listOfBets = listBets;
  }
  get listOfBets() {
    this.setListOfBets();
    return this._listOfBets;
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
    console.log(this.status);
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
    console.log("####### AFTER BLINDS #######");
    console.log(this.status);
  }

  getMaximumBetInTable() {
    let playerBets = [];
    for (let p of this.listPlayers) {
      playerBets.push(p.getBetCoins);
    }
    return Math.max(...playerBets);
  }

  askForDecision(player) {
    let playerDecision = readlineSync.question(
      `Give ${player.name} decision: `
    );
    console.log(`${player.name} decision: ${playerDecision}`);
    let quantityToBet = 0;

    if (playerDecision == "bet") {
      quantityToBet = readlineSync.question(`Quantity to bet: `);
      if (!this.coinsEnough(parseInt(quantityToBet), player.coins)) {
        console.log("No coins enough to bet");
      } else {
        eval("player." + playerDecision + "(" + quantityToBet + ")");
        this.coinsOnTable += parseInt(quantityToBet);
      }
    } else if (playerDecision == "call") {
      let maxBetOnTable = this.getMaximumBetInTable();
      quantityToBet = maxBetOnTable - player.getBetCoins;
      console.log(
        `quant to equal ${maxBetOnTable}. player coins: ${player.getBetCoins}`
      );
      let str_ToBet = String(quantityToBet);
      eval("player." + playerDecision + "(" + str_ToBet + ")");
      this.coinsOnTable += quantityToBet;
    } else if (playerDecision == "check") {
      let maxBetOnTable = this.getMaximumBetInTable();
      if (maxBetOnTable == player.getBetCoins) {
        eval("player." + playerDecision + "()");
      } else {
        console.log(
          "Can not check, bet coins must be equal to the highest bet on table"
        );
      }
    } else if (playerDecision == "fold") {
      eval("player." + playerDecision + "()");
      const index = this.listPlayers.indexOf(player);
      this.listPlayers.splice(index, 1);
    } else {
      console.log("Invalid decision");
    }
  }

  playRound(firstToBet) {
    let offset = firstToBet;
    for (let i = 0; i < this.listPlayers.length; i++) {
      let pointer = (i + offset) % this.listPlayers.length;
      console.log(`Player to bet: ${this.listPlayers[pointer].name}`);
      this.askForDecision(this.listPlayers[pointer]);
    }
  }

  startPreFlop() {
    let indexbigBlind = this.listPlayers.findIndex((player) => {
      return player.getBetCoins === this._bigBlind;
    });

    let maxRounds = 3;
    let round = 1;

    while (
      !this.listOfBets.every((val, i, arr) => val === arr[0]) ||
      round <= maxRounds
    ) {
      console.log(`ROUND ${round}`);
      let firstToBetIndex = this.getNextPlayerIndex(indexbigBlind);
      this.playRound(firstToBetIndex);
      console.log(this.status);
      round += 1;
    }
    console.log("####### ENDING OF PRE FLOP PHASE #######");
  }
  showCard() {
    let c = this._deck.deckList.pop();
    for (let p of this.listPlayers) {
      p.addCardsToHand(c);
    }
    this._cardsOnTable.push(c);
  }

  startFlop() {
    console.log("####### START FLOP PHASE #######");
    let cardsToShow = 3;
    for (let i = 0; i < cardsToShow; i++) {
      this.showCard();
    }
    let indexDealer = this.listPlayers.findIndex((player) => {
      return player.dealer === true;
    });
    let round = 1;
    const maxRounds = 1;
    while (
      !this.listOfBets.every((val, i, arr) => val === arr[0]) ||
      round <= maxRounds
    ) {
      console.log(`ROUND ${round}`);
      let firstToBetIndex = this.getNextPlayerIndex(indexDealer);
      this.playRound(firstToBetIndex);
      console.log(this.status);
      console.log(this.listOfBets);
      round += 1;
    }
    console.log("####### ENDING OF PRE FLOP PHASE #######");
  }

  startTurn() {
    console.log("####### START TURN PHASE #######");
    let cardsToShow = 1;
    for (let i = 0; i < cardsToShow; i++) {
      this.showCard();
    }
    let indexDealer = this.listPlayers.findIndex((player) => {
      return player.dealer === true;
    });
    let round = 1;
    let maxRounds = 1;
    while (
      !this.listOfBets.every((val, i, arr) => val === arr[0]) ||
      round <= maxRounds
    ) {
      console.log(`ROUND ${round}`);
      let firstToBetIndex = this.getNextPlayerIndex(indexDealer);
      this.playRound(firstToBetIndex);
      console.log(this.status);
      round += 1;
    }
  }

  startRiver() {
    console.log("####### START RIVER PHASE #######");
    let cardsToShow = 1;
    for (let i = 0; i < cardsToShow; i++) {
      this.showCard();
    }
    let indexDealer = this.listPlayers.findIndex((player) => {
      return player.dealer === true;
    });
    let round = 0;

    while (
      round < 1 ||
      (round >= 1 && this.listOfBets.every((val, i, arr) => val != arr[0]))
    ) {
      console.log(`ROUND ${round}`);
      let firstToBetIndex = this.getNextPlayerIndex(indexDealer);
      this.playRound(firstToBetIndex);
      console.log(this.status);
      round += 1;
    }
  }
  showDown() {
    let listRanks = [];
    for (let p of this.listPlayers) {
      console.log(p.compareHand);
      const rank = getHandRank(p.compareHand);
      p.handRank = rank;
      listRanks.push(rank);
    }
    console.log(listRanks);
    const minRank = Math.min(...listRanks);
    const winnerIndex = this.listPlayers.findIndex((player) => {
      return player.getHandRank === minRank;
    });
    console.log(
      `Winner is ${this.listPlayers[winnerIndex].name}, with rank ${minRank}`
    );
  }

  start() {
    this.payBlinds();

    this.giveTwoCards();

    this.startPreFlop();

    this.startFlop();

    this.startTurn();

    this.startRiver();

    this.showDown();
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
    return [
      this.players,
      `Coins on the table: ${this.coinsTable}, Cards on table: ${this.cardsOnTableStatus}`,
    ];
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

  get cardsOnTableStatus() {
    return this._cardsOnTable.map(function (card) {
      return card.cardSuitRank;
    });
  }
}

let poker = new Poker(3, 100, 10, 5);
poker.start();

/* 

console.log("Initial Status:");
console.log(poker.status);

poker.payBlinds();

console.log("After paying blinds");
console.log(poker.status);

poker.giveTwoCards();
console.log(poker.status);

poker.startPreFlop();

poker.startFlop();

poker.startTurn();

poker.startRiver();

poker.showDown();

 */

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
