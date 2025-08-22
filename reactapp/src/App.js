import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./pages/Home";
import PrivateRoute from "./pages/PrivateRoutes";
import Logout from "./pages/Logout";
import StaffDashboard from "./components/StaffDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<Logout />} />

    
        <Route element={<PrivateRoute role="STUDENT" />}>
          <Route path="/user/*" element={<StudentDashboard />} />
        </Route>

        
        <Route element={<PrivateRoute role="ADMIN" />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>


        <Route element={<PrivateRoute role="STAFF" />}>
          <Route path="/staff/*" element={<StaffDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
