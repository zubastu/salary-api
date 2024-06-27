import type { Request, Response } from 'express';
import EmployeeModel from '../models/employeeModel';
import shiftModel from '../models/shiftModel';

const getEmployees = (_: Request, res: Response) => {
  EmployeeModel.findAll({
    include: {
      model: shiftModel,
    },
  })
    .then((employees) => {
      res.status(200).json(employees);
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

const getEmployeeById = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  EmployeeModel.findOne({
    where: { id: employee_id },
    include: {
      model: shiftModel,
    },
  })
    .then((employee) => {
      res.status(200).json(employee);
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

const createEmployee = (req: Request, res: Response) => {
  EmployeeModel.create({ ...req.body })
    .then((employee) => {
      EmployeeModel.findOne({
        where: {
          id: employee.id,
        },
      })
        .then((employee) => {
          res.status(200).json(employee);
        })
        .catch(() => {
          res.status(400).json({ message: 'Bad request' });
        });
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

const updateEmployee = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  EmployeeModel.update(
    { ...req.body },
    {
      where: {
        id: employee_id,
      },
      returning: true,
    },
  )
    .then((employee) => {
      res.status(200).json(employee[1]);
    })
    .catch(() => {
      res.status(400).json({ message: 'Bad request' });
    });
};

const deleteEmployee = (req: Request, res: Response) => {
  const { employee_id } = req.params;
  EmployeeModel.destroy({ where: { id: employee_id } })
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
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
};
