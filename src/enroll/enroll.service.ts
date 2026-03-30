import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateEnrollDto } from "./dto/create-enroll.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateEnrollDto } from "./dto/update-enroll.dto";

@Injectable()
export class EnrollService {
  constructor(private readonly prisma: PrismaService) {}

  async getTestRoom(id: string) {
    try {
      const enroll = await this.prisma.enroll.findUnique({
        where: { id },
        include: { exam: true },
      });

      if (!enroll) throw new NotFoundException("Test room not found.");

      return {
        message: "Get test room success.",
        enroll,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createRoom(data: CreateEnrollDto) {
    try {
      const { examId, userId } = data;

      const isExisting = await this.prisma.enroll.findFirst({
        where: { examId, userId },
      });

      if (!isExisting) {
        const exam = await this.prisma.exam.findUnique({
          where: { id: examId },
        });

        if (!exam)
          throw new NotFoundException("Exam not found to create a test room.");

        const enroll = await this.prisma.enroll.create({
          data: {
            userId,
            examId,
            attempts: [],
            timeLimit: exam.timeLimit,
          },
          include: {
            exam: true,
          },
        });

        return {
          message: "Create test room success",
          enroll,
        };
      } else {
        const startAt = new Date();
        const expectedEnd = new Date(
          startAt.getTime() + isExisting.timeLimit * 60 * 1000,
        );

        const enroll = await this.prisma.enroll.update({
          where: { id: isExisting.id },
          data: {
            startAt,
            status: "IN_PROGRESS",
            expectedEnd,
            violateCount: 0,
          },
          include: { exam: true },
        });

        return {
          message: "Create test room success",
          enroll,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async saveTest(id: string, data: UpdateEnrollDto) {
    try {
      const enroll = await this.prisma.enroll.findFirst({ where: { id } });
      if (!enroll) throw new NotFoundException("Test room not found.");

      const { responses } = data;

      if (data.responses) {
        const isDifference =
          JSON.stringify(enroll.responses) !== JSON.stringify(responses);

        if (isDifference) {
          const res = await this.prisma.enroll.update({
            where: { id: enroll.id },
            data: { responses },
            include: { exam: true },
          });
          return {
            message: "Progress saved",
            enroll: res,
          };
        }
        return {
          message: "",
          enroll,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async submit(id: string, data: UpdateEnrollDto) {
    try {
      const enroll = await this.prisma.enroll.findUnique({ where: { id } });

      if (!enroll) throw new NotFoundException("Test room not found.");

      if (enroll.startAt && enroll.expectedEnd) {
        const { attempts } = data;
        const currentAttempts = enroll.attempts;

        await this.prisma.enroll.update({
          where: { id: enroll.id },
          data: {
            attempts: [...currentAttempts, ...attempts],
            responses: {},
            violateCount: 0,
            duration: 0,
            startAt: null,
            expectedEnd: null,
            status: "COMPLETED",
          },
        });

        return { message: "Submit success." };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async startTest(id: string) {
    try {
      const findEnroll = await this.prisma.enroll.findUnique({ where: { id } });
      if (!findEnroll) throw new NotFoundException("Test room not found.");

      const startAt = new Date();
      const durationMs = findEnroll.timeLimit * 60 * 1000;
      const expectedEnd = new Date(startAt.getTime() + durationMs);

      const enroll = await this.prisma.enroll.update({
        where: { id },
        data: { startAt, expectedEnd },
        include: {
          exam: true,
        },
      });

      return {
        message: "Start",
        enroll,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
