import { Company } from '../../company/entities/company.entity';
import { JobApplication } from '../../job-application/entities/job-application.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class JobPosting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @Column()
  compensation: number;

  @Column()
  technique: string;

  @Column()
  content: string;

  @ManyToOne(() => Company, (company) => company.jobPostings)
  @JoinColumn()
  company: Company;

  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.jobPosting,
  )
  jobApplications: JobApplication[];
}
