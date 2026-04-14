import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/app.error';
import { verifyAccessToken } from '../services/jwt.service';
import { UserRole } from '@prisma/client';

// requireAuth middleware to protect routes, checks for valid access token in Authorization header
// attaches user info to req.user for use in controllers
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next(new AppError("Authorization header missing", 401));
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new AppError("Token missing", 401));
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
        return next(new AppError("Invalid or expired token", 401));
    }
    // attach user info to request object for use in controllers
    req.user = { userId: payload.userId, role: payload.role };
    next();
} catch (error) {
  return next(new AppError("Invalid or expired token", 401));
}
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    if (req.user.role !== UserRole.ADMIN) {
        return next(new AppError("Admin access required", 403));
    }
    next();
}