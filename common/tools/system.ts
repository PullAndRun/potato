import arg from "arg";
import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";

/**
 * 设置，参见根目录config文件夹内的json。
 * key为json文件名，value为json文件内容。
 * 使用init()初始化。
 * 使用setConfig()更新。
 * 使用getConfig()读取。
 */
let config: any = undefined;

/**
 * 格式化Args成JSON。
 * @param param.spec Args的key和值类型的映射关系。
 * @param param.argv Args。
 * @returns 成功返回Args的JSON。失败返回undefined。
 */
function parseArgs(param: { spec: arg.Spec; argv: Array<string> }) {
  try {
    return arg(param.spec, { argv: param.argv });
  } catch (_) {
    return undefined;
  }
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
function getRootPath() {
  return path.resolve();
}

/**
 * 获取某文件夹下的文件名。
 * @param folder 文件夹，示例：common/tools。
 * @returns 成功返回文件名，失败返回undefined。
 */
async function getFileDirents(folder: string) {
  return fs
    .readdir(path.resolve(folder), { withFileTypes: true })
    .then((dirent) =>
      dirent.map((v) => {
        const [fileName, ...fileType] = v.name.split(".");
        return {
          ...v,
          fileName: fileName,
          fileType: fileType.join("."),
        };
      })
    )
    .catch((_) => undefined);
}

/**
 * 重新读取config文件夹内的所有json文件，覆盖到全局变量config。
 */
async function setConfig() {
  const fileDirents = await getFileDirents("config");
  if (!fileDirents) {
    return;
  }
  for (const fileDirent of fileDirents) {
    if (!fileDirent.fileName) {
      continue;
    }
    config = {
      ...(config || {}),
      [fileDirent.fileName]: await import(
        `${fileDirent.path}/${fileDirent.name}`,
        { assert: { type: "json" } }
      ),
    };
  }
}

/**
 * 获取设置。
 * @param fileName config文件夹内的文件名，映射返回值的key。
 * @returns 成功返回目标文件的JSON，失败返回undefined。
 */
function getConfig(fileName: string) {
  if (!config || !config[fileName] || !config[fileName]["default"]) {
    return undefined;
  }
  const conf = config[fileName]["default"];
  const serverName = getCmdArgs({ "--server": String });
  if (!serverName || !serverName["--server"]) {
    return {
      ...conf,
      ...(conf["dev"] || {}),
    };
  }
  return {
    ...conf,
    ...(conf[serverName["--server"]] || {}),
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
 * 初始化
 */
async function init() {
  await setConfig();
}

export {
  formatDate,
  getCmdArgs,
  getConfig,
  getFileDirents,
  getRootPath,
  init,
  parseJson,
};
