# CampusFix Backend

Backend REST API untuk **CampusFix**, aplikasi pelaporan dan penanganan kerusakan fasilitas kampus. Sistem ini mendukung mahasiswa dalam membuat laporan, admin dalam mengelola laporan dan fasilitas, serta teknisi dalam menangani pekerjaan berdasarkan assignment.

Backend dikembangkan menggunakan Node.js, Express.js, Prisma ORM, dan MySQL. Autentikasi menggunakan JSON Web Token (JWT), sedangkan password disimpan dalam bentuk hash menggunakan bcrypt.

## 🔗 Deployment

* **Frontend:** https://campus-fix-sable.vercel.app
* **Backend produksi:** https://campusfix.de.deplexo.com
* **API Base URL:** https://campusfix.de.deplexo.com/api
* **Repository:** https://github.com/mhmdiqb/campusFix

CampusFix menggunakan layanan terpisah untuk frontend, backend, dan database. URL produksi digunakan untuk mengakses aplikasi online, sedangkan pengembangan lokal menggunakan server dan database lokal.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Backend Framework:** Express.js
* **Database:** MySQL
* **ORM:** Prisma ORM
* **Authentication:** JSON Web Token (JWT)
* **Password Hashing:** bcrypt
* **Environment Configuration:** dotenv
* **API Testing:** Thunder Client
* **Version Control:** Git & GitHub
* **Frontend Deployment:** Vercel
* **Backend Deployment:** DePlexo
* **Production Database:** Aiven MySQL

## 📁 Project Structure

```text
campusFix/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
└── .gitignore
```

Struktur di atas merupakan gambaran direktori utama. Nama atau lokasi file dapat berubah mengikuti perkembangan implementasi. File `.env` digunakan untuk konfigurasi lokal dan tidak boleh berisi kredensial yang dipublikasikan ke GitHub.

## ✨ Features

### 1. Authentication & Authorization

* Registrasi dan login pengguna.
* Autentikasi menggunakan JWT.
* Password disimpan dalam bentuk hash menggunakan bcrypt.
* Middleware autentikasi untuk memvalidasi token.
* Role-based authorization untuk membatasi akses endpoint.
* Endpoint untuk mengambil informasi pengguna yang sedang login.

### 2. User Roles

| Role         | Tanggung Jawab                                                                |
| ------------ | ----------------------------------------------------------------------------- |
| `STUDENT`    | Membuat laporan kerusakan dan melihat laporan sesuai hak akses.               |
| `TECHNICIAN` | Melihat assignment miliknya dan memperbarui progres pekerjaan.                |
| `ADMIN`      | Mengelola laporan, fasilitas, kategori, assignment, dashboard, dan audit log. |

### 3. Facility Management

Pengelolaan fasilitas kampus mencakup:

* Melihat daftar fasilitas.
* Melihat detail fasilitas.
* Menambahkan fasilitas.
* Memperbarui informasi fasilitas.
* Menghapus fasilitas.

Operasi pengelolaan fasilitas dibatasi untuk role `ADMIN`, sedangkan endpoint pembacaan memerlukan autentikasi.

### 4. Facility Category Management

* Melihat kategori fasilitas.
* Membuat kategori baru.
* Memperbarui kategori.
* Menghapus kategori.

Kategori digunakan untuk mengelompokkan fasilitas kampus.

### 5. Report Management

Sistem laporan mendukung:

* Membuat laporan.
* Melihat daftar laporan.
* Melihat detail laporan.
* Mengelola status laporan.
* Menambahkan catatan laporan.
* Melihat riwayat perubahan laporan.
* Mengonfirmasi penyelesaian laporan.

Data laporan dapat mencakup judul, deskripsi, prioritas, status, pelapor, dan fasilitas terkait.

### 6. Report Images

CampusFix menyediakan endpoint untuk menambahkan gambar pada laporan. Validasi kepemilikan laporan digunakan untuk mencegah pengguna menambahkan gambar ke laporan milik pengguna lain.

### 7. Technician Assignment

Admin dapat menugaskan teknisi untuk menangani laporan tertentu.

Fitur assignment mencakup:

* Melihat daftar teknisi yang tersedia untuk penugasan.
* Menugaskan teknisi pada laporan.
* Melihat assignment milik teknisi yang sedang login.
* Memulai pekerjaan.
* Memperbarui status assignment.
* Menyelesaikan pekerjaan.

Validasi assignment digunakan untuk membatasi akses teknisi terhadap pekerjaan yang ditugaskan kepadanya.

### 8. Report Status & Workflow

| Status        | Keterangan                                 |
| ------------- | ------------------------------------------ |
| `REPORTED`    | Laporan baru dibuat.                       |
| `VERIFIED`    | Laporan telah diverifikasi.                |
| `ASSIGNED`    | Laporan telah ditugaskan kepada teknisi.   |
| `IN_PROGRESS` | Pekerjaan sedang berlangsung.              |
| `COMPLETED`   | Pekerjaan telah diselesaikan oleh teknisi. |
| `CONFIRMED`   | Penyelesaian telah dikonfirmasi.           |
| `REJECTED`    | Laporan ditolak.                           |

