import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../config/app-config';
const API_KEY = appConfig.authKey;

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {

  //TODO : We should be using something more sophisitcated, like an Auth Server for the Future. 
  const apiKey = req.header('Authorization');
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // If the API key is valid, proceed to the next middleware or route
  next();
}
