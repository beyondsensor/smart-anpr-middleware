import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('An error occurred:', error);
  // Customize the error response as needed
  res.status(500).json({ error: 'Internal Server Error' });
}