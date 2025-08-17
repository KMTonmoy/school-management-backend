import { Request, Response } from "express";
import * as UserService from "./user.service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const handleError = (error: unknown, res: Response, statusCode = 500) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  res.status(statusCode).json({ error: errorMessage });
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const admin = await UserService.createAdmin(name, email, password);
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user: admin, token, role: admin.role });
  } catch (error) {
    handleError(error, res);
  }
};

export const registerTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email, password, subjects, qualification } = req.body;
    const teacher = await UserService.createTeacher(name, email, password, subjects, qualification);
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email, role: teacher.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user: teacher, token, role: teacher.role });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTeacher = await UserService.updateTeacher(id, req.body);
    res.status(200).json(updatedTeacher);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserService.deleteTeacher(id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, class: classId, rollNumber, guardian } = req.body;
    const student = await UserService.createStudent(name, email, password, classId, rollNumber, guardian);
    const token = jwt.sign(
      { id: student._id, email: student.email, role: student.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user: student, token, role: student.role });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedStudent = await UserService.updateStudent(id, req.body);
    res.status(200).json(updatedStudent);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserService.deleteStudent(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res, 401);
  }
};

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await UserService.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await UserService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    handleError(error, res);
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await UserService.getTeacherById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    handleError(error, res);
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await UserService.getStudentById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    handleError(error, res);
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.blockUser(id);
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.unblockUser(id);
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
  }
};