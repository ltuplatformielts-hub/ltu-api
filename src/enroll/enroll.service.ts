import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateEnrollDto } from "./dto/create-enroll.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UpdateEnrollDto } from "./dto/update-enroll.dto";
// import { UpdateEnrollDto } from "./dto/update-enroll.dto";

@Injectable()
export class EnrollService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateEnrollDto) {
    try {
      const count = await this.prisma.enroll.count({
        where: { userId: data.userId, examId: data.examId },
      });

      const enroll = await this.prisma.enroll.create({
        data: {
          ...data,
          attemptNumber: count + 1,
          responses: data.responses as unknown as Prisma.InputJsonValue,
          status: "IN_PROGRESS",
        },
        include: {
          exam: {
            select: {
              name: true,
              picture: true,
              audio: true,
              timeLimit: true,
              sections: true,
            },
          },
        },
      });

      return {
        enroll,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(data: UpdateEnrollDto) {
    try {
      const isExisting = await this.prisma.enroll.findUnique({
        where: { id: data.id },
      });

      if (!isExisting) throw new NotFoundException("Can not find this term.");

      const { responses, ...rest } = data;

      const updated = await this.prisma.enroll.update({
        where: { id: isExisting.id },
        data: {
          ...rest,
          status: data.status || "COMPLETED",
          responses: responses as any as Prisma.InputJsonValue,
        },
      });

      return {
        message: "Update enroll success.",
        result: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
