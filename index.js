var winston = require('winston');
require('dotenv').config();
const logger = new winston.Logger();

logger.add(winston.transports.File, {
    filename: process.env.LOG_FILENAME,
    timestamp: true,
    json: false
});

var cont = 0;

setInterval(() => {
    logger.info('filelog-generator: ' + ++cont);
}, process.env.GENERATION_TIME);