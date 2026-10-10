import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateReport() {
  const navigate = useNavigate();

  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    facilityId: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/facilities`
        );

        setFacilities(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data fasilitas.");
      } finally {
        setLoadingFacilities(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.facilityId) {
      setError("Judul, deskripsi, dan fasilitas wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("priority", form.priority);
      formData.append("facilityId", Number(form.facilityId));

      if (image) {
        formData.append("image", image);
      }

      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/reports`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Report created:", response.data);

      setSuccess("Laporan berhasil dibuat!");

      setTimeout(() => {
        navigate("/student");
      }, 1000);
    } catch (err) {
      console.error("Create report error:", err);

      setError(
        err.response?.data?.message ||
          "Gagal membuat laporan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format file harus JPG, PNG, atau WebP.");
      setImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      setImage(null);
      return;
    }

    setError("");
    setImage(file);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <button onClick={() => navigate("/student")}>
        ← Kembali ke Dashboard
      </button>

      <h1>Buat Laporan</h1>

      <p>
        Laporkan kerusakan fasilitas kampus agar dapat segera ditangani.
      </p>

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Judul Laporan</strong>
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Contoh: AC Ruang Kelas Rusak"
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Deskripsi Kerusakan</strong>
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Jelaskan kondisi kerusakan..."
            rows="6"
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Foto Kerusakan</strong>
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <small
            style={{
              display: "block",
              marginTop: "6px",
              color: "#64748b",
            }}
          >
            Format JPG, PNG, atau WebP. Maksimal 5 MB.
          </small>

          {image && (
            <p
              style={{
                marginTop: "8px",
                color: "#2563eb",
              }}
            >
              Foto dipilih: {image.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Prioritas</strong>
          </label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Fasilitas</strong>
          </label>

          <select
            name="facilityId"
            value={form.facilityId}
            onChange={handleChange}
            disabled={loadingFacilities}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          >
            <option value="">
              {loadingFacilities
                ? "Memuat fasilitas..."
                : "-- Pilih Fasilitas --"}
            </option>

            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
                {facility.location ? ` - ${facility.location}` : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting || loadingFacilities}
          style={{
            padding: "12px 20px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
    </div>
  );
}

export default CreateReport;
