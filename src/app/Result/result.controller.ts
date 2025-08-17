import { Request, Response } from "express";
import { ResultService } from "./result.service";

export const ResultController = {
  async createResult(req: Request, res: Response) {
    if (!req.user)
      return res.status(403).json({ error: "Authentication required" });
    const result = await ResultService.createResult({
      teacherId: req.user.id,
      ...req.body,
    });
    res.status(201).json(result);
  },

  async getStudentResults(req: Request, res: Response) {
    const results = await ResultService.getStudentResults(req.params.studentId);
    res.json(results);
  },

  async getTeacherResults(req: Request, res: Response) {
    if (!req.user)
      return res.status(403).json({ error: "Authentication required" });
    const results = await ResultService.getTeacherResults(req.user.id);
    res.json(results);
  },

  async updateResult(req: Request, res: Response) {
    if (!req.user)
      return res.status(403).json({ error: "Authentication required" });
    const result = await ResultService.updateResult(
      req.params.id,
      req.user.id,
      req.body.marks
    );
    if (!result) return res.status(404).json({ error: "Result not found" });
    res.json(result);
  },

  async deleteResult(req: Request, res: Response) {
    if (!req.user)
      return res.status(403).json({ error: "Authentication required" });
    const result = await ResultService.deleteResult(req.params.id, req.user.id);
    if (!result) return res.status(404).json({ error: "Result not found" });
    res.status(204).send();
  },

  async adminCreateResult(req: Request, res: Response) {
    const result = await ResultService.adminCreateResult(req.body);
    res.status(201).json(result);
  },

  async adminUpdateResult(req: Request, res: Response) {
    const result = await ResultService.adminUpdateResult(
      req.params.id,
      req.body.marks
    );
    if (!result) return res.status(404).json({ error: "Result not found" });
    res.json(result);
  },

  async adminDeleteResult(req: Request, res: Response) {
    const result = await ResultService.adminDeleteResult(req.params.id);
    if (!result) return res.status(404).json({ error: "Result not found" });
    res.status(204).send();
  },

  async getAllResults(req: Request, res: Response) {
    const results = await ResultService.getAllResults();
    res.json(results);
  },
};
