// config/logger.js
const { createLogger, transports, format } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const errorTransport = new DailyRotateFile({
  dirname: logDir,
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxFiles: "7d",
  zippedArchive: true
});

const combinedTransport = new DailyRotateFile({
  dirname: logDir,
  filename: "combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  zippedArchive: true
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    errorTransport,
    combinedTransport
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    })
  );
}

module.exports = logger;
