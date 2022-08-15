import { Module } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { JobPostingController } from './job-posting.controller';

@Module({
  controllers: [JobPostingController],
  providers: [JobPostingService]
})
export class JobPostingModule {}
