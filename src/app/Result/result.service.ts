import { Types } from "mongoose";
import { CreateResultDto } from "./result.interface";
import { ResultModel } from "./result.model";
import { AssignmentModel } from "../Assign/assign.model";

export const ResultService = {
  async createResult(data: { teacherId: string } & CreateResultDto) {
    const isAssigned = await AssignmentModel.exists({
      teacher: new Types.ObjectId(data.teacherId),
      student: new Types.ObjectId(data.studentId),
    });

    if (!isAssigned) throw new Error("Not assigned to this student");

    const result = new ResultModel({
      student: new Types.ObjectId(data.studentId),
      teacher: new Types.ObjectId(data.teacherId),
      subject: data.subject,
      marks: data.marks,
    });

    return await result.save();
  },

  async getStudentResults(studentId: string) {
    return await ResultModel.find({ student: new Types.ObjectId(studentId) })
      .populate("teacher", "name email")
      .exec();
  },

  async getTeacherResults(teacherId: string) {
    return await ResultModel.find({ teacher: new Types.ObjectId(teacherId) })
      .populate("student", "name email")
      .exec();
  },

  async updateResult(resultId: string, teacherId: string, marks: number) {
    return await ResultModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(resultId),
        teacher: new Types.ObjectId(teacherId),
      },
      { marks },
      { new: true }
    ).populate("student", "name email");
  },
};
