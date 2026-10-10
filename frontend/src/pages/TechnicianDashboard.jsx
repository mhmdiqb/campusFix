import { useEffect, useState } from "react";
import axios from "axios";
import "./TechnicianDashboard.css";

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
        "https://campusfix.de.deplexo.com/api/assignments/my",
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
        `https://campusfix.de.deplexo.com/api/assignments/${assignmentId}/status`,
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


  if (loading) {
    return (
      <div
        className="td-style-1"
      >
        <h2>Loading technician dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      className="technician-dashboard td-style-2"
    >
      {/* HEADER */}
      <div
        className="td-style-3"
      >
        <div
          className="td-style-4"
        >
          <div>
            <div
              className="td-style-5"
            >
              TECHNICIAN PORTAL
            </div>

            <h1
              className="td-style-6"
            >
              Technician Dashboard
            </h1>

            <p
              className="td-style-7"
            >
              Kelola laporan fasilitas yang ditugaskan kepada kamu.
            </p>
          </div>

          <div
            className="td-style-8"
          >
            T
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="td-style-9"
          >
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div
          className="td-style-10"
        >
          {/* TOTAL */}
          <div
            className="td-style-11"
          >
            <div
              className="td-style-12"
            >
              ☷
            </div>

            <div>
              <span
                className="td-style-13"
              >
                Total Tugas
              </span>

              <strong
                className="td-style-14"
              >
                {totalAssignments}
              </strong>
            </div>
          </div>

          {/* ASSIGNED */}
          <div
            className="td-style-15"
          >
            <div
              className="td-style-16"
            >
              ◷
            </div>

            <div>
              <span
                className="td-style-17"
              >
                Ditugaskan
              </span>

              <strong
                className="td-style-18"
              >
                {assignedCount}
              </strong>
            </div>
          </div>

          {/* IN PROGRESS */}
          <div
            className="td-style-19"
          >
            <div
              className="td-style-20"
            >
              ⚙
            </div>

            <div>
              <span
                className="td-style-21"
              >
                Dikerjakan
              </span>

              <strong
                className="td-style-22"
              >
                {inProgressCount}
              </strong>
            </div>
          </div>

          {/* COMPLETED */}
          <div
            className="td-style-23"
          >
            <div
              className="td-style-24"
            >
              ✓
            </div>

            <div>
              <span
                className="td-style-25"
              >
                Selesai
              </span>

              <strong
                className="td-style-26"
              >
                {completedCount}
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION */}
        <div
          className="td-style-27"
        >
          {/* SECTION HEADER */}
          <div
            className="td-style-28"
          >
            <div>
              <h2
                className="td-style-29"
              >
                Laporan yang Ditugaskan
              </h2>

              <p
                className="td-style-30"
              >
                Kelola dan perbarui status laporan fasilitas.
              </p>
            </div>

            <button
              onClick={fetchAssignments}
              className="td-style-31"
            >
              ↻ Refresh Data
            </button>
          </div>

          {/* EMPTY */}
          {assignments.length === 0 ? (
            <div
              className="td-style-32"
            >
              <div
                className="td-style-33"
              >
                ✓
              </div>

              <h3
                className="td-style-34"
              >
                Belum ada tugas
              </h3>

              <p className="td-style-35">
                Belum ada laporan yang ditugaskan kepada kamu.
              </p>
            </div>
          ) : (
            <div
              className="td-style-36"
            >
              {assignments.map((assignment) => {
                const report = assignment.report;

                return (
                  <div
                    key={assignment.id}
                    className="td-style-37"
                  >
                    {/* CARD HEADER */}
                    <div
                      className="td-style-38"
                    >
                      <span
                        className="td-style-39"
                      >
                        LAPORAN #{report?.id}
                      </span>

                      <span className={`technician-status-badge ${report?.status?.toLowerCase() || "assigned"}`}
                      >
                        {getStatusLabel(report?.status)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3
                      className="td-style-40"
                    >
                      {report?.title || "Tanpa judul"}
                    </h3>

                    <p
                      className="td-style-41"
                    >
                      {report?.description ||
                        "Tidak ada deskripsi."}
                    </p>

                    <hr
                      className="td-style-42"
                    />

                    {/* INFORMATION */}
                    <div
                      className="td-style-43"
                    >
                      <div>
                        <span
                          className="td-style-44"
                        >
                          Fasilitas
                        </span>

                        <strong>
                          {report?.facility?.name || "-"}
                        </strong>
                      </div>

                      <div>
                        <span
                          className="td-style-45"
                        >
                          Lokasi
                        </span>

                        <strong>
                          {report?.facility?.location || "-"}
                        </strong>
                      </div>

                      <div>
                        <span
                          className="td-style-46"
                        >
                          Prioritas
                        </span>

                        <strong>
                          {getPriorityLabel(report?.priority)}
                        </strong>
                      </div>

                      <div>
                        <span
                          className="td-style-47"
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
                      className="td-style-48"
                    >
                      <label
                        className="td-style-49"
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
                        className="td-style-50"
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