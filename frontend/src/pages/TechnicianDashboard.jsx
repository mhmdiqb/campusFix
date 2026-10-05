import { useEffect, useState } from "react";
import axios from "axios";

function TechnicianDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/api/assignments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil assignment:", err);

      setError(
        err.response?.data?.message ||
          "Gagal mengambil laporan yang ditugaskan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleStatusChange = async (assignmentId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/assignments/${assignmentId}/status`,
        {
          status,
          note:
            status === "IN_PROGRESS"
              ? "Teknisi mulai mengerjakan laporan."
              : "Perbaikan fasilitas telah selesai.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Status laporan berhasil diperbarui.");

      fetchAssignments();
    } catch (err) {
      console.error("Gagal mengubah status:", err);

      alert(
        err.response?.data?.message ||
          "Gagal mengubah status laporan."
      );
    }
  };

  const totalAssignments = assignments.length;

  const assignedCount = assignments.filter(
    (item) => item.report?.status === "ASSIGNED"
  ).length;

  const inProgressCount = assignments.filter(
    (item) => item.report?.status === "IN_PROGRESS"
  ).length;

  const completedCount = assignments.filter(
    (item) => item.report?.status === "COMPLETED"
  ).length;

  const getStatusLabel = (status) => {
    const labels = {
      ASSIGNED: "Ditugaskan",
      IN_PROGRESS: "Dikerjakan",
      COMPLETED: "Selesai",
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

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (status === "IN_PROGRESS") {
      return {
        background: "#ede9fe",
        color: "#7c3aed",
      };
    }

    return {
      background: "#dbeafe",
      color: "#2563eb",
    };
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        <h2>Loading technician dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        color: "#172033",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "35px",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              TECHNICIAN PORTAL
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "700",
              }}
            >
              Technician Dashboard
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              Kelola laporan fasilitas yang ditugaskan kepada kamu.
            </p>
          </div>

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            T
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "14px 18px",
              marginBottom: "25px",
              borderRadius: "10px",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          {/* TOTAL */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "22px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "#dbeafe",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              ☷
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Total Tugas
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  marginTop: "4px",
                }}
              >
                {totalAssignments}
              </strong>
            </div>
          </div>

          {/* ASSIGNED */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "22px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "21px",
              }}
            >
              ◷
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Ditugaskan
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  marginTop: "4px",
                }}
              >
                {assignedCount}
              </strong>
            </div>
          </div>

          {/* IN PROGRESS */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "22px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "#ede9fe",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "21px",
              }}
            >
              ⚙
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Dikerjakan
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  marginTop: "4px",
                }}
              >
                {inProgressCount}
              </strong>
            </div>
          </div>

          {/* COMPLETED */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "22px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              ✓
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Selesai
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "28px",
                  marginTop: "4px",
                }}
              >
                {completedCount}
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION */}
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* SECTION HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                }}
              >
                Laporan yang Ditugaskan
              </h2>

              <p
                style={{
                  marginTop: "7px",
                  marginBottom: 0,
                  color: "#64748b",
                }}
              >
                Kelola dan perbarui status laporan fasilitas.
              </p>
            </div>

            <button
              onClick={fetchAssignments}
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

          {/* EMPTY */}
          {assignments.length === 0 ? (
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "50px 20px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "10px",
                }}
              >
                ✓
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#172033",
                }}
              >
                Belum ada tugas
              </h3>

              <p style={{ margin: 0 }}>
                Belum ada laporan yang ditugaskan kepada kamu.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "18px",
              }}
            >
              {assignments.map((assignment) => {
                const report = assignment.report;

                return (
                  <div
                    key={assignment.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "24px",
                      background: "#ffffff",
                    }}
                  >
                    {/* CARD HEADER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "18px",
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
                        LAPORAN #{report?.id}
                      </span>

                      <span
                        style={{
                          ...getStatusStyle(report?.status),
                          padding: "8px 14px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {getStatusLabel(report?.status)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3
                      style={{
                        margin: "0",
                        fontSize: "22px",
                        color: "#172033",
                      }}
                    >
                      {report?.title || "Tanpa judul"}
                    </h3>

                    <p
                      style={{
                        marginTop: "8px",
                        color: "#64748b",
                        lineHeight: "1.6",
                      }}
                    >
                      {report?.description ||
                        "Tidak ada deskripsi."}
                    </p>

                    <hr
                      style={{
                        border: 0,
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0",
                      }}
                    />

                    {/* INFORMATION */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "block",
                            color: "#94a3b8",
                            fontSize: "12px",
                            marginBottom: "5px",
                          }}
                        >
                          Fasilitas
                        </span>

                        <strong>
                          {report?.facility?.name || "-"}
                        </strong>
                      </div>

                      <div>
                        <span
                          style={{
                            display: "block",
                            color: "#94a3b8",
                            fontSize: "12px",
                            marginBottom: "5px",
                          }}
                        >
                          Lokasi
                        </span>

                        <strong>
                          {report?.facility?.location || "-"}
                        </strong>
                      </div>

                      <div>
                        <span
                          style={{
                            display: "block",
                            color: "#94a3b8",
                            fontSize: "12px",
                            marginBottom: "5px",
                          }}
                        >
                          Prioritas
                        </span>

                        <strong>
                          {getPriorityLabel(report?.priority)}
                        </strong>
                      </div>

                      <div>
                        <span
                          style={{
                            display: "block",
                            color: "#94a3b8",
                            fontSize: "12px",
                            marginBottom: "5px",
                          }}
                        >
                          Status
                        </span>

                        <strong>
                          {getStatusLabel(report?.status)}
                        </strong>
                      </div>
                    </div>

                    {/* UPDATE STATUS */}
                    <div
                      style={{
                        marginTop: "24px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        Update Status
                      </label>

                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusChange(
                              assignment.id,
                              e.target.value
                            );
                            e.target.value = "";
                          }
                        }}
                        style={{
                          width: "100%",
                          padding: "11px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          background: "white",
                          color: "#172033",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <option value="">
                          -- Pilih Status --
                        </option>

                        {report?.status === "ASSIGNED" && (
                          <option value="IN_PROGRESS">
                            Dikerjakan
                          </option>
                        )}

                        {report?.status === "IN_PROGRESS" && (
                          <option value="COMPLETED">
                            Selesai
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;