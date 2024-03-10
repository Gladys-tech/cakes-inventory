"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_1 = require("./models/user");
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: `${process.env.DB_PASSWORD}`,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'development' ? true : false,
    logging: true,
    entities: [
        user_1.User,
        `${__dirname}/models/*.ts`,
        `${__dirname}/models/*.js`,
        `${__dirname}/models/User.ts`,
        `${__dirname}/models/abstracts/*.js`,
        `${__dirname}/models/abstracts/*.ts`,
    ],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: [],
    extra: {
        ssl: {
            ca: process.env.CRT,
        },
    },
});
//# sourceMappingURL=data-source.js.map