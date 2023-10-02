import { DataTypes, Model, ModelStatic, Op } from "sequelize";
import { useSequelize } from "../tools/db.js";

interface IBotConfig {
  server: string | null;
  log: {
    level: string;
  };
  signServer: string;
}

function useModel<T>(getModel: (model: ModelStatic<Model<any, any>>) => T): T {
  return getModel(
    useSequelize((sequelize) =>
      sequelize.define("config", {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        bot: {
          type: DataTypes.JSON,
        },
      })
    )
  );
}

async function botConfigFindOne(server: string | undefined) {
  return useModel((model) =>
    model
      .findOne({
        attributes: ["bot"],
        where: {
          server: server || null,
        },
      })
      .then((v) => <IBotConfig>v?.toJSON())
      .catch((_) => undefined)
  );
}

export { useModel, botConfigFindOne };
