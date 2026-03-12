import { Controller, Body } from "@nestjs/common";
import { EnrollService } from "./enroll.service";
import { CreateEnrollDto } from "./dto/create-enroll.dto";
// import { UpdateEnrollDto } from "./dto/update-enroll.dto";

@Controller("enroll")
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  async createOne(@Body() data: CreateEnrollDto) {
    const res = await this.enrollService.create(data);
    return res;
  }

  // async update
}
