import { Request, Response } from "express";
import { ResultService } from "./result.service";
import { CreateResultDto } from "./result.interface";

export const ResultController = {
  async createResult(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const result = await ResultService.createResult({
        teacherId: req.user.id,
        ...req.body
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create result" });
    }
  },

  async getStudentResults(req: Request, res: Response) {
    try {
      const results = await ResultService.getStudentResults(req.params.studentId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get results" });
    }
  },

  async getTeacherResults(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const results = await ResultService.getTeacherResults(req.user.id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get results" });
    }
  },

  async updateResult(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const result = await ResultService.updateResult(
        req.params.id,
        req.user.id,
        req.body.marks
      );
      if (!result) {
        return res.status(404).json({ error: "Result not found or not authorized" });
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update result" });
    }
  }
};