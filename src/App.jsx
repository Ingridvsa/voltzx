import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProprietarioDashboard from "./dashboards/ProprietarioDashboard";
import EmpresaDashboard from "./dashboards/EmpresaDashboard";
import InvestidorDashboard from "./dashboards/InvestidorDashboard";


function App() {
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
  try {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser && storedUser !== "undefined") {
      setLoggedUser(JSON.parse(storedUser));
    }
  } catch (err) {
    console.error("Erro ao fazer parse do usuário logado:", err);
    localStorage.removeItem("loggedUser"); // limpa se estiver corrompido
    setLoggedUser(null);
  }
}, []);



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={setLoggedUser} />} />
        <Route path="/dashboard" element={<Dashboard userType={loggedUser?.role} />} />
        <Route path="/proprietario" element={<ProprietarioDashboard />} />
        <Route path="/empresa" element={<EmpresaDashboard />} />
        <Route path="/investidor" element={<InvestidorDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
