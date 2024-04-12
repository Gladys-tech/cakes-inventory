import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/user';
import { NextFunction } from 'express';

const {
    JWT_TOKEN_SECRET,
    JWT_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRATION,
} = process.env;


export const generateJwtToken = (user: User): string => {
    const token = jwt.sign({ userId: user.id }, JWT_TOKEN_SECRET, {
        expiresIn: JWT_TOKEN_EXPIRATION,
    });
    return token;
};

export const generateRefreshToken = (user: User): string => {
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
    });
    return refreshToken;
};

export const verify = (token: string): any => {
    try {
        console.log('Verifying token:', token);
        return jwt.verify(token, JWT_TOKEN_SECRET);
    } catch (error) {
        // Handle the error, e.g., invalid token or token expired
        console.error('JWT verification error:', error);
        throw error;
    }
};

export const verifyResetToken = (token: string): any => {
    try {
        const decodedToken: any = jwt.verify(token, JWT_TOKEN_SECRET);

        // If the token has an expiration time, you can check it here
        if (decodedToken.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (decodedToken.exp < currentTime) {
                throw new TokenExpiredError(
                    'Token expired',
                    new Date(decodedToken.exp * 1000)
                );
            }
        }

        return decodedToken;
    } catch (error) {
        console.error('Invalid token:', token);
        // Handle the error, e.g., invalid token or token expired
        console.error('Reset token verification error:', error);
        throw error;
    }
};


