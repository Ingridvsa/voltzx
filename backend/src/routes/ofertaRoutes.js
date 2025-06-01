import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/ofertas – Criar oferta de investimento
router.post("/", authenticateToken, async (req, res) => {
  const { projetoId, valor, descricao } = req.body;

  try {
    const oferta = await prisma.oferta.create({
      data: {
        projetoId,
        valor,
        descricao,
        investidorId: req.user.id,
      },
    });

    res.status(201).json(oferta);
  } catch (err) {
    console.error("Erro ao criar oferta:", err);
    res.status(500).json({ error: "Erro ao criar oferta" });
  }
});

// GET /api/ofertas/minhas - Retorna todas as ofertas feitas pelo investidor logado
router.get("/minhas", authenticateToken, async (req, res) => {
  try {
    const ofertas = await prisma.oferta.findMany({
      where: { investidorId: req.user.id },
      include: {
        projeto: {
          select: {
            nome: true,
            descricao: true
          }
        }
      }
    });

    res.json(ofertas);
  } catch (err) {
    console.error("Erro ao buscar ofertas do investidor:", err);
    res.status(500).json({ error: "Erro ao buscar ofertas do investidor" });
  }
});


export default router;
