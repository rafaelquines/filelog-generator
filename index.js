var winston = require('winston');
require('dotenv').config();

if (!process.env.LOG_FILENAME) {
    console.error('Invalid envoriment');
    console.error('Please set LOG_FILENAME var');
    process.exit(1);
}

process.env.GENERATION_TIME = process.env.GENERATION_TIME || 1000;

const logger = new winston.Logger();

logger.add(winston.transports.File, {
    filename: process.env.LOG_FILENAME,
    timestamp: true,
    json: false
});

var cont = 0;

setInterval(() => {
    console.log('Generating ' + ++cont);
    logger.info('filelog-generator: ' + cont);
}, process.env.GENERATION_TIME);