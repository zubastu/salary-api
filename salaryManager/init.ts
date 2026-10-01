import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import dotenv from "dotenv";

import ShiftModel from "./models/shiftModel";
import UserModel from "./models/userModel";
import RoleModel from "./models/roleModel";
import CoefficientModel from "./models/coeffitientModel";
import { ROLES } from "../utils/constants";
import * as console from "console";
import { requireEnv } from "../utils/env";

dotenv.config();

const sequelizeOptions: SequelizeOptions = {
  host: requireEnv("POSTGRES_HOST"),
  port: Number(requireEnv("POSTGRES_PORT")),
  username: requireEnv("POSTGRES_USER"),
  password: requireEnv("POSTGRES_PASSWORD"),
  database: requireEnv("POSTGRES_DB"),
  dialect: "postgres",
  logging: (msg) => console.log(msg),
};
export const sequelize = new Sequelize(sequelizeOptions);
sequelize.addModels([RoleModel, ShiftModel, UserModel, CoefficientModel]);
export async function dbConnect() {
  try {
    await sequelize.authenticate(); // Проверка аутентификации в БД
    await sequelize.sync(/*{ force: true }*/); // Синхронизация базы данных
    RoleModel.findAll()
      .then((roles) => {
        if (roles.length === 0) {
          RoleModel.create({ role: ROLES[0], id: 0 }).catch((e) =>
            console.log(e),
          );
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
