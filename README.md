# Broken Ball redesign

Gotowy, samodzielny frontend zgodny z obecną strukturą projektu Express.

## Instalacja
1. Skopiuj `index-redesign.html`, `redesign.css` i `redesign.js` do katalogu głównego obecnego projektu.
2. Upewnij się, że katalog `img/` i plik `news.json` pozostają w katalogu głównym.
3. W `server.js` zmień:
   `res.sendFile(path.join(websitePath, "index.html"));`
   na:
   `res.sendFile(path.join(websitePath, "index-redesign.html"));`
4. Uruchom `npm start` i otwórz `http://localhost:3000`.

## Ważne
- Projekt korzysta z istniejących zdjęć: `bb19start.jpg`, `bb_19_extreme.jpg`, `bb_19_fit.jpg`, `bb_19_star.jpg`, `bb_19_graffitti.jpg`.
- Aktualności są pobierane z istniejącego `/news.json`.
- Google Fonts wymaga internetu. W wersji produkcyjnej warto hostować fonty lokalnie.
- Link e-mail `kontakt@brokenball.pl` jest przykładowy. Zmień go, jeśli faktyczny adres jest inny.
- Przed publikacją należy podłączyć właściwe formularze zapisów i linki społecznościowe.
