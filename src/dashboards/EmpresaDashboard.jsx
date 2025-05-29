import React, { useState } from "react";

export default function EmpresaDashboard() {
  const [terrenos] = useState([
    { id: 1, localizacao: "PE", preco: 150000, tamanho: 2000 },
    { id: 2, localizacao: "BA", preco: 200000, tamanho: 3000 },
  ]);
  const [filtro, setFiltro] = useState("");
  const [projeto, setProjeto] = useState({ terrenoId: "", nome: "", descricao: "" });

  const terrenosFiltrados = terrenos.filter(t =>
    t.localizacao.toLowerCase().includes(filtro.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Projeto criado:", projeto);
    alert("Projeto criado com sucesso!");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Buscar Terrenos Disponíveis</h2>
      <input
        className="w-full p-2 border mb-4"
        placeholder="Filtrar por localização"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <ul className="mb-6">
        {terrenosFiltrados.map((t) => (
          <li key={t.id} className="mb-2 border p-2 rounded">
            <strong>{t.localizacao}</strong> - {t.tamanho}m² - R$ {t.preco.toLocaleString()}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Criar Projeto Solar</h3>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <select className="w-full p-2 border" onChange={(e) => setProjeto({ ...projeto, terrenoId: e.target.value })}>
          <option value="">Selecione um terreno</option>
          {terrenos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.localizacao} - {t.tamanho}m²
            </option>
          ))}
        </select>
        <input className="w-full p-2 border" placeholder="Nome do Projeto" onChange={(e) => setProjeto({ ...projeto, nome: e.target.value })} />
        <textarea className="w-full p-2 border" placeholder="Descrição" onChange={(e) => setProjeto({ ...projeto, descricao: e.target.value })} />
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">Criar Projeto</button>
      </form>
    </div>
  );
}
