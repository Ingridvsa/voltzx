import React, { useState } from "react";

export default function EmpresaDashboard() {
  const [terrenosDisponiveis] = useState([
    { localizacao: "Recife", tamanho: 2000, preco: "R$ 250.000" },
    { localizacao: "Salvador", tamanho: 3000, preco: "R$ 330.000" }
  ]);

  const [terrenoSelecionado, setTerrenoSelecionado] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoAtual, setProjetoAtual] = useState({ nome: "", descricao: "" });
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(null);

  function abrirModal(terreno) {
    setTerrenoSelecionado(terreno);
    setModalAberto(true);
  }

  function enviarProposta() {
    const novoProjeto = {
      ...projetoAtual,
      terreno: terrenoSelecionado,
      status: "pendente",
    };
    setProjetos([...projetos, novoProjeto]);
    setProjetoAtual({ nome: "", descricao: "" });
    setModalAberto(false);
    alert("Proposta enviada para o proprietário.");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <div className="bg-gray-300 p-4 text-center text-lg font-bold">EMPRESA</div>

      {/* Lista de Terrenos */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Terrenos disponíveis</h2>

        <div className="space-y-4">
          {terrenosDisponiveis.length > 0 ? (
            terrenosDisponiveis.map((terreno, index) => (
              <div key={index} className="bg-gray-200 p-4 flex justify-between items-center relative">
                <span>terreno {index + 1}</span>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() =>
                    setDetalhesVisiveis(det => (det === index ? null : index))
                  }
                >
                  ver detalhes
                </button>
                {detalhesVisiveis === index && (
                  <div className="absolute right-0 mt-2 bg-black text-white p-4 rounded shadow-md z-10">
                    <p><strong>Localidade:</strong> {terreno.localizacao}</p>
                    <p><strong>Metros²:</strong> {terreno.tamanho}</p>
                    <p><strong>Valor:</strong> {terreno.preco}</p>
                    <button
                      className="mt-2 text-white font-bold underline"
                      onClick={() => abrirModal(terreno)}
                    >
                      criar projeto
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Nenhum terreno disponível no momento.</p>
          )}
        </div>
      </div>

      {/* Modal para Criar Projeto */}
      {modalAberto && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Criar Projeto para Terreno</h3>
            <input
              className="w-full p-2 border mb-2"
              placeholder="Nome do Projeto"
              value={projetoAtual.nome}
              onChange={(e) => setProjetoAtual({ ...projetoAtual, nome: e.target.value })}
            />
            <textarea
              className="w-full p-2 border mb-2"
              placeholder="Descrição do Projeto"
              value={projetoAtual.descricao}
              onChange={(e) => setProjetoAtual({ ...projetoAtual, descricao: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={enviarProposta}
              >
                Enviar Proposta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div className="bg-gray-300 p-4 text-center mt-auto">
        painel monitoramento
      </div>
    </div>
  );
}
