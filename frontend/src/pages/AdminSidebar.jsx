import { NavLink, useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="logo-small">CF</div>
        <h2>CampusFix</h2>
        <span>Admin Portal</span>
      </div>

      <nav className="admin-nav">
        {/* DASHBOARD */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ▦ Dashboard
        </NavLink>

        {/* LAPORAN */}
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ▤ Laporan
        </NavLink>

        {/* TEKNISI */}
        <NavLink
          to="/admin/technicians"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ♙ Teknisi
        </NavLink>
      </nav>

      <button
        className="admin-logout"
        onClick={handleLogout}
      >
        ↪ Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;