# GOURMET — Profil Perusahaan Restoran

Website profil perusahaan restoran full-stack dengan tema gelap yang elegan, chatbot berbasis AI, reservasi online, dan dasbor admin yang lengkap. Dibangun menggunakan React, Express, Firebase Firestore, dan Firebase Authentication.

---

## Teknologi (Tech Stack)

| Lapisan | Teknologi |
|---------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM, Axios, React Hook Form, Zod, Lucide React, Motion |
| **Backend** | Node.js, Express.js, JWT Authentication, Bcrypt, Multer, Helmet, CORS, Rate Limiting |
| **Database & Auth**| Firebase Firestore, Firebase Authentication |
| **AI** | Google Gemini API |

---

## Fitur Utama

### Halaman Publik
- **Beranda (Landing Page)** — Bagian hero, menu andalan (signature), profil chef, reservasi cepat
- **Tentang Kami (About)** — Sejarah restoran, visi, misi, nilai-nilai, penghargaan
- **Menu** — Jelajahi hidangan dengan filter kategori, pencarian, dan fitur wishlist
- **Promosi (Promotions)** — Banner promo aktif dengan modal detail
- **Galeri (Gallery)** — Grid foto dengan filter kategori dan tampilan lightbox
- **Reservasi (Reservation)** — Formulir pemesanan online dengan validasi Zod dan pembuatan kode reservasi
- **Kontak (Contact)** — Sematan Google Maps, info kontak, dan formulir pesan
- **AI Chatbot** — Asisten sommelier (pakar anggur) berbasis Gemini dengan basis pengetahuan yang dapat diperbarui

### Dasbor Admin (Dilindungi dengan JWT)
- Dasbor dengan statistik dan diagram batang (bar charts)
- CRUD: Menu hidangan, Promosi, Galeri, Profil Restoran
- Manajemen Reservasi dengan alur status (Menunggu → Dikonfirmasi → Selesai → Dibatalkan)
- Kotak masuk pesan kontak

---

## Struktur Proyek

```
├── src/
│   ├── components/          # Komponen UI yang dapat digunakan ulang
│   ├── hooks/               # Konteks & hooks untuk Auth
│   ├── layouts/             # MainLayout, AdminLayout
│   ├── pages/               # Komponen halaman rute
│   │   └── admin/           # Halaman panel admin
│   ├── server/              # Modul Backend
│   │   ├── middleware/      # Auth, upload, keamanan (security)
│   │   ├── routes/          # API route handlers
│   │   └── seed.ts          # Skrip penyemaian data (seed) untuk Firebase
│   ├── services/            # Klien API Axios
│   ├── types.ts             # Antarmuka (Interfaces) TypeScript
│   ├── App.tsx              # Definisi router & rute
│   └── main.tsx             # Titik masuk utama (Entry point)
├── server.ts                # Titik masuk server Express
└── vite.config.ts
```

---

## Memulai (Getting Started)

### Prasyarat Instalasi

- **Node.js** versi 18 atau lebih baru
- **Firebase Project** (Pastikan Firestore dan Authentication sudah diaktifkan)

### Tahap Instalasi & Pengaturan Lingkungan (Setup)

1. **Instal dependensi**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variables (Variabel Lingkungan)**

   Salin file `.env.example` menjadi `.env` dan isi dengan nilai Firebase dan Gemini API Anda:
   ```env
   # Gemini API
   GEMINI_API_KEY="kunci-api-gemini-anda"

   # URL Aplikasi
   APP_URL="http://localhost:3000"
   
   # Firebase Admin SDK (untuk Server-side)
   # Dapatkan dari Firebase Console > Project Settings > Service Accounts > Generate New Private Key
   FIREBASE_PROJECT_ID="id-proyek-firebase-anda"
   FIREBASE_CLIENT_EMAIL="akun-layanan-anda@proyek-anda.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nKUNCI_ANDA_DI_SINI\n-----END PRIVATE KEY-----\n"

   # Firebase Client SDK (untuk Frontend, menggunakan awalan VITE_)
   # Dapatkan dari Firebase Console > Project Settings > General > Your apps
   VITE_FIREBASE_API_KEY="kunci-api-firebase-anda"
   VITE_FIREBASE_AUTH_DOMAIN="proyek-anda.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="id-proyek-firebase-anda"
   VITE_FIREBASE_STORAGE_BUCKET="proyek-anda.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="id-pengirim-anda"
   VITE_FIREBASE_APP_ID="id-aplikasi-anda"
   ```

