import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from './module/environment/environment.service';

async function bootstrap() {
  const logger = new Logger('SYSTEM');
  const app = await NestFactory.create(AppModule);
  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (error) => {
        return new BadRequestException(error);
      },
    }),
  );
  app.enableCors({ origin: true, methods: ['GET', 'POST', 'DELETE', 'PUT'] });
  const envService = app.get(EnvironmentService);
  const API_PORT = envService.ENVIRONMENT.API_PORT;
  await app.listen(API_PORT);
  logger.log(`Server start port: ${API_PORT}`);
}
bootstrap();
