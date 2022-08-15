import { JobPosting } from 'src/job-posting/entities/job-posting.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  user: User;

  @OneToOne(() => JobPosting)
  jobPosting: JobPosting;
}
