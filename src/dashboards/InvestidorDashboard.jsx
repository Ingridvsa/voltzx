import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function InvestidorPage() {
  const [projetos] = useState([
    {
      id: 1,
      nome: "Projeto Solar PE",
      descricao: "Instalação em terreno de 2.000m²",
      localidade: "Pernambuco",
      metros2: 2000,
      valor: "R$ 500.000",
    },
    {
      id: 2,
      nome: "Projeto Bahia",
      descricao: "Painéis fotovoltaicos em área de 3.000m²",
      localidade: "Bahia",
      metros2: 3000,
      valor: "R$ 750.000",
    },
  ]);

  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [modalOferta, setModalOferta] = useState(false);
  const [oferta, setOferta] = useState("");
  const [statusOferta, setStatusOferta] = useState("");

  function abrirDetalhes(projeto) {
    setProjetoSelecionado(projeto);
  }

  function abrirModalInvestir() {
    setModalOferta(true);
    setStatusOferta("");
  }

  function enviarOferta(e) {
    e.preventDefault();
    setStatusOferta("pendente");
    setModalOferta(false);
    alert("Oferta enviada com sucesso!");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-gray-200 p-4 text-center text-xl font-bold">INVESTIDOR</header>

      {/* Marketplace */}
      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4">Marketplace de Projetos</h2>
        <ul className="space-y-3">
          {projetos.map((p) => (
            <li key={p.id} className="border p-3 rounded flex justify-between items-center bg-white shadow">
              <span>{p.nome}</span>
              <button
                className="text-blue-600 underline"
                onClick={() => abrirDetalhes(p)}
              >
                ver detalhes
              </button>
            </li>
          ))}
        </ul>

        {/* Painel de Detalhes tipo "hover-box" */}
        {projetoSelecionado && (
          <div className="mt-4 bg-black text-white p-4 rounded max-w-xs">
            <p><strong>{projetoSelecionado.nome}</strong></p>
            <p>{projetoSelecionado.descricao}</p>
            <p>{projetoSelecionado.localidade}</p>
            <p>{projetoSelecionado.metros2} m²</p>
            <p>{projetoSelecionado.valor}</p>
            <button
              onClick={abrirModalInvestir}
              className="mt-2 bg-white text-black px-3 py-1 rounded font-bold"
            >
              investir
            </button>
          </div>
        )}
      </main>

      {/* Modal de Oferta */}
      <Modal
        isOpen={modalOferta}
        onRequestClose={() => setModalOferta(false)}
        className="bg-white p-6 rounded shadow max-w-md mx-auto mt-20"
      >
        <h3 className="text-lg font-semibold mb-4">Enviar Oferta</h3>
        <form onSubmit={enviarOferta} className="space-y-4">
          <input
            className="w-full p-2 border"
            placeholder="Valor da oferta (R$)"
            value={oferta}
            onChange={(e) => setOferta(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Enviar
          </button>
        </form>
      </Modal>

      {/* Rodapé com navegação */}
      <footer className="bg-gray-200 p-4 flex justify-around text-center text-sm font-semibold">
        <span>Minhas ofertas</span>
        <span>Botão Investir</span>
        <span>painel monitoramento</span>
      </footer>
    </div>
  );
}
