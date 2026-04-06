import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import WorkerApproval from "./pages/admin/WorkerApproval";

import EmployerDasboard from "./pages/employer/EmployerDasboard";
import CreateRequest from "./pages/employer/CreateRequest";
import MyRequests from "./pages/employer/MyRequests";
import WorkerList from "./pages/employer/WorkerList";

import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerJobs from "./pages/worker/WorkerJobs";
import WorkerProfile from "./pages/worker/WorkerProfile";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/approvals" element={<WorkerApproval />} />

            <Route path="/employer" element={<EmployerDasboard />} />
            <Route path="/employer/create" element={<CreateRequest />} />
            <Route path="/employer/requests" element={<MyRequests />} />
            <Route path="/employer/workers" element={<WorkerList />} />

            <Route path="/worker" element={<WorkerDashboard />} />
            <Route path="/worker/jobs" element={<WorkerJobs />} />
            <Route path="/worker/profile" element={<WorkerProfile />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
