"use strict";
// import express, { Request, Response } from 'express';
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// const port = 3000;
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, World!');
// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
require('dotenv').config();
const data_source_1 = require("./data-source");
const app_1 = require("./app");
const logger_1 = require("../logger");
data_source_1.dataSource
    .initialize()
    .then(async () => {
    logger_1.Logger.info('Database connection initialized.');
    const port = process.env.PORT || 8000;
    // Start the Server
    app_1.app.listen(port, () => {
        logger_1.Logger.info(`Environment set to "${process.env.NODE_ENV}".`);
        logger_1.Logger.info(`Server running on http://localhost:${port}.`);
    });
})
    .catch((error) => {
    logger_1.Logger.error('Error during Data Source initialization process', error);
});
//# sourceMappingURL=index.js.map