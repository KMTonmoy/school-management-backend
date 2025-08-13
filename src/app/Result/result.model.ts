import { model, Schema } from "mongoose";
import { IResult } from "./result.interface";

const resultSchema = new Schema<IResult>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  date: { type: Date, default: Date.now }
});

export const ResultModel = model<IResult>("Result", resultSchema);