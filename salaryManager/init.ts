import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import dotenv from "dotenv";

import ShiftModel from "./models/shiftModel";
import UserModel from "./models/userModel";
import RoleModel from "./models/roleModel";
import CoefficientModel from "./models/coeffitientModel";
import { ROLES } from "../utils/constants";
import * as console from "console";

dotenv.config();

const sequelizeOptions: SequelizeOptions = {
  host: process.env.POSTGRES_HOST!,
  port: Number(process.env.POSTGRES_PORT!),
  username: String(process.env.POSTGRES_USER!),
  password: String(process.env.POSTGRES_PASSWORD!),
  database: process.env.POSTGRES_DB!,
  dialect: "postgres",
  logging: (msg) => console.log(msg),
};
export const sequelize = new Sequelize(sequelizeOptions);
sequelize.addModels([RoleModel, ShiftModel, UserModel, CoefficientModel]);
export async function dbConnect() {
  try {
    await sequelize.authenticate(); // Проверка аутентификации в БД
    await sequelize.sync({ force: true }); // Синхронизация базы данных
    RoleModel.findAll()
      .then((roles) => {
        if (roles.length === 0) {
          //@ts-ignore
          RoleModel.create({ role: ROLES[0], id: 0 }).catch((e) =>
            console.log(e),
          );
          //@ts-ignore
          RoleModel.create({ role: ROLES[1], id: 1 }).catch((e) =>
            console.log(e),
          );
          return;
        }
      })
      .catch((e) => console.log(e));

    CoefficientModel.findOne({ where: { id: 0 } })
      .then((coefficient) => {
        if (!coefficient) {
          const defaultCoefficient = {
            pricePerHour: 0,
            valueOfGainGoodDay: 0,
            valueOfGainGoodNight: 0,
            valueOfGainVeryGoodDay: 0,
            valueOfGainVeryGoodNight: 0,
            coefficientOfGainGood: 0,
            coefficientOfGainVeryGood: 0,
            id: 0,
          };
          //@ts-ignore
          CoefficientModel.create(defaultCoefficient).catch((e) =>
            console.log(e),
          );
          return;
        }
      })
      .catch((e) => console.log(e));

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
