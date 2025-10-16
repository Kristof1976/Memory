"use strict";
import UI from "./ui.js";
import Game from "./game.js";
import GameManager from "./gameManager.js";

// afbeeldingen: gebruik de beschikbare afbeeldingen in img/ (0.png, 1.png, 2.png, ...)
const IMAGE_PATHS = Array.from(
  { length: 32 },
  (_, i) => `img/${i}.png`
);

const ui = new UI("#app");
const gameManager = new GameManager();
const game = new Game(ui, () => IMAGE_PATHS, gameManager);

// DOM controls
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const continueBtn = document.getElementById("continue");

// Stats are now managed by UI class

// Initialize UI
updateStatsUI();
checkContinueOption();

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

