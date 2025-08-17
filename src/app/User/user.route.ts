import express from "express";
import {
  registerAdmin,
  registerTeacher,
  registerStudent,
  loginUser,
  getAllTeachers,
  getAllStudents,
  getTeacherById,
  getStudentById,
  updateTeacherById,
  updateStudentById,
  deleteTeacherById,
  deleteStudentById,
  blockUser,
  unblockUser,
} from "./user.controller";

const router = express.Router();

router.post("/auth/register/admin", registerAdmin);
router.post("/auth/register/teacher", registerTeacher);
router.post("/auth/register/student", registerStudent);
router.post("/auth/login", loginUser);

router.get("/teachers", getAllTeachers);
router.get("/teachers/:id", getTeacherById);
router.put("/teachers/:id", updateTeacherById);
router.delete("/teachers/:id", deleteTeacherById);

router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudentById);
router.delete("/students/:id", deleteStudentById);

router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);

export const UserRoutes = router;