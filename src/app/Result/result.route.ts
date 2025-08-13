import express from "express";
import { ResultController } from "./result.controller";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Simplified interface directly in the router file
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "admin" | "teacher" | "student";
      };
    }
  }
}

const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: "admin" | "teacher" | "student";
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

const teacherOnly = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.user?.role !== "teacher")
    return res.status(403).json({ error: "Teacher access required" });
  next();
};

router.post("/add-result", auth, teacherOnly, ResultController.createResult);
router.get("/student/:studentId", auth, ResultController.getStudentResults);
router.get("/teacher", auth, teacherOnly, ResultController.getTeacherResults);
router.patch("/:id", auth, teacherOnly, ResultController.updateResult);

export const resultRouter = router;