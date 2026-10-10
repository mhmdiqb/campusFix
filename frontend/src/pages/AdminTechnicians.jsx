import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTechnicians.css";

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

  const totalTasks = technicians.reduce(
    (total, technician) =>
      total + (technician._count?.assignments || 0),
    0
  );

  if (loading) {
    return (
      <div className="technician-loading">
        <div className="technician-spinner"></div>
        <h2>Loading teknisi...</h2>
      </div>
    );
  }

  return (
    <div className="technician-page">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <main className="technician-content">
        <div className="technician-container">

          {/* HEADER */}
          <header className="technician-header">
            <div>
              <span className="technician-portal-label">
                ADMIN PORTAL
              </span>

              <h1>Daftar Teknisi</h1>

              <p>
                Kelola teknisi yang menangani laporan fasilitas kampus.
              </p>
            </div>

            <div className="technician-avatar">
              A
            </div>
          </header>

          {/* ERROR */}
          {error && (
            <div className="technician-error">
              {error}
            </div>
          )}

          {/* SUMMARY */}
          <section className="technician-summary">

            {/* TOTAL TEKNISI */}
            <div className="technician-summary-card">
              <div className="summary-icon blue">
                👨‍🔧
              </div>

              <span>Total Teknisi</span>

              <strong>
                {technicians.length}
              </strong>
            </div>

            {/* TOTAL TUGAS */}
            <div className="technician-summary-card">
              <div className="summary-icon purple">
                🔧
              </div>

              <span>Total Tugas</span>

              <strong>
                {totalTasks}
              </strong>
            </div>

            {/* STATUS */}
            <div className="technician-summary-card">
              <div className="summary-icon green">
                ✓
              </div>

              <span>Status</span>

              <strong>
                Aktif
              </strong>
            </div>

          </section>

          {/* TECHNICIAN SECTION */}
          <section className="technician-section">

            {/* SECTION HEADER */}
            <div className="technician-section-header">

              <div>
                <span className="technician-section-label">
                  TECHNICIANS
                </span>

                <h2>Teknisi Kampus</h2>

                <p>
                  Daftar teknisi yang tersedia untuk menangani laporan.
                </p>
              </div>

              <button
                className="technician-refresh"
                onClick={fetchTechnicians}
              >
                ↻ Refresh
              </button>

            </div>

            {/* EMPTY STATE */}
            {technicians.length === 0 ? (
              <div className="technician-empty">

                <div className="empty-icon">
                  👨‍🔧
                </div>

                <h3>
                  Belum ada teknisi
                </h3>

                <p>
                  Belum ada akun teknisi yang tersedia.
                </p>

              </div>
            ) : (

              /* TECHNICIAN LIST */
              <div className="technician-grid">

                {technicians.map((technician) => (
                  <div
                    className="technician-card"
                    key={technician.id}
                  >

                    {/* TECHNICIAN HEADER */}
                    <div className="technician-card-header">

                      <div className="technician-initial">
                        {technician.name
                          ?.charAt(0)
                          ?.toUpperCase() || "T"}
                      </div>

                      <div className="technician-identity">

                        <h3>
                          {technician.name}
                        </h3>

                        <span>
                          {technician.email}
                        </span>

                      </div>

                    </div>

                    {/* TECHNICIAN INFO */}
                    <div className="technician-info">

                      {/* ID */}
                      <div className="technician-info-box">

                        <small>
                          ID Teknisi
                        </small>

                        <strong>
                          #{technician.id}
                        </strong>

                      </div>

                      {/* TUGAS */}
                      <div className="technician-info-box">

                        <small>
                          Tugas
                        </small>

                        <strong>
                          {technician._count?.assignments || 0}
                        </strong>

                      </div>

                    </div>

                    {/* STATUS */}
                    <div className="technician-status">
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

export default AdminTechnicians;