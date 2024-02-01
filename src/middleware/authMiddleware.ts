import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwtUtils';

declare module 'express' {
    interface Request {
        user?: any; // or replace 'any' with the type of your user object
    }
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('Auth Middleware Executed');
    //   const token = req.header('Authorization');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token without 'Bearer'

    if (!token) {
        console.log('No Token Found');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Received Token:', token); // Add this line to log the token

    try {
        const decoded = verify(token);
        console.log('Decoded Token Payload:', decoded); // Log decoded payload
        req.user = decoded; // Attach the user information to the request object
        console.log('Token Verified:', decoded);
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
