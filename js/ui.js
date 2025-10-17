export default class UI {
  constructor(rootSelector = "#app") {
    this.root = document.querySelector(rootSelector);
    this.boardEl = this.root.querySelector("#board");

    // stats elements
    this.currentLevelEl = document.querySelector("#current-level");
    this.maxLevelEl = document.querySelector("#max-level");
    this.currentScoreEl = document.querySelector("#current-score");
    this.totalScoreEl = document.querySelector("#total-score");
    this.movesCountEl = document.querySelector("#moves-count");
    this.gridSizeEl = document.querySelector("#grid-size");

    // overlay elements
    this.overlay = document.querySelector("#overlay");
    this.overlayMessage = document.querySelector("#overlay-message");
    this.overlayContinue = document.querySelector("#overlay-continue");
    this.overlayStop = document.querySelector("#overlay-stop");
  }

  renderBoard(cards, columns, rows = null) {
    this.boardEl.style.setProperty("--cols", columns);
    if (rows) {
      this.boardEl.style.setProperty("--rows", rows);
    }

    // clear
    this.boardEl.innerHTML = "";

    cards.forEach((card, idx) => {
      const cell = document.createElement("div");
      cell.className =
        "card" +
        (card.isFlipped ? " flipped" : "") +
        (card.isMatched ? " matched" : "");
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.dataset.index = idx;

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const front = document.createElement("div");
      front.className = "card-face card-front";
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = "Memory afbeelding";

      
      front.appendChild(img);

      const back = document.createElement("div");
      back.className = "card-face card-back";
      const backInner = document.createElement("div");
      backInner.className = "back-inner";
      backInner.textContent = "?";
      back.appendChild(backInner);

      inner.appendChild(front);
      inner.appendChild(back);
      cell.appendChild(inner);

      this.boardEl.appendChild(cell);
    });
  }
  updateCardElement(index, card) {
    const el = this.boardEl.querySelector(`[data-index='${index}']`);
    if (!el) return;
    el.classList.toggle("flipped", card.isFlipped);
    el.classList.toggle("matched", card.isMatched);
  }

  bindCardClick(handler) {
    this.boardEl.addEventListener("click", (e) => {
      const cell = e.target.closest(".card");
      if (!cell) return;
      const idx = Number(cell.dataset.index);
      handler(idx);
    });

    // keyboard support
    this.boardEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const cell = e.target.closest(".card");
        if (!cell) return;
        e.preventDefault();
        const idx = Number(cell.dataset.index);
        handler(idx);
      }
    });
  }

  showMismatchOptions(onContinue, onStop) {
    // Delay the popup to give players time to memorize card positions
    setTimeout(() => {
      this.overlayMessage.textContent = "No match — Try again:";
      this.overlay.classList.remove("hidden");
      this.overlay.classList.add("mismatch-overlay");

      // temporarily disable rest of page interactions
      this.overlayContinue.disabled = false;
      this.overlayStop.disabled = false;

      const { overlayContinue, overlayStop } = this;

      const cont = () => {
        overlayContinue.removeEventListener("click", cont);
        overlayStop.removeEventListener("click", stop);
        this.overlay.classList.add("hidden");
        this.overlay.classList.remove("mismatch-overlay");
        onContinue();
      };
      const stop = () => {
        overlayContinue.removeEventListener("click", cont);
        overlayStop.removeEventListener("click", stop);
        this.overlay.classList.add("hidden");
        this.overlay.classList.remove("mismatch-overlay");
        onStop();
      };

      overlayContinue.addEventListener("click", cont);
      overlayStop.addEventListener("click", stop);
    }, 1500); // 1.5 second delay to see and memorize cards
  }

  showLevelComplete(levelStats, onNext) {
    const message = `🎉 Level ${levelStats.level} Complete!\n\n` +
      `Score: ${levelStats.score} points\n` +
      `Time: ${levelStats.time} seconds\n` +
      `Moves: ${levelStats.moves}\n\n` +
      (levelStats.canAdvance ? "Go to the next level!" : "All levels complete!");
      
    this.overlayMessage.textContent = message;
    this.overlayContinue.textContent = levelStats.canAdvance ? "Next Level" : "Game Complete";
    this.overlay.classList.remove("hidden");
    this.overlayStop.classList.add("hidden");

    const cont = () => {
      this.overlay.classList.add("hidden");
      this.overlayContinue.removeEventListener("click", cont);
      this.overlayStop.classList.remove("hidden");
      this.overlayContinue.textContent = "Continue";
      onNext?.();
    };
    this.overlayContinue.addEventListener("click", cont);
  }

  showGameComplete(finalStats) {
    const message = `🏆 Congratulations! 🏆\n\n` +
      `You have completed ${finalStats.level} levels!\n\n` +
      `Total Score: ${finalStats.totalScore} score\n` +
      `Last Level Score: ${finalStats.score} score\n\n` +
      `You are the Memory Master!`;
      
    this.overlayMessage.textContent = message;
    this.overlayContinue.textContent = "New Game";
    this.overlay.classList.remove("hidden");
    this.overlayStop.classList.add("hidden");

    const cont = () => {
      this.overlay.classList.add("hidden");
      this.overlayContinue.removeEventListener("click", cont);
      this.overlayStop.classList.remove("hidden");
      this.overlayContinue.textContent = "Continue";
      // Reset game
      location.reload();
    };
    this.overlayContinue.addEventListener("click", cont);
  }

  showGameOver(stats, onRestart) {
    const message = `💀 GAME OVER! 💀\n\n` +
      `No more moves!\n\n` +
      `Level: ${stats.level}\n` +
      `Score: ${stats.score} score\n` +
      `Moves used: ${stats.moves}/${stats.maxMoves}\n\n` +
      `Try again!`;
      
    this.overlayMessage.textContent = message;
    this.overlayContinue.textContent = "Try again";
    this.overlay.classList.remove("hidden");
    this.overlayStop.classList.add("hidden");

    const restart = () => {
      this.overlay.classList.add("hidden");
      this.overlayContinue.removeEventListener("click", restart);
      this.overlayStop.classList.remove("hidden");
      this.overlayContinue.textContent = "Continue";
      onRestart?.();
    };
    this.overlayContinue.addEventListener("click", restart);
  }

  updateStats(stats) {
    this.currentLevelEl.textContent = stats.level;
    this.maxLevelEl.textContent = stats.maxLevel;
    this.currentScoreEl.textContent = stats.score;
    this.totalScoreEl.textContent = stats.totalScore;
    this.movesCountEl.textContent = `${stats.moves}/${stats.maxMoves}`;
    this.gridSizeEl.textContent = stats.gridSize;
    
    // Warning styling bij weinig moves
    if (stats.isWarning) {
      this.movesCountEl.classList.add('warning');
    } else {
      this.movesCountEl.classList.remove('warning');
    }
  }
}
