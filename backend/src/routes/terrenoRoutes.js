import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken, async (req, res) => {
  console.log("REQ.USER:", req.user); // mostra o token decodificado
  console.log("BODY:", req.body);     // mostra os dados enviados

  const { localizacao, preco, tamanho } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "Usuário não autenticado corretamente." });
  }

  try {
    const terreno = await prisma.terreno.create({
      data: {
        localizacao,
        preco,
        tamanho: Number(tamanho),
        userId,
      },
    });
    res.status(201).json(terreno);
  } catch (err) {
    console.error("ERRO AO CRIAR TERRENO:", err); // ← mostra erro no terminal
    res.status(500).json({ error: err.message }); // ← mostra erro real no Insomnia
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    let terrenos;

    if (req.user.role === "proprietario") {
      // Proprietário vê só os seus
      terrenos = await prisma.terreno.findMany({
        where: {
          userId: req.user.id,
        },
      });
    } else if (req.user.role === "empresa" || req.user.role === "investidor") {
      // Empresas e investidores veem todos
      terrenos = await prisma.terreno.findMany({
        include: { user: true },
      });
    } else {
      return res.status(403).json({ error: "Perfil não autorizado" });
    }

    res.json(terrenos);
  } catch (err) {
    console.error("Erro ao buscar terrenos:", err);
    res.status(500).json({ error: "Erro ao buscar terrenos." });
  }
});

export default router;
