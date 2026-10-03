import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="student-dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>CampusFix</h2>
          <span>Student Portal</span>
        </div>

        <nav>
          <a href="#" className="active">
            Dashboard
          </a>

          <a href="#">
            Laporan Saya
          </a>

          <a href="#">
            Buat Laporan
          </a>

          <a href="#">
            Riwayat
          </a>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Selamat datang kembali,{" "}
              <strong>{user?.name || "Mahasiswa"}</strong>.
            </p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || "M"}
            </div>

            <div>
              <strong>{user?.name || "Mahasiswa"}</strong>
              <span>{user?.role || "STUDENT"}</span>
            </div>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Laporan</span>
            <strong>0</strong>
          </div>

          <div className="stat-card">
            <span>Diproses</span>
            <strong>0</strong>
          </div>

          <div className="stat-card">
            <span>Selesai</span>
            <strong>0</strong>
          </div>

          <div className="stat-card">
            <span>Menunggu</span>
            <strong>0</strong>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Laporan Terbaru</h2>
              <p>Daftar laporan fasilitas yang kamu buat.</p>
            </div>

            <button className="primary-button">
              + Buat Laporan
            </button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">📋</div>

            <h3>Belum ada laporan</h3>

            <p>
              Kamu belum membuat laporan kerusakan fasilitas.
            </p>

            <button className="primary-button">
              Buat Laporan Pertama
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;