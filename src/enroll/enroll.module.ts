import { Module } from "@nestjs/common";
import { EnrollService } from "./enroll.service";
import { EnrollController } from "./enroll.controller";

@Module({
  controllers: [EnrollController],
  providers: [EnrollService],
})
export class EnrollModule {}
