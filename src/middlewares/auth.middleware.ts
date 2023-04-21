import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedException('Token not found');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req['user'] = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedException('Invalid token');
  }
};
