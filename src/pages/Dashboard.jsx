import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProprietarioDashboard from "../dashboards/ProprietarioDashboard";
import EmpresaDashboard from "../dashboards/EmpresaDashboard";
import InvestidorDashboard from "../dashboards/InvestidorDashboard";

export default function Dashboard({ userType }) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedUser) {
      navigate("/login");
    } else if (loggedUser.role === "proprietario") {
      navigate("/proprietario");
    } else if (loggedUser.role === "empresa") {
      navigate("/empresa");
    } else if (loggedUser.role === "investidor") {
      navigate("/investidor");
    }
  }, [loggedUser, navigate]);


  if (userType === "proprietario") return <ProprietarioDashboard />;
  if (userType === "empresa") return <EmpresaDashboard />;
  if (userType === "investidor") return <InvestidorDashboard />;
  return <div>Tipo de usuário inválido.</div>;
}
