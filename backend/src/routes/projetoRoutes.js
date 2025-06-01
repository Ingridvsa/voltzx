import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/projetos - Empresa cria projeto
router.post("/", authenticateToken, async (req, res) => {
  const { nome, descricao, terrenoId } = req.body;

  try {
    const projeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        terrenoId,
        empresaId: req.user.id, // isso aqui é ESSENCIAL
      }
    });
    res.status(201).json(projeto);
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    res.status(500).json({ error: "Erro ao criar projeto" });
  }
});

// GET /api/projetos/meus - Projetos do usuário logado
router.get("/meus", authenticateToken, async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany({
      where: {
        OR: [
          { empresaId: req.user.id },
          { terreno: { userId: req.user.id } }
        ],
      },
      include: {
        terreno: true,
        empresa: true,
        ofertas: {
          include: {
            investidor: true
          }
        }
      }
    });

    res.json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
});

// GET /api/projetos/monitoramento - Painel de monitoramento (empresa e proprietário)
// GET /api/projetos/monitoramento - Painel de monitoramento (empresa e proprietário)
router.get("/monitoramento", authenticateToken, async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany({
      where: {
        OR: [
          { empresaId: req.user.id },
          { terreno: { userId: req.user.id } }
        ],
      },
      include: {
        terreno: {
          include: { user: true }
        },
        empresa: true,
        ofertas: {
          include: { investidor: true }
        }
      }
    });

    res.json({
      projetos, // <- plural
      usuario: { id: req.user.id, role: req.user.role }
    });
  } catch (error) {
    console.error("Erro ao carregar monitoramento:", error);
    res.status(500).json({ error: "Erro ao carregar monitoramento" });
  }
});


// GET /api/projetos/:id/ofertas - Listar ofertas por projeto
router.get("/:id/ofertas", authenticateToken, async (req, res) => {
  const projetoId = parseInt(req.params.id);

  try {
    const ofertas = await prisma.oferta.findMany({
      where: { projetoId },
      include: {
        investidor: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    });

    res.json(ofertas);
  } catch (error) {
    console.error("Erro ao buscar ofertas:", error);
    res.status(500).json({ error: "Erro ao buscar ofertas" });
  }
});

// POST /api/projetos/:id/resposta - Proprietário responde à proposta
// POST /api/projetos/:id/resposta
router.post("/:id/resposta", authenticateToken, async (req, res) => {
  const projetoId = parseInt(req.params.id);
  const { acao } = req.body;

  if (!["aceitar", "rejeitar"].includes(acao)) {
    return res.status(400).json({ error: "Ação inválida" });
  }

  try {
    const projeto = await prisma.projeto.findUnique({
      where: { id: projetoId },
      include: { terreno: true }
    });

    if (!projeto) return res.status(404).json({ error: "Projeto não encontrado" });

    if (projeto.terreno.userId !== req.user.id || req.user.role !== "proprietario") {
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
    console.error("Erro ao responder projeto:", error);
    res.status(500).json({ error: "Erro ao responder projeto" });
  }
});


export default router;
