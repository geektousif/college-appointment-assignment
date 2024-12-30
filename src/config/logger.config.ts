import winston from 'winston';

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
];

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat,
    ),
    transports,
    levels,
});

export default logger;
