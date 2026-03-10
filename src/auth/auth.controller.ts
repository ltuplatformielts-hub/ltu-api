import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { GetAuthDto } from "./dto/get-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: GetAuthDto) {
    const res = await this.authService.get(data);
    return res;
  }

  @Post("register")
  async register(@Body() data: CreateAuthDto) {
    const res = await this.authService.create(data);
    return res;
  }
}
