import {
  IBaiduTranslateAccount,
  INeteaseMusicAccount,
  IOpenaiAccount,
  IQQAccount,
  ISaucenaoAccount,
  baiduTranslateAccountCreate,
  neteaseMusicAccountCreate,
  openaiAccountCreate,
  qqAccountCreate,
  saucenaoAccountCreate,
} from "../common/model/account.js";
import { IBotConfig, botConfigCreate } from "../common/model/config.js";
import { database } from "../common/tools/db.js";
import { logger } from "../common/tools/log.js";

async function setQQAccount() {
  const account: Array<IQQAccount> = [];
  const result = qqAccountCreate(account);
  console.log(result);
}

async function setBaiduTranslateAccount() {
  const account: Array<IBaiduTranslateAccount> = [];
  const result = baiduTranslateAccountCreate(account);
  console.log(result);
}

async function setNeteaseMusicAccount() {
  const account: Array<INeteaseMusicAccount> = [];
  const result = neteaseMusicAccountCreate(account);
  console.log(result);
}

async function setOpenaiAccount() {
  const account: Array<IOpenaiAccount> = [];
  const result = openaiAccountCreate(account);
  console.log(result);
}

async function setSaucenaoAccount() {
  const account: Array<ISaucenaoAccount> = [];
  const result = saucenaoAccountCreate(account);
  console.log(result);
}

async function setBotConfig() {
  const config: Array<IBotConfig> = [];
  const result = botConfigCreate(config);
  console.log(result);
}

async function setDb() {
  await logger.setWinston();
  await database.setSequelize();
}

setDb();
