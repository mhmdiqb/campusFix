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

  // =========================
  // FETCH DATA
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [reportsResponse, techniciansResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/reports", {
          headers,
        }),

        axios.get("http://localhost:3000/api/assignments/technicians", {
          headers,
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

  // =========================
  // ASSIGN TECHNICIAN
  // =========================

  const handleAssignTechnician = async (reportId, technicianId) => {
    if (!technicianId) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3000/api/assignments/reports/${reportId}`,
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

      fetchData();
    } catch (err) {
      console.error("Gagal assign teknisi:", err);

      alert(
        err.response?.data?.message ||
          "Gagal menugaskan laporan ke teknisi."
      );
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (reportId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/reports/${reportId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();
    } catch (err) {
      console.error("Gagal mengubah status:", err);

      alert(
        err.response?.data?.message ||
          "Gagal mengubah status laporan."
      );
    }
  };

  // =========================
  // STATUS LABEL
  // =========================

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

  // =========================
  // PRIORITY LABEL
  // =========================

  const getPriorityLabel = (priority) => {
    const labels = {
      LOW: "Rendah",
      MEDIUM: "Sedang",
      HIGH: "Tinggi",
      CRITICAL: "Kritis",
    };

    return labels[priority] || priority || "-";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fb",
        }}
      >
        <h2>Loading laporan...</h2>
      </div>
    );
  }

  // =========================
  // MAIN RETURN
  // =========================

  return (
    <div
      className="admin-reports-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
        color: "#172033",
      }}
    >
      {/* =========================
          SIDEBAR
      ========================= */}

      <AdminSidebar />

      {/* =========================
          CONTENT
      ========================= */}

      <main
        style={{
          flex: 1,
          padding: "40px",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* =========================
              HEADER
          ========================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "35px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#2563eb",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                }}
              >
                ADMIN PORTAL
              </div>

              <h1
                style={{
                  margin: "8px 0",
                  fontSize: "34px",
                }}
              >
                Daftar Laporan
              </h1>

              <p
                style={{
                  color: "#64748b",
                  margin: 0,
                }}
              >
                Kelola laporan kerusakan fasilitas kampus.
              </p>
            </div>

            {/* ADMIN AVATAR */}

            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "20px",
              }}
            >
              A
            </div>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* =========================
              REPORT COUNT
          ========================= */}

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "25px",
              marginBottom: "25px",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    color: "#64748b",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  Total Laporan
                </span>

                <strong
                  style={{
                    fontSize: "28px",
                  }}
                >
                  {reports.length}
                </strong>
              </div>

              <button
                onClick={fetchData}
                style={{
                  border: "none",
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "11px 18px",
                  borderRadius: "9px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ↻ Refresh Data
              </button>
            </div>
          </div>

          {/* =========================
              EMPTY STATE
          ========================= */}

          {reports.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "15px",
                }}
              >
                📋
              </div>

              <h3>Belum ada laporan</h3>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Belum ada laporan fasilitas dari mahasiswa.
              </p>
            </div>
          ) : (
            /* =========================
               REPORT LIST
            ========================= */

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(420px, 1fr))",
                gap: "20px",
              }}
            >
              {reports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "24px",
                    boxShadow:
                      "0 2px 8px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  {/* REPORT TOP */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "1px",
                      }}
                    >
                      LAPORAN #{report.id}
                    </span>

                    <span
                      style={{
                        padding: "7px 12px",
                        borderRadius: "20px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: "21px",
                    }}
                  >
                    {report.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                    }}
                  >
                    {report.description}
                  </p>

                  <hr
                    style={{
                      border: 0,
                      borderTop: "1px solid #e5e7eb",
                      margin: "20px 0",
                    }}
                  />

                  {/* REPORT INFO */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "18px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <small
                        style={{
                          color: "#64748b",
                        }}
                      >
                        Pelapor
                      </small>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {report.user?.name || "Mahasiswa"}
                      </strong>
                    </div>

                    <div>
                      <small
                        style={{
                          color: "#64748b",
                        }}
                      >
                        Fasilitas
                      </small>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {report.facility?.name || "-"}
                      </strong>
                    </div>

                    <div>
                      <small
                        style={{
                          color: "#64748b",
                        }}
                      >
                        Lokasi
                      </small>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {report.facility?.location || "-"}
                      </strong>
                    </div>

                    <div>
                      <small
                        style={{
                          color: "#64748b",
                        }}
                      >
                        Prioritas
                      </small>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {getPriorityLabel(report.priority)}
                      </strong>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: 0,
                      borderTop: "1px solid #e5e7eb",
                      margin: "20px 0",
                    }}
                  />

                  {/* =========================
                      ASSIGN TECHNICIAN
                  ========================= */}

                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "7px",
                    }}
                  >
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
                    style={selectStyle}
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

                  {/* =========================
                      UPDATE STATUS
                  ========================= */}

                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginTop: "15px",
                      marginBottom: "7px",
                    }}
                  >
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
                    style={selectStyle}
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

                  {/* =========================
                      DETAIL BUTTON
                  ========================= */}

                  <button
                    onClick={() =>
                      navigate(`/reports/${report.id}`)
                    }
                    style={{
                      width: "100%",
                      marginTop: "15px",
                      padding: "11px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    👁 Lihat Detail
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "11px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "white",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default AdminReports;

