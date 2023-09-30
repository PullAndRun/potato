import { DataTypes, Op } from "sequelize";
import { database } from "../tools/db.js";

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

async function openaiAccountFindAll() {
  return model()
    .findAll({
      attributes: ["openai"],
      where: {
        openai: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IOpenaiAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function openaiAccountFindOne(account: Partial<IOpenaiAccount>) {
  return model()
    .findOne({
      attributes: ["openai"],
      where: {
        openai: account,
      },
    })
    .then((v) => <IOpenaiAccount>v?.toJSON())
    .catch((_) => undefined);
}

async function openaiAccountCreate(accounts: Array<IOpenaiAccount>) {
  return model()
    .bulkCreate(
      accounts.map((account) => {
        return { openai: account };
      })
    )
    .then((v) => v.map((v) => <IOpenaiAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function openaiAccountUpdate(param: {
  find: Partial<IOpenaiAccount>;
  update: Partial<IOpenaiAccount>;
}) {
  return model()
    .update({ openai: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function openaiAccountDestroy(account: Partial<IOpenaiAccount>) {
  return model()
    .destroy({
      where: {
        openai: account,
      },
    })
    .then((v) => !!v)
    .catch((_) => undefined);
}

async function saucenaoAccountFindAll() {
  return model()
    .findAll({
      attributes: ["saucenao"],
      where: {
        saucenao: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <ISaucenaoAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function saucenaoAccountFindOne(account: Partial<ISaucenaoAccount>) {
  return model()
    .findOne({
      attributes: ["saucenao"],
      where: {
        saucenao: account,
      },
    })
    .then((v) => <ISaucenaoAccount>v?.toJSON())
    .catch((_) => undefined);
}

async function saucenaoAccountCreate(accounts: Array<ISaucenaoAccount>) {
  return model()
    .bulkCreate(
      accounts.map((account) => {
        return { saucenao: account };
      })
    )
    .then((v) => v.map((v) => <ISaucenaoAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function saucenaoAccountUpdate(param: {
  find: Partial<ISaucenaoAccount>;
  update: Partial<ISaucenaoAccount>;
}) {
  return model()
    .update({ saucenao: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function saucenaoAccountDestroy(account: Partial<ISaucenaoAccount>) {
  return model()
    .destroy({
      where: {
        saucenao: account,
      },
    })
    .then((v) => !!v)
    .catch((_) => undefined);
}

async function neteaseMusicAccountFindAll() {
  return model()
    .findAll({
      attributes: ["neteaseMusic"],
      where: {
        neteaseMusic: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <INeteaseMusicAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function neteaseMusicAccountFindOne(
  account: Partial<INeteaseMusicAccount>
) {
  return model()
    .findOne({
      attributes: ["neteaseMusic"],
      where: {
        neteaseMusic: account,
      },
    })
    .then((v) => <INeteaseMusicAccount>v?.toJSON())
    .catch((_) => undefined);
}

async function neteaseMusicAccountCreate(
  accounts: Array<INeteaseMusicAccount>
) {
  return model()
    .bulkCreate(
      accounts.map((account) => {
        return { neteaseMusic: account };
      })
    )
    .then((v) => v.map((v) => <INeteaseMusicAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function neteaseMusicAccountUpdate(param: {
  find: Partial<INeteaseMusicAccount>;
  update: Partial<INeteaseMusicAccount>;
}) {
  return model()
    .update({ neteaseMusic: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function neteaseMusicAccountDestroy(
  account: Partial<INeteaseMusicAccount>
) {
  return model()
    .destroy({
      where: {
        neteaseMusic: account,
      },
    })
    .then((v) => !!v)
    .catch((_) => undefined);
}

async function baiduTranslateAccountFindAll() {
  return model()
    .findAll({
      where: {
        attribute: ["baiduTranslate"],
        baiduTranslate: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IBaiduTranslateAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function baiduTranslateAccountFindOne(
  account: Partial<IBaiduTranslateAccount>
) {
  return model()
    .findOne({
      attributes: ["baiduTranslate"],
      where: {
        baiduTranslate: account,
      },
    })
    .then((v) => <IBaiduTranslateAccount>v?.toJSON())
    .catch((_) => undefined);
}

async function baiduTranslateAccountCreate(
  accounts: Array<IBaiduTranslateAccount>
) {
  return model()
    .bulkCreate(
      accounts.map((account) => {
        return { baiduTranslate: account };
      })
    )
    .then((v) => v.map((v) => <IBaiduTranslateAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function baiduTranslateAccountUpdate(param: {
  find: Partial<IBaiduTranslateAccount>;
  update: Partial<IBaiduTranslateAccount>;
}) {
  return model()
    .update({ baiduTranslate: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function baiduTranslateAccountDestroy(
  account: Partial<IBaiduTranslateAccount>
) {
  return model()
    .destroy({
      where: {
        baiduTranslate: account,
      },
    })
    .then((v) => !!v)
    .catch((_) => undefined);
}

async function qqAccountFindAll() {
  return model()
    .findAll({
      attributes: ["qq"],
      where: {
        qq: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IQQAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function qqAccountFindOne(account: Partial<IQQAccount>) {
  return model()
    .findOne({
      attributes: ["qq"],
      where: {
        qq: account,
      },
    })
    .then((v) => <IQQAccount>v?.toJSON())
    .catch((_) => undefined);
}

async function qqAccountCreate(accounts: Array<IQQAccount>) {
  return model()
    .bulkCreate(
      accounts.map((account) => {
        return { qq: account };
      })
    )
    .then((v) => v.map((v) => <IQQAccount>v.toJSON()))
    .catch((_) => undefined);
}

async function qqAccountUpdate(param: {
  find: Partial<IQQAccount>;
  update: Partial<IQQAccount>;
}) {
  return model()
    .update({ qq: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function qqAccountDestroy(account: Partial<IQQAccount>) {
  return model()
    .destroy({
      where: {
        qq: account,
      },
    })
    .then((v) => !!v)
    .catch((_) => undefined);
}

export {
  IBaiduTranslateAccount,
  INeteaseMusicAccount,
  IOpenaiAccount,
  IQQAccount,
  ISaucenaoAccount,
  baiduTranslateAccountCreate,
  baiduTranslateAccountDestroy,
  baiduTranslateAccountFindAll,
  baiduTranslateAccountFindOne,
  baiduTranslateAccountUpdate,
  model,
  neteaseMusicAccountCreate,
  neteaseMusicAccountDestroy,
  neteaseMusicAccountFindAll,
  neteaseMusicAccountFindOne,
  neteaseMusicAccountUpdate,
  openaiAccountCreate,
  openaiAccountDestroy,
  openaiAccountFindAll,
  openaiAccountFindOne,
  openaiAccountUpdate,
  qqAccountCreate,
  qqAccountDestroy,
  qqAccountFindAll,
  qqAccountFindOne,
  qqAccountUpdate,
  saucenaoAccountCreate,
  saucenaoAccountDestroy,
  saucenaoAccountFindAll,
  saucenaoAccountFindOne,
  saucenaoAccountUpdate,
};
