const API_URL = "http://localhost:3000/api/auth";

export async function registrarUsuario({ email, password, role }) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();  // Captura a resposta de erro
    console.error("Erro no registro:", errorData);  // Exibe o erro no console
    throw new Error("Erro no registro");
  }

  return response.json();
}


export async function loginUsuario({ email, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Erro no login");
  return response.json();
}


const token = localStorage.getItem("token");

const API = 'http://localhost:3000/api';

export async function cadastrarTerreno(terreno, token) {
  const response = await fetch(`${API}/terrenos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(terreno),
  });

  if (!response.ok) throw new Error('Erro ao cadastrar terreno');
  return response.json();
}

const API_BASE_URL = "http://localhost:3000/api";

// Buscar todos os terrenos disponíveis (visíveis para empresa)
export async function fetchTerrenos(token) {
  const response = await fetch(`${API_BASE_URL}/terrenos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar terrenos");
  return response.json();
}

// Criar projeto com vínculo ao terreno selecionado
export async function criarProjeto(data, token) {
  const response = await fetch(`${API_BASE_URL}/projetos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar projeto");
  return response.json();
}

export async function buscarTerrenos() {
  const response = await fetch("http://localhost:3000/api/terrenos");
  if (!response.ok) throw new Error("Erro ao buscar terrenos");
  return response.json();
}

// src/services/api.js
export async function listarTerrenos(token) {
  const response = await fetch("http://localhost:3000/api/terrenos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar terrenos");
  }

  return response.json();
}

