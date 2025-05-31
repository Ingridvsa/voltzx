import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Cadastrar novo terreno (somente proprietário)
router.post("/", authenticateToken, async (req, res) => {
  const { pais, estado, cidade, bairro, tamanho } = req.body;
  const userId = req.user?.id;

  if (!userId || req.user.role !== "proprietario") {
    return res.status(403).json({ error: "Apenas proprietários podem cadastrar terrenos." });
  }

  try {
    const terreno = await prisma.terreno.create({
      data: {
        pais,
        estado,
        cidade,
        bairro,
        tamanho: Number(tamanho),
        userId,
      },
    });
    res.status(201).json(terreno);
  } catch (err) {
    console.error("Erro ao criar terreno:", err);
    res.status(500).json({ error: err.message });
  }
});

// Listar terrenos
router.get("/", authenticateToken, async (req, res) => {
  try {
    let terrenos;

    if (req.user.role === "proprietario") {
      // Proprietário vê apenas os terrenos dele
      terrenos = await prisma.terreno.findMany({
        where: { userId: req.user.id },
      });
    } else if (req.user.role === "empresa") {
      // Empresa vê todos os terrenos de usuários com role "proprietario"
      terrenos = await prisma.terreno.findMany({
        where: {
          user: {
            role: "proprietario",
          },
        },
        include: { user: true },
      });
    } else {
      return res.status(403).json({ error: "Perfil não autorizado." });
    }

    res.json(terrenos);
  } catch (err) {
    console.error("Erro ao buscar terrenos:", err);
    res.status(500).json({ error: "Erro ao buscar terrenos." });
  }
});

export default router;
