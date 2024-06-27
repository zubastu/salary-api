import type { Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import ShiftModel from '../models/shiftModel';
import employeeModel from '../models/employeeModel';

const getWorkShifts = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  ShiftModel.findAll({
    where: {
      employee_id,
    },
    include: {
      model: employeeModel,
    },
    order: [[Sequelize.col('createdAt'), 'DESC']],
  })
    .then((workShifts) => {
      res.status(200).json(workShifts);
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

const getAllWorkShifts = (_: Request, res: Response) => {
  ShiftModel.findAll({
    include: {
      model: employeeModel,
    },
    order: [[Sequelize.col('createdAt'), 'DESC']],
  })
    .then((workShifts) => {
      res.status(200).json(workShifts);
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

const postWorkShift = (req: Request, res: Response) => {
  ShiftModel.create(
    { ...req.body },
    {
      returning: true,
      include: {
        model: employeeModel,
      },
    },
  )
    .then((workShift) => {
      res.status(200).json(workShift);
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
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
      res.status(400).json({ message: 'Bad request' });
    });
};

const deleteWorkShift = (req: Request, res: Response) => {
  const { work_shift_id } = req.params;
  ShiftModel.destroy({ where: { id: work_shift_id } })
    .then((deletedRecord) => {
      deletedRecord === 1
        ? res.status(200).json({ message: 'OK' })
        : res.status(404).json({ message: 'Not found' });
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

export {
  getWorkShifts,
  postWorkShift,
  deleteWorkShift,
  updateWorkShift,
  getAllWorkShifts,
};
