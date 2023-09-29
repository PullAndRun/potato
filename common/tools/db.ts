import { Model, ModelStatic, Sequelize } from "sequelize";
import { logger } from "./log.js";
import { getCmdArg, getConfig, getFileDirents } from "./system.js";

let database: {
  database: Sequelize | undefined;
  readonly sequelize: Sequelize;
  setSequelize: () => Promise<void>;
} = {
  database: undefined,
  get sequelize() {
    if (!this.database) {
      throw new Error(`Sequelize未初始化。`);
    }
    return this.database;
  },
  setSequelize: async function () {
    const config = await getDbConfig();
    this.database = new Sequelize(config);
    logger.winston.info("数据库实例创建成功。");
  },
};

/**
 * 数据库配置。
 */
async function getDbConfig() {
  const dbArgs = {
    host: getCmdArg("--dbHost"),
    port: getCmdArg("--dbPort"),
    database: getCmdArg("--dbName"),
    username: getCmdArg("--dbUser"),
    password: getCmdArg("--dbPswd"),
  };
  const config = await getConfig("db");
  if (!config) {
    throw new Error(`获取数据库配置文件失败。检查config/db.json。`);
  }
  return {
    ...config,
    ...dbArgs,
  };
}

/**
 * 测试数据库连接。
 * 测试失败则crash。
 */
async function testConnection() {
  return database.sequelize
    .authenticate()
    .catch((e) => {
      throw new Error(`数据库连接失败，原因:${e}。`);
    })
    .finally(() => {
      logger.winston.info("数据库连接成功。");
    });
}

/**
 * 轮番执行common/tools文件夹内的model和init函数。
 */
async function initModel() {
  const fileDirents = await getFileDirents("common/model");
  if (!fileDirents || !fileDirents.length) {
    throw new Error(
      `同步Model时，获取文件名失败。检查common/model文件夹内是否有文件。`
    );
  }
  logger.winston.info(`数据库开始同步。`);
  for (const fileDirent of fileDirents) {
    if (!fileDirent.fileName) {
      continue;
    }
    const modelFile: {
      init: any;
      model: () => ModelStatic<Model<any, any>>;
    } = await import(`${fileDirent.path}/${fileDirent.fileName}.js`);
    if (modelFile && modelFile.model) {
      await modelFile
        .model()
        .sync({ alter: { drop: false } })
        .then((_) => logger.winston.info(`表${modelFile.model.name}同步成功。`))
        .catch((e) => {
          throw new Error(`\n表${modelFile.model.name}同步失败。原因:${e}。`);
        });
      if (modelFile.init) {
        await modelFile.init();
      }
    }
  }
  logger.winston.info(`数据库完成同步。`);
}

function init() {
  return {
    order: 1,
    startInit: async () => {
      await database.setSequelize();
      await testConnection();
      await initModel();
    },
  };
}

export { database, init };
