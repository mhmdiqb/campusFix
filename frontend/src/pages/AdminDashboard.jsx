import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
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
  // AMBIL DATA TEKNISI
  // =========================
  const fetchTechnicians = async () => {
    try {
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
    }
  };

  // =========================
  // AMBIL DATA LAPORAN
  // =========================
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

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

  // =========================
  // LOAD DATA SAAT HALAMAN DIBUKA
  // =========================
  useEffect(() => {
    fetchReports();
    fetchTechnicians();
  }, []);

  // =========================
  // ASSIGN TEKNISI
  // =========================
  const handleAssignTechnician = async (reportId, technicianId) => {
    if (!technicianId) {
      alert("Pilih teknisi terlebih dahulu.");
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

      // Refresh laporan
      fetchReports();
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

      // Refresh data
      fetchReports();
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
  const totalReports = reports.length;

  const reportedCount = reports.filter(
    (report) => report.status === "REPORTED"
  ).length;

  const inProgressCount = reports.filter(
    (report) => report.status === "IN_PROGRESS"
  ).length;

  const completedCount = reports.filter(
    (report) => report.status === "COMPLETED"
  ).length;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Admin Dashboard</h1>

      <p>
        Kelola dan pantau laporan kerusakan fasilitas kampus.
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
          <h3>Total Laporan</h3>
          <strong>{totalReports}</strong>
        </div>

        <div className="stat-card">
          <h3>Baru</h3>
          <strong>{reportedCount}</strong>
        </div>

        <div className="stat-card">
          <h3>Diproses</h3>
          <strong>{inProgressCount}</strong>
        </div>

        <div className="stat-card">
          <h3>Selesai</h3>
          <strong>{completedCount}</strong>
        </div>
      </div>

      {/* =========================
          DAFTAR LAPORAN
      ========================= */}
      <h2>Daftar Laporan</h2>

      {reports.length === 0 ? (
        <p>Belum ada laporan.</p>
      ) : (
        <div>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "15px",
              }}
            >
              <h3>{report.title}</h3>

              <p>{report.description}</p>

              <p>
                <strong>Pelapor:</strong>{" "}
                {report.user?.name || "-"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {report.user?.email || "-"}
              </p>

              <p>
                <strong>Fasilitas:</strong>{" "}
                {report.facility?.name || "-"}
              </p>

              <p>
                <strong>Lokasi:</strong>{" "}
                {report.facility?.location || "-"}
              </p>

              <p>
                <strong>Prioritas:</strong>{" "}
                {report.priority}
              </p>

              {/* =========================
                  ASSIGN TEKNISI
              ========================= */}
              <div
                style={{
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                <strong>Teknisi: </strong>

                <select
                  defaultValue=""
                  onChange={(e) =>
                    handleAssignTechnician(
                      report.id,
                      e.target.value
                    )
                  }
                  style={{
                    marginLeft: "10px",
                    padding: "6px",
                  }}
                >
                  <option value="">
                    -- Pilih Teknisi --
                  </option>

                  {technicians.map((technician) => (
                    <option
                      key={technician.id}
                      value={technician.id}
                    >
                      {technician.name} -{" "}
                      {technician.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* =========================
                  STATUS
              ========================= */}
              <div>
                <strong>Status: </strong>

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
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;