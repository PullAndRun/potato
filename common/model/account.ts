import { DataTypes, Model, ModelCtor, ModelStatic, Op } from "sequelize";
import { useSequelize } from "../tools/db.js";

interface IQQAccount {
  id: string;
  nickName: string;
  password: string;
}

interface IBaiduTranslateAccount {
  id: string;
  password: string;
}

interface INeteaseMusicAccount {
  id: string;
  password: string;
}

interface ISaucenaoAccount {
  id: string;
}

interface IOpenaiAccount {
  key: string;
}

function useModel<T>(getModel: (model: ModelStatic<Model<any, any>>) => T): T {
  return getModel(
    useSequelize((sequelize) =>
      sequelize.define("account", {
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
      })
    )
  );
}

async function qqAccountFindAll() {
  return useModel((model) =>
    model
      .findAll({
        attributes: ["qq"],
        where: {
          qq: { [Op.not]: null },
        },
      })
      .then((v) => v.map((v) => <IQQAccount>v.toJSON()))
      .catch((_) => undefined)
  );
}

export { useModel, IQQAccount, qqAccountFindAll };
