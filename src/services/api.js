const API_URL = "http://localhost:3000/api/auth";

export async function registrarUsuario({ nome, email, password, role }) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erro no registro:", errorData);
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

export async function getPainelData(token) {
  const res = await fetch("http://localhost:3000/api/projetos/monitoramento", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erro ao carregar painel");
  return await res.json();
}

export async function responderProjeto(id, acao, token) {
  const res = await fetch(`http://localhost:3000/api/projetos/${id}/resposta`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ acao }),
  });

  if (!res.ok) throw new Error("Erro ao responder projeto");
  return await res.json();
}

export async function getProjetosDisponiveis(token) {
  const res = await fetch("http://localhost:3000/api/projetos/disponiveis", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar projetos disponíveis");
  return await res.json();
}


export async function criarOferta(data, token) {
  const response = await fetch("http://localhost:3000/api/ofertas", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao enviar oferta");
  return await response.json();
}

export async function getOfertasAceitas(token) {
  const res = await fetch("http://localhost:3000/api/projetos/ofertas-aceitas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar ofertas aceitas");
  return await res.json();
}

export async function getMinhasOfertas(token) {
  const response = await fetch("http://localhost:3000/api/ofertas/minhas", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar ofertas do investidor");
  }

  return response.json();
}

export async function responderOferta(ofertaId, acao, token, origem) {
  const res = await fetch(`http://localhost:3000/api/projetos/ofertas/${ofertaId}/resposta`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ acao, origem }),
  });

  if (!res.ok) throw new Error("Erro ao responder oferta");
  return await res.json();
}

