import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

import { setupRoutes } from './routes';
import errorHandler from './middlewares/error.middleware';
import { container } from 'tsyringe';
import { DI_TOKEN_NAMES } from './constants/container';

export const startApp = () => {
    const app = express();

    app.use(morgan('dev'));

    // TODO: configure cors according to requirements

    app.use(helmet());
    app.use(cors());
    app.use(cookieParser());

    app.use((_req, _res, next) => {
        console.log('Registered tokens:', container.resolveAll(DI_TOKEN_NAMES.USER_CONTROLLER));
        next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/v1', setupRoutes());

    app.use(errorHandler);

    return app;
};
