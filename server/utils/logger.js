import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'miazii-shop-api' },
    transports: [
        // On Vercel/Serverless, we MUST log to console. 
        // File transports will cause 500 errors due to read-only filesystem.
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

export default logger;
