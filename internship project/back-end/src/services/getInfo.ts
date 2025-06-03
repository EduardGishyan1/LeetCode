import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../services/prismaService';

export interface QuoteResponse {
    symbol: string;
    currentPrice: number;
    highPrice: number,
    lowPrice: number,
    openPrice: number,
    timestamp: number,
}

@Injectable()
export class FinnhubService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly apiKey = 'd0vcpphr01qmg3ulljt0d0vcpphr01qmg3ulljtg';

    private readonly symbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK.B', 'JNJ', 'V', 'WMT',
        'NVDA', 'JPM', 'UNH', 'HD', 'PG', 'MA', 'DIS', 'BAC', 'ADBE', 'CMCSA',
        'NFLX', 'XOM', 'INTC', 'KO', 'CSCO', 'PFE', 'PEP', 'VZ', 'T', 'ABBV',
        'CVX', 'ABT', 'CRM', 'NKE', 'ORCL', 'MRK', 'TMO', 'ACN', 'WFC', 'MCD',
        'DHR', 'LLY', 'MDT', 'COST', 'NEE', 'AMGN', 'TXN', 'HON', 'QCOM', 'BMY',
        'LIN', 'PM', 'UPS', 'RTX', 'LOW', 'UNP', 'GS', 'CAT', 'BLK', 'IBM'
    ];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getQuotesForValidCompanies(): Promise<QuoteResponse[]> {
        if (!this.apiKey) {
            throw new HttpException('API key not set', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const validQuotes: QuoteResponse[] = [];

        while (validQuotes.length < 60) {
            const remainingSymbols = this.symbols.filter(
                symbol => !validQuotes.some(q => q.symbol === symbol)
            );

            const quotePromises = remainingSymbols.map(async symbol => {
                try {
                    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`);
                    const data = response.data;

                    if (data && data.c != null) {
                        const quote: QuoteResponse = {
                            symbol,
                            currentPrice: data.c,
                            highPrice: data.h,
                            lowPrice: data.l,
                            openPrice: data.o,
                            timestamp: data.t,
                        };

                        await this.prisma.quote.upsert({
                            where: { symbol: quote.symbol },
                            update: {
                                currentPrice: quote.currentPrice,
                                highPrice: quote.highPrice,
                                lowPrice: quote.lowPrice,
                                openPrice: quote.openPrice,
                                timestamp: quote.timestamp,
                            },
                            create: {
                                symbol: quote.symbol,
                                currentPrice: quote.currentPrice,
                                highPrice: quote.highPrice,
                                lowPrice: quote.lowPrice,
                                openPrice: quote.openPrice,
                                timestamp: quote.timestamp,
                            },
                        });

                        return quote;
                    }
                } catch (error) {
                    if (error.status === 429) {
                        console.log(`Error: ${error.message}`);
                    }
                }
                return null;
            });

            const quotes = await Promise.all(quotePromises);

            let newCount = 0;

            quotes.forEach(q => {
                if (q && !validQuotes.some(existing => existing.symbol === q.symbol)) {
                    validQuotes.push(q);
                    newCount++;
                }
            });

            if (validQuotes.length < 60) {
                await this.delay(2000);
                console.log("delay")
            }
        }

        return validQuotes;
    }
}