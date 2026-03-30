import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { EnrollService } from "./enroll.service";
import { Public } from "src/auth/public.decorator";
import { CreateEnrollDto } from "./dto/create-enroll.dto";
import { UpdateEnrollDto } from "./dto/update-enroll.dto";

@Controller("enroll")
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Public()
  @Get(":id")
  async getTestRoom(@Param("id") id: string) {
    const res = await this.enrollService.getTestRoom(id);
    return res;
  }

  @Public()
  @Post()
  async createTestRoom(@Body() data: CreateEnrollDto) {
    const res = await this.enrollService.createRoom(data);
    return res;
  }

  @Public()
  @Patch("start/:id")
  async startTest(@Param("id") id: string) {
    const res = await this.enrollService.startTest(id);
    return res;
  }

  @Public()
  @Patch("save/:id")
  async saveTest(@Param("id") id: string, @Body() data: UpdateEnrollDto) {
    const res = await this.enrollService.saveTest(id, data);
    return res;
  }

  @Public()
  @Patch("submit/:id")
  async submitTest(@Param("id") id: string, @Body() data: UpdateEnrollDto) {
    const res = await this.enrollService.submit(id, data);
    return res;
  }
}
