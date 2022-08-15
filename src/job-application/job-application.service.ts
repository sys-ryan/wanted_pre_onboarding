import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPostingService } from 'src/job-posting/job-posting.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplication } from './entities/job-application.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private jobPostingService: JobPostingService,
    private userService: UserService,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto) {
    const { userId, jobPostingId } = createJobApplicationDto;

    // 사용자는 1회만 지원 가능합니다.
    this.checkUserApplication(userId);

    const jobPosting = await this.jobPostingService.findOne(jobPostingId);

    if (!jobPosting) {
      throw new NotFoundException(
        `JobPosting (id: ${jobPostingId}) not found.`,
      );
    }

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User (id: ${userId}) not found.`);
    }

    const jobApplication = await this.jobApplicationRepository.create({
      jobPosting,
      user,
    });

    return this.jobApplicationRepository.save(jobApplication);
  }

  findAll() {
    return this.jobApplicationRepository.find();
  }

  // find job application by user id
  // find job application by jobpostisng id
  findOne(id: number) {
    return `This action returns a #${id} jobApplication`;
  }

  async remove(id: number) {
    const jobApplication = await this.jobApplicationRepository.findOne({
      where: { id },
    });

    if (!jobApplication) {
      throw new NotFoundException(`Job Application (id: ${id}) not found.`);
    }

    await this.jobApplicationRepository.remove(jobApplication);

    return {
      message: `Job Application (id: ${id}) was deleted.`,
    };
  }

  private async checkUserApplication(userId: number) {
    const application = await this.jobApplicationRepository.findOne({
      where: { user: { id: userId } },
    });

    if (application) {
      throw new NotAcceptableException({
        message: 'User already applied for a job-posting.',
        history: application,
      });
    }
  }
}
