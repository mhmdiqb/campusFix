# CampusFix Backend

Backend API untuk **CampusFix**, sistem pelaporan dan penanganan kerusakan fasilitas kampus. Aplikasi ini memungkinkan mahasiswa membuat laporan kerusakan, admin mengelola fasilitas dan laporan, serta teknisi menangani perbaikan berdasarkan assignment yang diberikan.

CampusFix dikembangkan dengan pendekatan backend-first menggunakan REST API, autentikasi berbasis JWT, role-based authorization, Prisma ORM, dan MySQL.

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
│   ├── .env                 # Lokal, tidak diunggah
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── .gitignore
```

> Struktur di atas merupakan gambaran direktori utama. File `.env` digunakan untuk konfigurasi lokal dan tidak boleh berisi kredensial yang dipublikasikan ke GitHub.

## ✨ Features

### 1. Authentication & Authorization

* Registrasi dan login pengguna.
* Autentikasi menggunakan JWT.
* Password disimpan dalam bentuk hash menggunakan bcrypt.
* Middleware autentikasi untuk memvalidasi token.
* Role-based authorization untuk membatasi akses endpoint.
* Endpoint untuk mengambil informasi pengguna yang sedang login.

### 2. User Roles

| Role         | Tanggung jawab                                                                |
| ------------ | ----------------------------------------------------------------------------- |
| `STUDENT`    | Membuat laporan kerusakan dan melihat laporan sesuai hak aksesnya.            |
| `TECHNICIAN` | Melihat assignment dan memperbarui progres pekerjaan.                         |
| `ADMIN`      | Mengelola laporan, fasilitas, kategori, assignment, dashboard, dan audit log. |

### 3. Facility Management

Pengelolaan data fasilitas kampus meliputi:

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

Sistem laporan kerusakan mendukung:

* Membuat laporan.
* Melihat daftar laporan.
* Melihat detail laporan.
* Mengelola status laporan.
* Menambahkan catatan laporan.
* Melihat riwayat perubahan laporan.
* Mengonfirmasi penyelesaian laporan.

Data laporan mencakup informasi seperti judul, deskripsi, prioritas, status, pelapor, dan fasilitas terkait.

### 6. Report Images

CampusFix menyediakan endpoint untuk menambahkan gambar pada laporan.

Validasi kepemilikan laporan digunakan untuk mencegah pengguna menambahkan gambar ke laporan milik pengguna lain.

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

Status laporan yang digunakan:

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

Laporan dapat berakhir dengan status `REJECTED` apabila ditolak. Perubahan status dilakukan melalui endpoint sesuai hak akses masing-masing role.

### 9. Admin Dashboard

Backend menyediakan endpoint dashboard admin untuk mendukung tampilan ringkasan dan pengelolaan laporan.

### 10. Audit Logging

Audit log digunakan untuk mencatat aktivitas penting dalam sistem, termasuk pembuatan assignment dan perubahan status.

Pencatatan audit membantu proses penelusuran aktivitas dan meningkatkan akuntabilitas pengelolaan laporan.

## 🛠️ Installation

### Prerequisites

Pastikan perangkat telah memiliki:

* Node.js dan npm.
* MySQL Server.
* Git.

### 1. Clone Repository

```bash
git clone https://github.com/mhmdiqb/campusFix.git
cd campusFix/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Buat file `.env` di dalam direktori `backend/`.

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3307/campusfix"
JWT_SECRET="ganti_dengan_secret_yang_aman"
PORT=3000
```

Sesuaikan username, password, nama database, port MySQL, dan variabel lain dengan konfigurasi lokal.

**Penting:** Jangan mengunggah file `.env` berisi kredensial asli ke GitHub. Gunakan secret yang kuat dan unik untuk `JWT_SECRET`.

### 4. Prepare Database

Pastikan MySQL berjalan dan database telah dibuat sesuai konfigurasi `DATABASE_URL`.

Generate Prisma Client:

```bash
npx prisma generate
```

Terapkan migration yang sudah tersedia:

```bash
npx prisma migrate deploy
```

Untuk lingkungan pengembangan ketika membuat migration baru, gunakan:

```bash
npx prisma migrate dev --name nama_migration
```

### 5. Start the Server

Jalankan server dalam mode development:

```bash
npm run dev
```

Jika script `dev` tidak tersedia tetapi script `start` tersedia, gunakan:

```bash
npm start
```

Base URL backend lokal:

```text
http://localhost:3000
```

Health check:

```http
GET /api/health
```

## 🔐 Authentication

Endpoint yang memerlukan autentikasi menggunakan JWT pada header request:

```http
Authorization: Bearer <JWT_TOKEN>
```

Token diperoleh melalui proses login dan digunakan untuk mengakses endpoint sesuai role pengguna.

## 📡 API Endpoints

Base URL:

```text
http://localhost:3000/api
```

### Authentication

| Method | Endpoint         | Access        |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Public        |
| POST   | `/auth/login`    | Public        |
| GET    | `/auth/me`       | Authenticated |

### Reports

| Method | Endpoint               | Access        |
| ------ | ---------------------- | ------------- |
| POST   | `/reports`             | Authenticated |
| GET    | `/reports`             | Authenticated |
| GET    | `/reports/:id`         | Authenticated |
| GET    | `/reports/:id/history` | Authenticated |
| POST   | `/reports/:id/notes`   | Authenticated |
| PATCH  | `/reports/:id/status`  | ADMIN         |
| PATCH  | `/reports/:id/confirm` | Authenticated |

### Report Images

| Method | Endpoint              | Access        |
| ------ | --------------------- | ------------- |
| POST   | `/reports/:id/images` | Authenticated |

### Facilities

| Method | Endpoint          | Access        |
| ------ | ----------------- | ------------- |
| GET    | `/facilities`     | Authenticated |
| GET    | `/facilities/:id` | Authenticated |
| POST   | `/facilities`     | ADMIN         |
| PATCH  | `/facilities/:id` | ADMIN         |
| DELETE | `/facilities/:id` | ADMIN         |

### Facility Categories

| Method | Endpoint                   | Access        |
| ------ | -------------------------- | ------------- |
| GET    | `/facility-categories`     | Authenticated |
| POST   | `/facility-categories`     | ADMIN         |
| PATCH  | `/facility-categories/:id` | ADMIN         |
| DELETE | `/facility-categories/:id` | ADMIN         |

### Assignments

| Method | Endpoint                                  | Access     |
| ------ | ----------------------------------------- | ---------- |
| GET    | `/assignments/my`                         | TECHNICIAN |
| POST   | `/assignments/reports/:reportId`          | ADMIN      |
| PATCH  | `/assignments/reports/:reportId/start`    | TECHNICIAN |
| PATCH  | `/assignments/reports/:reportId/complete` | TECHNICIAN |
| PATCH  | `/assignments/:id/status`                 | TECHNICIAN |

### Dashboard

| Method | Endpoint           | Access |
| ------ | ------------------ | ------ |
| GET    | `/dashboard/admin` | ADMIN  |

### Audit Logs

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | `/audit-logs` | ADMIN  |

> Catatan: tabel endpoint merangkum dokumentasi API yang tersedia. Detail validasi, format request/response, dan aturan otorisasi tetap mengikuti implementasi route dan controller di backend.

## 🧪 API Testing

Thunder Client dapat digunakan untuk menguji endpoint backend.

Area pengujian meliputi:

* Health check.
* Registrasi dan login.
* Validasi JWT dan role pengguna.
* Pengelolaan fasilitas dan kategori.
* Pembuatan serta pengelolaan laporan.
* Riwayat, catatan, dan gambar laporan.
* Penugasan teknisi.
* Perubahan status assignment.
* Dashboard admin.
* Audit log.

Pengujian endpoint sebaiknya dilakukan menggunakan token dari masing-masing role untuk memastikan batasan akses berjalan sesuai rancangan.

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

Keamanan aplikasi juga bergantung pada pengelolaan secret, konfigurasi database, validasi input, dan pengujian akses pada setiap endpoint.

## 📌 Project Status

Backend CampusFix telah dikembangkan dengan fitur utama berikut:

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

Pengembangan berikutnya dapat difokuskan pada peningkatan validasi, pengujian otomatis, dokumentasi request/response, serta persiapan deployment.

## 👨‍💻 Author

**Muhammad Iqbal**

GitHub: [@mhmdiqb](https://github.com/mhmdiqb)

Repository: [CampusFix](https://github.com/mhmdiqb/campusFix)

---

CampusFix merupakan proyek pengembangan sistem pelaporan dan penanganan kerusakan fasilitas kampus yang dibangun untuk menerapkan konsep backend development, REST API, database management, authentication, authorization, dan audit logging.
