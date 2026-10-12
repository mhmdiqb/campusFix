
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminReports.css";

const API_URL = "https://campusfix.de.deplexo.com/api";

const statuses = [
  "REPORTED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CONFIRMED",
  "REJECTED",
];

function AdminReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigningId, setAssigningId] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reportsResponse, techniciansResponse] =
        await Promise.all([
          axios.get(`${API_URL}/reports`, {
            headers: getHeaders(),
          }),
          axios.get(`${API_URL}/assignments/technicians`, {
            headers: getHeaders(),
          }),
        ]);

      setReports(reportsResponse.data.data || []);
      setTechnicians(techniciansResponse.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil data laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTechnician = async (reportId, technicianId) => {
    if (!technicianId) return;

    try {
      setAssigningId(reportId);

      await axios.post(
        `${API_URL}/assignments/reports/${reportId}`,
        { technicianId: Number(technicianId) },
        { headers: getHeaders() }
      );

      alert("Laporan berhasil ditugaskan ke teknisi.");
      await fetchData();
    } catch (err) {
      console.error("Gagal assign teknisi:", err);
      alert(
        err.response?.data?.message ||
          "Gagal menugaskan laporan ke teknisi."
      );
    } finally {
      setAssigningId(null);
    }
  };

  const handleStatusChange = async (reportId, status) => {
    try {
      await axios.patch(
        `${API_URL}/reports/${reportId}/status`,
        { status },
        { headers: getHeaders() }
      );

      await fetchData();
    } catch (err) {
      console.error("Gagal mengubah status:", err);
      alert(
        err.response?.data?.message ||
          "Gagal mengubah status laporan."
      );
    }
  };

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

  const getPriorityLabel = (priority) => {
    const labels = {
      LOW: "Rendah",
      MEDIUM: "Sedang",
      HIGH: "Tinggi",
      CRITICAL: "Kritis",
    };

    return labels[priority] || priority || "-";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-reports-loading">
        <h2>Memuat laporan...</h2>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <AdminSidebar />

      <main className="admin-reports-main">
        <div className="admin-reports-content">
          <header className="admin-reports-header">
            <div>
              <span className="admin-eyebrow">ADMIN PORTAL</span>
              <h1>Daftar Laporan</h1>
              <p>
                Kelola laporan kerusakan fasilitas kampus.
              </p>
            </div>

            <div className="admin-avatar">A</div>
          </header>

          {error && (
            <div className="admin-reports-error">
              {error}
              <button onClick={fetchData}>Coba lagi</button>
            </div>
          )}

          <section className="report-summary">
            <div>
              <span>Total Laporan</span>
              <strong>{reports.length}</strong>
            </div>

            <button
              className="refresh-button"
              onClick={fetchData}
            >
              ↻ Refresh Data
            </button>
          </section>

          {reports.length === 0 ? (
            <section className="report-empty">
              <div>📋</div>
              <h3>Belum ada laporan</h3>
              <p>
                Belum ada laporan fasilitas dari mahasiswa.
              </p>
            </section>
          ) : (
            <section className="report-list">
              {reports.map((report) => (
                <article className="report-card" key={report.id}>
                  <div className="report-card-header">
                    <span className="report-number">
                      LAPORAN #{report.id}
                    </span>

                    <span
                      className={`report-status status-${report.status.toLowerCase()}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  <h2 className="report-title">
                    {report.title}
                  </h2>

                  <p className="report-description">
                    {report.description}
                  </p>

                  <div className="report-info">
                    <div>
                      <small>Pelapor</small>
                      <strong>
                        {report.user?.name || "Mahasiswa"}
                      </strong>
                    </div>

                    <div>
                      <small>Fasilitas</small>
                      <strong>
                        {report.facility?.name || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>Lokasi</small>
                      <strong>
                        {report.facility?.location || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>Prioritas</small>
                      <strong>
                        {getPriorityLabel(report.priority)}
                      </strong>
                    </div>
                  </div>

                  <div className="report-form-group">
                    <label htmlFor={`technician-${report.id}`}>
                      Teknisi
                    </label>

                    <select
                      id={`technician-${report.id}`}
                      defaultValue=""
                      disabled={assigningId === report.id}
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

                  <div className="report-form-group">
                    <label htmlFor={`status-${report.id}`}>
                      Update Status
                    </label>

                    <select
                      id={`status-${report.id}`}
                      value={report.status}
                      onChange={(e) =>
                        handleStatusChange(
                          report.id,
                          e.target.value
                        )
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="report-detail-button"
                    onClick={() =>
                      navigate(`/admin/reports/${report.id}`)
                    }
                  >
                    👁 Lihat Detail
                  </button>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminReports;
