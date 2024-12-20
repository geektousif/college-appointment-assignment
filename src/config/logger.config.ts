import { format, transports, createLogger } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(format.colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

export default logger;
