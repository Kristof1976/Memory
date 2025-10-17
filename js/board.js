import Card from "./card.js";

export default class Board {
  constructor(width, height, images = []) {
    this.width = width;
    this.height = height;
    this.count = width * height;

    // Check voor paren (even number of cards)
    if (this.count % 2 !== 0) {
      throw new Error(`Board size ${width}×${height} results in odd number of cards (${this.count}). Cannot create pairs.`);
    }
    
    this.images = images;
    this.cards = this.#createShuffledCards();
  }

  #createShuffledCards() {
    const pairsNeeded = this.count / 2;
    if (this.images.length < pairsNeeded) {
      throw new Error("Not enough images provided for the board size");
    }

    const selected = this.images.slice(0, pairsNeeded);
    const pairs = [];
    selected.forEach((img, index) => {
      pairs.push(new Card(`${index}-A`, index, img));
      pairs.push(new Card(`${index}-B`, index, img));
    });

    // shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs;
  }

  allMatched() {
    return this.cards.every((c) => c.isMatched);
  }
}
