import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from "./services/prismaService";

const prisma = new PrismaService();

async function main() {
  await prisma.onModuleInit();
}

async function bootstrap() {
  await main()
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();