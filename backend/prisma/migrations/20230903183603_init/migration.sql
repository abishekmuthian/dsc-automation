/*
  Warnings:

  - You are about to drop the column `studentFormToggle` on the `StudentForm` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "disability" TEXT NOT NULL
);
INSERT INTO "new_StudentForm" ("disability", "email", "id", "name", "studentId") SELECT "disability", "email", "id", "name", "studentId" FROM "StudentForm";
DROP TABLE "StudentForm";
ALTER TABLE "new_StudentForm" RENAME TO "StudentForm";
CREATE UNIQUE INDEX "StudentForm_studentId_key" ON "StudentForm"("studentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
