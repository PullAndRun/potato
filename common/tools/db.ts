import { Model, ModelStatic, Sequelize } from "sequelize";
import { logger } from "./log.js";
import { getCmdArg, getConfig, getFileDirents } from "./system.js";

let sequelizeInstance: Sequelize | undefined = undefined;

function useSequelize<T>(getSequelize: (sequelize: Sequelize) => T): T {
  if (!sequelizeInstance) {
    throw new Error(`Sequelize未初始化。`);
  }
  return getSequelize(sequelizeInstance);
}

async function setSequelize() {
  const cmdConf = {
    host: getCmdArg("--dbHost"),
    port: getCmdArg("--dbPort"),
    database: getCmdArg("--dbName"),
    username: getCmdArg("--dbUser"),
    password: getCmdArg("--dbPswd"),
  };
  const dbConf = await getConfig("db");
  const config = {
    ...cmdConf,
    ...dbConf,
  };
  sequelizeInstance = new Sequelize(config);
  logger("info", "sequelize实例化成功。");
}

async function testSequelizeConnection(sequelize: Sequelize) {
  sequelize
    .authenticate()
    .catch((e) => {
      throw new Error(`数据库连接失败，原因:${e}。`);
    })
    .finally(() => {
      logger("info", "数据库连接成功。");
    });
}

async function setSequelizeModel() {
  const fileDirents = await getFileDirents("common/model");
  logger("info", "数据库开始同步。");
  for (const fileDirent of fileDirents) {
    const modelFile: {
      useModel: () => ModelStatic<Model<any, any>>;
    } = await import(`${fileDirent.path}/${fileDirent.name}.js`);
    if (modelFile && modelFile.useModel) {
      await modelFile
        .useModel()
        .sync({ alter: { drop: false } })
        .then((_) => logger("info", `表${modelFile.useModel.name}同步成功。`))
        .catch((e) => {
          throw new Error(
            `\n表${modelFile.useModel.name}同步失败。原因:${e}。`
          );
        });
    }
  }
  logger("info", "数据库完成同步。");
}

function init() {
  return {
    order: 1,
    startInit: async () => {
      await setSequelize();
      await useSequelize(testSequelizeConnection);
      await setSequelizeModel();
    },
  };
}

export { init, useSequelize };
