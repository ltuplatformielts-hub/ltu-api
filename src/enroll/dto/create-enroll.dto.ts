import { EnrollStatus } from "@prisma/client";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateEnrollDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsDateString()
  @IsOptional()
  startAt?: string;

  @IsDateString()
  @IsOptional()
  expectedEnd?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsOptional()
  attempts: any;

  @IsNumber()
  @IsOptional()
  violateCount?: number;

  @IsEnum(EnrollStatus)
  @IsOptional()
  status: EnrollStatus;

  @IsOptional()
  responses: any;
}
