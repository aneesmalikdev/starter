"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const winston_1 = require("winston");
const path_1 = require("path");
const errorColor = chalk_1.default.red.bold;
const warningColor = chalk_1.default.yellow.bold;
const successColor = chalk_1.default.green.bold;
const infoColor = chalk_1.default.white;
const logFolderPath = (_a = process.env["LOG_FOLDER_PATH"]) !== null && _a !== void 0 ? _a : "./logs";
const maxLogSize = parseInt((_b = process.env["LOG_FILE_MAX_SIZE"]) !== null && _b !== void 0 ? _b : "10485760");
const customLevels = {
    error: 0,
    warning: 1,
    info: 2,
    success: 3,
};
const timestampFormat = winston_1.format.timestamp({
    format: "DD-MMM-YYYY HH:mm:ss.SSS",
});
const simpleOutputFormat = winston_1.format.printf((log) => {
    return `${log["timestamp"]}\t${log.level}: ${log.message}`;
});
const coloredOutputFormat = winston_1.format.printf((log) => {
    let color = infoColor;
    switch (log.level) {
        case "error":
            color = errorColor;
            break;
        case "warning":
            color = warningColor;
            break;
        case "success":
            color = successColor;
            break;
    }
    return `${log["timestamp"]}\t${color(log.message)}`;
});
const fileFormat = winston_1.format.combine(timestampFormat, simpleOutputFormat);
const consoleFormat = winston_1.format.combine(timestampFormat, coloredOutputFormat);
const logger = (0, winston_1.createLogger)({
    levels: customLevels,
    transports: [
        new winston_1.transports.File({
            level: "error",
            filename: (0, path_1.resolve)(logFolderPath, "error.log"),
            maxsize: maxLogSize,
            format: fileFormat,
        }),
        new winston_1.transports.File({
            level: "success",
            filename: (0, path_1.resolve)(logFolderPath, "combined.log"),
            maxsize: maxLogSize,
            format: fileFormat,
        }),
        new winston_1.transports.Console({
            level: "success",
            format: consoleFormat,
            handleExceptions: true,
        }),
    ],
    exceptionHandlers: [
        new winston_1.transports.File({
            filename: (0, path_1.resolve)(logFolderPath, "exceptions.log"),
            format: fileFormat,
        }),
    ],
});
const Logger = {
    error: (message) => logger.error(message),
    warning: (message) => logger.warning(message),
    info: (message) => logger.info(message),
    success: (message) => logger.log("success", message),
};
exports.default = Logger;
