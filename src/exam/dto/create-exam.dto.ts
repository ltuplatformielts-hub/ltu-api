import { ExamType } from "@prisma/client";
import { Escape } from "class-sanitizer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  @Escape()
  name: string;

  @IsString()
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @Escape()
  img?: string;

  @IsEnum(ExamType)
  @IsNotEmpty()
  type: ExamType;

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @IsString()
  @IsOptional()
  @Escape()
  audio?: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @Escape()
  picture: string[];

  @IsNotEmpty()
  @Escape()
  sections: any;

  @IsNumber()
  @IsNotEmpty()
  totalQuestion: number;

  @IsNumber()
  @IsNotEmpty()
  totalScore: number;
}
