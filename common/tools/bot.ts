import { Client, LogLevel, createClient } from "icqq";
import { IQQAccount, qqAccountFindAll } from "../model/account.js";
import { getCMDInput, getPath, isDev, isFolderExist } from "./system.js";
import { botConfigFindOne } from "../model/config.js";
import { logger } from "./log.js";

interface IBot {
  nickName: string;
  client: Client;
}

const bot: {
  bots: Array<IBot>;
  getBots: () => Array<IBot>;
  getBot: () => IBot;
  getBotByNickName: (name: string) => IBot | undefined;
  getBotByUin: (uin: string) => IBot | undefined;
  setBot: () => void;
} = {
  bots: [],
  getBot,
  getBots,
  getBotByNickName,
  getBotByUin,
  setBot,
};

/**
 * 登陆传入的bot。
 */
async function login(accounts: Array<IQQAccount>) {
  const ffmpegPath = getPath("bin/ffmpesg");
  const ffmpegExist = await isFolderExist(ffmpegPath);
  const onlineBots: Array<IBot> = [];
  const config = await (isDev()
    ? botConfigFindOne({ server: null })
    : botConfigFindOne({ server: "aliyun" }));
  if (!config) {
    throw new Error("从数据库获取bot设置失败。");
  }
  for (const account of accounts) {
    const client = createClient({
      log_level: <LogLevel>config.log.level,
      data_dir: getPath("data/bot"),
      reconn_interval: 40,
      sign_api_addr: config.signServer,
      ...(ffmpegExist
        ? {
            ffmpeg_path: ffmpegPath,
            ffprobe_path: ffmpegPath,
          }
        : {}),
    });
    client
      .on("system.login.slider", async (v) => {
        const slider = await getCMDInput(
          `bot ${account.id} 登陆->输入滑块地址获取的ticket后继续。\n滑块地址:\n${v.url}`
        );
        client.submitSlider(slider);
      })
      .on("system.login.qrcode", async () => {
        await getCMDInput(`bot ${account.id} 登陆->扫码完成后回车继续:`);
        client.login();
      })
      .on("system.login.device", async (v) => {
        const tip = await getCMDInput(
          `bot ${account.id} 登陆->请选择验证方式:(1：短信验证   其他：扫码验证)`
        );
        if (tip === "1") {
          client.sendSmsCode();
          const smsCode = await getCMDInput(
            `bot ${account.id} 登陆->请输入手机收到的短信验证码:`
          );
          client.submitSmsCode(smsCode);
        } else {
          await getCMDInput(
            `bot ${account.id} 登陆->扫码完成后回车继续:\n${v.url}`
          );
          client.login();
        }
      });
    await client.login(parseFloat(account.id), account.password).catch((e) => {
      logger.winston.error(`bot登陆失败，uin:${account.id}，错误:${e}`);
      return undefined;
    });
    onlineBots.push({ nickName: account.nickName, client: client });
  }
  return onlineBots;
}

/**
 * 使用昵称获取登陆的bot实例。
 */
function getBotByNickName(nickName: String) {
  return getBots().find((bot) => bot.nickName === nickName);
}

/**
 * 获取所有登陆的bot实例。
 */
function getBots() {
  if (!bot.bots.length) {
    throw new Error(`icqq未初始化。`);
  }
  return bot.bots;
}

/**
 * 使用qq号获取登陆的bot实例。
 */
function getBotByUin(uin: string) {
  return getBots().find((bot) => bot.client.uin.toString() === uin);
}

/**
 * 获取数据库里面所有qq账户。
 */
async function getAllQQAccount() {
  const account = await qqAccountFindAll();
  if (!account || !account.length) {
    throw new Error("获取所有qq账号失败，数据库没有qq账号信息。");
  }
  return account;
}

/**
 * 登陆所有没登录的bot。
 */
async function setBot() {
  const account = await getAllQQAccount();
  const liveBots = await login(account);
  liveBots.forEach((newBot) => {
    const isBotExist = getBots().filter(
      (oldBot) =>
        oldBot.client.uin === newBot.client.uin ||
        oldBot.nickName === newBot.nickName
    ).length;
    if (isBotExist) {
      return;
    }
    bot.bots.push(newBot);
  });
}

/**
 * 获取已登录的bot实例的头一个实例。
 */
function getBot() {
  const bots = getBots();
  if (!bots.length || !bots[0]) {
    throw new Error(`获取bot失败，bot未初始化。`);
  }
  return bots[0];
}

export { bot };