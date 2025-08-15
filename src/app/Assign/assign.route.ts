import express from "express";
import { AssignController } from "./assign.controller";
import { authenticate, authorize } from "./auth.middleware";

const router = express.Router();

router.post(
  "/assign",
  authenticate,
  authorize(["admin"]),
  AssignController.assignStudent
);
router.post(
  "/assign/bulk",
  authenticate,
  authorize(["admin"]),
  AssignController.bulkAssignStudents
);
router.get(
  "/teacher/:teacherId/students",
  authenticate,
  authorize(["admin", "teacher"]),
  AssignController.getTeacherStudents
);
router.get(
  "/student/:studentId/teachers",
  authenticate,
  authorize(["admin", "student"]),
  AssignController.getStudentTeachers
);
router.delete(
  "/assignment/:assignmentId",
  authenticate,
  authorize(["admin"]),
  AssignController.removeAssignment
);

export const AssignRoutes = router;
