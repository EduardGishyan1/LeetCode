-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION,
    "lowPrice" DOUBLE PRECISION,
    "openPrice" DOUBLE PRECISION,
    "previousClose" DOUBLE PRECISION,
    "timestamp" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_symbol_key" ON "Quote"("symbol");
