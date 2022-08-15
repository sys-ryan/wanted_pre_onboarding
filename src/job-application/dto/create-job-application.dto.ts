import { IsNumber, Min } from 'class-validator';

export class CreateJobApplicationDto {
  @IsNumber()
  @Min(0)
  userId: number;

  @Min(0)
  @IsNumber()
  jobPostingId: number;
}
