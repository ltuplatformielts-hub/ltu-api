import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { GetAuthDto } from "./dto/get-auth.dto";
import { Public } from "./public.decorator";
import { type Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: GetAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, message, access_token, refresh_token } =
      await this.authService.get(data);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600 * 1000, // 1 ngày
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600 * 1000 * 24, // 1 ngày
    });

    return { message, user };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register")
  async register(@Body() data: CreateAuthDto) {
    const res = await this.authService.create(data);
    return res;
  }
}
