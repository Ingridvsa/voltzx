import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../services/api";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("proprietario");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await registrarUsuario({ nome, email, password, role });
      localStorage.setItem("token", res.token);
      localStorage.setItem("loggedUser", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro ao registrar.");
    }
  };


  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Cadastro</h2>
      <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="p-2 border border-gray-300 rounded w-full mb-4" />

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
