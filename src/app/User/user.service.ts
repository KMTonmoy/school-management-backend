import { AdminModel, TeacherModel, StudentModel } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const SALT_ROUNDS = 10;

// Define base user interface with all common properties
interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?(password: string): Promise<boolean>;
}

interface AuthResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    token: string;
    role: "admin" | "teacher" | "student";
    userId: string;
  };
}

// Utility functions
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePasswords = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

const generateToken = (
  userId: Types.ObjectId,
  role: "admin" | "teacher" | "student"
): string => {
  return jwt.sign({ userId: userId.toString(), role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Authentication Service
const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Check in all user collections with proper typing
  const admin = await AdminModel.findOne({ email }).select("+password").exec();
  const teacher = await TeacherModel.findOne({ email })
    .select("+password")
    .exec();
  const student = await StudentModel.findOne({ email })
    .select("+password")
    .exec();

  const user = (admin || teacher || student) as IUser | null;

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id, user.role);

  return {
    success: true,
    message: "Login successful",
    statusCode: 200,
    data: {
      token,
      role: user.role,
      userId: user._id.toString(),
    },
  };
};

// Admin Services
const createAdmin = async (name: string, email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  const admin = new AdminModel({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    isBlocked: false,
  });
  return await admin.save();
};

// Teacher Services
const createTeacher = async (
  name: string,
  email: string,
  password: string,
  subjects: string[],
  qualification: string
) => {
  const hashedPassword = await hashPassword(password);
  const teacher = new TeacherModel({
    name,
    email,
    password: hashedPassword,
    role: "teacher",
    subjects,
    qualification,
    isBlocked: false,
  });
  return await teacher.save();
};

// Student Services
const createStudent = async (
  name: string,
  email: string,
  password: string,
  classId: string,
  rollNumber: string,
  guardian: {
    name: string;
    relation: string;
    primaryContact: string;
    secondaryContact?: string;
  }
) => {
  const hashedPassword = await hashPassword(password);
  const student = new StudentModel({
    name,
    email,
    password: hashedPassword,
    role: "student",
    class: classId,
    rollNumber,
    guardian,
    isBlocked: false,
  });
  return await student.save();
};

// Data Retrieval Services
const getAllAdmins = async () => {
  return await AdminModel.find().exec();
};

const getAllTeachers = async () => {
  return await TeacherModel.find().exec();
};

const getAllStudents = async () => {
  return await StudentModel.find().exec();
};

const getAllUsers = async () => {
  return await AdminModel.find()
    .exec()
    .then((admins) =>
      TeacherModel.find()
        .exec()
        .then((teachers) =>
          StudentModel.find()
            .exec()
            .then((students) => [...admins, ...teachers, ...students])
        )
    );
};

const getUserByEmail = async (email: string) => {
  const admin = await AdminModel.findOne({ email }).exec();
  const teacher = await TeacherModel.findOne({ email }).exec();
  const student = await StudentModel.findOne({ email }).exec();
  return admin || teacher || student;
};

export const UserServices = {
  createAdmin,
  createTeacher,
  createStudent,
  loginUser,
  getAllAdmins,
  getAllTeachers,
  getAllStudents,
  hashPassword,
  comparePasswords,
  generateToken,
  getAllUsers,
  getUserByEmail,
};
