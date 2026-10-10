# CampusFix Frontend

Frontend untuk **CampusFix**, sebuah aplikasi pelaporan dan penanganan kerusakan fasilitas kampus. Aplikasi ini menyediakan antarmuka bagi mahasiswa untuk melaporkan kerusakan, teknisi untuk menangani tugas perbaikan, dan admin untuk mengelola laporan fasilitas kampus.

Frontend dikembangkan menggunakan React dan Vite, serta terhubung dengan backend CampusFix melalui REST API.

## 🚀 Tech Stack

* **Library UI:** React
* **Build Tool & Development Server:** Vite
* **Programming Language:** JavaScript
* **Styling:** CSS
* **HTTP Communication:** Fetch API atau konfigurasi API pada service frontend
* **Version Control:** Git & GitHub

## 📁 Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── vite.svg
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
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

**Keterangan folder utama:**

* `pages/` — halaman login, dashboard mahasiswa, dashboard admin, pengelolaan laporan, teknisi, dan detail laporan.
* `services/api.js` — bagian frontend yang menangani komunikasi dengan backend API.
* `ProtectedRoute.jsx` — komponen untuk membantu membatasi akses halaman berdasarkan autentikasi dan role.
* `App.jsx` dan `App.css` — komponen utama aplikasi dan styling-nya.
* `index.css` — styling global aplikasi.
* `assets/` — aset statis yang digunakan frontend.


> Struktur di atas merupakan gambaran berdasarkan file yang terlihat pada repository. Nama dan lokasi file lain dapat berbeda mengikuti perkembangan proyek.

## ✨ Features

### 1. Authentication

Frontend menyediakan halaman login untuk pengguna mengakses aplikasi CampusFix.

* Mengirim permintaan login ke backend.
* Menggunakan token autentikasi untuk request yang memerlukan login.
* Mengarahkan pengguna berdasarkan alur autentikasi aplikasi.

### 2. Role-Based Access

CampusFix memiliki tiga role pengguna utama:

| Role         | Fungsi                                                           |
| ------------ | ---------------------------------------------------------------- |
| `STUDENT`    | Mengakses dashboard mahasiswa dan laporan kerusakan.             |
| `TECHNICIAN` | Melihat tugas yang ditugaskan dan memperbarui progres pekerjaan. |
| `ADMIN`      | Mengelola laporan dan penugasan teknisi melalui halaman admin.   |

Komponen `ProtectedRoute.jsx` digunakan untuk mendukung pembatasan akses halaman berdasarkan autentikasi dan konfigurasi role.

### 3. Student Dashboard

Dashboard mahasiswa menjadi halaman utama untuk mengakses fitur pelaporan fasilitas kampus.

Fitur yang dikembangkan meliputi tampilan ringkasan dan akses menuju data laporan mahasiswa.

### 4. My Reports

Halaman `MyReports.jsx` digunakan untuk menampilkan laporan mahasiswa.

Halaman ini membantu pengguna melihat laporan yang telah dibuat dan mengakses detail laporan sesuai hak aksesnya.

### 5. Report Detail

Halaman `ReportDetail.jsx` digunakan untuk menampilkan informasi terperinci mengenai suatu laporan.

Informasi yang ditampilkan mengikuti data yang disediakan backend, seperti judul, deskripsi, status, prioritas, dan informasi terkait fasilitas.

### 6. Technician Dashboard

Dashboard teknisi menyediakan tampilan tugas perbaikan yang ditugaskan kepada teknisi.

Fitur yang telah dikembangkan meliputi:

* Melihat assignment milik teknisi yang sedang login.
* Menampilkan ringkasan tugas berdasarkan status.
* Melihat detail laporan yang ditugaskan.
* Memperbarui status pekerjaan melalui backend.

### 7. Admin Interface

Frontend juga mencakup antarmuka admin untuk mendukung pengelolaan laporan dan penugasan teknisi.

Halaman admin menggunakan sidebar navigasi untuk berpindah antarbagian aplikasi. Tampilan dirancang menggunakan CSS dengan tema terang pada halaman utama.

