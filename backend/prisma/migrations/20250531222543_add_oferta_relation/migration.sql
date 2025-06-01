-- CreateTable
CREATE TABLE "Oferta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projetoId" INTEGER NOT NULL,
    "investidorId" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "aceitaEmpresa" BOOLEAN NOT NULL DEFAULT false,
    "aceitaProprietario" BOOLEAN NOT NULL DEFAULT false,
    "rejeitadaEmpresa" BOOLEAN NOT NULL DEFAULT false,
    "rejeitadaProprietario" BOOLEAN NOT NULL DEFAULT false,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Oferta_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Oferta_investidorId_fkey" FOREIGN KEY ("investidorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
