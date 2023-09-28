import { Logger, createLogger, format, transports } from "winston";
import { formatDate, getConfig } from "./system.js";

/**
 * log配置。
 */
const { combine, timestamp, json } = format;

let logger: Logger | undefined = undefined;

/**
 * 初始化日志。
 */
async function setLogger() {
  const logConfig = await getConfig("log");
  if (!logConfig) {
    throw new Error(`获取日志配置文件失败。检查config/log.json。`);
  }
  logger = createLogger({
    format: combine(timestamp(), json()),
    ...logConfig,
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
}

function getLogger() {
  if (!logger) {
    throw new Error(`Logger未初始化。`);
  }
  return logger;
}

async function init() {
  await setLogger();
}

export { getLogger, init };
