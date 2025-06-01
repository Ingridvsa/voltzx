import React, { useState, useEffect } from "react";
import {
  cadastrarTerreno,
  listarTerrenos,
  getPainelData,
  responderProjeto,
} from "../services/api";

export default function ProprietarioDashboard() {
  const [terrenos, setTerrenos] = useState([]);
  const [terreno, setTerreno] = useState({
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    tamanho: "",
  });
  const [loading, setLoading] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [detalheVisivel, setDetalheVisivel] = useState(false);
  const [terrenoSelecionado, setTerrenoSelecionado] = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [projetosRecebidos, setProjetosRecebidos] = useState([]);

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

  async function carregarProjetosRecebidos() {
    try {
      const token = localStorage.getItem("token");
      const res = await getPainelData(token);
      setProjetosRecebidos(res.projetos || []);
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
    }
  }

  const responder = async (id, acao, tipo) => {
    try {
      const token = localStorage.getItem("token");

      if (tipo === "projeto") {
        await responderProjeto(id, acao, token);
        alert(`Projeto ${acao === "aceitar" ? "aceito" : "rejeitado"} com sucesso!`);
      } else if (tipo === "proprietario") {
        await fetch(`http://localhost:3000/api/projetos/ofertas/${id}/resposta`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ acao, origem: "proprietario" }),
        });
        alert(`Oferta ${acao === "aceitar" ? "aceita" : "rejeitada"} com sucesso!`);
      }

      carregarProjetosRecebidos();
    } catch (err) {
      console.error("Erro ao responder:", err);
      alert("Erro ao responder.");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const novo = await cadastrarTerreno(terreno, token);
      setTerrenos([...terrenos, novo]);
      setTerreno({ pais: "", estado: "", cidade: "", bairro: "", tamanho: "" });
      setFormAberto(false);
      alert("Terreno cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar terreno");
    }
    setLoading(false);
  }

  function verDetalhes(terreno) {
    setTerrenoSelecionado(terreno);
    setDetalheVisivel(true);
  }

  function abrirPainel() {
    carregarProjetosRecebidos();
    setPainelAberto(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-gray-300 p-4 text-center font-bold text-lg">PROPRIETÁRIO</div>
      <div className="text-center font-medium p-2">meus terrenos</div>

      <div className="flex justify-center mt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={abrirPainel}
        >
          Painel de Monitoramento
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center space-y-4">
        {terrenos.map((t, index) => (
          <div key={index} className="bg-gray-200 w-2/3 flex justify-between p-4">
            <span>terreno {index + 1}</span>
            <button
              onClick={() => verDetalhes(t)}
              className="text-blue-600 hover:underline"
            >
              ver detalhes
            </button>
          </div>
        ))}
      </div>

      {detalheVisivel && terrenoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Detalhes do Terreno</h3>
            <p><strong>País:</strong> {terrenoSelecionado.pais}</p>
            <p><strong>Estado:</strong> {terrenoSelecionado.estado}</p>
            <p><strong>Cidade:</strong> {terrenoSelecionado.cidade}</p>
            <p><strong>Bairro:</strong> {terrenoSelecionado.bairro}</p>
            <p><strong>Tamanho:</strong> {terrenoSelecionado.tamanho} m²</p>
            <div className="text-right mt-4">
              <button onClick={() => setDetalheVisivel(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {painelAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Propostas Recebidas</h2>
            {projetosRecebidos.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma proposta recebida ainda.</p>
            ) : (
              projetosRecebidos.map((projeto) => (
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

                  {!projeto.aprovado && !projeto.rejeitado && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => responder(projeto.id, "aceitar", "projeto")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => responder(projeto.id, "rejeitar", "projeto")}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}

                  {/* Ofertas */}
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

                          {!oferta.aceitaProprietario && !oferta.rejeitadaProprietario && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => responder(oferta.id, "aceitar", "proprietario")}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                              >
                                Aceitar
                              </button>
                              <button
                                onClick={() => responder(oferta.id, "rejeitar", "proprietario")}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                              >
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

      <div className="bg-gray-300 p-4 text-center mt-auto">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setFormAberto(!formAberto)}
        >
          {formAberto ? "Cancelar" : "Cadastrar novo terreno"}
        </button>
      </div>

      {formAberto && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 border-t flex flex-col gap-2"
        >
          {["pais", "estado", "cidade", "bairro", "tamanho"].map((campo) => (
            <input
              key={campo}
              className="p-2 border"
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              value={terreno[campo]}
              onChange={(e) =>
                setTerreno({ ...terreno, [campo]: e.target.value })
              }
            />
          ))}
          <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
            Salvar
          </button>
        </form>
      )}
    </div>
  );
}
