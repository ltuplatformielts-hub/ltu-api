import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
// import { UpdateAuthDto } from "./dto/update-auth.dto";
import bcrypt from "bcrypt";
import { GetAuthDto } from "./dto/get-auth.dto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "dotenv/config";
import { PrismaService } from "src/prisma/prisma.service";

const supabaseURL = process.env.SUPABASE_URL;
const supabaseAnon = process.env.SUPABASE_ANON_KEY;

if (!supabaseAnon || !supabaseURL)
  throw new Error("supabaseAnon/supabaseURL is undefined");

const UserCode = {
  "535455": "STUDENT",
  "4C4543": "LECTURER",
  "41444D": "ADMIN",
};

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_ANON_KEY ?? "",
    );
  }

  async create(data: CreateAuthDto) {
    try {
      const { firstName, lastName, password, email, username, userCode } = data;

      const isExistingUser = await this.prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (isExistingUser) throw new ConflictException("Registration failed.");

      const { data: sbUser, error: sbError } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (sbError || !sbUser.user)
        throw new InternalServerErrorException(
          sbError?.message || "Registration failed.",
        );
      const id = sbUser.user.id;
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const fullName = `${lastName.trim()} ${firstName.trim()}`.trim();

      const role = userCode ? UserCode[userCode] : "GUEST";

      await this.prisma.user.create({
        data: {
          ...data,
          fullName,
          password: hashedPassword,
          id,
          role,
        },
      });

      return { message: "User created successfully." };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async get(data: GetAuthDto) {
    try {
      const { identicator } = data;

      const user = await this.prisma.user.findFirst({
        where: { OR: [{ username: identicator }, { email: identicator }] },
      });

      if (!user) throw new NotFoundException("User not found.");

      const { data: sbUser, error } =
        await this.supabase.auth.signInWithPassword({
          email: user.email,
          password: data.password,
        });

      if (error || !sbUser) {
        throw new UnauthorizedException(error?.message);
      }

      const comparePassword = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (!comparePassword) {
        throw new UnauthorizedException(
          "Username/Email or Password incorrect.",
        );
      }

      const { password, ...userWithoutPassword } = user;

      return {
        message: "Login success.",
        access_token: sbUser.session.access_token,
        refresh_token: sbUser.session.refresh_token,
        access_time: sbUser.session.expires_in,
        user: userWithoutPassword,
        password,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUser(token: string) {
    try {
      const {
        data: { user: sbUser },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error || !sbUser || !sbUser)
        throw new UnauthorizedException(
          error?.message ?? "Login session has expired.",
        );

      const user = await this.prisma.user.findUnique({
        where: { id: sbUser.id },
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          enrolls: true,
          img: true,
          role: true,
          wpUserId: true,
          updatedAt: true,
        },
      });

      if (!user) throw new UnauthorizedException("User not found.");

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async refresh(refresh_token: string) {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token,
      });

      if (error || !data || !data.session)
        throw new UnauthorizedException("The login session has expired.");

      const user = await this.prisma.user.findUnique({
        where: { id: data.session?.user.id },
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
        },
      });

      return {
        message: "Login success.",
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        access_time: data.session.expires_in,
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
