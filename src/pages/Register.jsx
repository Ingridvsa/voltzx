import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users } from "../services/userService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [type, setType] = useState("Proprietario");
  const navigate = useNavigate();

  function handleRegister() {
    if (password !== confirm) return alert("Senhas não coincidem");
    const newUser = { email, password, type };
    users.push(newUser);
    alert("Usuário registrado com sucesso!");
    navigate("/login");
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Cadastro</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2 p-2 border" />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mb-2 p-2 border" />
      <input type="password" placeholder="Confirmar Senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="block w-full mb-2 p-2 border" />
      <select value={type} onChange={(e) => setType(e.target.value)} className="block w-full mb-2 p-2 border">
        <option value="Proprietario">Proprietário</option>
        <option value="Empresa">Empresa</option>
        <option value="Investidor">Investidor</option>
      </select>
      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">Cadastrar</button>

      <p className="mt-4 text-sm text-center">
        Já tem conta? <Link to="/login" className="text-blue-500 underline">Faça login</Link>
      </p>
    </div>
  );
}