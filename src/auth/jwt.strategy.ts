import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";

interface SupabaseJwtPayload {
  sub: string; // User ID
  email?: string;
  role?: string; // Role mặc định của Postgres
  app_metadata?: {
    role?: string; // Role tùy chỉnh (INDIVIDUAL, TEAM, ENTERPRISE)
    provider?: string;
  };
  user_metadata?: Record<string, any>;
  exp?: number; // Thời điểm hết hạn
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error("SUPABASE_JWT_SECRET is not defined in .env file");
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const token = request?.cookies?.access_token as string | undefined;
          console.log("Token from cookie:", token);
          return token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: secret,
      }),
      algorithms: ["ES256"],
    });
  }

  async validate(payload: SupabaseJwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException("Token has no valid user identifier");
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      throw new UnauthorizedException("Token has expired");
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.app_metadata?.role || "STUDENT",
      metadata: payload.user_metadata,
    };
  }
}
