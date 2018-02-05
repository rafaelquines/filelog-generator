var winston = require('winston');
require('./lib/winston-mqtt-transport').MqttTransport;
require('dotenv').config();

if (!process.env.LOG_OUTPUT || (process.env.LOG_OUTPUT != 'file' && process.env.LOG_OUTPUT != 'mqtt' &&
        process.env.LOG_OUTPUT != 'both')) {
    console.error('Invalid envoriment');
    console.error('Set LOG_OUTPUT to file, mqtt or both');
    process.exit(1);
}

if ((process.env.LOG_OUTPUT === 'mqtt' || process.env.LOG_OUTPUT === 'both') &&
    (!process.env.MQTT_URL || !process.env.MQTT_TOPIC)) {
    console.error('Invalid envoriment');
    console.error('Set MQTT_URL and MQTT_TOPIC');
    process.exit(1);
}

if ((process.env.LOG_OUTPUT === 'file' || process.env.LOG_OUTPUT === 'both') &&
    !process.env.LOG_FILENAME) {
    console.error('Invalid envoriment');
    console.error('Set LOG_FILENAME');
    process.exit(1);
}

process.env.GENERATION_TIME = process.env.GENERATION_TIME || 1000;

const logger = new winston.Logger();

if (process.env.LOG_OUTPUT === 'mqtt' || process.env.LOG_OUTPUT === 'both') {
    logger.add(winston.transports.MqttTransport, {
        name: 'mqtt-source',
        topic: process.env.MQTT_TOPIC,
        host: process.env.MQTT_URL
    });
}

if (process.env.LOG_OUTPUT === 'file' || process.env.LOG_OUTPUT === 'both') {
    logger.add(winston.transports.File, {
        filename: process.env.LOG_FILENAME,
        timestamp: true,
        json: false
    });
}

var cont = 0;

setInterval(() => {
    console.log('Generating ' + ++cont);
    logger.info('log-generator: ' + cont);
}, process.env.GENERATION_TIME);