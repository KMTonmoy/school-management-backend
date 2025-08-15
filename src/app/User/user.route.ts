import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/auth/register/admin", async (req, res, next) => {
  try {
    const result = await userControllers.createAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/register/teacher", async (req, res, next) => {
  try {
    const result = await userControllers.createTeacher(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/register/student", async (req, res, next) => {
  try {
    const result = await userControllers.createStudent(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const result = await userControllers.loginUser(
      req.body.email,
      req.body.password
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await userControllers.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/users/:email", async (req, res, next) => {
  try {
    const user = await userControllers.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/teachers", async (req, res, next) => {
  try {
    const teachers = await userControllers.getAllTeachers();
    res.status(200).json(teachers);
  } catch (err) {
    next(err);
  }
});

router.get("/students", async (req, res, next) => {
  try {
    const students = await userControllers.getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

router.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

export const UserRoutes = router;
