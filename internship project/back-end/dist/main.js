"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prismaService_1 = require("./services/prismaService");
const prisma = new prismaService_1.PrismaService();
async function main() {
    await prisma.onModuleInit();
}
async function bootstrap() {
    await main();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
//# sourceMappingURL=main.js.map