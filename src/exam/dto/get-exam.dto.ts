import { ExamType } from "@prisma/client";
import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export class GetExamDto {
  @IsOptional()
  @IsEnum(ExamType)
  type?: ExamType;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumberString()
  page?: number;
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
