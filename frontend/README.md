# CampusFix Frontend

Frontend untuk **CampusFix**, aplikasi pelaporan dan penanganan kerusakan fasilitas kampus. Aplikasi ini menyediakan antarmuka bagi mahasiswa untuk melaporkan kerusakan, teknisi untuk menangani tugas perbaikan, dan admin untuk mengelola laporan fasilitas kampus.

Frontend dikembangkan menggunakan React, Vite, JavaScript, dan CSS, serta terhubung dengan backend CampusFix melalui REST API.

## 🌐 Demo Online

* **Frontend:** https://campus-fix-sable.vercel.app
* **Backend:** https://campusfix.de.deplexo.com
* **API Base URL:** https://campusfix.de.deplexo.com/api
* **Repository GitHub:** https://github.com/mhmdiqb/campusFix

## 🚀 Tech Stack

* **Library UI:** React
* **Build Tool:** Vite
* **Programming Language:** JavaScript
* **Styling:** CSS
* **HTTP Client:** Axios
* **Routing:** React Router
* **Version Control:** Git dan GitHub
* **Frontend Hosting:** Vercel
* **Backend Integration:** REST API

## 📁 Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── AdminReports.jsx
│   │   ├── AdminReports.css
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminTechnicians.jsx
│   │   ├── AdminTechnicians.css
│   │   ├── CreateReport.jsx
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── MyReports.jsx
│   │   ├── MyReports.css
│   │   ├── ReportDetail.jsx
│   │   ├── ReportDetail.css
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentDashboard.css
│   │   ├── TechnicianDashboard.jsx
│   │   └── TechnicianDashboard.css
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── ProtectedRoute.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

Keterangan folder utama:

* `pages/` — halaman login, dashboard, laporan, detail laporan, dan pengelolaan teknisi.
* `services/api.js` — konfigurasi komunikasi frontend dengan backend API.
* `ProtectedRoute.jsx` — membantu membatasi akses halaman berdasarkan autentikasi dan role.
* `App.jsx` dan `App.css` — komponen utama aplikasi beserta styling.
* `index.css` — styling global.
* `assets/` — aset statis yang digunakan frontend.

Struktur tersebut merupakan gambaran file utama proyek dan dapat berubah mengikuti perkembangan aplikasi.

## ✨ Features

### 1. Authentication

Frontend menyediakan halaman login untuk pengguna mengakses CampusFix.

* Mengirim permintaan login ke backend.
* Menggunakan token autentikasi untuk request yang memerlukan login.
* Mendukung alur autentikasi dan navigasi berdasarkan role pengguna.

### 2. Role-Based Access

CampusFix memiliki tiga role utama:

| Role         | Fungsi                                                     |
| ------------ | ---------------------------------------------------------- |
| `STUDENT`    | Membuat laporan kerusakan dan memantau laporan pribadi.    |
| `TECHNICIAN` | Melihat tugas perbaikan dan memperbarui progres pekerjaan. |
| `ADMIN`      | Mengelola laporan dan penugasan teknisi.                   |

Pembatasan akses halaman didukung oleh `ProtectedRoute.jsx`. Backend tetap bertanggung jawab untuk memvalidasi token, role, dan izin akses.

### 3. Student Dashboard

Dashboard mahasiswa menyediakan akses ke fitur utama pelaporan kerusakan fasilitas kampus serta informasi terkait laporan.

### 4. My Reports

Halaman `MyReports.jsx` menampilkan laporan yang dibuat mahasiswa sehingga pengguna dapat memantau laporan miliknya.

### 5. Create Report

Mahasiswa dapat membuat laporan kerusakan fasilitas kampus dengan mengisi informasi yang diperlukan, seperti judul, deskripsi, fasilitas, prioritas, dan foto apabila tersedia pada form.

Data laporan dikirimkan ke backend untuk diproses dan disimpan.

### 6. Report Detail

Halaman `ReportDetail.jsx` menampilkan informasi terperinci mengenai laporan, seperti:

* Judul dan deskripsi kerusakan.
* Fasilitas dan lokasi.
* Status serta prioritas laporan.
* Foto kerusakan apabila tersedia.
* Informasi teknisi atau penugasan apabila tersedia.

Informasi yang ditampilkan mengikuti data dari backend dan hak akses pengguna.

### 7. Technician Dashboard

Dashboard teknisi menyediakan fitur untuk:

* Melihat tugas yang ditugaskan kepada teknisi yang sedang login.
* Menampilkan ringkasan tugas berdasarkan status.
* Melihat detail laporan yang ditugaskan.
* Memperbarui status pekerjaan melalui backend.

### 8. Admin Interface

Antarmuka admin mendukung pengelolaan laporan dan teknisi melalui beberapa bagian:

* Dashboard ringkasan laporan.
* Daftar dan detail laporan.
* Pembaruan status laporan.
* Pengelolaan teknisi.
* Penugasan teknisi sesuai fitur yang tersedia.

## 🔗 API Integration

Frontend berkomunikasi dengan backend CampusFix melalui REST API. Konfigurasi koneksi dikelola melalui `src/services/api.js` dan environment variable `VITE_API_URL`.

**Backend online:**

```text
https://campusfix.de.deplexo.com
```

**API Base URL:**

```text
https://campusfix.de.deplexo.com/api
```

Untuk deployment Vercel, pastikan environment variable berikut telah dikonfigurasi:

