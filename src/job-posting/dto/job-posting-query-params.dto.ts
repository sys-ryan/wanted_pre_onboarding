import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JobPostingQueryParamsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search: string;
}
