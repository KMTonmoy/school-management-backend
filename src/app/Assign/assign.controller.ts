import { Request, Response } from "express";
import { AssignService } from "./assign.service";
import { AssignStudentsDto } from "./assign.interface";

export const AssignController = {
  async assignStudent(req: Request, res: Response) {
    try {
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
    } catch (error) {
      res
        .status(500)
        .json({
          message: error instanceof Error ? error.message : "Assignment failed",
        });
    }
  },

  async bulkAssignStudents(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admins can assign students" });
      }

      const data: AssignStudentsDto = req.body;
      const result = await AssignService.bulkAssignStudents(data, req.user.id);
      res.status(result.success ? 200 : 207).json(result);
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error instanceof Error ? error.message : "Bulk assignment failed",
        });
    }
  },

  async getTeacherStudents(req: Request, res: Response) {
    try {
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
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error instanceof Error ? error.message : "Failed to fetch students",
        });
    }
  },

  async removeAssignment(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admins can remove assignments" });
      }

      const { assignmentId } = req.params;
      await AssignService.removeAssignment(assignmentId);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error instanceof Error
              ? error.message
              : "Failed to remove assignment",
        });
    }
  },
};
