# DRWversity — Landing Page

Landing page program **DRWversity** (Learn · Grow · Earn) — program pengembangan **pelajar & mahasiswa** dari **DRW Skincare**. Dibangun dengan **Next.js + TypeScript + TailwindCSS**, siap di-deploy ke **Vercel**. Mobile-first, funnel konversi ke WhatsApp.

## Struktur Proyek

```
drwversity/
├── app/
│   ├── api/meta-pixel/route.ts   # Meta Conversion API (server-side)
│   ├── globals.css               # Tailwind v4 (@import)
│   ├── layout.tsx                # Metadata/OG + GTM, Meta Pixel, TikTok Pixel
│   └── page.tsx                  # Entry point
├── components/
│   └── LandingDRWversity.tsx     # Komponen utama landing page (semua section)
├── lib/meta-pixel.ts             # Helper tracking (Lead, ViewContent, custom)
├── public/
│   ├── hero-video.mp4            # Video hero 9:16 (sudah dikompres ~5MB)
│   ├── hero-poster.jpg           # Poster video
│   └── images/                   # og-image, pelajar, mahasiswa, avatar-1..3
│       # NOTE: images/* saat ini AI-generated (Magnific) sebagai placeholder.
│       #       Ganti dengan foto asli mahasiswa/kegiatan bila tersedia.
├── .env.example
└── package.json
```

## Menjalankan Lokal

```bash
npm install
cp .env.example .env.local   # sesuaikan bila perlu
npm run dev                  # http://localhost:3000
npm run build && npm start   # produksi
```

## Kustomisasi

- **Konten & copy:** semua ada di `components/LandingDRWversity.tsx`.
- **Nomor WhatsApp:** default `62811944288`, override lewat `NEXT_PUBLIC_WA_NUMBER`.
- **PLACEHOLDER yang perlu diganti sebelum publish:**
  - Angka statistik (section "Kata Mereka") — tandai `PLACEHOLDER` di kode.
  - Teks & foto testimoni (`public/images/avatar-*.jpg`).
  - Foto section "Untuk Siapa" (`public/images/pelajar.jpg`, `mahasiswa.jpg`).
  - Link Kebijakan Privasi & Syarat & Ketentuan di footer.
- **Pixel/Analytics:** isi `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_GTM_ID`. Kosong = nonaktif (tidak error).

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import project di Vercel → framework Next.js otomatis terdeteksi.
3. Set Environment Variables sesuai `.env.example`.
4. Deploy.

## Catatan Aset

- `hero-video.mp4` dikompres dari sumber vertikal 1440×2560 (120MB → ~5MB, 720×1280, `+faststart`) agar cepat di mobile.
- Foto di `public/images/` dihasilkan via Magnific (realistic) sebagai isian awal; mudah diganti foto asli dengan nama file yang sama.
