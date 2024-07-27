import type { Request, Response } from "express";
import shiftModel from "../models/shiftModel";
import UserModel from "../models/userModel";
import * as console from "console";
import RoleModel from "../models/roleModel";

const getUser = (req: Request, res: Response) => {
  UserModel.findOne({
    //@ts-ignore
    where: { id: req.userId },
    attributes: {
      exclude: ["password"],
    },
    include: {
      model: RoleModel,
    },
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const getEmployees = (_: Request, res: Response) => {
  UserModel.findAll({
    where: { role_id: 0 },
    attributes: {
      exclude: ["password"],
    },
  })
    .then((employees) => {
      res.status(200).json(employees);
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const getEmployeeById = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  UserModel.findOne({
    where: { id: employee_id },
    include: {
      model: shiftModel,
    },
    attributes: {
      exclude: ["password"],
    },
  })
    .then((employee) => {
      if (employee) {
        res.status(200).json(employee);
        return;
      }
      res.status(404).json({ message: "Not found" });
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const updateEmployee = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  UserModel.update(
    { name: req.body.name },
    {
      where: {
        id: employee_id,
      },
      returning: true,
    },
  )
    .then((updateRecord) => {
      updateRecord[0] === 1
        ? res.status(200).json({ message: "OK" })
        : res.status(404).json({ message: "Not found" });
    })
    .catch((e) => {
      res.status(400).json({ message: e ? e : "Bad request" });
    });
};

const deleteEmployee = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  UserModel.destroy({ where: { id: employee_id } })
    .then((deletedRecord) => {
      console.log(deletedRecord);
      deletedRecord === 1
        ? res.status(200).json({ message: "OK" })
        : res.status(404).json({ message: "Not found" });
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json({ message: "Bad request" });
    });
};

export {
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getUser,
};
