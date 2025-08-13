import { Schema, model } from 'mongoose';
import { IAssignment } from './assign.interface';

const assignmentSchema = new Schema<IAssignment>({
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  assignedAt: { type: Date, default: Date.now }
});

assignmentSchema.index({ teacher: 1, student: 1 }, { unique: true });

export const AssignmentModel = model<IAssignment>('Assignment', assignmentSchema);