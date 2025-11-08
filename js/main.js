"use strict";
import UI from "./ui.js";
import Game from "./game.js";
import GameManager from "./gameManager.js";


// Thema-afbeeldingen
const EMOJI_IMAGES = [
  "img/emojis/0.png", "img/emojis/1.png", "img/emojis/2.png", "img/emojis/3.png", "img/emojis/4.png", "img/emojis/5.png", "img/emojis/6.png", "img/emojis/7.png", "img/emojis/8.png", "img/emojis/9.png", "img/emojis/10.png", "img/emojis/11.png", "img/emojis/12.png", "img/emojis/13.png", "img/emojis/14.png", "img/emojis/15.png", "img/emojis/16.png", "img/emojis/17.png", "img/emojis/18.png", "img/emojis/19.png", "img/emojis/20.png", "img/emojis/21.png", "img/emojis/22.png", "img/emojis/23.png", "img/emojis/24.png", "img/emojis/25.png", "img/emojis/26.png", "img/emojis/27.png", "img/emojis/28.png", "img/emojis/29.png", "img/emojis/30.png", "img/emojis/31.png"
];

const ANIMAL_IMAGES = [
  "img/animals/Ant.png", "img/animals/Badger.png", "img/animals/Bat.png", "img/animals/Bear.png", "img/animals/Bison.png", "img/animals/Butterfly.png", "img/animals/Camel.png", "img/animals/Cat.png", "img/animals/Caterpillar.png", "img/animals/Cow.png", "img/animals/Crab.png", "img/animals/Dog.png", "img/animals/Dolphin.png", "img/animals/Elephant.png", "img/animals/Flamingo.png", "img/animals/Fly.png", "img/animals/Fox.png", "img/animals/Goat.png", "img/animals/Gorilla.png", "img/animals/Horse.png", "img/animals/Jellyfish.png", "img/animals/Kangeroo.png", "img/animals/Lobster.png", "img/animals/Monkey.png", "img/animals/Monkey_face.png", "img/animals/Panda.png", "img/animals/Peacock.png", "img/animals/Penguin.png", "img/animals/Pig.png", "img/animals/Pows.png", "img/animals/Rabbit.png", "img/animals/Ram.png", "img/animals/Rat.png", "img/animals/Rhino.png", "img/animals/Rooster.png", "img/animals/Seal.png", "img/animals/Shark.png", "img/animals/Snale.png", "img/animals/Spider.png", "img/animals/Squirel.png", "img/animals/Tiger.png", "img/animals/Tropical_fish.png", "img/animals/Turtle.png", "img/animals/Water Buffalo.png", "img/animals/Whale.png", "img/animals/Wolf.png"
];

// Huidig thema (default emojis)
let currentTheme = "emojis";


function getRandomImages(themeArray, count) {
  // Shuffle en neem 'count' unieke afbeeldingen
  const arr = [...themeArray];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function getThemeImages() {
  // Bepaal aantal benodigde afbeeldingen voor huidig level
  const config = gameManager.getCurrentLevelConfig();
  const totalCards = config.width * config.height;
  const pairs = totalCards / 2;
  const themeArray = currentTheme === "animals" ? ANIMAL_IMAGES : EMOJI_IMAGES;
  return getRandomImages(themeArray, pairs);
}

const ui = new UI("#app");
const gameManager = new GameManager();
const game = new Game(ui, getThemeImages, gameManager);

// DOM controls
const themeSelect = document.getElementById("theme-select");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const continueBtn = document.getElementById("continue");
const stopBtn = document.getElementById("stop");

// Stats are now managed by UI class

// Initialize UI
updateStatsUI();
checkContinueOption();

// Thema selecteren
if (themeSelect) {
  themeSelect.addEventListener("change", (e) => {
    currentTheme = e.target.value;
    // Optioneel: direct nieuw level starten bij wisselen
    // const config = gameManager.getCurrentLevelConfig();
    // game.startLevel(config.width, config.height);
  });
}

stopBtn.addEventListener("click", () => {
  // Stop het spel: zet isPlaying op false, vergrendel het bord
  game.endGame();
  updateButtonStates();
  // Optioneel: toon een melding dat het spel gestopt is
  alert("Spel gestopt. Je kunt een nieuw level starten of verder gaan.");
});
startBtn.addEventListener("click", () => {
  const config = gameManager.getCurrentLevelConfig();
  game.startLevel(config.width, config.height);
  updateButtonStates();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Nieuw spel starten? Je huidige voortgang gaat verloren.")) {
    gameManager.resetGame();
    updateStatsUI();
    checkContinueOption();
    // Auto-start het eerste level
    const config = gameManager.getCurrentLevelConfig();
    game.startLevel(config.width, config.height);
    updateButtonStates();
  }
});

continueBtn.addEventListener("click", () => {
  const config = gameManager.getCurrentLevelConfig();
  game.startLevel(config.width, config.height);
  updateButtonStates();
});

// Game event handlers
game.onLevelComplete = (levelStats) => {
  ui.showLevelComplete(levelStats, () => {
    if (gameManager.canAdvanceLevel()) {
      gameManager.advanceLevel();
      updateStatsUI();
      // Auto-start next level
      const config = gameManager.getCurrentLevelConfig();
      game.startLevel(config.width, config.height);
    } else {
      // Game completed!
      ui.showGameComplete(levelStats);
    }
  });
};

function updateStatsUI() {
  const stats = gameManager.getStats();
  ui.updateStats(stats);
}

function updateButtonStates() {
  startBtn.textContent = "Herstart Level";
  continueBtn.classList.add("hidden");
}

function checkContinueOption() {
  const stats = gameManager.getStats();
  if (stats.level > 1 || stats.totalScore > 0) {
    continueBtn.classList.remove("hidden");
    continueBtn.classList.add("show-inline");
    startBtn.textContent = "Start Level " + stats.level;
  }
}

// Update stats during gameplay and check for game over
setInterval(() => {
  if (game.isPlaying) {
    updateStatsUI();
    
    // Check if game over (no moves left)
    if (gameManager.isGameOver && gameManager.isGameOver()) {
      game.endGame(); // End the current game
      const stats = gameManager.getStats();
      ui.showGameOver(stats, () => {
        // Restart current level
        const config = gameManager.getCurrentLevelConfig();
        game.startLevel(config.width, config.height);
      });
    }
  }
}, 1000);

