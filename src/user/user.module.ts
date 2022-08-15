import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JobApplication } from 'src/job-application/entities/job-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, JobApplication])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
