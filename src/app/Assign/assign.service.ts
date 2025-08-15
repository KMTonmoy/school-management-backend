import { AssignmentModel } from "./assign.model";
import { Types } from "mongoose";
import { AssignStudentsDto, BulkAssignResponse } from "./assign.interface";

export const AssignService = {
  async assignStudent(teacherId: string, studentId: string, adminId: string) {
    const assignment = new AssignmentModel({
      teacher: new Types.ObjectId(teacherId),
      student: new Types.ObjectId(studentId),
      assignedBy: new Types.ObjectId(adminId),
    });
    return await assignment.save();
  },

  async bulkAssignStudents(
    data: AssignStudentsDto,
    adminId: string
  ): Promise<BulkAssignResponse> {
    const results: BulkAssignResponse = {
      success: true,
      message: "Bulk assignment completed",
      assignedCount: 0,
      failedAssignments: [],
    };

    for (const studentId of data.studentIds) {
      try {
        await this.assignStudent(data.teacherId, studentId, adminId);
        results.assignedCount++;
      } catch (error) {
        results.failedAssignments.push({
          studentId,
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (results.failedAssignments.length > 0) {
      results.success = false;
      results.message = "Some assignments failed";
    }

    return results;
  },

  async getTeacherStudents(teacherId: string) {
    return await AssignmentModel.find({ teacher: teacherId })
      .populate("student", "name email")
      .exec();
  },

  async getStudentTeachers(studentId: string) {
    return await AssignmentModel.find({ student: studentId })
      .populate("teacher", "name email")
      .exec();
  },

  async removeAssignment(assignmentId: string) {
    return await AssignmentModel.findByIdAndDelete(assignmentId);
  },
};
