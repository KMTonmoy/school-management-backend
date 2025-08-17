import {
  AdminModel,
  TeacherModel,
  StudentModel,
  UserModel,
} from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const SALT_ROUNDS = 10;

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

export const loginUser = async (email: string, password: string) => {
  const admin = await AdminModel.findOne({ email }).select("+password").exec();
  const teacher = await TeacherModel.findOne({ email })
    .select("+password")
    .exec();
  const student = await StudentModel.findOne({ email })
    .select("+password")
    .exec();

  const user = (admin || teacher || student) as IUser | null;
  if (!user) throw new Error("User not found");

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id, user.role);
  return { token, role: user.role, userId: user._id.toString() };
};

export const createAdmin = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await hashPassword(password);
  return await AdminModel.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    accessLevel: "full",
  });
};

export const createTeacher = async (
  name: string,
  email: string,
  password: string,
  subjects: string[],
  qualification: string
) => {
  const hashedPassword = await hashPassword(password);
  return await TeacherModel.create({
    name,
    email,
    password: hashedPassword,
    role: "teacher",
    subjects,
    qualification,
  });
};

export const updateTeacher = async (
  id: string,
  updateData: {
    name?: string;
    subjects?: string[];
    qualification?: string;
  }
) => {
  return await TeacherModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteTeacher = async (id: string) => {
  return await TeacherModel.findByIdAndDelete(id);
};

export const createStudent = async (
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
  return await StudentModel.create({
    name,
    email,
    password: hashedPassword,
    role: "student",
    class: classId,
    rollNumber,
    guardian,
  });
};

export const updateStudent = async (
  id: string,
  updateData: {
    name?: string;
    class?: string;
    rollNumber?: string;
    guardian?: {
      name?: string;
      relation?: string;
      primaryContact?: string;
      secondaryContact?: string;
    };
  }
) => {
  return await StudentModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteStudent = async (id: string) => {
  return await StudentModel.findByIdAndDelete(id);
};

export const getAllTeachers = async () => {
  return await TeacherModel.find();
};

export const getAllStudents = async () => {
  return await StudentModel.find();
};

export const getTeacherById = async (id: string) => {
  return await TeacherModel.findById(id);
};

export const getStudentById = async (id: string) => {
  return await StudentModel.findById(id);
};

export const blockUser = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found");
  user.isBlocked = true;
  await user.save();
  return user;
};

export const unblockUser = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found");
  user.isBlocked = false;
  await user.save();
  return user;
};
