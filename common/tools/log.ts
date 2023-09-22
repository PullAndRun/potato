import { createLogger, format, transports } from "winston";
import { formatDate, getConfig } from "./system.js";

/**
 * log配置。
 */
const logConfig = getLogConfig();
const { combine, timestamp, json } = format;

/**
 * log实例。
 */
const log = createLogger({
  ...logConfig,
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console(),
    new transports.File({
      dirname: "./log/error/",
      filename: `${formatDate("YYYY-MM-DD")}.log`,
      level: "error",
    }),
    new transports.File({
      dirname: "./log/all/",
      filename: `${formatDate("YYYY-MM-DD")}.log`,
    }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({
      dirname: "./log/exception/",
      filename: `${formatDate("YYYY-MM-DD")}.log`,
    }),
  ],
});

/**
 * 获取日志配置。
 * @returns 日志配置。
 */
function getLogConfig() {
  const config = getConfig("log");
  if (!config) {
    throw new Error(`获取日志配置文件失败。检查config/log.json。`);
  }
  return config;
}

export { log };
