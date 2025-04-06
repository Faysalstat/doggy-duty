const winston = require("winston");
const { format, transports } = winston;
const path = require("path");

// Custom log format to handle objects properly
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), // Timestamp with milliseconds
  format.errors({ stack: true }), // Stack traces for errors
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let metaInfo = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta, null, 2)}` : "";
    return stack
      ? `[${timestamp}] [PID:${process.pid}] ${level.toUpperCase()}: ${message} \n Stack: ${stack}${metaInfo}`
      : `[${timestamp}] [PID:${process.pid}] ${level.toUpperCase()}: ${message}${metaInfo}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: "info", // Log levels: error, warn, info, http, verbose, debug, silly
  format: logFormat,
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), logFormat) }), // Console logs with color
    new transports.File({ filename: path.join(__dirname, "logs", "app.log") }), // General logs
    new transports.File({ filename: path.join(__dirname, "logs", "error.log"), level: "error" }) // Error logs
  ],
});

module.exports = logger;
