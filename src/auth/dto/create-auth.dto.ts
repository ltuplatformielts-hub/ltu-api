import { UserRole } from "@prisma/client";
import { Escape, Trim } from "class-sanitizer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class CreateAuthDto {
  @IsNumber()
  @IsOptional()
  wpUserId?: number;

  @IsString()
  @IsNotEmpty({ message: "Email is required." })
  @Trim()
  @Escape()
  email: string;

  @IsString()
  @IsNotEmpty({ message: "First name is required." })
  @Trim()
  @Escape()
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Last name is required." })
  @Trim()
  @Escape()
  lastName: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters",
    },
  )
  @Trim()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  img?: string;

  @IsString()
  @IsNotEmpty({ message: "Username is required." })
  @MinLength(5, { message: "Username must be at least 5 characters." })
  @Trim()
  @Escape()
  username: string;

  @IsString()
  @IsOptional()
  userCode?: string;
}
