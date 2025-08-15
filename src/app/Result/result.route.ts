import express from "express";
import { ResultController } from "./result.controller";
import { auth, teacherOnly } from "./auth.middleware";

const router = express.Router();

router.post("/add-result", auth, teacherOnly, ResultController.createResult);
router.get("/student/:studentId", auth, ResultController.getStudentResults);
router.get("/teacher", auth, teacherOnly, ResultController.getTeacherResults);
router.patch("/results/:id", auth, teacherOnly, ResultController.updateResult);
router.delete("/results/:id", auth, teacherOnly, ResultController.deleteResult);

export const resultRouter = router;