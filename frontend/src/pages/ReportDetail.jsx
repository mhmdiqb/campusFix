import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ReportDetail.css";

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://campusfix.de.deplexo.com/api/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReport(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil detail laporan:", err);

      setError(
        err.response?.data?.message ||
          "Gagal mengambil detail laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompletion = async () => {
    const confirmAction = window.confirm(
      "Apakah kamu yakin laporan ini sudah selesai dan sesuai?"
    );

    if (!confirmAction) return;

    try {
      setConfirming(true);
      setError("");

      const token = localStorage.getItem("token");

      await axios.patch(
        `https://campusfix.de.deplexo.com/api/reports/${id}/confirm`,
        {
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ambil data terbaru setelah berhasil
      await fetchReportDetail();

      alert("Laporan berhasil dikonfirmasi selesai.");
    } catch (err) {
      console.error("Gagal mengonfirmasi laporan:", err);

      alert(
        err.response?.data?.message ||
          "Gagal mengonfirmasi laporan."
      );
    } finally {
      setConfirming(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      REPORTED: "Menunggu",
      VERIFIED: "Terverifikasi",
      ASSIGNED: "Ditugaskan",
      IN_PROGRESS: "Sedang Dikerjakan",
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

  const getHistoryTitle = (update) => {
    if (update.type === "STATUS_CHANGE") {
      return getStatusLabel(update.status);
    }

    return "Catatan";
  };

  const getHistoryDescription = (update) => {
    if (update.type === "STATUS_CHANGE") {
      return `Status laporan berubah menjadi ${getStatusLabel(
        update.status
      )}`;
    }

    if (update.note) {
      return update.note;
    }

    return "Aktivitas laporan";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="report-detail-page">
        <div className="report-message">
          <h2>Memuat detail laporan...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-detail-page">
        <div className="report-message">
          <h2>{error}</h2>

          <button
            className="back-button"
            onClick={() => navigate("/student")}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-detail-page">
        <div className="report-message">
          <h2>Laporan tidak ditemukan.</h2>

          <button
            className="back-button"
            onClick={() => navigate("/student")}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-detail-page">
      <div className="report-detail-container">

        {/* BACK BUTTON */}
        <button
          className="back-button"
          onClick={() => navigate("/student")}
        >
          ← Kembali
        </button>

        <div className="report-detail-card">

          {/* HEADER */}
          <div className="report-detail-header">
            <div>
              <span className="report-number">
                LAPORAN #{report.id}
              </span>

              <h1>{report.title}</h1>
            </div>

            <span className="status-badge">
              {getStatusLabel(report.status)}
            </span>
          </div>

          {/* INFORMATION */}
          <div className="report-info-grid">

            <div className="info-item">
              <span>Fasilitas</span>

              <strong>
                {report.facility?.name ||
                  "Tidak diketahui"}
              </strong>
            </div>

            <div className="info-item">
              <span>Lokasi</span>

              <strong>
                {report.facility?.location ||
                  "Tidak diketahui"}
              </strong>
            </div>

            <div className="info-item">
              <span>Prioritas</span>

              <strong>
                {getPriorityLabel(report.priority)}
              </strong>
            </div>

            <div className="info-item">
              <span>Dibuat Oleh</span>

              <strong>
                {report.user?.name || "Mahasiswa"}
              </strong>
            </div>

          </div>

          {/* DESCRIPTION */}
          <section className="detail-section">
            <h2>Deskripsi Kerusakan</h2>

            <p className="description">
              {report.description}
            </p>
          </section>

          <section className="detail-section">
            <h2>Foto Kerusakan</h2>

            {!report.images || report.images.length === 0 ? (
              <p>Tidak ada foto yang dilampirkan.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginTop: "15px",
                }}
              >
                {report.images.map((image) => (
                  <div key={image.id}>
                    <img
                      src={`https://campusfix.de.deplexo.com${image.imageUrl}`}
                      alt="Foto kerusakan"
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CONFIRM COMPLETION */}
          {report.status === "COMPLETED" && (
            <section className="detail-section confirmation-section">
              <div className="confirmation-card">
                <div className="confirmation-icon">
                  ✓
                </div>

                <div className="confirmation-content">
                  <h2>Laporan Sudah Selesai</h2>

                  <p>
                    Teknisi telah menyelesaikan laporan ini.
                    Silakan konfirmasi jika perbaikan sudah sesuai.
                  </p>

                  <button
                    className="confirm-button"
                    onClick={handleConfirmCompletion}
                    disabled={confirming}
                  >
                    {confirming
                      ? "Mengonfirmasi..."
                      : "✓ Konfirmasi Selesai"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TECHNICIAN */}
          {report.assignment && (
            <section className="detail-section">

              <h2>Teknisi</h2>

              <div className="technician-card">

                <div className="technician-avatar">
                  {report.assignment.technician?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "T"}
                </div>

                <div>
                  <strong>
                    {report.assignment.technician?.name ||
                      "Belum tersedia"}
                  </strong>

                  <p>
                    {report.assignment.technician?.email ||
                      "-"}
                  </p>
                </div>

              </div>
            </section>
          )}

          {/* HISTORY / TIMELINE */}
          <section className="detail-section">

            <div className="history-header">
              <span className="history-label">
                TRACKING LAPORAN
              </span>

              <h2>Riwayat Laporan</h2>

              <p>
                Perjalanan laporan dari dibuat hingga
                selesai.
              </p>
            </div>

            {!report.updates ||
            report.updates.length === 0 ? (
              <div className="empty-history">
                <div className="empty-history-icon">
                  📋
                </div>

                <strong>
                  Belum ada aktivitas
                </strong>

                <p>
                  Riwayat laporan akan muncul ketika
                  ada perubahan status.
                </p>
              </div>
            ) : (
              <div className="history-timeline">

                {report.updates.map(
                  (update, index) => (
                    <div
                      className="history-item"
                      key={update.id}
                    >

                      {/* TIMELINE DOT */}
                      <div
                        className={`history-dot ${
                          index ===
                          report.updates.length - 1
                            ? "history-dot-active"
                            : ""
                        }`}
                      ></div>

                      {/* CONTENT */}
                      <div className="history-content">

                        <div className="history-top">

                          <strong>
                            {getHistoryTitle(update)}
                          </strong>

                          <span>
                            {formatDate(
                              update.createdAt
                            )}
                          </span>

                        </div>

                        <p className="history-description">
                          {getHistoryDescription(
                            update
                          )}
                        </p>

                        <small>
                          Oleh{" "}
                          <strong>
                            {update.user?.name ||
                              "User"}
                          </strong>

                          {update.user?.role && (
                            <>
                              {" "}
                              · {update.user.role}
                            </>
                          )}
                        </small>

                      </div>
                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
}

export default ReportDetail;