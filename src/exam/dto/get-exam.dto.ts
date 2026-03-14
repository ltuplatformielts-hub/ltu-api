import { ExamType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetExamDto {
  @IsOptional()
  @IsEnum(ExamType)
  type?: ExamType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
