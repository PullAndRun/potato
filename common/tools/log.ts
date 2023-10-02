import { Logger, createLogger, format, transports } from "winston";
import { formatDate, getConfig } from "./system.js";

/**
 * log配置。
 */
const { combine, timestamp, json } = format;

let loggerInstance: Logger | undefined = undefined;
type logLevels =
  | "emerg"
  | "alert"
  | "crit"
  | "error"
  | "warning"
  | "notice"
  | "info"
  | "debug";

/**
 * logger实例。
 */
function logger(level: logLevels, msg: string) {
  if (!loggerInstance) {
    throw new Error(`Logger未初始化。`);
  }
  return loggerInstance[level](msg);
}

/**
 * 重新创建logger实例。
 */
async function setLogger() {
  const logConfig = await getConfig("log");
  if (!logConfig) {
    throw new Error(`获取日志配置文件失败。检查config/log.json。`);
  }
  loggerInstance = createLogger({
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
  logger("info", "Logger实例创建成功。");
}

function init() {
  return {
    order: 0,
    startInit: async () => {
      await setLogger();
    },
  };
}

export { init, logger };
