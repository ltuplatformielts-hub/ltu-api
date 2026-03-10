import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
      const { firstName, lastName, password, email, username } = data;

      const isExistingUser = await this.prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (isExistingUser) throw new ConflictException("Registration failed");

      const { data: sbUser, error: sbError } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (sbError || !sbUser.user)
        throw new InternalServerErrorException(
          sbError?.message || "Registration failed",
        );
      const id = sbUser.user.id;
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const fullName = `${lastName.trim()} ${firstName.trim()}`.trim();

      await this.prisma.user.create({
        data: {
          ...data,
          fullName,
          password: hashedPassword,
          id,
        },
      });

      return { message: "User created successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async get(data: GetAuthDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: data.identicator }, { username: data.identicator }],
        },
      });
      const isMatch = user
        ? await bcrypt.compare(data.password, user.password)
        : false;

      if (!user || !isMatch)
        throw new UnauthorizedException(
          "Username/Email or Password incorrect.",
        );

      const { data: authData, error } =
        await this.supabase.auth.signInWithPassword({
          email: user.email,
          password: data.password,
        });

      if (error || !authData.session) {
        throw new UnauthorizedException(error?.message || "Login failed");
      }

      return {
        message: "Login successful",
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        user: {
          ...user,
          password: "",
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
