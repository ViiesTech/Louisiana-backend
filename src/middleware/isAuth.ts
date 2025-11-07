import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtSecret } from '../config/env';

export const IsAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({ success: false, message: '*Not authenticated.' });
        return
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not set in .env');
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
            _id: string;
            email: string,
            role: string
        };        

        req._id = decoded._id;
        req.email = decoded.email;

        next();
    } catch (error) {
        console.error('JWT error:', error);
        res.status(401).json({ success: false, message: '*Not authenticated.' });
    }
}; 