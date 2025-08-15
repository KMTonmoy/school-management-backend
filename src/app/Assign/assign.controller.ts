import { Request, Response } from "express";
import { AssignService } from "./assign.service";
import { AssignStudentsDto } from "./assign.interface";

export const AssignController = {
  async assignStudent(req: Request, res: Response) {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can assign students" });
    }

    const { teacherId, studentId } = req.body;
    const result = await AssignService.assignStudent(
      teacherId,
      studentId,
      req.user.id
    );
    res.status(201).json(result);
  },

  async bulkAssignStudents(req: Request, res: Response) {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can assign students" });
    }

    const data: AssignStudentsDto = req.body;
    const result = await AssignService.bulkAssignStudents(data, req.user.id);
    res.status(result.success ? 200 : 207).json(result);
  },

  async getTeacherStudents(req: Request, res: Response) {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "teacher")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { teacherId } = req.params;

    if (req.user.role === "teacher" && req.user.id !== teacherId) {
      return res
        .status(403)
        .json({ message: "Teachers can only view their own students" });
    }

    const students = await AssignService.getTeacherStudents(teacherId);
    res.status(200).json(students);
  },

  async getStudentTeachers(req: Request, res: Response) {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.role !== "student")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentId } = req.params;

    if (req.user.role === "student" && req.user.id !== studentId) {
      return res
        .status(403)
        .json({ message: "Students can only view their own teachers" });
    }

    const teachers = await AssignService.getStudentTeachers(studentId);
    res.status(200).json(teachers);
  },

  async removeAssignment(req: Request, res: Response) {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can remove assignments" });
    }

    const { assignmentId } = req.params;
    await AssignService.removeAssignment(assignmentId);
    res.status(204).send();
  },
};
