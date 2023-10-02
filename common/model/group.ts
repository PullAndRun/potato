import { DataTypes, Model, ModelStatic, Op } from "sequelize";
import { useSequelize } from "../tools/db.js";

const group = {
  group: [],
};

function useModel<T>(getModel: (model: ModelStatic<Model<any, any>>) => T): T {
  return getModel(
    useSequelize((sequelize) =>
      sequelize.define("group", {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        gid: {
          type: DataTypes.TEXT,
        },
        Plugin: {
          type: DataTypes.ARRAY,
        },
      })
    )
  );
}

export { useModel };
