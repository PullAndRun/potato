import { BelongsToOptions, Model, ModelStatic, Sequelize } from "sequelize";
import { log } from "./log.js";
import { getCmdArgs, getConfig, getFileDirents } from "./system.js";

const dbConfig = getDbConfig();
const sequelize = new Sequelize(dbConfig);

/**
 * 数据库配置。
 */
function getDbConfig() {
  const cmdArgs = getCmdArgs({
    "--dbName": String,
    "--dbUser": String,
    "--dbPswd": String,
  });
  if (!cmdArgs) {
    throw new Error(`从启动脚本获取数据库配置失败。`);
  }
  const dbArgs = {
    database: cmdArgs["--dbName"],
    username: cmdArgs["--dbUser"],
    password: cmdArgs["--dbPswd"],
  };
  const config = getConfig("db");
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
  return sequelize.authenticate().catch((e) => {
    throw new Error(`数据库连接失败，原因:${e}。`);
  });
}

/**
 * 给model添加belongsTo。
 * @param source 谁belongsTo。
 * @param target belongsTo谁。
 * @param option belongsTo参数。
 */
function belongsTo(
  source: ModelStatic<Model<any, any>>,
  target: ModelStatic<Model<any, any>>,
  option: BelongsToOptions
) {
  source.belongsTo(target, option);
  return source;
}

/**
 * 传入model，同步model。
 * @param model model。
 * @returns 同步失败则crash。
 */
async function dbSync(model: ModelStatic<Model<any, any>>) {
  model
    .sync({ alter: { drop: false } })
    .then((_) => log.info(`表${model.name}同步完毕。`))
    .catch((e) => {
      throw new Error(`\n表${model.name}同步失败。原因:${e}。`);
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
    const model = await import(`${fileDirent.path}/${fileDirent.fileName}.js`);
    if (model && model.init) {
      await model.init();
    }
  }
  log.info(`数据库同步完成。`);
}

async function init() {
  await testConnection();
  await initModel();
}

export { belongsTo, dbSync, init, sequelize };
