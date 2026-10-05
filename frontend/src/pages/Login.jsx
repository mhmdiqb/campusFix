import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Simpan token dan data user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect berdasarkan role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "TECHNICIAN") {
        navigate("/technician");
      } else if (user.role === "STUDENT") {
        navigate("/student");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login gagal:", error);

      setError(
        error.response?.data?.message ||
          "Email atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-brand">
          <div className="brand-logo">CF</div>

          <h1>CampusFix</h1>

          <p>
            Laporkan kerusakan fasilitas kampus
            dengan mudah dan pantau proses
            perbaikannya.
          </p>

          <div className="brand-feature">
            <span>✓</span>
            <span>Pelaporan fasilitas lebih mudah</span>
          </div>

          <div className="brand-feature">
            <span>✓</span>
            <span>Pantau status laporan secara real-time</span>
          </div>

          <div className="brand-feature">
            <span>✓</span>
            <span>Terhubung dengan teknisi kampus</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-card">

          <div className="login-header">
            <h2>Selamat Datang 👋</h2>

            <p>
              Masuk ke akun CampusFix kamu
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password kamu"
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                ⚠️ {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>

          </form>

          <div className="login-footer">
            <span>CampusFix</span>
            <span>•</span>
            <span>Campus Facility Reporting System</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;

