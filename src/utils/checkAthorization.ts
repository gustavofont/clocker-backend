import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Enviroment config 
dotenv.config();
const jwtSecret= process.env.JWT_SECRET || '';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    jwt.verify(token, jwtSecret, (err, payload) => {
      if (err) {
        return res.status(403).send('Invalid token');
      } else {
        req.body.user = payload;
        next();
      }
    });
  } else res.status(403).send('Missing token');
};