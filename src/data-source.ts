
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/user';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Ensure SSL option based on env variable
    synchronize: process.env.NODE_ENV === 'development',
    logging: true,
    entities: [
        User,
        `${__dirname}/models/*.ts`,
        `${__dirname}/models/*.js`,
        `${__dirname}/models/User.ts`,
        `${__dirname}/models/abstracts/*.js`,
        `${__dirname}/models/abstracts/*.ts`,
    ],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: [],
});

