import React, { useEffect, useState } from "react";
import { getPainelData, responderProjeto } from "../services/api";

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

  router.post("/:id/resposta", authenticateToken, async (req, res) => {
  const projetoId = parseInt(req.params.id);
  const { acao } = req.body;

  console.log("Requisição recebida:", { projetoId, acao, user: req.user });

  if (!["aceitar", "rejeitar"].includes(acao)) {
    return res.status(400).json({ error: "Ação inválida" });
  }

  try {
    const projeto = await prisma.projeto.findUnique({
      where: { id: projetoId },
      include: { terreno: true }
    });

    if (!projeto) {
      console.log("Projeto não encontrado");
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    // Verifica se é o proprietário
    if (projeto.terreno.userId !== req.user.id || req.user.role !== "proprietario") {
      console.log("Acesso negado", {
        projetoUserId: projeto.terreno.userId,
        currentUserId: req.user.id,
        role: req.user.role
      });
      return res.status(403).json({ error: "Acesso negado" });
    }

    const projetoAtualizado = await prisma.projeto.update({
      where: { id: projetoId },
      data: {
        aprovado: acao === "aceitar",
        rejeitado: acao === "rejeitar",
      },
    });

    res.json(projetoAtualizado);
  } catch (error) {
    console.error("Erro ao responder projeto:", error); // <-- Aqui vem o erro exato
    res.status(500).json({ error: "Erro ao responder projeto" });
  }
});


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
          </div>
        );
      })}
    </div>
  );
}
