import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import route from './routes/index';
import errorHandler from './middlewares/error.middleware';

const app = express();

app.use(morgan('dev'));

// app.use(
//     cors({
//         origin: env.FRONTEND_URL,
//     }),
// );

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', route);

app.use(errorHandler);

export default app;
