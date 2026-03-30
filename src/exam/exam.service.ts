import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateExamDto } from "./dto/create-exam.dto";
// import { UpdateExamDto } from "./dto/update-exam.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetExamsDto } from "./dto/get-exam.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExamDto) {
    try {
      await this.prisma.exam.create({ data });
      return { message: "Create Exam success." };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(req: GetExamsDto) {
    const { page = 1, limit = 10, search, sort, type } = req;

    const skip = (page - 1) * limit;

    const orderBy: Record<string, any> = { createdAt: "desc" };

    if (sort) {
      const [key, value] = sort.split("_");
      if (key && value) {
        delete orderBy.createdAt;
        orderBy[key] = value;
      }
    }

    const where: Prisma.ExamWhereInput = {
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      type: type || undefined,
    };

    try {
      const exams = await this.prisma.exam.findMany({
        where: {
          name: search ? { contains: search, mode: "insensitive" } : undefined,
          type: type || undefined,
        },
        select: { id: true, name: true, img: true, createdAt: true },
        orderBy,
        skip,
        take: limit,
      });

      const totalItem = await this.prisma.exam.count({ where });

      const totalPage = Math.ceil(totalItem / limit);

      return {
        message: "Get Exams success.",
        exams,
        page,
        totalPage,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const exam = await this.prisma.exam.findUnique({ where: { id } });

      if (!exam) throw new NotFoundException("Exam not found.");

      return {
        message: "Get Exam success.",
        exam,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // update(id: number, updateExamDto: UpdateExamDto) {
  //   return `This action updates a #${id} exam`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} exam`;
  // }
}
