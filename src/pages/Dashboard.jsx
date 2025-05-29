import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProprietarioDashboard from "../dashboards/ProprietarioDashboard";
import EmpresaDashboard from "../dashboards/EmpresaDashboard";
import InvestidorDashboard from "../dashboards/InvestidorDashboard";

export default function Dashboard({ userType }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userType) {
      const storedUser = localStorage.getItem("loggedUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login");
      }
    }
  }, [userType, navigate]);

  if (userType === "Proprietario") return <ProprietarioDashboard />;
  if (userType === "Empresa") return <EmpresaDashboard />;
  if (userType === "Investidor") return <InvestidorDashboard />;
  return <div>Tipo de usuário inválido.</div>;
}
