import { JobPosting } from 'src/job-posting/entities/job-posting.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.jobApplication)
  @JoinColumn()
  user: User;

  @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.jobApplication)
  @JoinColumn()
  jobPosting: JobPosting;
}
