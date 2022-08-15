import { Module } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { JobPostingController } from './job-posting.controller';
import { JobPosting } from './entities/job-posting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosting]), CompanyModule],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
