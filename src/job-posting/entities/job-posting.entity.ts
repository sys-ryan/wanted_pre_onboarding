import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JobPosting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  position: string;

  @Column()
  compensation: number;

  @Column()
  technique: string;

  @Column()
  content: string;

  @ManyToOne(() => Company, (company) => company.jobPostings)
  company: Company;
}
