import { Request, Response, NextFunction } from "express";
import appLogger from "../utilities/logger";
export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();
  const userIP = req.ip;
  res.on("finish", () => {
    const end = Date.now();
    const responseTime = end - start;
    const statusCode = res.statusCode;
    const logMessage = `${req.method} ${req.path} [${statusCode}] [${responseTime}ms] ${userIP}`;
    appLogger.info(logMessage);
  });

  next();
}
