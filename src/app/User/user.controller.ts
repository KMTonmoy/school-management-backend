import jwt from "jsonwebtoken";
import {
  UserModel,
  AdminModel,
  TeacherModel,
  StudentModel,
} from "./user.model";
import type { UserDocument } from "./user.model";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
}) {
  const admin = await AdminModel.create({
    ...data,
    role: "admin",
    accessLevel: "full",
  });
  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { user: admin, token, role: admin.role };
}

async function createTeacher(data: {
  name: string;
  email: string;
  password: string;
  subjects: string[];
  qualification: string;
}) {
  const teacher = await TeacherModel.create({ ...data, role: "teacher" });
  const token = jwt.sign(
    { id: teacher._id, email: teacher.email, role: teacher.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { user: teacher, token, role: teacher.role };
}

async function createStudent(data: {
  name: string;
  email: string;
  password: string;
  class: string;
  rollNumber: string;
  guardian: { name: string; relation: string; primaryContact: string };
}) {
  const student = await StudentModel.create({ ...data, role: "student" });
  const token = jwt.sign(
    { id: student._id, email: student.email, role: student.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { user: student, token, role: student.role };
}

async function getAllUsers() {
  return await UserModel.find();
}

async function getUserByEmail(email: string) {
  return await UserModel.findOne({ email });
}

async function loginUser(email: string, password: string) {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await (user as UserDocument).isPasswordMatch(password);
  if (!isMatch) throw new Error("Invalid credentials");
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { token, role: user.role };
}

async function blockUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");
  user.isBlocked = true;
  await user.save();
  return { success: true };
}

async function unblockUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");
  user.isBlocked = false;
  await user.save();
  return { success: true };
}

async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await UserModel.findById(userId).select("+password");
  if (!user) throw new Error("User not found");
  const isMatch = await (user as UserDocument).isPasswordMatch(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");
  user.password = newPassword;
  await user.save();
  return { success: true };
}

async function getTeachers() {
  return await UserModel.find({ role: "teacher" });
}

async function getStudents() {
  return await UserModel.find({ role: "student" });
}

async function getAllStudents() {
  return await StudentModel.find();
}

async function getAllTeachers() {
  return await TeacherModel.find();
}

export const userControllers = {
  createAdmin,
  createTeacher,
  createStudent,
  getAllUsers,
  getUserByEmail,
  loginUser,
  blockUser,
  unblockUser,
  updatePassword,
  getTeachers,
  getStudents,
  getAllStudents,
  getAllTeachers,
};
