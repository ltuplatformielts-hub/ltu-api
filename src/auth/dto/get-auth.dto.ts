import { Trim } from "class-sanitizer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class GetAuthDto {
  @IsString()
  @IsNotEmpty({ message: "Username/Email is required." })
  @MinLength(3, { message: "Username/Email must be at least 3 characters." })
  @Trim()
  identicator: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required." })
  @Trim()
  password: string;
}
