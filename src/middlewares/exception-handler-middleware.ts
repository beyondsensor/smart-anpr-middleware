import { Request, Response, NextFunction } from 'express';
import appLogger from '../lib/logger';
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  appLogger.error ( `[${req.method}] [${req.url}] [${error.message}]`);
  // Customize the error response as needed
  res.status(500).json({ error: 'Internal Server Error' });
}