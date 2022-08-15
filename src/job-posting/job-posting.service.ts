import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { Repository, DataSource } from 'typeorm';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { JobPosting } from './entities/job-posting.entity';

interface QueryBuilderJobPosting {
  job_posting_id: number;
  job_posting_position: string;
  job_posting_compensation: number;
  job_posting_technique: string;
  job_posting_content: string;
  job_posting_companyId: number;
  company_name: string;
  company_country: string;
  company_region: string;
}

@Injectable()
export class JobPostingService {
  constructor(
    @InjectRepository(JobPosting)
    private jobPostingRepository: Repository<JobPosting>,
    private companyService: CompanyService,
    private dataSource: DataSource,
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

  async findAll(search: string) {
    let result;

    if (search) {
      // search query parameter가 설정된 경우
      result = await this.dataSource
        .getRepository(JobPosting)
        .createQueryBuilder('job_posting')
        .leftJoin('job_posting.company', 'company')
        .addSelect('company.name')
        .addSelect('company.country')
        .addSelect('company.region')
        .where(
          `company.name LIKE :search
            or company.country LIKE :search
            or company.region LIKE :search
            or job_posting.position LIKE :search
            or job_posting.technique LIKE :search
          `,
          { search: `%${search}%` },
        )
        .execute();
    } else {
      // no search parameter
      result = await this.dataSource
        .getRepository(JobPosting)
        .createQueryBuilder('job_posting')
        .leftJoin('job_posting.company', 'company')
        .addSelect('company.name')
        .addSelect('company.country')
        .addSelect('company.region')
        .execute();
    }

    result = this.formatJobPostingList(result);
    return result;
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

    const formattedJobPosting = this.formatJobPosting(jobPosting);
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

  private formatJobPostingList(list: QueryBuilderJobPosting[]) {
    const formattedJobPostingList = list.map((posting) => {
      return {
        id: posting.job_posting_id,
        companyName: posting.company_name,
        country: posting.company_country,
        region: posting.company_region,
        position: posting.job_posting_position,
        compensation: posting.job_posting_compensation,
        technique: posting.job_posting_technique,
      };
    });

    return formattedJobPostingList;
  }

  private formatJobPosting(posting: JobPosting) {
    const formattedPost = {
      id: posting.id,
      companyName: posting.company.name,
      country: posting.company.country,
      region: posting.company.region,
      position: posting.position,
      compensation: posting.compensation,
      technique: posting.technique,
    };

    return formattedPost;
  }
}
