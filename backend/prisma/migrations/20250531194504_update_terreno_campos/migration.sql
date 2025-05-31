/*
  Warnings:

  - You are about to drop the column `localizacao` on the `Terreno` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `Terreno` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Terreno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pais" TEXT,
    "estado" TEXT,
    "cidade" TEXT,
    "bairro" TEXT,
    "tamanho" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Terreno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Terreno" ("id", "tamanho", "userId") SELECT "id", "tamanho", "userId" FROM "Terreno";
DROP TABLE "Terreno";
ALTER TABLE "new_Terreno" RENAME TO "Terreno";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
