-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "productName" TEXT NOT NULL DEFAULT 'Unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "id", "isArchived", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "isArchived", "updatedAt", "userId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
