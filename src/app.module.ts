import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import OrmConfig, { envFilePath } from './ormConfig';
import { ConfigModule } from '@nestjs/config';
import { JobPostingModule } from './job-posting/job-posting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(OrmConfig as TypeOrmModuleOptions),
    CompanyModule,
    JobPostingModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
