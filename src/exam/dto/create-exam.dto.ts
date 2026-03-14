import { ExamType } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  img: string;

  @IsEnum(ExamType)
  type: ExamType;

  @IsNumber()
  timeLimit: number;

  @IsArray()
  @IsString()
  audio: string;

  @IsArray()
  @IsString({ each: true })
  picture: string[];

  @IsOptional()
  sections: any;

  @IsNumber()
  totalQuestion: number;

  @IsNumber()
  totalScore: number;

  @IsOptional()
  enrolls: any;
}
