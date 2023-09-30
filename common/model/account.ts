import { DataTypes, Op } from "sequelize";
import { database } from "../tools/db.js";

interface IQQ {
  id: string;
  nickName: string;
  password: string;
}

interface IBaiduTranslate {
  id: string;
  password: string;
}

interface INeteaseMusic {
  id: string;
  password: string;
}

interface ISaucenao {
  id: string;
}

interface IOpenai {
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
      where: {
        openai: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IOpenai>v.toJSON()))
    .catch((_) => undefined);
}

async function openaiAccountFindOne(account: Partial<IOpenai>) {
  return model()
    .findOne({
      where: {
        openai: account,
      },
    })
    .then((v) => <IOpenai>v?.toJSON())
    .catch((_) => undefined);
}

async function openaiAccountCreate(account: IOpenai) {
  return model()
    .create({ openai: account })
    .then((v) => <IOpenai>v.toJSON())
    .catch((_) => undefined);
}

async function openaiAccountUpdate(param: {
  find: Partial<IOpenai>;
  update: Partial<IOpenai>;
}) {
  return model()
    .update({ openai: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function openaiAccountDestroy(account: Partial<IOpenai>) {
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
      where: {
        saucenao: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <ISaucenao>v.toJSON()))
    .catch((_) => undefined);
}

async function saucenaoAccountFindOne(account: Partial<ISaucenao>) {
  return model()
    .findOne({
      where: {
        saucenao: account,
      },
    })
    .then((v) => <ISaucenao>v?.toJSON())
    .catch((_) => undefined);
}

async function saucenaoAccountCreate(account: ISaucenao) {
  return model()
    .create({ saucenao: account })
    .then((v) => <ISaucenao>v.toJSON())
    .catch((_) => undefined);
}

async function saucenaoAccountUpdate(param: {
  find: Partial<ISaucenao>;
  update: Partial<ISaucenao>;
}) {
  return model()
    .update({ saucenao: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function saucenaoAccountDestroy(account: Partial<ISaucenao>) {
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
      where: {
        neteaseMusic: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <INeteaseMusic>v.toJSON()))
    .catch((_) => undefined);
}

async function neteaseMusicAccountFindOne(account: Partial<INeteaseMusic>) {
  return model()
    .findOne({
      where: {
        neteaseMusic: account,
      },
    })
    .then((v) => <INeteaseMusic>v?.toJSON())
    .catch((_) => undefined);
}

async function neteaseMusicAccountCreate(account: INeteaseMusic) {
  return model()
    .create({ neteaseMusic: account })
    .then((v) => <INeteaseMusic>v.toJSON())
    .catch((_) => undefined);
}

async function neteaseMusicAccountUpdate(param: {
  find: Partial<INeteaseMusic>;
  update: Partial<INeteaseMusic>;
}) {
  return model()
    .update({ neteaseMusic: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function neteaseMusicAccountDestroy(account: Partial<INeteaseMusic>) {
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
        baiduTranslate: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IBaiduTranslate>v.toJSON()))
    .catch((_) => undefined);
}

async function baiduTranslateAccountFindOne(account: Partial<IBaiduTranslate>) {
  return model()
    .findOne({
      where: {
        baiduTranslate: account,
      },
    })
    .then((v) => <IBaiduTranslate>v?.toJSON())
    .catch((_) => undefined);
}

async function baiduTranslateAccountCreate(account: IBaiduTranslate) {
  return model()
    .create({ baiduTranslate: account })
    .then((v) => <IBaiduTranslate>v.toJSON())
    .catch((_) => undefined);
}

async function baiduTranslateAccountUpdate(param: {
  find: Partial<IBaiduTranslate>;
  update: Partial<IBaiduTranslate>;
}) {
  return model()
    .update({ baiduTranslate: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function baiduTranslateAccountDestroy(account: Partial<IBaiduTranslate>) {
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
      where: {
        qq: {
          [Op.not]: null,
        },
      },
    })
    .then((v) => v.map((v) => <IQQ>v.toJSON()))
    .catch((_) => undefined);
}

async function qqAccountFindOne(account: Partial<IQQ>) {
  return model()
    .findOne({
      where: {
        qq: account,
      },
    })
    .then((v) => <IQQ>v?.toJSON())
    .catch((_) => undefined);
}

async function qqAccountCreate(accounts: Array<IQQ>) {
  return model()
    .bulkCreate(
      accounts.map((account) => {
        return { qq: account };
      })
    )
    .then((v) => v.map((v) => <IQQ>v.toJSON()))
    .catch((_) => undefined);
}

async function qqAccountUpdate(param: {
  find: Partial<IQQ>;
  update: Partial<IQQ>;
}) {
  return model()
    .update({ qq: param.find }, { where: param.update })
    .then((v) => v[0])
    .catch((_) => undefined);
}

async function qqAccountDestroy(account: Partial<IQQ>) {
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
