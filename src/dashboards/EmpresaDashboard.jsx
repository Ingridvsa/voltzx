import React, { useState, useEffect } from "react";
import { fetchTerrenos, criarProjeto, getPainelData } from "../services/api";


export default function EmpresaDashboard() {
  const [terrenos, setTerrenos] = useState([]);
  const [filtro, setFiltro] = useState({
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    tamanhoMin: ""
  });
  const [resultados, setResultados] = useState([]);
  const [terrenoSelecionado, setTerrenoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoAtual, setProjetoAtual] = useState({ nome: "", descricao: "" });
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [projetosEnviados, setProjetosEnviados] = useState([]);

  useEffect(() => {
    carregarTerrenos();
  }, []);

  async function carregarTerrenos() {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchTerrenos(token);
      setTerrenos(data);
      setResultados(data);
    } catch (error) {
      alert("Erro ao carregar terrenos.");
      console.error(error);
    }
  }

  const buscarTerrenos = () => {
    const { pais, estado, cidade, bairro, tamanhoMin } = filtro;
    const tamanho = parseInt(tamanhoMin);

    const filtrados = terrenos.filter((t) => {
      const matchPais = !pais || t.pais.toLowerCase().includes(pais.toLowerCase());
      const matchEstado = !estado || t.estado.toLowerCase().includes(estado.toLowerCase());
      const matchCidade = !cidade || t.cidade.toLowerCase().includes(cidade.toLowerCase());
      const matchBairro = !bairro || t.bairro.toLowerCase().includes(bairro.toLowerCase());
      const matchTamanho = isNaN(tamanho) || t.tamanho >= tamanho;

      return matchPais && matchEstado && matchCidade && matchBairro && matchTamanho;
    });

    setResultados(filtrados);
  };

  const abrirModal = (terreno) => {
    setTerrenoSelecionado(terreno);
    setModalAberto(true);
  };

  const enviarProposta = async () => {
    try {
      const token = localStorage.getItem("token");
      await criarProjeto(
        {
          nome: projetoAtual.nome,
          descricao: projetoAtual.descricao,
          terrenoId: terrenoSelecionado.id,
        },
        token
      );
      alert("Proposta enviada com sucesso!");
      setProjetoAtual({ nome: "", descricao: "" });
      setModalAberto(false);
      carregarTerrenos();
    } catch (error) {
      alert("Erro ao enviar proposta.");
      console.error(error);
    }
  };

  async function abrirPainelMonitoramento() {
    try {
      const token = localStorage.getItem("token");
      const res = await getPainelData(token);
      setProjetosEnviados(res.projetos || []);
      setPainelAberto(true);
    } catch (err) {
      console.error("Erro ao buscar painel:", err);
      alert("Erro ao carregar painel.");
    }
  }

  const responderOfertaClick = async (ofertaId, resposta) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/projetos/ofertas/${ofertaId}/resposta`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ acao: resposta, origem: "empresa" }),
      });

      alert(`Oferta ${resposta === "aceitar" ? "aceita" : "rejeitada"} com sucesso!`);
      abrirPainelMonitoramento(); // atualiza
    } catch (err) {
      console.error("Erro ao responder oferta:", err);
      alert("Erro ao responder oferta.");
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gray-300 p-4 text-center text-lg font-bold">EMPRESA</div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Buscar terrenos cadastrados</h2>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 mb-6">
          <input placeholder="País" className="p-2 border rounded" value={filtro.pais} onChange={(e) => setFiltro({ ...filtro, pais: e.target.value })} />
          <input placeholder="Estado" className="p-2 border rounded" value={filtro.estado} onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })} />
          <input placeholder="Cidade" className="p-2 border rounded" value={filtro.cidade} onChange={(e) => setFiltro({ ...filtro, cidade: e.target.value })} />
          <input placeholder="Bairro" className="p-2 border rounded" value={filtro.bairro} onChange={(e) => setFiltro({ ...filtro, bairro: e.target.value })} />
          <input type="number" placeholder="Tamanho mínimo (m²)" className="p-2 border rounded" value={filtro.tamanhoMin} onChange={(e) => setFiltro({ ...filtro, tamanhoMin: e.target.value })} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={buscarTerrenos}>Buscar</button>
        </div>

        <div className="space-y-4">
          {resultados.length > 0 ? (
            resultados.map((terreno) => (
              <div key={terreno.id} className="bg-gray-200 p-4 flex justify-between items-center relative">
                <span>{`${terreno.cidade} - ${terreno.estado}`} — {terreno.tamanho}m²</span>
                <button className="text-blue-600 hover:underline" onClick={() => setDetalhesVisiveis((d) => (d === terreno.id ? null : terreno.id))}>
                  ver detalhes
                </button>
                {detalhesVisiveis === terreno.id && (
                  <div className="absolute right-0 mt-2 bg-black text-white p-4 rounded shadow-md z-10 w-72">
                    <p><strong>País:</strong> {terreno.pais}</p>
                    <p><strong>Estado:</strong> {terreno.estado}</p>
                    <p><strong>Cidade:</strong> {terreno.cidade}</p>
                    <p><strong>Bairro:</strong> {terreno.bairro}</p>
                    <p><strong>Área:</strong> {terreno.tamanho} m²</p>
                    <button className="mt-2 text-white font-bold underline" onClick={() => abrirModal(terreno)}>criar projeto</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Nenhum terreno encontrado.</p>
          )}
        </div>
      </div>

      {modalAberto && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Criar Projeto</h3>
            <input className="w-full p-2 border mb-2" placeholder="Nome do Projeto" value={projetoAtual.nome} onChange={(e) => setProjetoAtual({ ...projetoAtual, nome: e.target.value })} />
            <textarea className="w-full p-2 border mb-2" placeholder="Descrição" value={projetoAtual.descricao} onChange={(e) => setProjetoAtual({ ...projetoAtual, descricao: e.target.value })} />
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={enviarProposta}>Enviar Proposta</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-300 p-4 text-center mt-auto">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={abrirPainelMonitoramento}
        >
          Painel de Monitoramento
        </button>
      </div>

      {painelAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Projetos Enviados</h2>
            {projetosEnviados.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum projeto enviado ainda.</p>
            ) : (
              projetosEnviados.map((projeto) => (
                <div key={projeto.id} className="border-b pb-4 mb-4">
                  <p><strong>Projeto:</strong> {projeto.nome}</p>
                  <p><strong>Descrição:</strong> {projeto.descricao}</p>
                  <p><strong>Terreno:</strong> {projeto.terreno.cidade} - {projeto.terreno.estado} ({projeto.terreno.tamanho}m²)</p>
                  <p><strong>Status:</strong>{" "}
                    {projeto.aprovado
                      ? "Aprovado"
                      : projeto.rejeitado
                        ? "Rejeitado"
                        : "Pendente"}
                  </p>

                  {projeto.ofertas && projeto.ofertas.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold">Ofertas de Investimento:</p>
                      {projeto.ofertas.map((oferta) => (
                        <div key={oferta.id} className="border mt-2 p-2 rounded bg-gray-100">
                          <p><strong>Valor:</strong> R$ {oferta.valor.toFixed(2)}</p>
                          <p><strong>Descrição:</strong> {oferta.descricao}</p>
                          <p><strong>Investidor:</strong> {oferta.investidor.nome} ({oferta.investidor.email})</p>
                          <p><strong>Status:</strong> {
                            oferta.aceitaEmpresa && oferta.aceitaProprietario
                              ? "Aceita por ambos"
                              : oferta.rejeitadaEmpresa || oferta.rejeitadaProprietario
                                ? "Rejeitada"
                                : "Pendente"
                          }</p>

                          {!oferta.aceitaEmpresa && !oferta.rejeitadaEmpresa && (
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => responderOfertaClick(oferta.id, "aceitar")} className="bg-green-600 text-white px-3 py-1 rounded">
                                Aceitar
                              </button>
                              <button onClick={() => responderOfertaClick(oferta.id, "rejeitar")} className="bg-red-600 text-white px-3 py-1 rounded">
                                Rejeitar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            <div className="text-center mt-4">
              <button
                onClick={() => setPainelAberto(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
