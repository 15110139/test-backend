import { EnvironmentService } from 'src/module/environment/environment.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormModule = () =>
  TypeOrmModule.forRootAsync({
    inject: [EnvironmentService],
    useFactory: async (
      env: EnvironmentService,
    ): Promise<TypeOrmModuleOptions> => {
      return <TypeOrmModuleOptions>{
        logging: true,
        type: 'postgres',
        host: env.ENVIRONMENT.DB_HOST,
        port: env.ENVIRONMENT.DB_PORT,
        username: env.ENVIRONMENT.DB_USER,
        database: env.ENVIRONMENT.DB_NAME,
        password: env.ENVIRONMENT.DB_PASSWORD,
        entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
        keepConnectionAlive: true,
        extra: {
          connectionLimit: env.ENVIRONMENT.DB_CONNECTION_LIMIT,
        },
      };
    },
  });
