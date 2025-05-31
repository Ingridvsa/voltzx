-- CreateTable
CREATE TABLE "Terreno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "localizacao" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "preco" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "terrenoId" INTEGER NOT NULL,
    CONSTRAINT "Projeto_terrenoId_fkey" FOREIGN KEY ("terrenoId") REFERENCES "Terreno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
