import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { GetAuthDto } from "./dto/get-auth.dto";
import { Public } from "./public.decorator";
import type { Response } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";

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
    const { user, message, access_token, refresh_token, access_time } =
      await this.authService.get(data);

    const refreshTokenExprise = data.isRemember
      ? 30 * 24 * 60 * 60 * 1000
      : 1 * 24 * 60 * 60 * 1000;

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: access_time * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: refreshTokenExprise,
    });

    return { message, user, token: { access_token, access_time } };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register")
  async register(@Body() data: CreateAuthDto) {
    const res = await this.authService.create(data);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Req() req) {
    const token = req.cookies["access_token"];

    if (!token || typeof token !== "string")
      throw new UnauthorizedException("Missing access token");

    return await this.authService.getUser(token);
  }

  @Public()
  @Post("refresh")
  async refresh(
    @Body("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken)
      throw new UnauthorizedException("The login session has expired.");

    const { access_time, access_token, message, user, refresh_token } =
      await this.authService.refresh(refreshToken);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: access_time * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { message, user };
  }
}
