import type { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import ShiftModel from "../models/shiftModel";
import UserModel from "../models/userModel";
import { Op } from "sequelize";

const getWorkShifts = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  ShiftModel.findAll({
    where: {
      user_id: employee_id,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: {
      model: UserModel,
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    },
    order: [[Sequelize.col("date"), "DESC"]],
  })
    .then((workShifts) => {
      res.status(200).json(workShifts);
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const getAllWorkShifts = (_: Request, res: Response) => {
  ShiftModel.findAll({
    limit: 31,
    include: {
      model: UserModel,
      attributes: {
        exclude: ["password"],
      },
    },
    order: [[Sequelize.col("date"), "DESC"]],
  })
    .then((workShifts) => {
      res.status(200).json(workShifts);
    })
    .catch((e) => {
      res.status(400).json({ message: e });
    });
};

const getWorkShiftsBetweenDates = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  ShiftModel.findAll({
    where: {
      user_id: employee_id,
      date: {
        [Op.and]: {
          [Op.gte]: req.body.startDate,
          [Op.lte]: req.body.endDate,
        },
      },
    },
    include: {
      model: UserModel,
      attributes: {
        exclude: ["password"],
      },
    },
    order: [[Sequelize.col("date"), "DESC"]],
  })
    .then((workShifts) => {
      res.status(200).json(workShifts);
    })
    .catch((e) => {
      res.status(400).json({ message: e });
    });
};

const getAllWorkShiftsBetweenDates = (req: Request, res: Response) => {
  ShiftModel.findAll({
    where: {
      date: {
        [Op.and]: {
          [Op.gte]: req.body.startDate,
          [Op.lte]: req.body.endDate,
        },
      },
    },
    include: {
      model: UserModel,
      attributes: {
        exclude: ["password"],
      },
    },
    order: [[Sequelize.col("date"), "DESC"]],
  })
    .then((workShifts) => {
      res.status(200).json(workShifts);
    })
    .catch((e) => {
      res.status(400).json({ message: e });
    });
};

const postWorkShift = (req: Request, res: Response) => {
  ShiftModel.create(
    { ...req.body, date: req.body.date },
    {
      returning: true,
      include: {
        model: UserModel,
        attributes: {
          exclude: ["password"],
        },
      },
    },
  )
    .then((workShift) => {
      res.status(200).json(workShift);
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const updateWorkShift = (req: Request, res: Response) => {
  const { work_shift_id } = req.params;
  ShiftModel.update(
    { ...req.body },
    {
      where: {
        id: work_shift_id,
      },
      returning: true,
    },
  )
    .then((workShift) => {
      res.status(200).json(workShift[1]);
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const deleteWorkShift = (req: Request, res: Response) => {
  const { work_shift_id } = req.params;
  ShiftModel.destroy({ where: { id: work_shift_id } })
    .then((deletedRecord) => {
      deletedRecord === 1
        ? res.status(200).json({ message: "OK" })
        : res.status(404).json({ message: "Not found" });
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

export {
  getWorkShifts,
  postWorkShift,
  deleteWorkShift,
  updateWorkShift,
  getAllWorkShifts,
  getWorkShiftsBetweenDates,
  getAllWorkShiftsBetweenDates,
};
