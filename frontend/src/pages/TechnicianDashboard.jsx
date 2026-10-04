import { useEffect, useState } from "react";
import axios from "axios";

function TechnicianDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // AMBIL LAPORAN TEKNISI
  // =========================
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

  // =========================
  // UPDATE STATUS
  // =========================
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

  // =========================
  // STATISTIK
  // =========================
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

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading technician dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Technician Dashboard</h1>

      <p>
        Kelola laporan fasilitas yang ditugaskan kepada kamu.
      </p>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#ffdede",
            color: "#b00020",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* =========================
          STATISTIK
      ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div className="stat-card">
          <h3>Total Tugas</h3>
          <strong>{totalAssignments}</strong>
        </div>

        <div className="stat-card">
          <h3>Ditugaskan</h3>
          <strong>{assignedCount}</strong>
        </div>

        <div className="stat-card">
          <h3>Dikerjakan</h3>
          <strong>{inProgressCount}</strong>
        </div>

        <div className="stat-card">
          <h3>Selesai</h3>
          <strong>{completedCount}</strong>
        </div>
      </div>

      {/* =========================
          DAFTAR TUGAS
      ========================= */}
      <h2>Laporan yang Ditugaskan</h2>

      {assignments.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "30px",
            marginTop: "15px",
          }}
        >
          <h3>Belum ada tugas</h3>

          <p>
            Belum ada laporan yang ditugaskan kepada kamu.
          </p>
        </div>
      ) : (
        <div>
          {assignments.map((assignment) => {
            const report = assignment.report;

            return (
              <div
                key={assignment.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "15px",
                }}
              >
                <h3>{report?.title || "Tanpa judul"}</h3>

                <p>
                  {report?.description ||
                    "Tidak ada deskripsi."}
                </p>

                <p>
                  <strong>Prioritas:</strong>{" "}
                  {report?.priority || "-"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {report?.status || "-"}
                </p>

                <p>
                  <strong>Fasilitas:</strong>{" "}
                  {report?.facility?.name || "-"}
                </p>

                <p>
                  <strong>Lokasi:</strong>{" "}
                  {report?.facility?.location || "-"}
                </p>

                {/* =========================
                    UPDATE STATUS
                ========================= */}
                <div style={{ marginTop: "20px" }}>
                  <strong>Update Status: </strong>

                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleStatusChange(
                          assignment.id,
                          e.target.value
                        );
                      }
                    }}
                    style={{
                      marginLeft: "10px",
                      padding: "7px",
                    }}
                  >
                    <option value="">
                      -- Pilih Status --
                    </option>

                    <option value="IN_PROGRESS">
                      IN_PROGRESS
                    </option>

                    <option value="COMPLETED">
                      COMPLETED
                    </option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TechnicianDashboard;