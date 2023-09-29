import { Logger, createLogger, format, transports } from "winston";
import { formatDate, getConfig } from "./system.js";

/**
 * log配置。
 */
const { combine, timestamp, json } = format;

const logger: {
  logger: Logger | undefined;
  readonly winston: Logger;
  setWinston: () => Promise<void>;
} = {
  logger: undefined,
  get winston() {
    if (!this.logger) {
      throw new Error(`Logger未初始化。`);
    }
    return this.logger;
  },
  setWinston: async function () {
    const logConfig = await getConfig("log");
    if (!logConfig) {
      throw new Error(`获取日志配置文件失败。检查config/log.json。`);
    }
    this.logger = createLogger({
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
    logger.winston.info("Logger实例创建成功。");
  },
};

function init() {
  return {
    order: 0,
    startInit: async () => {
      await logger.setWinston();
    },
  };
}

export { init, logger };
