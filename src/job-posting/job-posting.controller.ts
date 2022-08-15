import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { JobPostingQueryParamsDto } from './dto/job-posting-query-params.dto';

@Controller('job-posting')
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Post()
  create(@Body() createJobPostingDto: CreateJobPostingDto) {
    return this.jobPostingService.create(createJobPostingDto);
  }

  @Get()
  findAll(@Query() query: JobPostingQueryParamsDto) {
    return this.jobPostingService.findAll(query.search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobPostingDto: UpdateJobPostingDto,
  ) {
    return this.jobPostingService.update(+id, updateJobPostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostingService.remove(+id);
  }
}
