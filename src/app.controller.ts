import { Controller, Get } from "@nestjs/common";

@Controller("test") // Định nghĩa tiền tố đường dẫn
export class AppController {
  @Get() // Lắng nghe phương thức GET tại đường dẫn gốc của Controller
  getHello(): string {
    return "Hello World";
  }
}
