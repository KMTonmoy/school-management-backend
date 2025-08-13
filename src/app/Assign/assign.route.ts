import express, { Request, Response, NextFunction } from "express";
import { AssignController } from "./assign.controller";
import jwt from "jsonwebtoken";
import { UserModel } from "../User/user.model";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface JwtPayload {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (roles: ("admin" | "teacher" | "student")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Routes
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
router.delete(
  "/assignment/:assignmentId",
  authenticate,
  authorize(["admin"]),
  AssignController.removeAssignment
);

export const AssignRoutes = router;
