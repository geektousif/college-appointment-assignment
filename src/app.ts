import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { setupRoutes } from './routes';
import errorHandler from './middlewares/error.middleware';

export const startApp = () => {
    const app = express();

    app.use(morgan('dev'));

    app.use(helmet());
    app.use(cors());
    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/v1', setupRoutes());

    app.use(errorHandler);

    return app;
};
