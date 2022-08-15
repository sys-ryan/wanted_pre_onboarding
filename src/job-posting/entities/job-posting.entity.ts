import { Company } from 'src/company/entities/company.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
}
