import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

export const envFilePath = `${__dirname}/config/env/.${process.env.NODE_ENV}.env`;

dotenv.config({ path: envFilePath });

export class OrmConfig {
  getConfig() {
    let ormConfig: TypeOrmModuleOptions;

    switch (process.env.NODE_ENV) {
      case 'development': {
        ormConfig = {
          type: process.env.DATABASE_TYPE,
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
          migrations: [__dirname + '/migrations/*.ts'],
        };
      }

      case 'deployment': {
        // deployment config
      }
    }

    return ormConfig;
  }
}

export default new OrmConfig().getConfig();
