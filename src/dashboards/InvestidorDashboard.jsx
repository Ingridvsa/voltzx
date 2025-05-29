import React, { useState } from "react";

export default function InvestidorDashboard() {
  const [projetos] = useState([
    { id: 1, nome: "Projeto Solar PE", descricao: "Instalação em terreno de 2.000m²" },
    { id: 2, nome: "Projeto Bahia", descricao: "Painéis fotovoltaicos em área de 3.000m²" },
  ]);
  const [oferta, setOferta] = useState({ projetoId: "", valor: "" });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Oferta enviada:", oferta);
    alert("Oferta enviada com sucesso!");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Projetos Solares Disponíveis</h2>
      <ul className="mb-6">
        {projetos.map((p) => (
          <li key={p.id} className="mb-2 border p-2 rounded">
            <strong>{p.nome}</strong><br />{p.descricao}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Enviar Oferta</h3>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <select className="w-full p-2 border" onChange={(e) => setOferta({ ...oferta, projetoId: e.target.value })}>
          <option value="">Selecione um projeto</option>
          {projetos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <input className="w-full p-2 border" placeholder="Valor da oferta (R$)" onChange={(e) => setOferta({ ...oferta, valor: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Enviar Oferta</button>
      </form>
    </div>
  );
}
