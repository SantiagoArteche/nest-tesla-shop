import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

type sortOptions = 1 | -1 | 'asc' | 'desc';

export class PaginationDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public take?: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public skip?: number;

  @IsOptional()
  public sort?: sortOptions;
}
