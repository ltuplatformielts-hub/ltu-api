import { Controller, Get, Post, Body, Param, Req } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDto } from "./dto/create-exam.dto";
// import { UpdateExamDto } from "./dto/update-exam.dto";
import { Public } from "src/auth/public.decorator";
import { type Request } from "express";

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
  async getMany(@Req() req: Request) {
    const query = req.query;
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
