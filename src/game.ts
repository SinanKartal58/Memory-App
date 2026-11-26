import { gameOverScreen, gameScreen, winnerScreen } from "./screens";
import { pairCounts } from "./types";
import type { Card, Player, Settings } from "./types";

let cards: Card[] = [];
let currentPlayer: Player = "blue";
let scores: Record<Player, number> = { blue: 0, orange: 0 };
let selectedCards: number[] = [];
let locked = false;
let pendingTurn: ReturnType<typeof setTimeout> | undefined;

export function cancelPendingTurn(): void {
  if (pendingTurn !== undefined) {
    clearTimeout(pendingTurn);
    pendingTurn = undefined;
  }
}

export function startGame(root: HTMLElement, settings: Settings): void {
  cancelPendingTurn();
  currentPlayer = settings.player;
  scores = { blue: 0, orange: 0 };
  selectedCards = [];
  locked = false;

  const images = Array.from({ length: pairCounts[settings.size] }, (_, index) => index + 1);
  cards = [...images, ...images].map((image, id) => ({ id, image, matched: false }));

  for (let index = cards.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    const card = cards[index];
    const otherCard = cards[other];
    if (card && otherCard) {
      cards[index] = otherCard;
      cards[other] = card;
    }
  }

  root.innerHTML = gameScreen(settings, cards);
  updateScoreboard(root);
}

function updateScoreboard(root: HTMLElement): void {
  const blue = root.querySelector<HTMLElement>("#score-blue");
  const orange = root.querySelector<HTMLElement>("#score-orange");
  const current = root.querySelector<HTMLElement>("#current-player");
  const currentLabel = root.querySelector<HTMLElement>("#current-player-label");

  if (!blue || !orange || !current || !currentLabel) {
    throw new Error("The game scoreboard could not be found.");
  }

  blue.textContent = String(scores.blue);
  orange.textContent = String(scores.orange);
  currentLabel.textContent = currentPlayer === "blue" ? "Blau" : "Orange";
  current.className = `current-player__badge current-player__badge--${currentPlayer}`;
}

export function selectCard(root: HTMLElement, button: HTMLButtonElement, settings: Settings): void {
  const card = cards.find(item => item.id === Number(button.dataset.card));
  if (!card || card.matched || locked || selectedCards.includes(card.id)) {
    return;
  }

  selectedCards.push(card.id);
  button.classList.add("is-flipped");
  button.setAttribute("aria-label", `Revealed card, image ${card.image}`);

  if (selectedCards.length !== 2) {
    return;
  }

  const first = cards.find(item => item.id === selectedCards[0]);
  const second = cards.find(item => item.id === selectedCards[1]);
  if (!first || !second) {
    throw new Error("Selected cards could not be found.");
  }

  locked = true;

  if (first.image === second.image) {
    first.matched = true;
    second.matched = true;
    scores[currentPlayer]++;
    updateScoreboard(root);

    pendingTurn = setTimeout(() => {
      selectedCards.forEach(id => {
        const matched = root.querySelector<HTMLButtonElement>(`[data-card="${id}"]`);
        if (matched) {
          matched.classList.add("is-matched");
          matched.disabled = true;
          matched.setAttribute("aria-label", `Matched pair, image ${first.image}`);
        }
      });
      selectedCards = [];
      locked = false;
      pendingTurn = undefined;
      if (cards.every(item => item.matched)) {
        root.innerHTML = gameOverScreen(settings.theme, scores);
        root.querySelector<HTMLButtonElement>(".result__button")?.focus();
      }
    }, 500);
  } else {
    pendingTurn = setTimeout(() => {
      selectedCards.forEach(id => {
        const flipped = root.querySelector<HTMLButtonElement>(`[data-card="${id}"]`);
        if (flipped) {
          flipped.classList.remove("is-flipped");
          flipped.setAttribute("aria-label", "Card, face down");
        }
      });
      selectedCards = [];
      currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
      updateScoreboard(root);
      locked = false;
      pendingTurn = undefined;
    }, 1000);
  }
}

export function showWinner(root: HTMLElement, settings: Settings): void {
  root.innerHTML = winnerScreen(settings.theme, scores);
  root.querySelector<HTMLButtonElement>(".result__button")?.focus();
}
