import { ExamType } from "@prisma/client";
import { Escape } from "class-sanitizer";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, Min } from "class-validator";

export class GetExamsDto {
  @IsString()
  @IsOptional()
  @Escape()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;

  @IsEnum(ExamType)
  @IsOptional()
  type?: ExamType;

  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
