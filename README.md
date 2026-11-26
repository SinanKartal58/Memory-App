# Memory-App

Ein Memory-Spiel für zwei Personen im Browser, entwickelt mit TypeScript, SCSS und Vite.

## Features

- Startseite mit animiertem Controller und Button zu den Einstellungen
- Vier Spielthemen: Code Vibes, Gaming, DA-Projekte und Lebensmittel
- Auswahl des startenden Spielers: Blau oder Orange
- Drei Spielfeldgrößen: 4 × 4, 4 × 6 und 6 × 6
- Animierte Karten, Punktestand und Anzeige des aktuellen Spielers
- Game-over-Anzeige, Gewinner oder Unentschieden und Neustart
- Darstellung für unterschiedliche Bildschirmgrößen

## Nachweise zur Checkliste

- Startseite und Navigation: [src/screens.ts](src/screens.ts), [src/main.ts](src/main.ts), [src/styles/_home.scss](src/styles/_home.scss)
- Einstellungen und Vorschau: [src/screens.ts](src/screens.ts), [src/main.ts](src/main.ts), [src/styles/_settings.scss](src/styles/_settings.scss)
- Spielfeldgrößen und Themen: [src/types.ts](src/types.ts), [src/screens.ts](src/screens.ts), [public/cards/](public/cards/)
- Spielablauf und Punkte: [src/game.ts](src/game.ts)
- Spielfeld und Kartenanimation: [src/screens.ts](src/screens.ts), [src/styles/_game.scss](src/styles/_game.scss)
- Ergebnis und Neustart: [src/game.ts](src/game.ts), [src/screens.ts](src/screens.ts), [src/styles/_result.scss](src/styles/_result.scss)
- Responsive Darstellung: [src/styles/_responsive.scss](src/styles/_responsive.scss)

## Hinweise zum Spiel

- Thema, Spieler und Spielfeldgröße müssen ausgewählt werden, bevor das Spiel startet.
- Bei einem passenden Paar erhält der aktuelle Spieler einen Punkt und bleibt am Zug.
- Bei zwei unterschiedlichen Karten ist der andere Spieler an der Reihe.
- Nach dem Spiel kann mit denselben Einstellungen erneut gespielt oder zu den Einstellungen zurückgekehrt werden.

## Bedienung

1. Auf der Startseite auf „Play“ klicken.
2. Spielthema, startenden Spieler und Spielfeldgröße auswählen und „Start“ drücken.
3. Abwechselnd zwei Karten aufdecken und passende Paare finden.
4. Nach dem Aufdecken aller Paare das Ergebnis anzeigen und bei Bedarf erneut spielen.

## Projektstruktur

- [index.html](index.html): HTML-Einstiegsseite
- [src/main.ts](src/main.ts): Navigation und Einstellungen
- [src/game.ts](src/game.ts): Spiellogik und Punkte
- [src/screens.ts](src/screens.ts): Ansichten der App
- [src/types.ts](src/types.ts): gemeinsame Typen und Einstellungen
- [src/styles/](src/styles/): SCSS-Dateien für die einzelnen Ansichten
- [public/cards/](public/cards/): Kartenbilder nach Thema
- [public/theme-previews/](public/theme-previews/): Vorschaubilder für die Einstellungen

## Lokal starten

Node.js und npm müssen installiert sein. Im Projektordner:

```bash
npm install
npm run dev
```

Danach die im Terminal angezeigte Adresse im Browser öffnen.

Mit `npm run build` wird eine fertige Version im Ordner `dist` erstellt.

## Live-Demo

- https://sinan-kartal.developerakademie.net/Memory/

## GitHub-Repository

- https://github.com/SinanKartal58/Memory-App

## Hinweise

- Dieses Projekt ist ein Lernprojekt der Developer Akademie.
