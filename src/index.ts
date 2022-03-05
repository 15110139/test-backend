import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { EnvironmentService } from './module/environment/environment.service';
let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  const logger = new Logger('SYSTEM');
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
  await app.init();
  return awsServerlessExpress.createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};
