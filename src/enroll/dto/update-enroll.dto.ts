import { PartialType } from "@nestjs/mapped-types";
import { CreateEnrollDto } from "./create-enroll.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateEnrollDto extends PartialType(CreateEnrollDto) {
  @IsString()
  @IsNotEmpty()
  id: string;
}
