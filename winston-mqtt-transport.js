const util = require('util');
const winston = require('winston');
const mqtt = require('mqtt');
const common = require('winston/lib/winston/common');

const MqttTransport = winston.transports.MqttTransport = function MqttTransport(options) {
    if (!options.name) {
        throw new Error('winston-mqtt requires a "name" property to be provided');
    }
    this.name = options.name;
    this.topic = options.topic || 'logs';
    this.level = options.level || 'info';
    this.mqttClient = mqtt.connect(options.host || 'mqtt://localhost:1883');
};

/** @extends winston.Transport */
util.inherits(MqttTransport, winston.Transport);

/**
 * Define a getter so that `winston.transports.MqttTransport`
 * is available and thus backwards compatible.
 */
winston.transports.MqttTransport = MqttTransport;

/**
 * Closes the mqttClient connection.
 * Used by winston Logger.close on transports
 */
MqttTransport.prototype.close = function close() {
    if (this.mqttClient) {
        this.mqttClient.end();
    }
};

function buildTopic(transport, level) {
    return `${transport.topic}/${level}`;
}

/**
 * Core logging method exposed to Winston. Metadata is optional.
 * @function log
 * @member MqttTransport
 * @param level {string} Level at which to log the message.
 * @param msg {string} Message to log.
 * @param meta {?Object} Additional metadata to attach.
 * @param callback {function} Continuation to respond to when complete.
 */
MqttTransport.prototype.log = function log(level, msg, meta, callback) {
    const output = common.log({
        level: level,
        message: msg,
        meta: meta,
        timestamp: true
    });
    this.mqttClient.publish(buildTopic(this, level), output);
    callback(null, true);
};

module.exports = MqttTransport;