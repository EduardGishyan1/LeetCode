import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../services/prismaService';

export interface QuoteResponse {
  symbol: string;
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  timestamp: number;
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
      // Symbols we still need quotes for
      const remainingSymbols = this.symbols.filter(
        symbol => !validQuotes.some(q => q.symbol === symbol)
      );

      // Fetch quotes for all remaining symbols concurrently
      const quotePromises = remainingSymbols.map(async symbol => {
        try {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`
          );
          const data = response.data;

          if (data && data.c != null) {
            return {
              symbol,
              currentPrice: data.c,
              highPrice: data.h,
              lowPrice: data.l,
              openPrice: data.o,
              timestamp: data.t,
            } as QuoteResponse;
          }
        } catch (error) {
          // Log error but don't fail all
          console.error(`Error fetching symbol ${symbol}:`, error.message || error);
        }
        return null;
      });

      // Wait for all fetches to complete
      const fetchedQuotes = (await Promise.all(quotePromises)).filter(
        (q): q is QuoteResponse => q !== null
      );

      // Add unique new quotes to validQuotes (limit max 60)
      for (const q of fetchedQuotes) {
        if (validQuotes.length >= 60) break;
        if (!validQuotes.some(existing => existing.symbol === q.symbol)) {
          validQuotes.push(q);
        }
      }

      // Batch upsert to DB outside map for better control
      try {
        await Promise.all(
          fetchedQuotes.map(q =>
            this.prisma.quote.upsert({
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
            })
          )
        );
      } catch (dbError) {
        console.error('Error upserting quotes to DB:', dbError);
        // Depending on your needs, you can decide to throw or continue
      }

      // If we still need more quotes, wait before next batch
      if (validQuotes.length < 60) {
        console.log(`Collected ${validQuotes.length} quotes, waiting before next batch...`);
        await this.delay(10000); // 10 seconds delay to avoid hitting rate limits
      }
    }

    return validQuotes;
  }
}