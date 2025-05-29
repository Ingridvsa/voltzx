import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users } from "../services/userService";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
      localStorage.setItem("loggedUser", JSON.stringify(user));
      navigate("/dashboard");
    } else {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2 p-2 border" />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mb-2 p-2 border" />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
      <div className="mt-2 text-sm text-blue-500 cursor-pointer" onClick={() => alert("Funcionalidade de recuperação de senha em desenvolvimento.")}>Esqueceu a senha?</div>
      <p className="mt-4 text-sm text-center">
        Não tem conta? <Link to="/register" className="text-blue-500 underline">Cadastre-se</Link>
      </p>
    </div>
  );
}