3. **Memasukkan Data Awal (Seed Database)**
   
   Isi Firestore dengan data sampel awal dan buat akun pengguna admin:
   ```bash
   npm run seed
   ```

4. **Menjalankan Program (Server Pengembangan)**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan dengan benar dan dapat diakses di `http://localhost:3000`.

### Kredensial Default Admin

| Email | Kata Sandi (Password) |
|-------|-----------------------|
| admin@gourmet.com | admin123 |

---

## Daftar Skrip Tersedia

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membangun aplikasi untuk produksi (build) |
| `npm run start` | Menjalankan server produksi |
| `npm run lint` | Mengecek pengetikan TypeScript |
| `npm run seed` | Mengisi database Firestore dengan data sampel |

---

## Endpoint API

### Publik
| Metode | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/menu` | Daftar menu hidangan (pencarian, filter, paginasi) |
| GET | `/api/menu/categories` | Daftar kategori menu |
| GET | `/api/promotions` | Daftar promosi aktif |
| GET | `/api/gallery` | Daftar foto galeri |
| GET | `/api/restaurant` | Mengambil profil restoran |
| POST | `/api/reservations` | Membuat reservasi baru |
| POST | `/api/contacts` | Mengirim pesan kontak |
| POST | `/api/chat` | Mengobrol dengan asisten AI |

### Terlindungi (Memerlukan JWT)
| Metode | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login admin |
| GET | `/api/auth/me` | Mengambil data pengguna saat ini |
| POST | `/api/menu` | Menambah menu hidangan baru |
| PUT | `/api/menu/:id` | Memperbarui menu hidangan |
| DELETE | `/api/menu/:id` | Menghapus menu hidangan |
| GET | `/api/reservations` | Daftar seluruh reservasi |
| PUT | `/api/reservations/:id/status`| Memperbarui status reservasi |
| DELETE | `/api/reservations/:id` | Menghapus reservasi |
| POST | `/api/promotions` | Menambah promosi baru |
| PUT | `/api/promotions/:id` | Memperbarui promosi |
| DELETE | `/api/promotions/:id` | Menghapus promosi |
| POST | `/api/gallery` | Menambah foto galeri baru |
| PUT | `/api/gallery/:id` | Memperbarui foto galeri |
| DELETE | `/api/gallery/:id` | Menghapus foto galeri |
| GET | `/api/contacts` | Daftar pesan kontak masuk |
| DELETE | `/api/contacts/:id` | Menghapus pesan kontak |
| PUT | `/api/restaurant` | Memperbarui profil restoran |
| GET | `/api/admin/stats` | Mengambil data statistik dasbor |

---

## Skema Database

Terdapat 9 koleksi yang disimpan dalam Firebase Firestore:

- **users** — Data profil admin (Autentikasi ditangani oleh Firebase Auth)
- **restaurant_profiles** — Informasi restoran dan pengaturan
- **categories** — Kategori hidangan (Makanan, Minuman, Dessert, Paket Spesial)
- **menus** — Menu hidangan dengan harga, tag kategori, dan ketersediaan
- **promotions** — Banner promo dengan rentang tanggal
- **galleries** — Galeri foto dengan penyaringan kategori
- **reservations** — Data pemesanan meja dengan kode unik dan alur status
- **contacts** — Formulir pengajuan pesan kontak
- **chatbot_knowledge** — Entri basis pengetahuan untuk AI chatbot

---

## Deployment (Penyebaran)

### Vercel / Railway / Heroku
Aplikasi ini adalah *monolithic full-stack app* di mana Vite membangun (*build*) frontend dan Express menyajikannya (*serve*).
1. Atur Environment Variables yang diperlukan di platform hosting (`FIREBASE_*`, `VITE_FIREBASE_*`, `GEMINI_API_KEY`, dll)
2. Build aplikasi: `npm run build`
3. Jalankan aplikasi: `npm run start`

---

## Lisensi

Proyek ini dibuat untuk tujuan edukasi (tugas kuliah).
