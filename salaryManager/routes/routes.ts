import express from 'express';

import {
  getWorkShifts,
  deleteWorkShift,
  postWorkShift,
  updateWorkShift,
  getAllWorkShifts,
} from '../controllers/workShiftsController';
import {
  updateEmployee,
  deleteEmployee,
  createEmployee,
  getEmployees,
} from '../controllers/employeeController';

import {
  checkDuplicateUsername,
  signin,
  signup,
  verifyToken,
} from '../controllers/userController';

const router = express.Router();

router.get('/employee', getEmployees);
router.get('/work_shifts/:employee_id', getWorkShifts);
router.get('/work_shifts', getAllWorkShifts);

router.post('/employee', verifyToken, createEmployee);
router.post('/work_shifts', postWorkShift);

router.delete('/employee/:employee_id', verifyToken, deleteEmployee);
router.delete('/work_shifts/:work_shift_id', verifyToken, deleteWorkShift);

router.patch('/employee/:employee_id', verifyToken, updateEmployee);
router.patch('/work_shifts/:work_shift_id', verifyToken, updateWorkShift);

router.post('/login', signin);
router.post('/registration', checkDuplicateUsername, signup);

export default router;
