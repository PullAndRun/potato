import { DataTypes, Op } from "sequelize";
import { database } from "../tools/db.js";

function model() {
  return database.sequelize.define("account", {
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
  return model()
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

export { getQQAccount, model };
