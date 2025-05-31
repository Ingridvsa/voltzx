import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function criarTerreno(req, res) {
  const { localizacao, preco, tamanho } = req.body;
  const userId = req.user.id;

  try {
    const terreno = await prisma.terreno.create({
      data: {
        localizacao,
        preco,
        tamanho: Number(tamanho),
        userId: userId,
      },
    });

    res.status(201).json(terreno);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar terreno." });
  }
}

export async function listarTerrenos(req, res) {
  try {
    let terrenos;

    if (req.user.role === "proprietario") {
      terrenos = await prisma.terreno.findMany({
        where: {
          userId: req.user.id,
        },
      });
    } else {
      terrenos = await prisma.terreno.findMany(); // empresa ou investidor veem todos
    }

    res.json(terrenos);
  } catch (err) {
    console.error("Erro ao buscar terrenos:", err);
    res.status(500).json({ error: "Erro ao buscar terrenos." });
  }
}

