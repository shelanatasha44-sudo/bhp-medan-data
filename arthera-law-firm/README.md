# ARTHERA LAW FIRM — Website

Situs statis satu halaman (Advocates, Legal Consultants & Intellectual Property Services).

- Live: https://arthera-law-firm.arthera.workers.dev
- Short link: https://bit.ly/4iEbbvx

## Struktur

- `public/index.html` — halaman situs
- `src/worker.js` — Cloudflare Worker yang menyajikan halaman
- `wrangler.toml` — konfigurasi deploy

## Deploy

```bash
cd arthera-law-firm
npx wrangler deploy
```
