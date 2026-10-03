import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/api/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Reports:", response.data);

      setReports(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);
      setError("Gagal mengambil data laporan.");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const totalReports = reports.length;

  const processedReports = reports.filter(
    (report) =>
      report.status === "IN_PROGRESS" ||
      report.status === "PROCESSING"
  ).length;

  const completedReports = reports.filter(
    (report) =>
      report.status === "COMPLETED" ||
      report.status === "DONE"
  ).length;

  const pendingReports = reports.filter(
    (report) =>
      report.status === "REPORTED" ||
      report.status === "PENDING" ||
      report.status === "WAITING"
  ).length;

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
            <strong>{totalReports}</strong>
          </div>

          <div className="stat-card">
            <span>Diproses</span>
            <strong>{processedReports}</strong>
          </div>

          <div className="stat-card">
            <span>Selesai</span>
            <strong>{completedReports}</strong>
          </div>

          <div className="stat-card">
            <span>Menunggu</span>
            <strong>{pendingReports}</strong>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Laporan Terbaru</h2>
              <p>Daftar laporan fasilitas yang kamu buat.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/reports/create")}
            >
              + Buat Laporan
            </button>
          </div>

          {loadingReports ? (
            <div className="empty-state">
              <h3>Memuat laporan...</h3>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>{error}</h3>
            </div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>

              <h3>Belum ada laporan</h3>

              <p>
                Kamu belum membuat laporan kerusakan fasilitas.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/reports/create")}
              >
                Buat Laporan Pertama
              </button>
            </div>
          ) : (
            <div className="reports-list">
              {reports.slice(0, 5).map((report) => (
                <div className="report-card" key={report.id}>
                  <div>
                    <h3>{report.title}</h3>

                    <p>{report.description}</p>

                    <small>
                      Fasilitas:{" "}
                      {report.facility?.name || "Tidak diketahui"}
                    </small>
                  </div>

                  <div>
                    <strong>{report.status}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
