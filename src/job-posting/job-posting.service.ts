import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'path';
import { CompanyService } from 'src/company/company.service';
import { Repository } from 'typeorm';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { JobPosting } from './entities/job-posting.entity';

@Injectable()
export class JobPostingService {
  constructor(
    @InjectRepository(JobPosting)
    private jobPostingRepository: Repository<JobPosting>,
    private companyService: CompanyService,
  ) {}

  async create(createJobPostingDto: CreateJobPostingDto) {
    const company = await this.companyService.findOne(
      createJobPostingDto.companyId,
    );

    if (!company) {
      throw new NotFoundException(
        `Company (id: ${createJobPostingDto.companyId}) not foudn.`,
      );
    }

    const jobPosting = await this.jobPostingRepository.create({
      company,
      position: createJobPostingDto.position,
      compensation: createJobPostingDto.compensation,
      content: createJobPostingDto.content,
      technique: createJobPostingDto.technique,
    });

    return this.jobPostingRepository.save(jobPosting);
  }

  async findAll() {
    const jobPostingList = await this.jobPostingRepository.find({
      relations: ['company'],
    });

    const formattedJobPostingList = this.formatJobPostingList(jobPostingList);

    return formattedJobPostingList;
  }

  private formatJobPostingList(list: JobPosting[]) {
    const formattedList = [];
    list.forEach((posting) => {
      formattedList.push({
        id: posting.id,
        companyName: posting.company.name,
        country: posting.company.country,
        region: posting.company.region,
        position: posting.position,
        compensation: posting.compensation,
        technique: posting.technique,
      });
    });

    return formattedList;
  }

  async findOne(id: number) {
    const jobPosting = await this.jobPostingRepository.findOne({
      where: { id },
      relations: ['company.jobPostings'],
    });

    // 회사가 올린 다른 채용공고 id list 구성
    const companyJobPostingLists = jobPosting.company.jobPostings;
    let companyJobPostingIds = companyJobPostingLists.map(
      (posting) => posting.id,
    );
    // 해당 회사의 채용공고 id list에서 현재 조회한 채용공고의 id 제거
    companyJobPostingIds = companyJobPostingIds.filter(
      (id) => id != jobPosting.id,
    );

    const formattedJobPosting = this.formatJobPostingList([jobPosting])[0];
    formattedJobPosting['content'] = jobPosting.content;
    formattedJobPosting['otherJobPostingOfThisCompany'] = companyJobPostingIds;

    return formattedJobPosting;
  }

  async update(id: number, updateJobPostingDto: UpdateJobPostingDto) {
    const jobPosting = await this.jobPostingRepository.findOne({
      where: { id },
    });

    if (!jobPosting) {
      throw new NotFoundException(`Job Posting (id: ${id}) was not found.`);
    }

    Object.assign(jobPosting, updateJobPostingDto);

    return this.jobPostingRepository.save(jobPosting);
  }

  async remove(id: number) {
    const jobPosting = await this.jobPostingRepository.findOne({
      where: { id },
    });

    if (!jobPosting) {
      throw new NotFoundException(`Job Posting (id: ${id}) was not found.`);
    }

    await this.jobPostingRepository.remove(jobPosting);

    return {
      message: `Job Posting (id: ${id}) was deleted.`,
    };
  }
}
