import React, { useState } from "react";

export default function ProprietarioDashboard() {
  const [terrenos, setTerrenos] = useState([]);
  const [terreno, setTerreno] = useState({ localizacao: "", preco: "", tamanho: "" });

  function handleSubmit(e) {
    e.preventDefault();
    setTerrenos([...terrenos, terreno]);
    setTerreno({ localizacao: "", preco: "", tamanho: "" });
    alert("Terreno cadastrado com sucesso!");
  }

  function verDetalhes(terreno) {
    alert(`Detalhes do Terreno:\n\nLocalização: ${terreno.localizacao}\nPreço: ${terreno.preco}\nTamanho: ${terreno.tamanho} m²`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <div className="bg-gray-300 p-4 text-center font-bold text-lg">
        meus terrenos
      </div>

      {/* Lista de terrenos */}
      <div className="flex-1 p-4 flex flex-col items-center space-y-4">
        {terrenos.map((t, index) => (
          <div key={index} className="bg-gray-200 w-2/3 flex justify-between p-4">
            <span>terreno {index + 1}</span>
            <button onClick={() => verDetalhes(t)} className="text-blue-600 hover:underline">ver detalhes</button>
          </div>
        ))}
      </div>

      {/* Cadastro de terreno */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:space-x-4 items-center justify-center space-y-2 md:space-y-0">
          <input className="p-2 border w-full md:w-auto" placeholder="Localização" value={terreno.localizacao} onChange={(e) => setTerreno({ ...terreno, localizacao: e.target.value })} />
          <input className="p-2 border w-full md:w-auto" placeholder="Preço" value={terreno.preco} onChange={(e) => setTerreno({ ...terreno, preco: e.target.value })} />
          <input className="p-2 border w-full md:w-auto" placeholder="Tamanho (m²)" value={terreno.tamanho} onChange={(e) => setTerreno({ ...terreno, tamanho: e.target.value })} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Cadastrar terreno</button>
        </form>
      </div>
    </div>
  );
}
