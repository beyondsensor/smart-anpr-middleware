import { Request, Response, NextFunction } from 'express';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start =  Date.now();
  const userIP = req.ip;
  res.on('finish', () => {
    const end = Date.now();
    const responseTime = end - start;
    const statusCode = res.statusCode;
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.path} - ${responseTime}ms | ${statusCode}| User IP: ${userIP}`;
    console.log(logMessage);
  });

  next();
}
