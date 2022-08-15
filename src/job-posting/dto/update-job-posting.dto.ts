import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateJobPostingDto {
  @IsString()
  position: string;

  @IsNumber()
  @Min(0)
  compensation: number;

  @IsString()
  content: string;

  @IsString()
  technique: string;
}
