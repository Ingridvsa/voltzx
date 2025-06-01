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
// GET /api/projetos/monitoramento
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
        terreno: { include: { user: true } },
        empresa: true,
        ofertas: {
          include: {
            investidor: {
              select: { nome: true, email: true }
            }
          }
        }
      }
    });

    res.json({
      projetos,
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

// GET /api/projetos/disponiveis - Projetos aprovados para investidores
router.get("/disponiveis", authenticateToken, async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany({
      where: {
        aprovado: true,
        rejeitado: false,
      },
      include: {
        terreno: true,
        empresa: {
          select: {
            nome: true,
            email: true,
          },
        },
      },
    });

    res.json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos disponíveis:", error);
    res.status(500).json({ error: "Erro ao buscar projetos disponíveis" });
  }
});

// POST /api/projetos/ofertas/:id/resposta
router.post("/ofertas/:id/resposta", authenticateToken, async (req, res) => {
  const ofertaId = parseInt(req.params.id);
  const { acao, origem } = req.body;

  if (!["aceitar", "rejeitar"].includes(acao) || !["empresa", "proprietario"].includes(origem)) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const oferta = await prisma.oferta.findUnique({
      where: { id: ofertaId },
      include: {
        projeto: {
          include: { terreno: true }
        }
      }
    });

    if (!oferta) return res.status(404).json({ error: "Oferta não encontrada" });

    if (
      (origem === "empresa" && oferta.projeto.empresaId !== req.user.id) ||
      (origem === "proprietario" && oferta.projeto.terreno.userId !== req.user.id)
    ) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const dataUpdate = {};
    if (origem === "empresa") {
      dataUpdate.aceitaEmpresa = acao === "aceitar";
      dataUpdate.rejeitadaEmpresa = acao === "rejeitar";
    } else {
      dataUpdate.aceitaProprietario = acao === "aceitar";
      dataUpdate.rejeitadaProprietario = acao === "rejeitar";
    }

    const ofertaAtualizada = await prisma.oferta.update({
      where: { id: ofertaId },
      data: dataUpdate,
    });

    res.json(ofertaAtualizada);
  } catch (err) {
    console.error("Erro ao responder oferta:", err);
    res.status(500).json({ error: "Erro ao processar resposta" });
  }
});

// GET /api/projetos/investidor - Painel de projetos aceitos para o investidor logado
router.get("/investidor", authenticateToken, async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany({
      where: {
        ofertas: {
          some: {
            investidorId: req.user.id,
            aceitaEmpresa: true,
            aceitaProprietario: true
          }
        }
      },
      include: {
        terreno: true,
        empresa: true,
        ofertas: {
          where: { investidorId: req.user.id }
        }
      }
    });

    res.json(projetos);
  } catch (error) {
    console.error("Erro ao buscar painel do investidor:", error);
    res.status(500).json({ error: "Erro ao buscar dados do investidor" });
  }
});

// GET /api/projetos/ofertas-aceitas - Projetos confirmados para o investidor
router.get("/ofertas-aceitas", authenticateToken, async (req, res) => {
  try {
    const ofertasAceitas = await prisma.oferta.findMany({
      where: {
        investidorId: req.user.id,
        aceitaEmpresa: true,
        aceitaProprietario: true,
      },
      include: {
        projeto: {
          include: {
            terreno: { include: { user: true } },
            empresa: true,
          },
        },
      },
    });

    res.json(ofertasAceitas);
  } catch (error) {
    console.error("Erro ao buscar ofertas aceitas:", error);
    res.status(500).json({ error: "Erro ao buscar ofertas aceitas" });
  }
});

// GET /api/projetos/ofertas-investidor - Painel do investidor com ofertas aceitas
router.get("/ofertas-investidor", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "investidor") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const ofertasAceitas = await prisma.oferta.findMany({
      where: {
        investidorId: req.user.id,
        aceitaEmpresa: true,
        aceitaProprietario: true,
        rejeitadaEmpresa: false,
        rejeitadaProprietario: false
      },
      include: {
        projeto: {
          include: {
            terreno: true,
            empresa: { select: { nome: true, email: true } }
          }
        }
      }
    });

    res.json(ofertasAceitas);
  } catch (error) {
    console.error("Erro ao buscar painel do investidor:", error);
    res.status(500).json({ error: "Erro ao carregar painel do investidor" });
  }
});


export default router;
