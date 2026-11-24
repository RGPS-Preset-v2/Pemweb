# RuangBaca — Manajemen Buku

## Persiapan database

1. Gunakan project Supabase/PostgreSQL untuk menyimpan data buku.
2. Salin `Backend/.env.example` menjadi `Backend/.env`, lalu isi `DATABASE_URL` atau variabel `DB_*` dengan kredensial database dari Supabase. Biarkan `DB_SSL=true` untuk Supabase.
3. Jika tabel `books` belum ada, jalankan `Backend/schema.sql` sekali di Supabase SQL Editor.

## Menjalankan aplikasi

Jalankan backend di terminal pertama:

```powershell
cd Backend
npm install
npm start
```

Jalankan frontend di terminal kedua:

```powershell
cd Frontend
npm install
npm run dev
```

Frontend memakai API `http://localhost:8080` secara default. Untuk alamat lain, salin `Frontend/.env.example` menjadi `Frontend/.env` dan ubah `VITE_API_URL`.
Postman tidak diperlukan untuk penggunaan aplikasi; formulir web langsung memakai API.

## Deployment

Repository ini disiapkan untuk deployment publik di GitHub Pages dan Vercel. File `.env` dan `node_modules` dikecualikan dari Git; jangan unggah kredensial database.

### GitHub Pages

1. Pastikan repository publik bernama `ruangbaca`.
2. Di **Settings → Pages**, pilih **GitHub Actions** sebagai sumber deployment.
3. Tambahkan repository variable `VITE_API_URL` yang menunjuk ke URL deployment API Vercel.
4. Workflow `.github/workflows/deploy-pages.yml` akan build dan deploy setiap push ke `main`.

URL Pages: `https://rgps-preset-v2.github.io/ruangbaca/`.

### Vercel

Buat dua project dari repository GitHub yang sama:

- **API**: Root Directory `Backend`. Tambahkan `DATABASE_URL` dari Supabase, atau variabel `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, dan `DB_SSL=true`, pada Project Settings → Environment Variables. Deploy API terlebih dahulu.
- **Frontend**: Root Directory `Frontend`, framework Vite, build command `npm run build`, output directory `dist`. Set `VITE_API_URL` ke domain project API.

Gunakan URL API Vercel yang sama untuk repository variable `VITE_API_URL` agar GitHub Pages juga dapat mengakses backend.
