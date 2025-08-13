import { Document, Types } from "mongoose";

export interface IResult extends Document {
  student: Types.ObjectId;
  teacher: Types.ObjectId;
  subject: string;
  marks: number;
  date: Date;
}

export interface CreateResultDto {
  studentId: string;
  subject: string;
  marks: number;
}