# bataie-rpg

**Bătălie RPG** – Selecție clasă + mediu (HTML+JS, 0 deps, inline)

## ▶ Run
- `index.html` (browser)
- `node server.js` → `http://localhost:3000`

## 📁 Structură
- `index.html` – CSS/JS inline

## 🎮 Funcționalități
- **Medii:** castel, padure, tundră, plajă, câmpie, canion, deșert, groapă
- **Clase:** warrior, mage, archer, magicgladiator (preview + carousel)
- **Caracter:** drawWarrior(), drawMage(), drawArcher(), draw_magic_gladiator()
- **Dinamic:** selectEnvironment(), updatePreview(), updateCarousel()

## 🌲 Forest
- 3 rânduri copaci (back/mid/front) cu stratificare
- 10 niveluri foi (radii = [35..5])
- treeData: poziții fixe între redraw-uri

## 🏰 Medii
- drawCastle(), drawForest(), drawVolcano(), drawBeach(), drawField(), drawCanion()

## 🎨 Stil
- Pixel art, canvas, image-rendering: pixelated
- No external deps
