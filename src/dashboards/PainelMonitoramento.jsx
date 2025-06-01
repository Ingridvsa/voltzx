import React, { useEffect, useState } from "react";
import { getPainelData, responderProjeto, responderOferta } from "../services/api";

export default function PainelMonitoramento() {
  const [projetos, setProjetos] = useState([]);
  const [status, setStatus] = useState("carregando");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarPainel() {
      try {
        const token = localStorage.getItem("token");
        const res = await getPainelData(token);
        setProjetos(res.projetos || []);
        setUsuario(res.usuario);
        setStatus("ok");
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        setStatus("erro");
      }
    }

    carregarPainel();
  }, []);

  const responder = async (projetoId, acao) => {
    try {
      const token = localStorage.getItem("token");
      await responderProjeto(projetoId, acao, token);
      alert(`Projeto ${acao === "aceitar" ? "aceito" : "rejeitado"} com sucesso!`);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao responder projeto:", err);
      alert("Erro ao responder proposta.");
    }
  };

  const responderOfertaClick = async (ofertaId, resposta) => {
  try {
    const token = localStorage.getItem("token");
    const origem = usuario?.role; // vai ser "empresa" ou "proprietario"
    await responderOferta(ofertaId, resposta, token, origem);
    alert(`Oferta ${resposta === "aceitar" ? "aceita" : "rejeitada"} com sucesso!`);
    window.location.reload();
  } catch (err) {
    console.error("Erro ao responder oferta:", err);
    alert("Erro ao responder oferta.");
  }
};


  if (status === "carregando") return <p className="text-center">Carregando...</p>;
  if (projetos.length === 0) return <p className="text-center text-gray-500">Nenhum projeto encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Painel de Monitoramento</h2>

      {projetos.map((projeto) => {
        const podeResponder = usuario?.role === "proprietario" && !projeto.aprovado && !projeto.rejeitado;

        return (
          <div key={projeto.id} className="bg-white shadow p-6 rounded mb-6">
            <h3 className="text-lg font-semibold mb-2">Projeto</h3>
            <p><strong>Nome:</strong> {projeto.nome}</p>
            <p><strong>Descrição:</strong> {projeto.descricao}</p>

            <h3 className="mt-4 font-semibold">Terreno</h3>
            <p><strong>Localização:</strong> {projeto.terreno.cidade} - {projeto.terreno.estado}</p>
            <p><strong>Área:</strong> {projeto.terreno.tamanho} m²</p>

            <h3 className="mt-4 font-semibold">Contatos</h3>
            <p><strong>Proprietário:</strong> {projeto.terreno.user.nome} - {projeto.terreno.user.email}</p>
            <p><strong>Empresa:</strong> {projeto.empresa.nome} - {projeto.empresa.email}</p>

            <h3 className="mt-4 font-semibold">Status</h3>
            {!projeto.aprovado && !projeto.rejeitado && (
              <p className="text-yellow-600">Pendente</p>
            )}
            {projeto.aprovado && (
              <p className="text-green-600">Projeto aprovado</p>
            )}
            {projeto.rejeitado && (
              <p className="text-red-600">Projeto rejeitado</p>
            )}

            {podeResponder && (
              <div className="mt-6 flex justify-center gap-4">
                <button onClick={() => responder(projeto.id, "aceitar")} className="bg-green-500 text-white px-4 py-2 rounded">
                  Aceitar Projeto
                </button>
                <button onClick={() => responder(projeto.id, "rejeitar")} className="bg-red-500 text-white px-4 py-2 rounded">
                  Rejeitar Projeto
                </button>
              </div>
            )}

            {/* Ofertas */}
            {projeto.ofertas && projeto.ofertas.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Ofertas de Investimento</h4>
                {projeto.ofertas.map((oferta) => (
                  <div key={oferta.id} className="border p-3 rounded mb-2">
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

                    {(usuario.role === "empresa" && !oferta.aceitaEmpresa && !oferta.rejeitadaEmpresa) && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => responderOfertaClick(oferta.id, "aceitar")} className="bg-green-600 text-white px-3 py-1 rounded">Aceitar</button>
                        <button onClick={() => responderOfertaClick(oferta.id, "rejeitar")} className="bg-red-600 text-white px-3 py-1 rounded">Rejeitar</button>
                      </div>
                    )}
                    {(usuario.role === "proprietario" && !oferta.aceitaProprietario && !oferta.rejeitadaProprietario) && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => responderOfertaClick(oferta.id, "aceitar")} className="bg-green-600 text-white px-3 py-1 rounded">Aceitar</button>
                        <button onClick={() => responderOfertaClick(oferta.id, "rejeitar")} className="bg-red-600 text-white px-3 py-1 rounded">Rejeitar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
