# CampusFix

**CampusFix** adalah aplikasi pelaporan kerusakan fasilitas kampus yang membantu mahasiswa menyampaikan laporan dan membantu pihak kampus memantau proses penanganannya.

Mahasiswa dapat membuat laporan kerusakan, sementara teknisi dan administrator dapat menindaklanjuti laporan sesuai peran masing-masing.

## Demo

- **Frontend:** https://campus-fix-sable.vercel.app
- **Backend API:** https://campusfix.de.deplexo.com
- **Repository:** https://github.com/mhmdiqb/campusFix

## Fitur Utama

- Autentikasi pengguna dengan JWT.
- Hak akses berdasarkan peran: **Student**, **Technician**, dan **Admin**.
- Pembuatan dan pemantauan laporan kerusakan fasilitas.
- Pengelolaan fasilitas dan kategori fasilitas.
- Penugasan laporan kepada teknisi.
- Pembaruan status dan riwayat penanganan laporan.
- Catatan serta konfirmasi penyelesaian laporan.
- Dukungan gambar pada laporan.
- Dashboard untuk membantu pemantauan laporan.

> Ketersediaan fitur dapat bergantung pada konfigurasi deployment dan perlu diuji pada lingkungan yang digunakan.

## Teknologi

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JSON Web Token (JWT)
- bcrypt

### Deployment dan Tools
- Vercel untuk frontend
- DePlexo untuk backend
- Aiven MySQL untuk database produksi
- Git dan GitHub untuk version control

## Arsitektur Singkat

```text
Pengguna
   |
   v
Frontend React (Vercel)
   |
   | REST API / HTTP
   v
Backend Express.js (DePlexo)
   |
   | Prisma ORM
   v
MySQL (Aiven)
```

## Dokumentasi

Dokumentasi terpisah tersedia untuk detail implementasi:

- [Dokumentasi Frontend](./frontend/README.md)
- [Dokumentasi Backend](./backend/README.md)

## Menjalankan Secara Lokal

### Prasyarat
- Node.js dan npm
- MySQL
- Git

### 1. Clone repository

```bash
git clone https://github.com/mhmdiqb/campusFix.git
cd campusFix
```

### 2. Jalankan backend

Masuk ke folder backend dan pasang dependensi:

```bash
cd backend
npm install
```

Buat file `.env` berdasarkan konfigurasi lokal. Contoh:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3307/campusfix_db"
JWT_SECRET="ganti_dengan_secret_yang_aman"
JWT_EXPIRES_IN="1d"
PORT=3000
```

Sesuaikan URL database, port, dan variabel lingkungan dengan konfigurasi proyekmu. Jangan commit file `.env` atau memasukkan kredensial asli ke repository publik.

Jika konfigurasi Prisma sudah siap, jalankan:

```bash
npx prisma generate
npx prisma migrate deploy
```

Kemudian jalankan server menggunakan script yang tersedia di `backend/package.json`, misalnya:

```bash
npm run dev
```

### 3. Jalankan frontend

Buka terminal baru dari root repository:

```bash
cd frontend
npm install
```

Buat file `.env` frontend dan isi URL API backend, misalnya:

```env
VITE_API_URL=http://localhost:3000/api
```

Jalankan frontend:

```bash
npm run dev
```

Pastikan backend, database, variabel lingkungan, dan endpoint API sudah sesuai sebelum menguji aplikasi. Perintah migration dan script untuk menjalankan server dapat berbeda sesuai konfigurasi proyek.

## Peran Pengguna

| Peran | Kegunaan |
|---|---|
| Student | Membuat laporan dan memantau penanganannya |
| Technician | Menindaklanjuti laporan yang ditugaskan |
| Admin | Mengelola data dan memantau laporan |

## Keamanan

- Simpan secret dan kredensial di variabel lingkungan.
- Jangan unggah `.env` ke GitHub.
- Gunakan akun demo khusus untuk demonstrasi dan hindari memasukkan data pribadi atau data kampus yang sensitif.
- Pastikan akses setiap peran diuji sebelum aplikasi digunakan secara nyata.

## Pengembang

**Muhammad Iqbal**  
GitHub: [@mhmdiqb](https://github.com/mhmdiqb)

---

*CampusFix — membantu pelaporan dan penanganan fasilitas kampus menjadi lebih terstruktur.*
