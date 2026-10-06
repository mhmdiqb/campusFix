import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyReports.css";

function MyReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

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

  const getStatusClass = (status) => {
    return status?.toLowerCase().replace("_", "-") || "";
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

  const filteredReports =
    filter === "ALL"
      ? reports
      : reports.filter((report) => report.status === filter);

  return (
    <div className="my-reports-page">
      <aside className="reports-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">CF</div>

          <div>
            <h2>CampusFix</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-item"
            onClick={() => navigate("/student")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button className="nav-item active">
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
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="reports-content">
        <header className="reports-header">
          <div>
            <p className="header-label">LAPORAN SAYA</p>

            <h1>Daftar Laporan</h1>

            <p>
              Pantau seluruh laporan fasilitas kampus yang telah kamu buat.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/reports/create")}
          >
            ＋ Buat Laporan
          </button>
        </header>

        <section className="report-summary">
          <div className="summary-card">
            <span>Total</span>
            <strong>{reports.length}</strong>
          </div>

          <div className="summary-card">
            <span>Menunggu</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "REPORTED" ||
                    report.status === "VERIFIED"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Diproses</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "ASSIGNED" ||
                    report.status === "IN_PROGRESS"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Selesai</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "COMPLETED" ||
                    report.status === "CONFIRMED"
                ).length
              }
            </strong>
          </div>
        </section>

        <section className="reports-panel">
          <div className="panel-header">
            <div>
              <h2>Semua Laporan</h2>
              <p>Riwayat laporan fasilitas yang kamu buat.</p>
            </div>

            <div className="filter-buttons">
              <button
                className={filter === "ALL" ? "filter active" : "filter"}
                onClick={() => setFilter("ALL")}
              >
                Semua
              </button>

              <button
                className={
                  filter === "REPORTED" ? "filter active" : "filter"
                }
                onClick={() => setFilter("REPORTED")}
              >
                Menunggu
              </button>

              <button
                className={
                  filter === "IN_PROGRESS"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("IN_PROGRESS")}
              >
                Diproses
              </button>

              <button
                className={
                  filter === "COMPLETED"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("COMPLETED")}
              >
                Selesai
              </button>
            </div>
          </div>

          {loading && (
            <div className="reports-empty">
              <div className="loading-spinner"></div>
              <h3>Memuat laporan...</h3>
              <p>Mohon tunggu sebentar.</p>
            </div>
          )}

          {!loading && error && (
            <div className="reports-empty">
              <div className="empty-icon">⚠️</div>
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

          {!loading &&
            !error &&
            filteredReports.length === 0 && (
              <div className="reports-empty">
                <div className="empty-icon">📋</div>

                <h3>Tidak ada laporan</h3>

                <p>
                  Belum ada laporan yang sesuai dengan filter ini.
                </p>

                <button
                  className="primary-button"
                  onClick={() => navigate("/reports/create")}
                >
                  Buat Laporan
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            filteredReports.length > 0 && (
              <div className="my-report-list">
                {filteredReports.map((report) => (
                  <article
                    className="my-report-card"
                    key={report.id}
                  >
                    <div className="my-report-content">
                      <div className="my-report-top">
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

                      <h3>{report.title}</h3>

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
                            {getPriorityLabel(report.priority)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className="detail-button"
                      onClick={() =>
                        navigate(`/reports/${report.id}`)
                      }
                    >
                      Lihat Detail →
                    </button>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default MyReports;