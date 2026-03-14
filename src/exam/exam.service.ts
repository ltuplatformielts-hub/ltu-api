import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateExamDto } from "./dto/create-exam.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetExamDto } from "./dto/get-exam.dto";
// import { UpdateExamDto } from "./dto/update-exam.dto";

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateExamDto) {
    try {
      await this.prisma.exam.create({ data });
      return {
        message: "Create exam success.",
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string) {
    try {
      const isExisting = await this.prisma.exam.findUnique({ where: { id } });
      if (!isExisting) throw new NotFoundException("Exam does not exist.");

      return {
        message: "Find exam success.",
        exam: isExisting,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findMany(query: GetExamDto) {
    try {
      const { limit = 20, page = 1, type, search, sort } = query;

      const skip = (page - 1) * limit;
      const whereCondition = {
        name: search
          ? { contains: search, mode: "insensitive" as const }
          : undefined,
        type: type ? type : undefined,
      };

      const orderBy: Record<string, unknown> = {};

      if (sort) {
        const [name, value] = sort.split("_");
        orderBy[name] = value;
      } else {
        orderBy.createdAt = "desc";
      }

      const exams = await this.prisma.exam.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          img: true,
          type: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy,
      });

      const totalItems = await this.prisma.exam.count({
        where: whereCondition,
      });
      const totalPage = Math.ceil(totalItems / limit);

      return {
        message: "Find exam success.",
        exam: exams,
        page,
        totalPage,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
