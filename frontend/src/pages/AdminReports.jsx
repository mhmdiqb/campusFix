import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminReports.css";

function AdminReports() {
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

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reportsResponse, techniciansResponse] = await Promise.all([
        axios.get(
          "https://campusfix.de.deplexo.com/api/reports",
          { headers: getHeaders() }
        ),
        axios.get(
          "https://campusfix.de.deplexo.com/api/assignments/technicians",
          { headers: getHeaders() }
        ),
      ]);

      setReports(reportsResponse.data.data || []);
      setTechnicians(techniciansResponse.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(
        err.response?.data?.message || "Gagal mengambil data laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ASSIGN TECHNICIAN
  const handleAssignTechnician = async (reportId, technicianId) => {
    if (!technicianId) return;

    try {
      await axios.post(
        `https://campusfix.de.deplexo.com/api/assignments/reports/${reportId}`,
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
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (reportId, status) => {
    try {
      await axios.patch(
        `https://campusfix.de.deplexo.com/api/reports/${reportId}/status`,
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

  // STATUS LABEL
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

  // PRIORITY LABEL
  const getPriorityLabel = (priority) => {
    const labels = {
      LOW: "Rendah",
      MEDIUM: "Sedang",
      HIGH: "Tinggi",
      CRITICAL: "Kritis",
    };

    return labels[priority] || priority || "-";
  };

  // LOADING
  if (loading) {
    return (
      <div className="admin-reports-loading">
        <h2>Loading laporan...</h2>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <AdminSidebar />

      <main className="admin-reports-main">
        <div className="admin-reports-container">
          {/* HEADER */}
          <header className="admin-reports-header">
            <div>
              <div className="admin-label">ADMIN PORTAL</div>
              <h1>Daftar Laporan</h1>
              <p className="admin-subtitle">
                Kelola laporan kerusakan fasilitas kampus.
              </p>
            </div>

            <div className="admin-avatar">A</div>
          </header>

          {/* ERROR */}
          {error && <div className="admin-error">{error}</div>}

          {/* REPORT COUNT */}
          <section className="report-count-card">
            <div>
              <span className="report-count-label">Total Laporan</span>
              <strong className="report-count-number">
                {reports.length}
              </strong>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={fetchData}
            >
              ↻ Refresh Data
            </button>
          </section>

          {/* EMPTY STATE */}
          {reports.length === 0 ? (
            <section className="reports-empty">
              <div className="empty-icon">📋</div>
              <h3>Belum ada laporan</h3>
              <p>Belum ada laporan fasilitas dari mahasiswa.</p>
            </section>
          ) : (
            /* REPORT LIST */
            <section className="admin-report-grid">
              {reports.map((report) => (
                <article className="report-card" key={report.id}>
                  {/* REPORT TOP */}
                  <div className="report-card-top">
                    <span className="report-number">
                      LAPORAN #{report.id}
                    </span>

                    <span className="report-status">
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h2>{report.title}</h2>

                  {/* DESCRIPTION */}
                  <p className="report-description">
                    {report.description}
                  </p>

                  <hr className="report-divider" />

                  {/* REPORT INFO */}
                  <div className="report-info-grid">
                    <div>
                      <small>Pelapor</small>
                      <strong>{report.user?.name || "Mahasiswa"}</strong>
                    </div>

                    <div>
                      <small>Fasilitas</small>
                      <strong>{report.facility?.name || "-"}</strong>
                    </div>

                    <div>
                      <small>Lokasi</small>
                      <strong>{report.facility?.location || "-"}</strong>
                    </div>

                    <div>
                      <small>Prioritas</small>
                      <strong>
                        {getPriorityLabel(report.priority)}
                      </strong>
                    </div>
                  </div>

                  <hr className="report-divider" />

                  {/* ASSIGN TECHNICIAN */}
                  <label
                    className="report-field-label"
                    htmlFor={`technician-${report.id}`}
                  >
                    Teknisi
                  </label>

                  <select
                    id={`technician-${report.id}`}
                    defaultValue=""
                    onChange={(e) =>
                      handleAssignTechnician(
                        report.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="">-- Pilih Teknisi --</option>

                    {technicians.map((technician) => (
                      <option
                        key={technician.id}
                        value={technician.id}
                      >
                        {technician.name}
                      </option>
                    ))}
                  </select>

                  {/* UPDATE STATUS */}
                  <label
                    className="report-field-label status-label"
                    htmlFor={`status-${report.id}`}
                  >
                    Update Status
                  </label>

                  <select
                    id={`status-${report.id}`}
                    value={report.status}
                    onChange={(e) =>
                      handleStatusChange(report.id, e.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>

                  {/* DETAIL BUTTON */}
                  <button
                    type="button"
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

