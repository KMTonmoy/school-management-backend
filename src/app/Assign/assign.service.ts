import { AssignmentModel } from "./assign.model";
import { Types } from "mongoose";

interface FailedAssignment {
  studentId: string;
  reason: string;
}

interface BulkAssignResult {
  success: boolean;
  message: string;
  assignedCount: number;
  failedAssignments: FailedAssignment[];
}

export const AssignService = {
  async getAllAssignments() {
    return AssignmentModel.find()
      .populate("teacher", "name email")
      .populate("student", "name email")
      .populate("assignedBy", "name email");
  },

  async assignStudent(teacherId: string, studentId: string, adminId: string) {
    return new AssignmentModel({
      teacher: new Types.ObjectId(teacherId),
      student: new Types.ObjectId(studentId),
      assignedBy: new Types.ObjectId(adminId),
    }).save();
  },

  async bulkAssignStudents(
    data: { teacherId: string; studentIds: string[] },
    adminId: string
  ): Promise<BulkAssignResult> {
    const results: BulkAssignResult = {
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
    return AssignmentModel.find({ teacher: teacherId }).populate(
      "student",
      "name email"
    );
  },

  async getStudentTeachers(studentId: string) {
    return AssignmentModel.find({ student: studentId }).populate(
      "teacher",
      "name email"
    );
  },

  async removeAssignment(assignmentId: string) {
    return AssignmentModel.findByIdAndDelete(assignmentId);
  },
};
