//ORDER
const order = "23456789TJQKA";

function getHandDetails(hand) {
  //Split into cards
  const cards = hand.split(" ");

  //extract faces
  // Para "A" -> a  77 le resta el indice de A en order (12) que es igual a 65
  //como 65 es el codigo para A, esto crea un string que va de A hacia adelante
  const faces = cards
    .map((a) => String.fromCharCode([77 - order.indexOf(a[0])]))
    .sort();

  const suits = cards.map((a) => a[1]).sort();

  //Identify duplicates
  //First count occurrences of each face
  const counts = {};
  for (let face of faces) {
    counts[face] = counts[face] ? counts[face] + 1 : 1;
  }

  //Secondly count occurrences of each quantity
  const duplicates = {};
  for (const [key, value] of Object.entries(counts)) {
    duplicates[value] = duplicates[value] ? duplicates[value] + 1 : 1;
  }

  //identificamos flush (que todas tengan misma suit)
  const flush = suits[0] === suits[4];

  //identificamos escalera (straight). Todas en secuencia
  const first = faces[0].charCodeAt(0);
  //comprueba que la resta entre el primer carcode y el charcode de todos los demas sea igual al índice.
  //este caso: (65-65===0? true),(66-65===1? true),(69-65===2? false),...
  const straight = faces.every((f, index) => f.charCodeAt(0) - first === index);

  //Create the rank
  // '&&' resolve to the last value if the previous conditions are true.
  //So, a straight flush is the number 1 in the rank. 4 of a kind is the number 2 in the rank...
  let rank =
    (flush && straight && 1) ||
    (duplicates[4] && 2) ||
    (duplicates[3] && duplicates[2] && 3) ||
    (flush && 4) ||
    (straight && 5) ||
    (duplicates[3] && 6) ||
    (duplicates[2] > 1 && 7) ||
    (duplicates[2] && 8) ||
    9;

  return { rank, value: faces.sort(byCountFirst).join("") };

  //if two hands have same rank we need to do the resolution by highest pair (case of duplicate)
  //highest 3 of a kind in full house...
  //we need to sort by count and then by face value.
  //so if we have 3 10s and 2 As, this will return: EEEAA
  function byCountFirst(a, b) {
    const countDiff = counts[b] - counts[a];
    if (countDiff) return countDiff;
    return b > a ? -1 : b === a ? 0 : 1;
  }
}

function compareTwoHands(h1, h2) {
  let d1 = getHandDetails(h1);
  let d2 = getHandDetails(h2);
  if (d1.rank === d2.rank) {
    if (d1.value < d2.value) {
      return "WIN";
    } else if (d1.value > d2.value) {
      return "LOSE";
    } else {
      return "DRAW";
    }
  }
  console.log("rank 1:", d1.rank, ". rank 2: ", d2.rank);
  return d1.rank < d2.rank ? "WIN" : "LOSE";
}

function getHandRank(h) {
  let d = getHandDetails(h);
  return d.rank;
}
/* 
const hand1 = "AH AS TC TD TS";
const hand2 = "AH AS 2C TD TS";
console.log(compareTwoHands(hand1, hand2));
 */
export { compareTwoHands, getHandRank };
