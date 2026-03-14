import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const PORT = process.env.PORT;
  const ENV = process.env["NODE_ENV"];
  const URLs = process.env["ACCEPT_URL"] || "";

  if (!PORT) throw new Error("PORT is undefined");
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.use(helmet());
  app.enableCors({
    origin:
      !ENV || ENV === "development" ? "http://localhost:3000" : URLs.split(","),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Requested-With",
      "apollo-query-plan",
      "baggage",
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  await app.listen(PORT);
}
bootstrap().catch((err) => {
  console.log(err);
  process.exit();
});
