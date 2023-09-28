import { DataTypes, Op } from "sequelize";
import { dbSync, getSequelize } from "../tools/db.js";

function accountModel() {
  return getSequelize().define("account", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    qq: {
      type: DataTypes.JSON,
    },
    baiduTranslate: {
      type: DataTypes.JSON,
    },
    neteaseMusic: {
      type: DataTypes.JSON,
    },
    saucenao: {
      type: DataTypes.JSON,
    },
    openai: {
      type: DataTypes.JSON,
    },
  });
}

async function getQQAccount() {
  return accountModel()
    .findAll({
      where: {
        qq: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => v.toJSON()))
    .then((v) => (v.length ? v : undefined))
    .catch((_) => undefined);
}

async function init() {
  await dbSync(accountModel());
}

export { getQQAccount, init };
