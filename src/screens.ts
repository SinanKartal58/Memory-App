import { pairCounts, themeLabels } from "./types";
import type { BoardSize, Card, Player, Settings, Theme } from "./types";

const controller = `
  <svg viewBox="0 0 96 64" fill="none" aria-hidden="true">
    <path d="M25 14h46c8 0 13 5 15 13l5 20c2 8-7 13-13 8L65 45H31L18 55c-6 5-15 0-13-8l5-20c2-8 7-13 15-13Z" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>
    <path d="M27 25v15M19.5 32.5h15" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    <circle cx="65" cy="27" r="4" fill="currentColor"/><circle cx="75" cy="36" r="4" fill="currentColor"/>
  </svg>`;

const playerIcon = `
  <svg viewBox="0 0 24 28" fill="none" aria-hidden="true">
    <circle cx="12" cy="5.5" r="3.5" stroke="currentColor" stroke-width="2.5"/>
    <path d="M10 9.5h4l1.5 4 4.5 7.5c1 1.8 0 4-2 4H6c-2 0-3-2.2-2-4l4.5-7.5 1.5-4Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`;

const exitIcon = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 4H5v16h7M10 12h11m-4-4 4 4-4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

export function homeScreen(): string {
  return `
    <main class="home">
      <div class="home__controller">${controller}</div>
      <div class="home__content">
        <p>It's play time.</p>
        <h1>Ready to play?</h1>
        <button class="button button--primary" data-action="settings">
          <span class="button__icon">${controller}</span> Play <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>`;
}

export function settingsScreen(): string {
  const themes: Theme[] = ["code", "games", "projects", "food"];
  const sizes: BoardSize[] = ["4x4", "4x6", "6x6"];

  return `
    <main class="settings">
      <div class="settings__content">
        <button class="back-button" data-action="home">← Zurück</button>
        <h1>Einstellungen</h1>
        <form id="settings-form">
          <div class="settings__choices">
            <fieldset>
              <legend><span class="settings__icon settings__icon--theme" aria-hidden="true">♧</span> Spielthemen</legend>
              <div class="options">
                ${themes.map(theme => `
                  <label class="option"><input type="radio" name="theme" value="${theme}" required><span>${themeLabels[theme]}</span></label>`).join("")}
              </div>
            </fieldset>
            <fieldset>
              <legend><span class="settings__icon settings__icon--player" aria-hidden="true">♙</span> Spieler auswählen</legend>
              <div class="options">
                <label class="option"><input type="radio" name="player" value="blue" required><span>Blau</span></label>
                <label class="option"><input type="radio" name="player" value="orange" required><span>Orange</span></label>
              </div>
            </fieldset>
            <fieldset>
              <legend><span class="settings__icon settings__icon--size" aria-hidden="true">▱</span> Spielfeldgröße</legend>
              <div class="options">
                ${sizes.map(size => `
                  <label class="option"><input type="radio" name="size" value="${size}" required><span>${pairCounts[size] * 2} Karten <small>(${size.replace("x", " × ")})</small></span></label>`).join("")}
              </div>
            </fieldset>
          </div>
          <div class="settings__visual">
            <div id="theme-placeholder" class="theme-preview theme-preview--placeholder">Bitte Spielthema auswählen</div>
            <img id="theme-preview" class="theme-preview" alt="" hidden>
            <div class="settings-summary" aria-live="polite">
              <span id="summary-theme">Thema wählen</span>
              <span id="summary-player">Spieler wählen</span>
              <span id="summary-size">Größe wählen</span>
              <button class="button button--primary" type="submit" disabled>▷ Start</button>
            </div>
          </div>
        </form>
      </div>
    </main>`;
}

export function gameScreen(settings: Settings, cards: Card[]): string {
  return `
    <main class="game game--${settings.theme}">
      <div class="game__inner">
        <header class="scoreboard" aria-label="Spielstand">
          <div class="scores" aria-label="Punktestand">
            <span class="score score--blue"><span class="score__icon">${playerIcon}</span><span class="score__name">Blau</span><strong id="score-blue">0</strong></span>
            <span class="score score--orange"><span class="score__icon">${playerIcon}</span><span class="score__name">Orange</span><strong id="score-orange">0</strong></span>
          </div>
          <p class="current-player" aria-live="polite">Aktueller Spieler: <span id="current-player" class="current-player__badge">${playerIcon}<span class="visually-hidden" id="current-player-label"></span></span></p>
          <button class="exit-button" data-action="settings"><span class="exit-button__icon">${exitIcon}</span><span>Spiel beenden</span></button>
        </header>
        <p class="game__hint">Find the matching pairs</p>
        <div class="board board--${settings.size}" aria-label="Memory cards">
          ${cards.map((card, index) => `
            <button type="button" class="card" data-card="${card.id}" aria-label="Card ${index + 1}, face down">
              <span class="card__inner">
                <span class="card__back">${settings.theme === "code" ? '<img src="./cards/code/01.png" alt="">' : '<span aria-hidden="true">&lt;/&gt;</span>'}</span>
                <span class="card__face"><img src="./cards/${settings.theme}/${String(card.image).padStart(2, "0")}.png" alt=""></span>
              </span>
            </button>`).join("")}
        </div>
      </div>
    </main>`;
}

export function gameOverScreen(theme: Theme, scores: Record<Player, number>): string {
  return `
    <main class="result result--${theme} result--game-over">
      <section class="result__content" aria-labelledby="game-over-title">
        <h1 id="game-over-title">Game over</h1>
        <p>Blue: ${scores.blue} &nbsp; · &nbsp; Orange: ${scores.orange}</p>
        <button class="result__button" data-action="winner">Ergebnis anzeigen →</button>
      </section>
    </main>`;
}

export function winnerScreen(theme: Theme, scores: Record<Player, number>): string {
  const isDraw = scores.blue === scores.orange;
  const winner: Player = scores.blue > scores.orange ? "blue" : "orange";
  const title = isDraw ? "Draw" : `${winner === "blue" ? "Blue" : "Orange"} Player`;
  const symbol = isDraw ? "⚖" : theme === "games" ? "🏆" : "♙";

  return `
    <main class="result result--${theme} result--winner ${isDraw ? "result--draw" : ""}">
      <section class="result__content" aria-labelledby="winner-title">
        <p>${isDraw ? "It's a" : "The winner is"}</p>
        <h1 id="winner-title" class="${isDraw ? "" : `text--${winner}`}">${title}</h1>
        <div class="result__symbol ${isDraw ? "" : `text--${winner}`}" aria-hidden="true">${symbol}</div>
        <p>Blue: ${scores.blue} &nbsp; · &nbsp; Orange: ${scores.orange}</p>
        <div class="result__actions">
          <button class="result__button" data-action="restart">Play again</button>
          <button class="result__button result__button--secondary" data-action="settings">Settings</button>
        </div>
      </section>
    </main>`;
}
