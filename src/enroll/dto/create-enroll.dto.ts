import { EnrollStatus } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateEnrollDto {
  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsNumber()
  @IsOptional()
  score: number;

  @IsNumber()
  @IsOptional()
  correctCount: number;

  @IsNumber()
  @IsOptional()
  duration: number;

  @IsEnum(EnrollStatus)
  @IsOptional()
  status: EnrollStatus;

  @IsOptional()
  responses: any;
}
