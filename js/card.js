export default class Card {
  constructor(id, key, imagePath) {
    this.id = id; // unieke kaart id
    this.key = key; // paar sleutel (zelfde voor de 2 identieke kaarten)
    this.image = imagePath; // pad naar afbeelding
    this.isFlipped = false;
    this.isMatched = false;
  }

  flip() {
    if (this.isMatched) return;
    this.isFlipped = !this.isFlipped;
  }
}
