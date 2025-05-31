import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("proprietario");
  const navigate = useNavigate();

  async function handleRegister() {
    if (password !== confirm) return alert("Senhas não coincidem");

    try {
      const data = await registrarUsuario({ email, password, role });
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedUser", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      const msg = await error.response?.json?.(); // depende da estrutura do seu api.js
      alert(msg?.message || "Erro ao registrar.");
      console.error("Erro no cadastro:", error);
    }

  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Cadastro</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2 p-2 border" />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mb-2 p-2 border" />
      <input type="password" placeholder="Confirmar Senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="block w-full mb-2 p-2 border" />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full mb-2 p-2 border">
        <option value="proprietario">Proprietário</option>
        <option value="empresa">Empresa</option>
        <option value="investidor">Investidor</option>
      </select>
      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">Cadastrar</button>

      <p className="mt-4 text-sm text-center">
        Já tem conta? <Link to="/login" className="text-blue-500 underline">Faça login</Link>
      </p>
    </div>
  );
}
