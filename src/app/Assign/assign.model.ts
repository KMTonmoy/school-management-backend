import { Schema, model, Types } from "mongoose";

const assignmentSchema = new Schema({
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedAt: { type: Date, default: Date.now },
});

assignmentSchema.index({ teacher: 1, student: 1 }, { unique: true });

export const AssignmentModel = model("Assignment", assignmentSchema);