```env
VITE_API_URL=https://campusfix.de.deplexo.com/api
```

Setelah mengubah environment variable di Vercel, lakukan redeployment agar perubahan diterapkan.

Untuk pengembangan lokal, konfigurasi API dapat disesuaikan dengan backend yang sedang dijalankan.

Backend menangani autentikasi, otorisasi, data fasilitas, laporan, gambar laporan, penugasan teknisi, pembaruan status, dan audit logging.

## ⚙️ Installation

### Prerequisites

Pastikan perangkat telah memiliki:

* Node.js
* npm
* Git
* Backend CampusFix yang telah dikonfigurasi

### 1. Clone Repository

```bash
git clone https://github.com/mhmdiqb/campusFix.git
cd campusFix/frontend
```

Jika repository sudah tersedia di komputer, langsung masuk ke direktori `frontend`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Connection

Buat file `.env` di dalam direktori `frontend` apabila belum tersedia, lalu isi:

```env
VITE_API_URL=https://campusfix.de.deplexo.com/api
```

Pastikan nama variabel sesuai dengan yang digunakan di `src/services/api.js`.

Jangan memasukkan JWT secret atau kredensial database backend ke environment variable frontend.

### 4. Run Development Server

```bash
npm run dev
```

Vite akan menampilkan alamat lokal di terminal. Biasanya alamatnya:

```text
http://localhost:5173
```

Buka alamat tersebut melalui browser untuk mengakses frontend lokal.

### 5. Run Linter

Untuk memeriksa masalah kode menggunakan ESLint, jalankan:

```bash
npm run lint
```

## 🧪 Demo dan Pengujian Panitia

Panitia dapat mengakses aplikasi melalui tautan berikut:

* **Website CampusFix:** https://campus-fix-sable.vercel.app
* **Backend API:** https://campusfix.de.deplexo.com

### Skenario Pengujian

| Role       | Skenario pengujian                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| STUDENT    | Login, membuat laporan kerusakan, melihat laporan pribadi, dan memantau status laporan.                              |
| TECHNICIAN | Login, melihat tugas yang ditugaskan, membuka detail laporan, dan memperbarui progres pekerjaan.                     |
| ADMIN      | Login, melihat ringkasan laporan, membuka detail laporan, memperbarui status, serta mengelola teknisi dan penugasan. |

### Akun Demo

Isi bagian berikut dengan kredensial akun demo yang benar-benar aktif dan telah diuji sebelum README dipublikasikan.

| Role       | Email                                                                               | Password                        |
| ---------- | ----------------------------------------------------------------------------------- | ------------------------------- |
| STUDENT    | [mahasiswa@student.unida.gontor.ac.id](mailto:mahasiswa@student.unida.gontor.ac.id) | `[Isi password demo mahasiswa]` |
| TECHNICIAN | `[Isi email demo teknisi]`                                                          | `[Isi password demo teknisi]`   |
| ADMIN      | `[Isi email demo admin]`                                                            | `[Isi password demo admin]`     |

**Catatan:** Ganti semua teks di dalam tanda kurung siku dengan kredensial demo yang telah disiapkan. Jangan mencantumkan password pribadi atau kredensial layanan lain. Pastikan setiap akun dapat login dan memiliki role yang sesuai sebelum diberikan kepada panitia.

### Alur Pengujian yang Disarankan

1. Buka website CampusFix.
2. Login menggunakan akun demo sesuai role.
3. Uji fitur yang tersedia untuk role tersebut.
4. Periksa apakah data yang dibuat atau diperbarui tampil sesuai pada aplikasi.
5. Logout sebelum mencoba role yang berbeda.

Ketersediaan fitur bergantung pada konfigurasi backend dan hak akses masing-masing akun.

## 🔒 Security Notes

* Jangan menyimpan password, JWT secret, atau kredensial database di source code frontend.
* Jangan mengandalkan pembatasan halaman frontend sebagai satu-satunya mekanisme keamanan.
* Backend harus memvalidasi token, role, dan hak akses pada endpoint yang memerlukan autentikasi.
* Jangan memasukkan secret backend ke variabel `VITE_*` karena nilainya dapat diakses oleh browser.
* Gunakan akun demo khusus untuk pengujian panitia.
* Jangan mencatat token atau kredensial sensitif ke log publik.
* Pastikan file `.env` yang berisi konfigurasi sensitif tidak ikut diunggah ke repository.

## 📌 Project Status

Frontend CampusFix telah dikembangkan untuk mendukung alur utama aplikasi, meliputi:

* Halaman login.
* Dashboard mahasiswa.
* Pembuatan dan daftar laporan.
* Detail laporan.
* Dashboard teknisi.
* Antarmuka admin.
* Integrasi dengan backend REST API.
* Pembatasan akses halaman berdasarkan autentikasi dan role.

Pengembangan lanjutan dapat mencakup peningkatan validasi form, penanganan loading dan error, pengujian otomatis, serta penyempurnaan tampilan responsif.

## 👨‍💻 Author

**Muhammad Iqbal**

GitHub: [@mhmdiqb](https://github.com/mhmdiqb)

Repository: [CampusFix](https://github.com/mhmdiqb/campusFix)

---

CampusFix merupakan proyek pengembangan sistem pelaporan dan penanganan kerusakan fasilitas kampus dengan frontend React dan backend REST API.
