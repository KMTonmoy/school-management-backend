import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUserBase extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(password: string): Promise<boolean>;
}

interface IAdmin extends IUserBase {
  accessLevel: "full" | "limited";
}

interface ITeacher extends IUserBase {
  subjects: string[];
  qualification: string;
  joiningDate: Date;
}

interface IStudent extends IUserBase {
  class: string;
  rollNumber: string;
  guardian: {
    name: string;
    relation: string;
    primaryContact: string;
    secondaryContact?: string;
  };
  address?: string;
}

type UserDocument = IAdmin | ITeacher | IStudent;

const guardianSchema = new Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  primaryContact: { type: String, required: true },
  secondaryContact: { type: String },
});

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre<IUserBase>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

const AdminModel = UserModel.discriminator<IAdmin>(
  "admin",
  new Schema({
    accessLevel: { type: String, enum: ["full", "limited"], default: "full" },
  })
);

const TeacherModel = UserModel.discriminator<ITeacher>(
  "teacher",
  new Schema({
    subjects: { type: [String], required: true },
    qualification: { type: String, required: true },
    joiningDate: { type: Date, default: Date.now },
  })
);

const StudentModel = UserModel.discriminator<IStudent>(
  "student",
  new Schema({
    class: { type: String, required: true },
    rollNumber: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    address: { type: String },
  })
);

export { UserModel, AdminModel, TeacherModel, StudentModel };
export type { IAdmin, ITeacher, IStudent, UserDocument };
