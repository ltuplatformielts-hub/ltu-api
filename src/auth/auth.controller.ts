import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { GetAuthDto } from "./dto/get-auth.dto";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: GetAuthDto) {
    const res = await this.authService.get(data);
    return res;
  }

  @Public()
  @Post("register")
  async register(@Body() data: CreateAuthDto) {
    const res = await this.authService.create(data);
    return res;
  }
}
