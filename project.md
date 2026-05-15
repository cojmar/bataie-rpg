# Bataie RPG

A **browser‑only** role‑playing game that lets you choose a character, pick an environment, and fight enemies. The whole game is contained in a single `index.html` file, with inline CSS and vanilla JavaScript for rendering, animation, and simple combat logic.

## Features

- **Environment selection** – Forest, Castle, Volcano, Beach, Tundra, Swamp.
- **Class selection** – Warrior, Mage, Archer, Magic Gladiator.
- **Dynamic preview** – Canvas draws a stylised character and stats for the selected class.
- **Combat** – Start a fight, choose skills, see damage, counter‑attack, and rewards.
- **Responsive UI** – Works on desktop and mobile thanks to media queries.
- **Simple local storage** – Game state is kept in the page’s variables; no server‑side code.

## How to Run

1. Open `index.html` in a modern browser (Chrome, Edge, or Firefox). The game runs automatically.
2. Optionally, run the simple HTTP server by executing `node server.js`. The server serves `index.html` on port 3000.

## Project Structure

```
index.html          – Main file containing all code
```

All styles and scripts are inline. The JavaScript handles:
- Environment rendering (particles, animated scenes).
- Class carousel logic.
- Combat API calls (stubbed in `/api/*`).
- UI updates and animations.

## Extending the Game

- **Add new environments** – Add a new case in `drawEnvironment()` and new particle logic.
- **Add new classes** – Add new `<div class="carousel-slide">` with stats/skills.
- **Add new stats** – Update `classData` in `updatePreview()`.
- **Backend API** – The game currently uses placeholder endpoints (`/api/start`, `/api/attack`). Implement a server to persist battles, enemies, rewards.

## Notes

- No external dependencies – all code is vanilla JS and CSS.
- The project is intentionally lightweight for educational use.

## Author

- **[cojmar]** – original author and maintainer.

---

*Feel free to fork and improve.*

