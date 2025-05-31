/*
  Warnings:

  - Added the required column `userId` to the `Terreno` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Terreno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "localizacao" TEXT NOT NULL,
    "preco" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Terreno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Terreno" ("id", "localizacao", "preco", "tamanho") SELECT "id", "localizacao", "preco", "tamanho" FROM "Terreno";
DROP TABLE "Terreno";
ALTER TABLE "new_Terreno" RENAME TO "Terreno";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
