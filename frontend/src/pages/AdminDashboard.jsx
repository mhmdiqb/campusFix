import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    "REPORTED", 
    "VERIFIED",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CONFIRMED",
    "REJECTED",
  ];

  const fetchTechnicians = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://campusfix.de.deplexo.com/api/assignments/technicians",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTechnicians(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil teknisi:", err);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://campusfix.de.deplexo.com/api/reports",
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

  useEffect(() => {
    fetchReports();
    fetchTechnicians();
  }, []);

  const handleAssignTechnician = async (reportId, technicianId) => {
    if (!technicianId) {
      alert("Pilih teknisi terlebih dahulu.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://campusfix.de.deplexo.com/api/assignments/reports/${reportId}`,
        {
          technicianId: Number(technicianId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Laporan berhasil ditugaskan ke teknisi.");

      fetchReports();
    } catch (err) {
      console.error("Gagal assign teknisi:", err);

      alert(
        err.response?.data?.message ||
          "Gagal menugaskan laporan ke teknisi."
      );
    }
  };

  const handleStatusChange = async (reportId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `https://campusfix.de.deplexo.com/api/reports/${reportId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReports();
    } catch (err) {
      console.error("Gagal mengubah status:", err);

      alert(
        err.response?.data?.message ||
          "Gagal mengubah status laporan."
      );
    }
  };

  const totalReports = reports.length;

  const reportedCount = reports.filter(
    (report) => report.status === "REPORTED"
  ).length;

  const assignedCount = reports.filter(
    (report) => report.status === "ASSIGNED"
  ).length;

  const inProgressCount = reports.filter(
    (report) => report.status === "IN_PROGRESS"
  ).length;

  const completedCount = reports.filter(
    (report) => report.status === "COMPLETED"
  ).length;

  const getStatusLabel = (status) => {
    const labels = {
      REPORTED: "Baru",
      VERIFIED: "Terverifikasi",
      ASSIGNED: "Ditugaskan",
      IN_PROGRESS: "Diproses",
      COMPLETED: "Selesai",
      CONFIRMED: "Dikonfirmasi",
      REJECTED: "Ditolak",
    };

    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <div className="logo-small">CF</div>

          <h2>CampusFix</h2>

          <span>Admin Portal</span>
        </div>

        <nav className="admin-nav">

          <a href="/admin" className="active">
            ▦ Dashboard
          </a>

          <a href="/admin/reports">
            ▤ Laporan
          </a>

          <a href="/admin/technicians">
            ♙ Teknisi
          </a>

        </nav>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          ↪ Logout
        </button>

      </aside>

      {/* CONTENT */}
      <main className="admin-content">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <span className="portal-label">
              ADMIN PORTAL
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Kelola dan pantau laporan kerusakan fasilitas kampus.
            </p>
          </div>

          <div className="admin-avatar">
            A
          </div>

        </header>

        {/* ERROR */}
        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="stat-icon blue">
              ▤
            </div>

            <div>
              <span>Total Laporan</span>
              <strong>{totalReports}</strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon orange">
              ◷
            </div>

            <div>
              <span>Laporan Baru</span>
              <strong>{reportedCount}</strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon purple">
              ⚙
            </div>

            <div>
              <span>Ditugaskan</span>
              <strong>{assignedCount}</strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Selesai</span>
              <strong>{completedCount}</strong>
            </div>

          </div>

        </section>

        {/* SUMMARY BAR */}
        <section className="admin-summary">

          <div>
            🔧 Sedang Diproses{" "}
            <strong>{inProgressCount}</strong>
          </div>

          <div>
            👨‍🔧 Total Teknisi{" "}
            <strong>{technicians.length}</strong>
          </div>

          <button
            onClick={() => {
              fetchReports();
              fetchTechnicians();
            }}
          >
            ↻ Refresh Data
          </button>

        </section>

        {/* MANAGEMENT */}
        <section className="admin-management">

          <div className="management-header">

            <div>
              <span className="section-label">
                MANAGEMENT
              </span>

              <h2>Daftar Laporan</h2>

              <p>
                Kelola laporan mahasiswa dan tugaskan teknisi.
              </p>
            </div>

          </div>

          {/* REPORTS */}
          {reports.length === 0 ? (

            <div className="empty-admin">
              <div>📋</div>

              <h3>Belum ada laporan</h3>

              <p>
                Belum ada laporan fasilitas dari mahasiswa.
              </p>
            </div>

          ) : (

            <div className="admin-report-grid">

              {reports.map((report) => (

                <div
                  className="admin-report-card"
                  key={report.id}
                >

                  {/* TOP */}
                  <div className="report-top">

                    <span>
                      LAPORAN #{report.id}
                    </span>

                    <span
                      className={`status-badge ${report.status?.toLowerCase()}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>

                  </div>

                  {/* TITLE */}
                  <h3>
                    {report.title}
                  </h3>

                  <p className="report-description">
                    {report.description}
                  </p>

                  <div className="report-divider"></div>

                  {/* INFO */}
                  <div className="report-info-grid">

                    <div>
                      <span>Pelapor</span>
                      <strong>
                        {report.user?.name || "Mahasiswa"}
                      </strong>
                    </div>

                    <div>
                      <span>Fasilitas</span>
                      <strong>
                        {report.facility?.name || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Lokasi</span>
                      <strong>
                        {report.facility?.location || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Prioritas</span>
                      <strong>
                        {report.priority || "-"}
                      </strong>
                    </div>

                  </div>

                  <div className="report-divider"></div>

                  {/* TECHNICIAN */}
                  <div className="assignment-section">

                    <label>
                      Teknisi
                    </label>

                    <select
                      defaultValue=""
                      onChange={(e) =>
                        handleAssignTechnician(
                          report.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        -- Pilih Teknisi --
                      </option>

                      {technicians.map((technician) => (

                        <option
                          key={technician.id}
                          value={technician.id}
                        >
                          {technician.name}
                        </option>

                      ))}

                    </select>

                  </div>

                  {/* STATUS */}
                  <div className="assignment-section">

                    <label>
                      Update Status
                    </label>

                    <select
                      value={report.status}
                      onChange={(e) =>
                        handleStatusChange(
                          report.id,
                          e.target.value
                        )
                      }
                    >

                      {statuses.map((status) => (

                        <option
                          key={status}
                          value={status}
                        >
                          {getStatusLabel(status)}
                        </option>

                      ))}

                    </select>

                    <button
                      className="detail-button"
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                    >
                      👁 Lihat Detail
                    </button>

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

export default AdminDashboard;