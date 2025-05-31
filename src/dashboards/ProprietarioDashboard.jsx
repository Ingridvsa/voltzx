import React, { useState, useEffect } from "react";
import { cadastrarTerreno, listarTerrenos } from "../services/api";

export default function ProprietarioDashboard() {
  const [terrenos, setTerrenos] = useState([]);
  const [terreno, setTerreno] = useState({ localizacao: "", preco: "", tamanho: "" });
  const [loading, setLoading] = useState(false);
  const [formAberto, setFormAberto] = useState(false);

  useEffect(() => {
    async function carregarTerrenos() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const data = await listarTerrenos(token);
        setTerrenos(data);
      } catch (error) {
        console.error("Erro ao carregar terrenos:", error);
      }
      setLoading(false);
    }

    carregarTerrenos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const novo = await cadastrarTerreno(terreno, token);
      setTerrenos([...terrenos, novo]);
      setTerreno({ localizacao: "", preco: "", tamanho: "" });
      setFormAberto(false);
      alert("Terreno cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar terreno");
    }
    setLoading(false);
  }

  function verDetalhes(terreno) {
    alert(`Detalhes do Terreno:\n\nLocalização: ${terreno.localizacao}\nPreço: ${terreno.preco}\nTamanho: ${terreno.tamanho} m²`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-gray-300 p-4 text-center font-bold text-lg">PROPRIETARIO</div>

      <div className="text-center font-medium p-2">meus terrenos</div>

      <div className="flex-1 p-4 flex flex-col items-center space-y-4">
        {terrenos.map((t, index) => (
          <div key={index} className="bg-gray-200 w-2/3 flex justify-between p-4">
            <span>terreno {index + 1}</span>
            <button onClick={() => verDetalhes(t)} className="text-blue-600 hover:underline">ver detalhes</button>
          </div>
        ))}
      </div>

      {/* Botão para abrir o formulário */}
      <div className="bg-gray-300 p-4 text-center mt-auto">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setFormAberto(!formAberto)}
        >
          {formAberto ? "Cancelar" : "Cadastrar novo terreno"}
        </button>
      </div>

      {/* Formulário condicional */}
      {formAberto && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 border-t flex flex-col md:flex-row md:space-x-4 items-center justify-center space-y-2 md:space-y-0"
        >
          <input
            className="p-2 border w-full md:w-auto"
            placeholder="Localização"
            value={terreno.localizacao}
            onChange={(e) => setTerreno({ ...terreno, localizacao: e.target.value })}
          />
          <input
            className="p-2 border w-full md:w-auto"
            placeholder="Preço"
            value={terreno.preco}
            onChange={(e) => setTerreno({ ...terreno, preco: e.target.value })}
          />
          <input
            className="p-2 border w-full md:w-auto"
            placeholder="Tamanho (m²)"
            value={terreno.tamanho}
            onChange={(e) => setTerreno({ ...terreno, tamanho: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
            Salvar
          </button>
        </form>
      )}
    </div>
  );
}
