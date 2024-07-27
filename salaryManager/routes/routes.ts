import express from "express";

import {
  getWorkShifts,
  deleteWorkShift,
  postWorkShift,
  updateWorkShift,
  getAllWorkShifts,
  getWorkShiftsBetweenDates,
  getAllWorkShiftsBetweenDates,
} from "../controllers/workShiftsController";
import {
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  getUser,
} from "../controllers/userController";

import {
  checkDuplicateUsername,
  isAdmin,
  signin,
  signup,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

router.get("/users/me", verifyToken, getUser);
router.get("/employee", verifyToken, getEmployees);
router.get("/employee/:employee_id", verifyToken, isAdmin, getEmployeeById);
router.delete("/employee/:employee_id", verifyToken, isAdmin, deleteEmployee);
router.patch("/employee/:employee_id", verifyToken, isAdmin, updateEmployee);
router.get("/work_shifts/:employee_id", verifyToken, isAdmin, getWorkShifts);
router.get("/work_shifts", verifyToken, getAllWorkShifts);
router.post(
  "/work_shifts/:employee_id/dates",
  verifyToken,
  isAdmin,
  getWorkShiftsBetweenDates,
);
router.post(
  "/work_shifts/dates",
  verifyToken,
  isAdmin,
  getAllWorkShiftsBetweenDates,
);
router.post("/work_shifts", verifyToken, postWorkShift);
router.delete(
  "/work_shifts/:work_shift_id",
  verifyToken,
  isAdmin,
  deleteWorkShift,
);

router.patch(
  "/work_shifts/:work_shift_id",
  verifyToken,
  isAdmin,
  updateWorkShift,
);

router.post("/login", signin);
router.post("/registration", checkDuplicateUsername, signup);

export default router;
