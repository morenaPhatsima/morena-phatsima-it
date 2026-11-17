# Repository Guidelines — Morena Phatsima IT

## Architecture & Stack
- Static, zero-dependency website deployed via Cloudflare Workers (`wrangler.jsonc`).
- Use only semantic HTML5, vanilla CSS3 (`css/styles.css`), and zero-dependency ES6 JavaScript (`js/main.js`, `js/uplift.js`). Do not introduce React, Tailwind, npm build steps, or external CDN scripts.
- Reuse existing CSS custom properties (`--bg-canvas`, `--bg-surface`, `--bg-card`, `--champagne`, `--champagne-border`, `--border-subtle`) and layout primitives (`.container`, `.section`, `.btn`, `.service-featured`).

## Business & Compliance Rules
- Service area: Potchefstroom and Ikageng, North West, South Africa.
- Operating hours (`Africa/Johannesburg` SAST): Mon–Fri 09:00–16:30, Sat 08:00–13:00, Sun Closed. Keep `index.html` JSON-LD `openingHoursSpecification` and `js/main.js` `initLiveBusinessStatus()` synchronized.
- Primary contact: WhatsApp `27661262587` (`066 126 2587`) and `phatsima16@gmail.com`. Always preserve the on-page fallback panel in `js/main.js` when modifying `#enquiryForm`.
- **POPIA / Privacy (`uplift.html`):** Never add analytics trackers, form submissions, or external network requests to `uplift.html` or `js/uplift.js`. All checklist and calculator state must remain strictly client-side (`localStorage` / memory only).