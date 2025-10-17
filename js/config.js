// Level configuraties voor progressive difficulty
export const LEVEL_CONFIG = [
  { level: 1, width: 2, height: 2, name: "Novice" },
  { level: 2, width: 3, height: 2, name: "Easy" },
  { level: 3, width: 4, height: 2, name: "Getting Started" },
  { level: 4, width: 2, height: 3, name: "Rectangle" }, 
  { level: 5, width: 4, height: 3, name: "Medium" },
  { level: 6, width: 4, height: 4, name: "Standard" },
  { level: 7, width: 5, height: 4, name: "Advanced" },
  { level: 8, width: 6, height: 4, name: "Challenge" },
  { level: 9, width: 6, height: 6, name: "Expert" },
  { level: 10, width: 8, height: 6, name: "Master" },
  { level: 11, width: 8, height: 8, name: "Legend" }
];

export const SCORING = {
  BASE_POINTS: 10,        // Kleine basis beloning
  LEVEL_MULTIPLIER: 15,   // Hoofdpunten komen van level
  TIME_BONUS_MAX: 100,    // Snelheidsbonus
  STREAK_BONUS: 10,       // Match streak bonus
  PENALTY_PER_MOVE: 2     // Punten verlies per extra move
};

export const GAME_RULES = {
  MOVES_MULTIPLIER: 2.5,  // Perfect moves × deze waarde
  LEVEL_BONUS_MOVES: 2,   // Extra moves per level
  WARNING_THRESHOLD: 0.8  // Waarschuwing bij 80% moves gebruikt
};

export default {
  LEVEL_CONFIG,
  SCORING,
  GAME_RULES
};