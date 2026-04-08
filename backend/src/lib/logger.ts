import winston from 'winston';

const isDevelopment = process.env.NODE_ENV === 'development';

const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);

const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

export const logger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',

    format: isDevelopment ? devFormat : prodFormat,

    // In development, transport to the console. 
    // In production, transport to files.

    transports: [
    // 1. This is ALWAYS in the array. It's index [0].
    new winston.transports.Console(), 

    // 2. We use the spread operator (...) because we are "spreading" 
    // an array into another array.
    ...(!isDevelopment 
        ? [
            // 3. If NOT development, we "spread" these two items into the main array.
            // Now the array has 3 items: [Console, ErrorFile, CombinedFile]
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
          ]
        : [
            // 4. If IT IS development, we spread an empty array.
            // The main array stays with 1 item: [Console]
          ]),
],

});
 