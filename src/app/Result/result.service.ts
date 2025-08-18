import { Types } from "mongoose";
import { BulkResultDto, AdminCreateResultDto } from "./result.interface";
import { ResultModel } from "./result.model";
import { AssignmentModel } from "../Assign/assign.model";

export const ResultService = {
  async createResult(data: BulkResultDto) {
    if (data.teacherId !== "admin") {
      const isAssigned = await AssignmentModel.exists({
        teacher: new Types.ObjectId(data.teacherId),
        student: new Types.ObjectId(data.studentId),
      });
      if (!isAssigned) throw new Error("Not assigned to this student");
    }

    return await new ResultModel({
      student: data.studentId,
      teacher: data.teacherId,
      subject: data.subject,
      marks: data.marks,
    }).save();
  },

  async getStudentResults(studentId: string) {
    return await ResultModel.find({ student: studentId })
      .populate("teacher", "name email")
      .populate("student", "name email");
  },

  async getTeacherResults(teacherId: string) {
    if (teacherId === "admin")
      return await ResultModel.find().populate("student", "name email");

    const assignments = await AssignmentModel.find({ teacher: teacherId });
    const studentIds = assignments.map((a) => a.student);

    return await ResultModel.find({
      teacher: teacherId,
      student: { $in: studentIds },
    }).populate("student", "name email");
  },

  async updateResult(resultId: string, teacherId: string, marks: number) {
    const result = await ResultModel.findById(resultId);
    if (!result) throw new Error("Result not found");

    if (teacherId !== "admin") {
      const isAssigned = await AssignmentModel.exists({
        teacher: teacherId,
        student: result.student,
      });
      if (!isAssigned) throw new Error("Not assigned to this student");
    }

    return await ResultModel.findByIdAndUpdate(
      resultId,
      { marks },
      { new: true }
    ).populate("student", "name email");
  },

  async deleteResult(resultId: string, teacherId: string) {
    const result = await ResultModel.findById(resultId);
    if (!result) throw new Error("Result not found");

    if (teacherId !== "admin") {
      const isAssigned = await AssignmentModel.exists({
        teacher: teacherId,
        student: result.student,
      });
      if (!isAssigned) throw new Error("Not assigned to this student");
    }

    return await ResultModel.findByIdAndDelete(resultId);
  },

  async adminCreateResult(data: AdminCreateResultDto) {
    if (data.teacherId && data.teacherId !== "admin") {
      await AssignmentModel.findOneAndUpdate(
        {
          student: data.studentId,
          teacher: data.teacherId,
        },
        {
          student: data.studentId,
          teacher: data.teacherId,
        },
        { upsert: true, new: true }
      );
    }

    const result = await new ResultModel({
      student: data.studentId,
      teacher: data.teacherId || "admin",
      subject: data.subject,
      marks: data.marks,
    }).save();

    return result.populate("student teacher", "name email");
  },

  async adminUpdateResult(resultId: string, data: any) {
    if (data.teacherId) {
      await AssignmentModel.findOneAndUpdate(
        {
          student: data.studentId,
        },
        {
          teacher: data.teacherId,
          student: data.studentId,
        },
        { upsert: true }
      );
    }

    return await ResultModel.findByIdAndUpdate(
      resultId,
      { ...data },
      { new: true }
    ).populate("student", "name email");
  },

  async adminDeleteResult(resultId: string) {
    return await ResultModel.findByIdAndDelete(resultId);
  },

  async getAllResults() {
    return await ResultModel.find()
      .populate("student", "name email")
      .populate("teacher", "name email");
  },

  async getTeacherAllResults(teacherId: string) {
    const assignments = await AssignmentModel.find({ teacher: teacherId });
    const studentIds = assignments.map((a) => a.student);

    return await ResultModel.find({ student: { $in: studentIds } })
      .populate("student", "name email")
      .populate("teacher", "name email");
  },
};
