import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class CommonHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader("X-Powered-By", "LTU-API");
    res.setHeader("X-System-Status", "Operational");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
  }
}
