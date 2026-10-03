import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CreateReport from "./pages/CreateReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>CampusFix</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/reports/create" element={<CreateReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;