import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "./user.model";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
}) {
  const admin = await UserModel.create({ ...data, role: "admin" });
  return admin;
}

async function createTeacher(data: {
  name: string;
  email: string;
  password: string;
  subjects: string[];
}) {
  const teacher = await UserModel.create({ ...data, role: "teacher" });
  return teacher;
}

async function createStudent(data: {
  name: string;
  email: string;
  password: string;
  guardian: { name: string; contact: string };
}) {
  const student = await UserModel.create({ ...data, role: "student" });
  return student;
}

async function getAllUsers(role?: "admin" | "teacher" | "student") {
  const filter = role ? { role } : {};
  return await UserModel.find(filter);
}

async function loginUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
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
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { success: true };
}

async function getTeachers() {
  return await UserModel.find({ role: "teacher" });
}

async function getStudents() {
  return await UserModel.find({ role: "student" });
}

export const userControllers = {
  createAdmin,
  createTeacher,
  createStudent,
  getAllUsers,
  loginUser,
  blockUser,
  unblockUser,
  updatePassword,
  getTeachers,
  getStudents,
};
