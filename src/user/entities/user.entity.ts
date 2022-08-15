import { JobApplication } from '../../job-application/entities/job-application.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToOne(() => JobApplication, (jobApplication) => jobApplication.user)
  jobApplication: JobApplication;
}
