"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinnhubService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const prismaService_1 = require("../services/prismaService");
let FinnhubService = class FinnhubService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    apiKey = 'd0vcpphr01qmg3ulljt0d0vcpphr01qmg3ulljtg';
    symbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK.B', 'JNJ', 'V', 'WMT',
        'NVDA', 'JPM', 'UNH', 'HD', 'PG', 'MA', 'DIS', 'BAC', 'ADBE', 'CMCSA',
        'NFLX', 'XOM', 'INTC', 'KO', 'CSCO', 'PFE', 'PEP', 'VZ', 'T', 'ABBV',
        'CVX', 'ABT', 'CRM', 'NKE', 'ORCL', 'MRK', 'TMO', 'ACN', 'WFC', 'MCD',
        'DHR', 'LLY', 'MDT', 'COST', 'NEE', 'AMGN', 'TXN', 'HON', 'QCOM', 'BMY',
        'LIN', 'PM', 'UPS', 'RTX', 'LOW', 'UNP', 'GS', 'CAT', 'BLK', 'IBM'
    ];
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async getQuotesForValidCompanies() {
        if (!this.apiKey) {
            throw new common_1.HttpException('API key not set', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const validQuotes = [];
        while (validQuotes.length < 60) {
            const remainingSymbols = this.symbols.filter(symbol => !validQuotes.some(q => q.symbol === symbol));
            const quotePromises = remainingSymbols.map(async (symbol) => {
                try {
                    const response = await axios_1.default.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`);
                    const data = response.data;
                    if (data && data.c != null) {
                        return {
                            symbol,
                            currentPrice: data.c,
                            highPrice: data.h,
                            lowPrice: data.l,
                            openPrice: data.o,
                            timestamp: data.t,
                        };
                    }
                }
                catch (error) {
                    console.error(`Error fetching symbol ${symbol}:`, error.message || error);
                }
                return null;
            });
            const fetchedQuotes = (await Promise.all(quotePromises)).filter((q) => q !== null);
            for (const q of fetchedQuotes) {
                if (validQuotes.length >= 60)
                    break;
                if (!validQuotes.some(existing => existing.symbol === q.symbol)) {
                    validQuotes.push(q);
                }
            }
            try {
                await Promise.all(fetchedQuotes.map(q => this.prisma.quote.upsert({
                    where: { symbol: q.symbol },
                    update: {
                        currentPrice: q.currentPrice,
                        highPrice: q.highPrice,
                        lowPrice: q.lowPrice,
                        openPrice: q.openPrice,
                        timestamp: q.timestamp,
                    },
                    create: {
                        symbol: q.symbol,
                        currentPrice: q.currentPrice,
                        highPrice: q.highPrice,
                        lowPrice: q.lowPrice,
                        openPrice: q.openPrice,
                        timestamp: q.timestamp,
                    },
                })));
            }
            catch (dbError) {
                console.error('Error upserting quotes to DB:', dbError);
            }
            if (validQuotes.length < 60) {
                console.log(`Collected ${validQuotes.length} quotes, waiting before next batch...`);
                await this.delay(10000);
            }
        }
        return validQuotes;
    }
};
exports.FinnhubService = FinnhubService;
exports.FinnhubService = FinnhubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaService_1.PrismaService])
], FinnhubService);
//# sourceMappingURL=getInfo.js.map