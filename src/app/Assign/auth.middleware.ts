import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../User/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface JwtPayload {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
}

export const authenticate = async (
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

export const authorize = (roles: ("admin" | "teacher" | "student")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.some((role) => req.user?.role === role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
