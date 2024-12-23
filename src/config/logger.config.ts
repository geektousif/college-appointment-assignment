import { format, transports, createLogger } from 'winston';

const { combine, timestamp, printf, align, cli } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        format.colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align(),
        cli(),
        myFormat,
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

export default logger;
