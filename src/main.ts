import "./styles/style.scss";
import { cancelPendingTurn, selectCard, showWinner, startGame } from "./game";
import { homeScreen, settingsScreen } from "./screens";
import { pairCounts, themeLabels } from "./types";
import type { BoardSize, Player, Settings, Theme } from "./types";

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("The app container could not be found.");
}
const root: HTMLElement = app;

let settings: Settings | undefined;

function currentSettings(): Settings {
  if (!settings) {
    throw new Error("Game settings have not been selected.");
  }
  return settings;
}

function showHome(): void {
  cancelPendingTurn();
  root.innerHTML = homeScreen();
}

function showSettings(): void {
  cancelPendingTurn();
  settings = undefined;
  root.innerHTML = settingsScreen();
}

function readSettings(form: HTMLFormElement): {
  player: Player | null;
  size: BoardSize | null;
  theme: Theme | null;
} {
  const data = new FormData(form);
  const player = data.get("player");
  const size = data.get("size");
  const theme = data.get("theme");

  if ((player !== null && player !== "blue" && player !== "orange")
    || (size !== null && size !== "4x4" && size !== "4x6" && size !== "6x6")
    || (theme !== null && theme !== "code" && theme !== "games" && theme !== "projects" && theme !== "food")) {
    throw new Error("Invalid game settings.");
  }

  return { player, size, theme };
}

function updateSettingsPreview(form: HTMLFormElement): void {
  const selection = readSettings(form);
  const preview = form.querySelector<HTMLImageElement>("#theme-preview");
  const placeholder = form.querySelector<HTMLElement>("#theme-placeholder");
  const themeSummary = form.querySelector<HTMLElement>("#summary-theme");
  const playerSummary = form.querySelector<HTMLElement>("#summary-player");
  const sizeSummary = form.querySelector<HTMLElement>("#summary-size");
  const startButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  if (!preview || !placeholder || !themeSummary || !playerSummary || !sizeSummary || !startButton) {
    throw new Error("The settings preview could not be found.");
  }

  if (selection.theme) {
    preview.src = `./theme-previews/${selection.theme}.png`;
    preview.alt = `Vorschau: ${themeLabels[selection.theme]}`;
    preview.hidden = false;
    placeholder.hidden = true;
  }
  themeSummary.textContent = selection.theme ? themeLabels[selection.theme] : "Thema wählen";
  playerSummary.textContent = selection.player ? (selection.player === "blue" ? "Blau" : "Orange") : "Spieler wählen";
  sizeSummary.textContent = selection.size ? `${pairCounts[selection.size] * 2} Karten` : "Größe wählen";
  startButton.disabled = !selection.theme || !selection.player || !selection.size;
}

root.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>("button");
  if (!button || !root.contains(button)) return;

  if (button.dataset.action === "home") showHome();
  else if (button.dataset.action === "settings") showSettings();
  else if (button.dataset.action === "restart") startGame(root, currentSettings());
  else if (button.dataset.action === "winner") showWinner(root, currentSettings());
  else if (button.dataset.card !== undefined) selectCard(root, button, currentSettings());
});

root.addEventListener("change", event => {
  if (event.target instanceof HTMLInputElement && event.target.form?.id === "settings-form") {
    updateSettingsPreview(event.target.form);
  }
});

root.addEventListener("submit", event => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "settings-form") return;
  event.preventDefault();
  const selection = readSettings(event.target);
  if (!selection.player || !selection.size || !selection.theme) {
    throw new Error("Choose a theme, player and board size before starting.");
  }
  settings = { player: selection.player, size: selection.size, theme: selection.theme };
  startGame(root, settings);
});

showHome();
