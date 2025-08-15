import { Document, Types } from "mongoose";

export interface IAssignment extends Document {
  teacher: Types.ObjectId;
  student: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
}

export interface AssignStudentsDto {
  teacherId: string;
  studentIds: string[];
}

export interface BulkAssignResponse {
  success: boolean;
  message: string;
  assignedCount: number;
  failedAssignments: {
    studentId: string;
    reason: string;
  }[];
}
