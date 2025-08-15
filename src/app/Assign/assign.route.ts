import express from "express";
import { AssignController } from "./assign.controller";
import { authenticate, authorize } from "./auth.middleware";

const router = express.Router();

router.get("/assign/assignments", AssignController.getAssignments);

router.post(
  "/assign",

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

  AssignController.removeAssignment
);

export const AssignRoutes = router;
