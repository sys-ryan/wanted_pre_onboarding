import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return this.jobApplicationService.create(createJobApplicationDto);
  }

  @Get()
  findAll() {
    return this.jobApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobApplicationService.findOne(+id);
  }

  @Get('/user/:userId')
  findOneByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.jobApplicationService.findJobApplicationByUseId(userId);
  }

  @Get('/job-posting/:jobPostingId')
  findOneByJobPostingId(
    @Param('jobPostingId', ParseIntPipe) jobPostingId: number,
  ) {
    return this.jobApplicationService.findJobApplicationByJobPostingId(
      jobPostingId,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobApplicationService.remove(id);
  }
}