### 8. API Integration

Frontend berkomunikasi dengan backend CampusFix melalui REST API.

File `src/services/api.js` digunakan sebagai bagian dari pengelolaan komunikasi API frontend.

Backend lokal secara default menggunakan alamat:

```text
https://campusfix.de.deplexo.com
```

Pastikan alamat API pada konfigurasi frontend sesuai dengan backend yang sedang dijalankan.

## ⚙️ Installation

### Prerequisites

Pastikan sudah tersedia:

* Node.js
* npm
* Git
* Backend CampusFix yang telah dikonfigurasi

### 1. Clone Repository

Jika repository belum tersedia di komputer:

```bash
git clone https://github.com/mhmdiqb/campusFix.git
```

Masuk ke direktori frontend:

```bash
cd campusFix/frontend
```

Jika repository sudah ada, cukup masuk ke folder `frontend`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Connection

Pastikan konfigurasi pada `src/services/api.js` mengarah ke backend yang benar.

Alamat backend lokal:

```text
https://campusfix.de.deplexo.com
```

Sesuaikan konfigurasi tersebut dengan implementasi `api.js` yang digunakan proyek.

### 4. Run Development Server

```bash
npm run dev
```

Vite akan menampilkan alamat lokal di terminal. Secara default, alamatnya biasanya:

```text
http://localhost:5173
```

Buka alamat tersebut melalui browser untuk mengakses frontend CampusFix.

## 🔗 Backend Integration

Frontend terhubung dengan backend CampusFix yang menangani:

* Authentication dan authorization.
* Data fasilitas dan kategori fasilitas.
* Pembuatan dan pengelolaan laporan.
* Riwayat serta gambar laporan.
* Assignment dan status pekerjaan teknisi.
* Dashboard admin.
* Audit logging.

Frontend berfungsi sebagai antarmuka pengguna, sedangkan validasi data, aturan akses, dan proses bisnis utama ditangani backend.

## 🧪 Development

Untuk menjalankan frontend dan backend secara lokal:

1. Pastikan MySQL telah berjalan.
2. Jalankan backend CampusFix sesuai instruksi pada `backend/README.md`.
3. Jalankan frontend dengan `npm run dev`.
4. Buka URL lokal yang diberikan Vite.
5. Uji login serta fitur menggunakan akun sesuai role masing-masing.

Untuk memeriksa masalah kode menggunakan ESLint, jalankan:

```bash
npm run lint
```

## 🔒 Security Notes

* Jangan menyimpan password, JWT secret, atau kredensial database di source code frontend.
* Jangan menganggap pembatasan halaman frontend sebagai satu-satunya mekanisme keamanan.
* Endpoint backend harus tetap memvalidasi token, role, dan hak akses pengguna.
* Jangan menaruh secret backend di variabel frontend yang dapat diakses browser.
* Pastikan token autentikasi ditangani dengan hati-hati dan tidak dicatat ke log publik.

## 📌 Project Status

Frontend CampusFix dikembangkan untuk mendukung alur utama aplikasi, termasuk:

* Halaman login.
* Dashboard mahasiswa.
* Daftar laporan mahasiswa.
* Detail laporan.
* Dashboard teknisi.
* Tampilan pengelolaan laporan oleh admin.
* Integrasi dengan backend CampusFix.
* Pembatasan akses halaman berdasarkan autentikasi dan role.

Pengembangan berikutnya dapat mencakup peningkatan pengalaman pengguna, validasi form, penanganan loading dan error, pengujian komponen, serta penyempurnaan tampilan responsif.

## 👨‍💻 Author

**Muhammad Iqbal**

GitHub: [@mhmdiqb](https://github.com/mhmdiqb)

Repository: [CampusFix](https://github.com/mhmdiqb/campusFix)

---

CampusFix merupakan proyek pengembangan sistem pelaporan dan penanganan kerusakan fasilitas kampus dengan frontend React dan backend REST API.
