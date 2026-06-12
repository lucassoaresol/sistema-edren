ALTER TABLE "StockLocation" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
UPDATE "StockLocation" SET "isActive" = ("status" = 'ACTIVE');
ALTER TABLE "StockLocation" DROP COLUMN "status";

ALTER TABLE "SalesChannel" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
UPDATE "SalesChannel" SET "isActive" = ("status" = 'ACTIVE');
ALTER TABLE "SalesChannel" DROP COLUMN "status";

DROP TYPE "ConfigStatus";
