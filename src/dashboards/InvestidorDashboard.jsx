import React, { useEffect, useState } from "react";
import { getProjetosDisponiveis, criarOferta, getMinhasOfertas } from "../services/api";

export default function InvestidorDashboard() {
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [valorOferta, setValorOferta] = useState("");
  const [descricaoOferta, setDescricaoOferta] = useState("");
  const [minhasOfertas, setMinhasOfertas] = useState([]);

  useEffect(() => {
    carregarProjetos();
    carregarMinhasOfertas();
  }, []);

  async function carregarProjetos() {
    try {
      const token = localStorage.getItem("token");
      const data = await getProjetosDisponiveis(token);
      setProjetos(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar projetos disponíveis.");
    }
  }

  async function carregarMinhasOfertas() {
    try {
      const token = localStorage.getItem("token");
      const data = await getMinhasOfertas(token);
      setMinhasOfertas(data);
    } catch (err) {
      console.error("Erro ao buscar painel de investimentos:", err);
    }
  }

  const abrirModal = (projeto) => {
    setProjetoSelecionado(projeto);
    setModalAberto(true);
  };

  const enviarOferta = async () => {
    try {
      const token = localStorage.getItem("token");
      await criarOferta({
        projetoId: projetoSelecionado.id,
        valor: parseFloat(valorOferta),
        descricao: descricaoOferta
      }, token);

      alert("Oferta enviada com sucesso!");
      setModalAberto(false);
      setValorOferta("");
      setDescricaoOferta("");
      carregarMinhasOfertas();
    } catch (error) {
      console.error("Erro ao enviar oferta:", error);
      alert("Erro ao enviar oferta.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Projetos Disponíveis para Investimento</h2>
      {erro && <p className="text-red-600 text-center">{erro}</p>}

      {projetos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum projeto disponível.</p>
      ) : (
        <div className="grid gap-4 mb-6">
          {projetos.map((projeto) => (
            <div key={projeto.id} className="bg-white shadow-md rounded p-4">
              <h3 className="text-xl font-semibold">{projeto.nome}</h3>
              <p><strong>Descrição:</strong> {projeto.descricao}</p>
              <p><strong>Localização:</strong> {projeto.terreno.cidade} - {projeto.terreno.estado}</p>
              <p><strong>Tamanho:</strong> {projeto.terreno.tamanho} m²</p>
              <p><strong>Empresa:</strong> {projeto.empresa.nome}</p>
              <button
                onClick={() => abrirModal(projeto)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Enviar Proposta de Investimento
              </button>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Nova Oferta</h3>
            <input
              type="number"
              placeholder="Valor da oferta"
              value={valorOferta}
              onChange={(e) => setValorOferta(e.target.value)}
              className="w-full p-2 border mb-2"
            />
            <textarea
              placeholder="Descrição da oferta"
              value={descricaoOferta}
              onChange={(e) => setDescricaoOferta(e.target.value)}
              className="w-full p-2 border mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-500 px-4 py-2 text-white rounded" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="bg-green-600 px-4 py-2 text-white rounded" onClick={enviarOferta}>Enviar</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Painel de Investimentos</h2>
        {minhasOfertas.length === 0 ? (
          <p className="text-gray-500">Nenhuma proposta enviada.</p>
        ) : (
          <div className="grid gap-4">
            {minhasOfertas.map((oferta) => (
              <div key={oferta.id} className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Projeto:</strong> {oferta.projeto.nome}</p>
                <p><strong>Descrição da Proposta:</strong> {oferta.descricao}</p>
                <p><strong>Valor:</strong> R$ {oferta.valor.toFixed(2)}</p>
                <p><strong>Status:</strong> {
                  oferta.aceitaEmpresa && oferta.aceitaProprietario
                    ? "Aprovada"
                    : oferta.rejeitadaEmpresa || oferta.rejeitadaProprietario
                    ? "Rejeitada"
                    : "Pendente"
                }</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
