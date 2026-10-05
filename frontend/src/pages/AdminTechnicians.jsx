import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/api/assignments/technicians",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTechnicians(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil teknisi:", err);

      setError(
        err.response?.data?.message ||
          "Gagal mengambil data teknisi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

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
        <h2>Loading teknisi...</h2>
      </div>
    );
  }

  return (
    <div
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
                Daftar Teknisi
              </h1>

              <p
                style={{
                  color: "#64748b",
                  margin: 0,
                }}
              >
                Kelola teknisi yang menangani laporan fasilitas kampus.
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
              SUMMARY
          ========================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginBottom: "25px",
            }}
          >
            {/* TOTAL TEKNISI */}
            <div style={summaryCardStyle}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "15px",
                }}
              >
                👨‍🔧
              </div>

              <span
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                Total Teknisi
              </span>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {technicians.length}
              </strong>
            </div>

            {/* TOTAL TUGAS */}
            <div style={summaryCardStyle}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#f3e8ff",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "15px",
                }}
              >
                🔧
              </div>

              <span
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                Total Tugas
              </span>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {technicians.reduce(
                  (total, technician) =>
                    total +
                    (technician._count?.assignments || 0),
                  0
                )}
              </strong>
            </div>

            {/* STATUS */}
            <div style={summaryCardStyle}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "15px",
                }}
              >
                ✓
              </div>

              <span
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                Status
              </span>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                Aktif
              </strong>
            </div>
          </div>

          {/* =========================
              TECHNICIAN SECTION
          ========================= */}
          <section
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "28px",
              boxShadow:
                "0 2px 8px rgba(15, 23, 42, 0.04)",
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
                <span
                  style={{
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  TECHNICIANS
                </span>

                <h2
                  style={{
                    margin: "6px 0",
                    fontSize: "24px",
                  }}
                >
                  Teknisi Kampus
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  Daftar teknisi yang tersedia untuk menangani laporan.
                </p>
              </div>

              <button
                onClick={fetchTechnicians}
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
                ↻ Refresh
              </button>
            </div>

            {/* =========================
                EMPTY STATE
            ========================= */}
            {technicians.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "12px",
                  color: "#64748b",
                }}
              >
                <div
                  style={{
                    fontSize: "45px",
                    marginBottom: "10px",
                  }}
                >
                  👨‍🔧
                </div>

                <h3
                  style={{
                    color: "#172033",
                    marginBottom: "8px",
                  }}
                >
                  Belum ada teknisi
                </h3>

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Belum ada akun teknisi yang tersedia.
                </p>
              </div>
            ) : (
              /* =========================
                 TECHNICIAN LIST
              ========================= */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "18px",
                }}
              >
                {technicians.map((technician) => (
                  <div
                    key={technician.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "22px",
                      transition: "0.2s",
                    }}
                  >
                    {/* TECHNICIAN HEADER */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "18px",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          background: "#dbeafe",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {technician.name
                          ?.charAt(0)
                          ?.toUpperCase() || "T"}
                      </div>

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "20px",
                          }}
                        >
                          {technician.name}
                        </h3>

                        <span
                          style={{
                            color: "#64748b",
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {technician.email}
                        </span>
                      </div>
                    </div>

                    {/* TECHNICIAN INFO */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                      }}
                    >
                      {/* ID */}
                      <div
                        style={{
                          background: "#f8fafc",
                          padding: "14px",
                          borderRadius: "10px",
                        }}
                      >
                        <small
                          style={{
                            color: "#64748b",
                          }}
                        >
                          ID Teknisi
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          #{technician.id}
                        </strong>
                      </div>

                      {/* TUGAS */}
                      <div
                        style={{
                          background: "#f8fafc",
                          padding: "14px",
                          borderRadius: "10px",
                        }}
                      >
                        <small
                          style={{
                            color: "#64748b",
                          }}
                        >
                          Tugas
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {technician._count?.assignments || 0}
                        </strong>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div
                      style={{
                        marginTop: "18px",
                        padding: "10px 14px",
                        background: "#dcfce7",
                        color: "#15803d",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      ● Teknisi Terdaftar
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

const summaryCardStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "22px",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
};

export default AdminTechnicians;