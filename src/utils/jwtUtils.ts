import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const {
    JWT_TOKEN_SECRET,
    JWT_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRATION,
} = process.env;

export const generateJwtToken = (user: User): string => {
    const token = jwt.sign({ userId: user.id }, JWT_TOKEN_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION });
    return token;
};

export const generateRefreshToken = (user: User): string => {
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });
    return refreshToken;
};
