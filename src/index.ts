// import express, { Request, Response } from 'express';

// const app = express();
// const port = 3000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, World!');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

require('dotenv').config();

import { dataSource } from './data-source';
import { app } from './app';
import { Logger } from '../logger';

dataSource
    .initialize()
    .then(async () => {
        Logger.info('Database connection initialized.');

        const port = process.env.PORT || 8000;

        // Start the Server
        app.listen(port, () => {
            Logger.info(`Environment set to "${process.env.NODE_ENV}".`);
            Logger.info(`Server running on http://localhost:${port}.`);
        });
    })
    .catch((error) => {
        Logger.error('Error during Data Source initialization', error);
    });
