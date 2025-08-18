import express from "express";
import { ResultController } from "./result.controller";
import { adminOnly, auth, teacherOnly } from "./auth.middleware";

const router = express.Router();

router.post("/add-result", auth, teacherOnly, ResultController.createResult);
router.get("/student/:studentId", auth, ResultController.getStudentResults);
router.get("/teacher", auth, teacherOnly, ResultController.getTeacherResults);
router.patch("/results/:id", auth, teacherOnly, ResultController.updateResult);
router.delete("/results/:id", auth, teacherOnly, ResultController.deleteResult);

router.post("/admin", auth, adminOnly, ResultController.adminCreateResult);
router.patch("/admin/:id", auth, adminOnly, ResultController.adminUpdateResult);
router.delete(
  "/admin/:id",
  auth,
  adminOnly,
  ResultController.adminDeleteResult
);
router.get("/all-results", ResultController.getAllResults);
router.get(
  "/teacher/all-results",
  auth,
  teacherOnly,
  ResultController.getTeacherAllResults
);
export const resultRouter = router;
