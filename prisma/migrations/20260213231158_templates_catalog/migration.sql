-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'section',
    "category" TEXT,
    "framework" TEXT NOT NULL DEFAULT 'nextjs',
    "uiStack" TEXT,
    "tags" TEXT,
    "layoutCode" TEXT,
    "placeholdersSchema" TEXT,
    "previewImageUrl" TEXT,
    "sourceMode" TEXT NOT NULL DEFAULT 'local',
    "repoFullName" TEXT,
    "defaultBranch" TEXT,
    "templateRootPath" TEXT,
    "pinnedPaths" TEXT,
    "readmePath" TEXT DEFAULT 'README.md',
    "entryFile" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'none',
    "lastSyncAt" DATETIME,
    "lastCommitSha" TEXT,
    "syncErrorMessage" TEXT,
    "fileTreeSnapshot" TEXT,
    "usesCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Template" ("createdAt", "description", "id", "layoutCode", "name", "placeholdersSchema", "previewImageUrl", "slug", "tags", "updatedAt") SELECT "createdAt", "description", "id", "layoutCode", "name", "placeholdersSchema", "previewImageUrl", "slug", "tags", "updatedAt" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
