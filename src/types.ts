export type Player = "blue" | "orange";
export type Theme = "code" | "games" | "projects" | "food";
export type BoardSize = "4x4" | "4x6" | "6x6";

export interface Card {
  id: number;
  image: number;
  matched: boolean;
}

export interface Settings {
  player: Player;
  size: BoardSize;
  theme: Theme;
}

export const pairCounts: Record<BoardSize, number> = {
  "4x4": 8,
  "4x6": 12,
  "6x6": 18,
};

export const themeLabels: Record<Theme, string> = {
  code: "Code-Vibes-Thema",
  games: "Gaming-Thema",
  projects: "DA-Projekte-Thema",
  food: "Thema Lebensmittel",
};
