import arg from "arg";
import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { logger } from "./log.js";

/**
 * 格式化Args成JSON。
 * @param param.spec Args的key和值类型的映射关系。
 * @param param.argv Args。
 * @returns 成功返回Args的JSON。失败返回undefined。
 */
function parseArgs(param: { spec: arg.Spec; argv: Array<string> }) {
  return arg(param.spec, { argv: param.argv, permissive: true });
}

/**
 * 获取格式化后的启动脚本的JSON。
 * @param spec Args的key和值类型的映射关系。
 * @returns 成功返回Args的JSON。失败返回undefined。
 */
function getCmdArgs(spec: arg.Spec) {
  return parseArgs({ spec, argv: process.argv.slice(2) });
}

/**
 * 获取项目根目录位置。
 * @returns 项目根目录位置。
 */
function getPath(v: string = "") {
  return path.resolve(v);
}

/**
 * 判断项目的目录是否存在。
 */
async function isFolderExist(path: string) {
  return fs.realpath(path).catch((_) => undefined);
}

/**
 * 获取某文件夹下的文件信息。
 * @param folder 文件夹，示例：common/tools。
 * @returns 成功返回文件信息，失败返回undefined。
 */
async function getFileDirents(folder: string) {
  const fileDirents = await fs
    .readdir(path.resolve(folder), { withFileTypes: true })
    .then((dirent) =>
      dirent.map((v) => {
        const [fileName, ...fileType] = v.name.split(".");
        return {
          type: fileType.join("."),
          name: fileName || "",
          fullName: v.name,
          path: v.path,
          fullPath: v.path + v.name,
        };
      })
    )
    .catch((_) => undefined);
  if (!fileDirents || !fileDirents.length) {
    throw new Error(`获取fileDirents失败，检查目录"${folder}"是否有文件。`);
  }
  return fileDirents;
}

/**
 * 获取设置。
 * @param fileName config文件夹内的文件名，映射返回值的key。
 * @returns 成功返回目标文件的JSON，失败返回undefined。
 */
async function getConfig(fileName: string) {
  const fileDirents = await getFileDirents("config");
  if (
    !fileDirents ||
    !fileDirents.length ||
    !fileDirents.map((v) => v.name).includes(fileName)
  ) {
    return undefined;
  }
  const fileDirent = fileDirents.filter((v) => v.name === fileName)[0];
  if (!fileDirent) {
    return undefined;
  }
  const configJson = await import(`${fileDirent.path}/${fileDirent.name}`, {
    assert: { type: "json" },
  });
  const config = configJson["default"];
  const server = getCmdArg("--server", { allowUndefined: true });
  if (!server) {
    return {
      ...config,
      ...(config["dev"] || {}),
    };
  }
  return {
    ...config,
    ...(config[server] || {}),
  };
}

/**
 * 安全转换String到JSON
 * @param str 待转换JSON的String
 * @returns 成功返回JSON，失败返回undefined。
 */
function parseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (_) {
    return undefined;
  }
}

/**
 * 格式化时间。
 * @param template 格式，比如YYYY-MM-DD。
 * @returns 时间
 */
function formatDate(template: string) {
  return dayjs().format(template);
}

/**
 * 获取一个命令行参数。
 * @param option.allowUndefined undefined返回值是否crash，默认crash。
 */
function getCmdArg(
  type:
    | "--dbHost"
    | "--dbPort"
    | "--dbName"
    | "--dbUser"
    | "--dbPswd"
    | "--server",
  option: { allowUndefined: boolean } = { allowUndefined: false }
) {
  const spec = {
    "--dbHost": String,
    "--dbPort": Number,
    "--dbName": String,
    "--dbUser": String,
    "--dbPswd": String,
    "--server": String,
  };
  const cmdArgs = getCmdArgs({
    [type]: spec[type],
  });
  if (!option.allowUndefined && cmdArgs[type] === undefined) {
    throw new Error(
      `获取启动命令参数失败。检查启动命令的参数是否包括${type}:${spec[type].name}。`
    );
  }
  return cmdArgs[type];
}

/**
 * 轮番执行common/tools文件夹内的init函数。
 * 注意init函数返回值的order是执行顺序。
 */
async function initSystem() {
  const fileDirents = await getFileDirents("common/tools");
  if (!fileDirents || !fileDirents.length) {
    throw new Error(
      `初始化系统时，获取文件名失败。检查common/tools文件夹内是否有文件。`
    );
  }
  console.log(
    `{"level":"info","message":"系统初始化开始。","timestamp":"${new Date().toISOString()}"}`
  );
  const initArr = [];
  for (const fileDirent of fileDirents) {
    if (!fileDirent.name) {
      continue;
    }
    const toolsFile = await import(`${fileDirent.path}/${fileDirent.name}.js`);
    if (toolsFile && toolsFile.init) {
      initArr[toolsFile.init().order] = toolsFile.init();
    }
  }
  for (const init of initArr) {
    await init.startInit();
  }
  logger("info", "系统初始化完成。");
}

/**
 * 是否开发模式。
 */
function isDev() {
  return !!getCmdArg("--server", { allowUndefined: true });
}

async function getCMDInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question + "\n", (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

export {
  formatDate,
  getCMDInput,
  getCmdArg,
  getCmdArgs,
  getConfig,
  getFileDirents,
  getPath,
  initSystem,
  isDev,
  isFolderExist,
  parseJson,
};
