import { Model, ModelStatic, Sequelize } from "sequelize";
import { logger } from "./log.js";
import { getCmdArg, getConfig, getFileDirents } from "./system.js";

let database: {
  database: Sequelize | undefined;
  readonly sequelize: Sequelize;
  setDatabase: () => Promise<void>;
} = {
  database: undefined,
  get sequelize() {
    if (!this.database) {
      throw new Error(`Sequelize未初始化。`);
    }
    return this.database;
  },
  setDatabase: async function () {
    const config = await getDbConfig();
    this.database = new Sequelize(config);
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
  return database.sequelize.authenticate().catch((e) => {
    throw new Error(`数据库连接失败，原因:${e}。`);
  });
}

/**
 * 同步common/model文件夹下所有model。
 * 执行model文件内的init()函数来同步model。
 */
async function initModel() {
  const fileDirents = await getFileDirents("common/model");
  if (!fileDirents || !fileDirents.length) {
    throw new Error(
      `同步所有Model时，获取Model文件名失败。检查common/model文件夹内是否有文件。`
    );
  }
  for (const fileDirent of fileDirents) {
    if (!fileDirent.fileName) {
      continue;
    }
    const modelFile: {
      name: string;
      model: () => ModelStatic<Model<any, any>>;
    } = await import(`${fileDirent.path}/${fileDirent.fileName}.js`);
    if (modelFile && modelFile.model) {
      modelFile
        .model()
        .sync({ alter: { drop: false } })
        .then((_) => logger.log.info(`表${modelFile.name}同步完毕。`))
        .catch((e) => {
          throw new Error(`\n表${modelFile.name}同步失败。原因:${e}。`);
        });
    }
  }
  logger.log.info(`数据库同步完成。`);
}

async function init() {
  await database.setDatabase();
  await testConnection();
  await initModel();
}

export { database, init };
