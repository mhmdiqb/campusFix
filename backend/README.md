# CampusFix Backend

Backend API untuk **CampusFix**, sebuah sistem pelaporan kerusakan fasilitas kampus yang memungkinkan mahasiswa melaporkan fasilitas yang bermasalah, admin mengelola laporan, dan teknisi menangani perbaikan.

## 🚀 Tech Stack

* Node.js
* Express.js
* Prisma ORM
* MySQL
* JWT Authentication
* bcrypt
* Thunder Client untuk API testing

## 📁 Struktur Project

```text
backend/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── .env
├── package.json
└── README.md
```

## ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/mhmdiqb/campusFix.git
```

Masuk ke folder backend:

```bash
cd campusFix/backend
```

Install dependency:

```bash
npm install
```

## 🔐 Environment Variables

Buat file `.env` di dalam folder `backend`:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3307/campusfix"
JWT_SECRET="your_secret_key"
PORT=3000
```

Sesuaikan `USERNAME`, `PASSWORD`, database, dan konfigurasi lainnya dengan environment lokal.

## 🗄️ Database

Pastikan MySQL sudah berjalan.

Setelah konfigurasi database selesai, jalankan Prisma:

```bash
npx prisma generate
```

Untuk membuat atau memperbarui database menggunakan migration:

```bash
npx prisma migrate dev
```

## ▶️ Menjalankan Server

Development:

```bash
npm run dev
```

Atau jika project menggunakan script start:

```bash
npm start
```

Server berjalan di:

```text
http://localhost:3000
```

Health check:

```http
GET /api/health
```

## 🔑 Authentication

CampusFix menggunakan JWT untuk authentication.

Setelah login berhasil, gunakan token pada request yang membutuhkan authentication:

```text
Authorization: Bearer <JWT_TOKEN>
```

### Role

CampusFix memiliki tiga role utama:

| Role       | Fungsi                                                  |
| ---------- | ------------------------------------------------------- |
| STUDENT    | Membuat dan melihat laporan miliknya                    |
| TECHNICIAN | Menangani assignment dan memperbarui status pekerjaan   |
| ADMIN      | Mengelola laporan, assignment, dashboard, dan audit log |

## 📡 API Endpoints

Base URL:

```text
http://localhost:3000/api
```

### Authentication

| Method | Endpoint         | Role          |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Public        |
| POST   | `/auth/login`    | Public        |
| GET    | `/auth/me`       | Authenticated |

### Reports

| Method | Endpoint               | Role          |
| ------ | ---------------------- | ------------- |
| POST   | `/reports`             | Authenticated |
| GET    | `/reports`             | Authenticated |
| GET    | `/reports/:id`         | Authenticated |
| GET    | `/reports/:id/history` | Authenticated |
| POST   | `/reports/:id/notes`   | Authenticated |
| PATCH  | `/reports/:id/status`  | ADMIN         |
| PATCH  | `/reports/:id/confirm` | Authenticated |

### Report Images

| Method | Endpoint              | Role          |
| ------ | --------------------- | ------------- |
| POST   | `/reports/:id/images` | Authenticated |

Report image memiliki validasi kepemilikan sehingga user tidak dapat menambahkan gambar ke laporan milik user lain.

### Facilities

| Method | Endpoint          | Role          |
| ------ | ----------------- | ------------- |
| GET    | `/facilities`     | Authenticated |
| GET    | `/facilities/:id` | Authenticated |
| POST   | `/facilities`     | ADMIN         |
| PATCH  | `/facilities/:id` | ADMIN         |
| DELETE | `/facilities/:id` | ADMIN         |

### Facility Categories

| Method | Endpoint                   | Role          |
| ------ | -------------------------- | ------------- |
| GET    | `/facility-categories`     | Authenticated |
| POST   | `/facility-categories`     | ADMIN         |
| PATCH  | `/facility-categories/:id` | ADMIN         |
| DELETE | `/facility-categories/:id` | ADMIN         |

### Assignments

| Method | Endpoint                                  | Role       |
| ------ | ----------------------------------------- | ---------- |
| GET    | `/assignments/my`                         | TECHNICIAN |
| POST   | `/assignments/reports/:reportId`          | ADMIN      |
| PATCH  | `/assignments/reports/:reportId/start`    | TECHNICIAN |
| PATCH  | `/assignments/reports/:reportId/complete` | TECHNICIAN |
| PATCH  | `/assignments/:id/status`                 | TECHNICIAN |

### Dashboard

| Method | Endpoint           | Role  |
| ------ | ------------------ | ----- |
| GET    | `/dashboard/admin` | ADMIN |

### Audit Logs

| Method | Endpoint      | Role  |
| ------ | ------------- | ----- |
| GET    | `/audit-logs` | ADMIN |

Audit log digunakan untuk mencatat aktivitas penting dalam sistem seperti pembuatan assignment dan perubahan status.

## 🔄 Report Flow

Alur utama laporan CampusFix:

```text
STUDENT
   │
   │ Membuat laporan
   ▼
REPORTED
   │
   │ Admin melakukan verifikasi/penanganan
   ▼
VERIFIED
   │
   │ Admin assign teknisi
   ▼
ASSIGNED
   │
   │ Teknisi mulai mengerjakan
   ▼
IN_PROGRESS
   │
   │ Teknisi menyelesaikan pekerjaan
   ▼
COMPLETED
   │
   │ Mahasiswa melakukan konfirmasi
   ▼
CONFIRMED
```

Laporan juga dapat memiliki status:

```text
REJECTED
```

jika laporan ditolak.

## 🛠️ Technician Flow

```text
ADMIN
  │
  └── Assign Report
          │
          ▼
     TECHNICIAN
          │
          ├── Start Assignment
          │
          ▼
      IN_PROGRESS
          │
          ├── Update status / note
          │
          ▼
       COMPLETED
```

Setiap perubahan penting dapat dicatat melalui **Report Update** dan **Audit Log**.

## 🔒 Security

Backend CampusFix menggunakan beberapa mekanisme keamanan:

* JWT authentication
* Role-based authorization
* Password hashing menggunakan bcrypt
* Validasi role pada endpoint
* Validasi kepemilikan report
* Validasi assignment berdasarkan technician yang login
* Audit log untuk aktivitas penting
* Environment variables untuk konfigurasi sensitif

## 🧪 API Testing

API telah diuji menggunakan **Thunder Client**.

Endpoint yang telah diuji antara lain:

* Health check
* Authentication
* Reports
* Report history
* Report images
* Assignments
* Assignment status
* Admin dashboard
* Audit logs

## 📌 Project Status

Backend CampusFix telah memiliki fitur utama untuk:

* Authentication
* Role management
* Facility management
* Facility category management
* Report management
* Report history
* Report notes
* Report images
* Technician assignment
* Technician status updates
* Admin dashboard
* Audit logging

## 👨‍💻 Author

**Muhammad Iqbal**

GitHub:

`https://github.com/mhmdiqb`

---

> CampusFix dibuat sebagai project pengembangan sistem pelaporan dan penanganan kerusakan fasilitas kampus.
