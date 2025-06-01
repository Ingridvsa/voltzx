/*
  Warnings:

  - Added the required column `empresaId` to the `Projeto` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projeto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "terrenoId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    CONSTRAINT "Projeto_terrenoId_fkey" FOREIGN KEY ("terrenoId") REFERENCES "Terreno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Projeto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Projeto" ("descricao", "id", "nome", "terrenoId") SELECT "descricao", "id", "nome", "terrenoId" FROM "Projeto";
DROP TABLE "Projeto";
ALTER TABLE "new_Projeto" RENAME TO "Projeto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
