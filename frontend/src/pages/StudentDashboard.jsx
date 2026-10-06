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
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Data user tidak valid:", err);
      }
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

    navigate("/login");
  };

  const scrollToReports = () => {
    document
      .getElementById("student-reports")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const totalReports = reports.length;

  const processedReports = reports.filter(
    (report) =>
      report.status === "IN_PROGRESS" ||
      report.status === "ASSIGNED"
  ).length;

  const completedReports = reports.filter(
    (report) =>
      report.status === "COMPLETED" ||
      report.status === "CONFIRMED"
  ).length;

  const pendingReports = reports.filter(
    (report) =>
      report.status === "REPORTED" ||
      report.status === "VERIFIED"
  ).length;

  const getStatusLabel = (status) => {
    const statusMap = {
      REPORTED: "Menunggu",
      VERIFIED: "Diverifikasi",
      ASSIGNED: "Ditugaskan",
      IN_PROGRESS: "Sedang Diproses",
      COMPLETED: "Selesai",
      CONFIRMED: "Dikonfirmasi",
      REJECTED: "Ditolak",
    };

    return statusMap[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const priorityMap = {
      LOW: "Rendah",
      MEDIUM: "Sedang",
      HIGH: "Tinggi",
      CRITICAL: "Kritis",
    };

    return priorityMap[priority] || priority;
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase().replace("_", "-") || "";
  };

  const getPriorityClass = (priority) => {
    return priority?.toLowerCase() || "";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="student-dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">CF</div>

          <div>
            <h2>CampusFix</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            onClick={() => navigate("/student")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={scrollToReports}
          >
            <span>▣</span>
            Laporan Saya
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/reports/create")}
          >
            <span>＋</span>
            Buat Laporan
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>
      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard-content">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <p className="header-label">
              STUDENT DASHBOARD
            </p>

            <h1>
              Halo,{" "}
              {user?.name?.split(" ")[0] || "Mahasiswa"} 👋
            </h1>

            <p className="header-description">
              Pantau dan kelola laporan fasilitas kampus kamu.
            </p>
          </div>

          <div className="user-info">

            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "M"}
            </div>

            <div className="user-details">
              <strong>
                {user?.name || "Mahasiswa"}
              </strong>

              <span>Mahasiswa</span>
            </div>

          </div>

        </header>


        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <span>Total Laporan</span>
              <strong>{totalReports}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">⏳</div>

            <div>
              <span>Menunggu</span>
              <strong>{pendingReports}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">🔧</div>

            <div>
              <span>Diproses</span>
              <strong>{processedReports}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Selesai</span>
              <strong>{completedReports}</strong>
            </div>
          </div>

        </section>


        {/* REPORT SECTION */}
        <section
          className="dashboard-section"
          id="student-reports"
        >

          <div className="section-header">

            <div>
              <p className="section-label">
                AKTIVITAS LAPORAN
              </p>

              <h2>Laporan Saya</h2>

              <p>
                Pantau perkembangan laporan fasilitas
                yang kamu buat.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/reports/create")}
            >
              ＋ Buat Laporan
            </button>

          </div>


          {/* LOADING */}
          {loadingReports && (
            <div className="empty-state">

              <div className="loading-spinner"></div>

              <h3>Memuat laporan...</h3>

              <p>
                Tunggu sebentar, kami sedang mengambil
                data laporan.
              </p>

            </div>
          )}


          {/* ERROR */}
          {!loadingReports && error && (
            <div className="empty-state error-state">

              <div className="empty-icon">
                ⚠️
              </div>

              <h3>Gagal memuat laporan</h3>

              <p>{error}</p>

              <button
                className="primary-button"
                onClick={fetchReports}
              >
                Coba Lagi
              </button>

            </div>
          )}


          {/* EMPTY */}
          {!loadingReports &&
            !error &&
            reports.length === 0 && (
              <div className="empty-state">

                <div className="empty-icon">
                  📋
                </div>

                <h3>Belum ada laporan</h3>

                <p>
                  Kamu belum membuat laporan kerusakan
                  fasilitas kampus.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("/reports/create")
                  }
                >
                  Buat Laporan Pertama
                </button>

              </div>
            )}


          {/* REPORT LIST */}
          {!loadingReports &&
            !error &&
            reports.length > 0 && (

              <div className="reports-list">

                {reports.slice(0, 5).map((report) => (

                  <div
                    className="report-card"
                    key={report.id}
                  >

                    <div className="report-main">

                      <div className="report-top">

                        <span className="report-id">
                          LAPORAN #{report.id}
                        </span>

                        <span
                          className={`status-badge ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {getStatusLabel(report.status)}
                        </span>

                      </div>


                      <h3>
                        {report.title}
                      </h3>


                      <p className="report-description">
                        {report.description}
                      </p>


                      <div className="report-meta">

                        <span>
                          📍{" "}
                          {report.facility?.name ||
                            "Fasilitas tidak diketahui"}
                        </span>

                        <span>
                          📅 {formatDate(report.createdAt)}
                        </span>

                        {report.priority && (
                          <span
                            className={`priority-badge ${getPriorityClass(
                              report.priority
                            )}`}
                          >
                            {getPriorityLabel(
                              report.priority
                            )}
                          </span>
                        )}

                      </div>

                    </div>


                    <button
                      className="detail-button"
                      onClick={() =>
                        navigate(
                          `/reports/${report.id}`
                        )
                      }
                    >
                      Lihat Detail →
                    </button>

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