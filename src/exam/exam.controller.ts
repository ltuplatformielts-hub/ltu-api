import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDto } from "./dto/create-exam.dto";
// import { UpdateExamDto } from "./dto/update-exam.dto";
import { Public } from "src/auth/public.decorator";
import { GetExamDto } from "./dto/get-exam.dto";

@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Public()
  @Get(":id")
  async getById(@Param("id") id: string) {
    const res = await this.examService.findById(id);
    return res;
  }

  @Public()
  @Get()
  async getMany(@Param("query") query: GetExamDto) {
    const res = await this.examService.findMany(query);
    return res;
  }

  @Public()
  @Post()
  async createOne(@Body() data: CreateExamDto) {
    const res = await this.examService.create(data);
    return res;
  }
}
