import { DataTypes, Op } from "sequelize";
import { database } from "../tools/db.js";

interface IBotConfig {
  server: string | null;
  log: {
    level: string;
  };
  signServer: string;
}

function model() {
  return database.sequelize.define("config", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bot: {
      type: DataTypes.JSON,
    },
  });
}

async function botConfigFindAll() {
  return model()
    .findAll({
      attributes: ["bot"],
      where: {
        bot: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IBotConfig>v.toJSON()))
    .catch((_) => undefined);
}

async function botConfigFindOne(config: Partial<IBotConfig>) {
  return model()
    .findOne({
      attributes: ["bot"],
      where: {
        bot: config,
      },
    })
    .then((v) => <IBotConfig>v?.toJSON())
    .catch((_) => undefined);
}

async function botConfigCreate(configs: Array<IBotConfig>) {
  return model()
    .bulkCreate(
      configs.map((config) => {
        return { bot: config };
      })
    )
    .then((v) => v.map((v) => <IBotConfig>v.toJSON()))
    .catch((_) => undefined);
}

async function botConfigUpdate(param: {
  find: Partial<IBotConfig>;
  update: Partial<IBotConfig>;
}) {
  return model()
    .update({ bot: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function botConfigDestroy(config: Partial<IBotConfig>) {
  return model()
    .destroy({
      where: {
        bot: config,
      },
    })
    .then((v) => !!v)
    .catch((_) => undefined);
}

export {
  botConfigCreate,
  botConfigDestroy,
  botConfigFindAll,
  botConfigFindOne,
  botConfigUpdate,
  model,
};
