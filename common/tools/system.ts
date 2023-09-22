import fs from "fs/promises";
import path from "path";
import arg from "arg";

/**
 * 设置，参见根目录config文件夹内的json。
 * key为json文件名，value为json文件内容。
 * 使用init()初始化。
 * 使用setConfig()更新。
 * 使用getConfig()读取。
 */
let config: any = undefined;

/**
 * 判断是否为发布模式。
 * 发布模式需要在启动参数添加--prod。
 */
function isProd() {
  return arg(
    {
      "--prod": Boolean,
    },
    { permissive: false, argv: process.argv.slice(2) }
  )["--prod"];
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
 * @param folder 文件夹，比如common/tools。
 * @returns 文件名。
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
 * 读取设置文件，覆盖到全局变量config。
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
 * @param type 参见根目录config文件夹，type为文件名。
 */
function getConfig(type: string) {
  if (!config || !config[type]) {
    return undefined;
  }
  return config[type]["default"];
}

/**
 * 安全转换String到JSON
 * @param str 待转换JSON的String
 */
function parseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (_) {
    return undefined;
  }
}

async function init() {
  await setConfig();
}

export { getConfig, getFileDirents, getRootPath, init, parseJson, isProd };
