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

## Logo layanan

Logo tiap layanan (varian "Warna Khas") tampil di kartu menu layanan, kartu pop-up, dan header halaman layanan.

- `assets/logo-layanan/*.jpg` — salinan logo yang sudah diperkecil (480×466)
- Di `public/index.html` logo ditanam sebagai base64 dalam `SERVICE_LOGOS`, karena Worker hanya menyajikan satu halaman
