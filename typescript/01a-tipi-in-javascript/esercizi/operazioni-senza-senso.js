// Obiettivo: vedere se node segnala un errore su tre righe valide in JavaScript
// ma con risultati strani (proprietà scritta male, divisione per un array, confronto tra stringa e numero).

const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
console.log(area);
console.log(4 / []);
console.log("" == 0);
