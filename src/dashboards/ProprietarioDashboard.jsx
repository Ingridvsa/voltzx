import React, { useState } from "react";

export default function ProprietarioDashboard() {
  const [terreno, setTerreno] = useState({ localizacao: "", preco: "", tamanho: "" });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Terreno cadastrado:", terreno);
    alert("Terreno cadastrado com sucesso!");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cadastro de Terreno</h2>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <input className="w-full p-2 border" placeholder="Localização" onChange={(e) => setTerreno({ ...terreno, localizacao: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Preço" onChange={(e) => setTerreno({ ...terreno, preco: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Tamanho (m²)" onChange={(e) => setTerreno({ ...terreno, tamanho: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