Alur utama laporan:

```text
STUDENT
   |
   v
REPORTED
   |
   v
VERIFIED
   |
   v
ASSIGNED
   |
   v
IN_PROGRESS
   |
   v
COMPLETED
   |
   v
CONFIRMED
```

Laporan juga dapat berakhir dengan status `REJECTED`. Perubahan status mengikuti aturan akses dan alur yang diterapkan oleh backend.

### 9. Admin Dashboard

Backend menyediakan endpoint dashboard admin untuk mendukung tampilan ringkasan dan pengelolaan laporan.

### 10. Audit Logging

Audit log digunakan untuk mencatat aktivitas penting dalam sistem, termasuk pembuatan assignment dan perubahan status. Pencatatan ini membantu penelusuran aktivitas dan meningkatkan akuntabilitas pengelolaan laporan.

## 🛠️ Installation & Local Setup

### Prerequisites

Pastikan perangkat sudah memiliki:

* Node.js dan npm.
* MySQL Server.
* Git.

### 1. Clone Repository

```bash
git clone https://github.com/mhmdiqb/campusFix.git
cd campusFix/backend
```

Jika repository sudah tersedia di komputer, cukup masuk ke direktori `backend`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Buat file `.env` di direktori `backend/`. Berikut contoh konfigurasi untuk MySQL lokal:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3307/campusfix_db"
JWT_SECRET="ganti_dengan_secret_yang_aman"
JWT_EXPIRES_IN="1d"
PORT=3000
```

Sesuaikan `USERNAME`, `PASSWORD`, port MySQL, dan nama database dengan konfigurasi lokal. Contoh ini menggunakan database `campusfix_db`; pastikan database tersebut sudah dibuat.

**Penting:** Jangan mengunggah file `.env` yang berisi kredensial asli ke GitHub. Gunakan `JWT_SECRET` yang kuat dan unik. Contoh secret di atas tidak boleh digunakan untuk produksi.

### 4. Prepare Database

Pastikan MySQL berjalan dan database telah dibuat sesuai konfigurasi `DATABASE_URL`.

Generate Prisma Client:

```bash
npx prisma generate
```

Terapkan migration yang tersedia:

```bash
npx prisma migrate deploy
```

Untuk membuat migration baru selama pengembangan:

```bash
npx prisma migrate dev --name nama_migration
```

Jalankan `migrate dev` hanya pada lingkungan pengembangan. Sebelum menerapkan migration pada database produksi, periksa migration dan siapkan cadangan data yang diperlukan.

### 5. Start the Server

Jalankan server dalam mode development jika script `dev` tersedia:

```bash
npm run dev
```

Jika proyek menggunakan script `start`, jalankan:

```bash
npm start
```

Base URL lokal:

```text
http://localhost:3000
```

Base URL produksi:

```text
https://campusfix.de.deplexo.com
```

API Base URL produksi:

```text
https://campusfix.de.deplexo.com/api
```

Untuk health check, gunakan `GET /api/health` hanya jika endpoint tersebut tersedia pada implementasi backend.

## 🔐 Authentication

Endpoint yang memerlukan autentikasi menggunakan JWT pada header request:

```http
Authorization: Bearer <JWT_TOKEN>
```

Token diperoleh melalui proses login dan digunakan untuk mengakses endpoint sesuai role pengguna. Jangan membagikan token autentikasi di screenshot, log publik, atau repository.

## 📡 API Endpoints

Base URL produksi:

```text
https://campusfix.de.deplexo.com/api
```

Daftar berikut merangkum endpoint yang didokumentasikan dalam README proyek. Detail request, response, dan otorisasi akhir harus mengikuti implementasi route dan controller yang aktif.

### Authentication

| Method | Endpoint         | Access        |
| ------ | ---------------- | ------------- |
| `POST` | `/auth/register` | Public        |
| `POST` | `/auth/login`    | Public        |
| `GET`  | `/auth/me`       | Authenticated |

### Reports

| Method  | Endpoint               | Access        |
| ------- | ---------------------- | ------------- |
| `POST`  | `/reports`             | Authenticated |
| `GET`   | `/reports`             | Authenticated |
| `GET`   | `/reports/:id`         | Authenticated |
| `GET`   | `/reports/:id/history` | Authenticated |
| `POST`  | `/reports/:id/notes`   | Authenticated |
| `PATCH` | `/reports/:id/status`  | `ADMIN`       |
| `PATCH` | `/reports/:id/confirm` | Authenticated |

### Report Images

| Method | Endpoint              | Access        |
| ------ | --------------------- | ------------- |
| `POST` | `/reports/:id/images` | Authenticated |

### Facilities

| Method   | Endpoint          | Access        |
| -------- | ----------------- | ------------- |
| `GET`    | `/facilities`     | Authenticated |
| `GET`    | `/facilities/:id` | Authenticated |
| `POST`   | `/facilities`     | `ADMIN`       |
| `PATCH`  | `/facilities/:id` | `ADMIN`       |
| `DELETE` | `/facilities/:id` | `ADMIN`       |

### Facility Categories

| Method   | Endpoint                   | Access        |
| -------- | -------------------------- | ------------- |
| `GET`    | `/facility-categories`     | Authenticated |
| `POST`   | `/facility-categories`     | `ADMIN`       |
| `PATCH`  | `/facility-categories/:id` | `ADMIN`       |
| `DELETE` | `/facility-categories/:id` | `ADMIN`       |

### Assignments

| Method  | Endpoint                                  | Access       |
| ------- | ----------------------------------------- | ------------ |
| `GET`   | `/assignments/my`                         | `TECHNICIAN` |
| `POST`  | `/assignments/reports/:reportId`          | `ADMIN`      |
| `PATCH` | `/assignments/reports/:reportId/start`    | `TECHNICIAN` |
| `PATCH` | `/assignments/reports/:reportId/complete` | `TECHNICIAN` |
| `PATCH` | `/assignments/:id/status`                 | `TECHNICIAN` |

### Dashboard

| Method | Endpoint           | Access  |
| ------ | ------------------ | ------- |
| `GET`  | `/dashboard/admin` | `ADMIN` |

### Audit Logs

| Method | Endpoint      | Access  |
| ------ | ------------- | ------- |
| `GET`  | `/audit-logs` | `ADMIN` |

> Catatan: daftar endpoint di atas disusun berdasarkan dokumentasi yang tersedia, bukan hasil pemeriksaan seluruh source code. Verifikasi kembali endpoint, method, dan role sebelum menjadikannya dokumentasi API final.

## 🧪 API Testing

Thunder Client dapat digunakan untuk menguji endpoint backend.

Area pengujian meliputi:

* Health check, jika endpoint tersedia.
* Registrasi dan login.
* Validasi JWT dan role pengguna.
* Pengelolaan fasilitas dan kategori.
* Pembuatan serta pengelolaan laporan.
* Riwayat, catatan, dan gambar laporan.
* Penugasan teknisi.
* Perubahan status assignment.
* Dashboard admin.
* Audit log.

Gunakan token dari akun dengan role yang sesuai untuk memastikan pembatasan akses bekerja sebagaimana mestinya.

## 🚀 Deployment

CampusFix menggunakan layanan terpisah untuk frontend, backend, dan database:

* **Frontend:** Vercel — https://campus-fix-sable.vercel.app
* **Backend:** DePlexo — https://campusfix.de.deplexo.com
* **Database produksi:** Aiven MySQL

Konfigurasi produksi harus disimpan pada environment variables di layanan hosting, bukan di dalam source code. Pastikan `DATABASE_URL`, `JWT_SECRET`, dan variabel sensitif lainnya diatur melalui dashboard hosting.

Jangan mencantumkan kredensial database, password, atau nilai secret dalam dokumentasi publik. Setelah melakukan perubahan backend, uji endpoint yang terdampak dan pastikan deployment berhasil sebelum menyatakan fitur siap digunakan.

## 🔒 Security

Mekanisme keamanan yang digunakan atau dirancang dalam backend meliputi:

* JWT authentication.
* Role-based authorization.
* Password hashing dengan bcrypt.
* Validasi hak akses pada endpoint.
* Validasi kepemilikan laporan.
* Validasi assignment berdasarkan teknisi yang login.
* Audit log untuk aktivitas penting.
* Environment variables untuk konfigurasi sensitif.

Keamanan aplikasi juga bergantung pada validasi input, pengelolaan secret, konfigurasi database, dan pengujian akses pada setiap endpoint. Pembatasan akses di frontend tidak menggantikan validasi otorisasi di backend.

## 📌 Project Status

Backend CampusFix telah dikembangkan untuk mendukung fitur utama berikut:

* Authentication dan authorization.
* Pengelolaan role pengguna.
* Facility management.
* Facility category management.
* Report management.
* Report history dan notes.
* Report images.
* Technician assignment.
* Technician status updates.
* Admin dashboard.
* Audit logging.
* Deployment backend dan database cloud.

Status operasional masing-masing fitur tetap perlu diverifikasi melalui pengujian. Pengembangan lanjutan dapat mencakup pengujian otomatis, validasi input yang lebih menyeluruh, dokumentasi request/response, dan peningkatan monitoring.

## 👨‍💻 Author

**Muhammad Iqbal**

* GitHub: [@mhmdiqb](https://github.com/mhmdiqb)
* Repository: [CampusFix](https://github.com/mhmdiqb/campusFix)

---

CampusFix merupakan proyek pengembangan sistem pelaporan dan penanganan kerusakan fasilitas kampus untuk menerapkan konsep backend development, REST API, database management, authentication, authorization, dan audit logging.
