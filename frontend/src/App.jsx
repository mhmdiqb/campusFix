import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateReport from "./pages/CreateReport";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import ReportDetail from "./pages/ReportDetail";
import ProtectedRoute from "./ProtectedRoute";
import AdminReports from "./pages/AdminReports";
import AdminTechnicians from "./pages/AdminTechnicians";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>CampusFix</h1>} />

        <Route path="/login" element={<Login />} />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRole="TECHNICIAN">
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        {/* STUDENT - BUAT LAPORAN */}
        <Route
          path="/reports/create"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <CreateReport />
            </ProtectedRoute>
          }
        />

        {/* STUDENT - DETAIL LAPORAN */}
        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <ReportDetail />
            </ProtectedRoute>
          }
        />

        {/* ADMIN - LAPORAN */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* ADMIN - TEKNISI */}
        <Route
          path="/admin/technicians"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminTechnicians />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

