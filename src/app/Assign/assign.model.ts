import { Schema, model, Types } from "mongoose";

interface IAssignment {
  teacher: Types.ObjectId;
  student: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedAt: { type: Date, default: Date.now },
});

assignmentSchema.index({ teacher: 1, student: 1 }, { unique: true });

export const AssignmentModel = model<IAssignment>(
  "Assignment",
  assignmentSchema
);
