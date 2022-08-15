import { JobPosting } from 'src/job-posting/entities/job-posting.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @OneToMany(() => JobPosting, (jobPosting) => jobPosting.company)
  jobPostings: JobPosting[];
}
