import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

export default function AppRouter({ onLogin }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Proprietario" element={<Dashboard userType="Proprietário" />} />
        <Route path="/Empresa" element={<Dashboard userType="Empresa" />} />
        <Route path="/Investidor" element={<Dashboard userType="Investidor" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
