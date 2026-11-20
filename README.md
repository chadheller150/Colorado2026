# Colorado 2026

Trip site for Florissant, CO, Dec 19–23, 2026. Static site: no build step.

- `data.js`: all trip content (itinerary, places, budget, packing, menu). Edit this to update the site.
- `app.js`, `style.css`, `index.html`: the app.
- Budget, checklists and notes save in each browser's localStorage (per device, not synced).

Preview: `python3 -m http.server 8000`, then open http://localhost:8000
Publish: push to GitHub and enable Pages (Settings → Pages → main / root).
