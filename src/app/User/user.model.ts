import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(password: string): Promise<boolean>;
}

interface ITeacher extends IUser {
  subjects: string[];
  qualification: string;
}

interface IStudent extends IUser {
  class: string;
  rollNumber: string;
  guardian: {
    name: string;
    relation: string;
    primaryContact: string;
    secondaryContact?: string;
  };
}

type UserDocument = IUser | ITeacher | IStudent;

const guardianSchema = new Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  primaryContact: { type: String, required: true },
  secondaryContact: { type: String },
});

const userSchema: Schema<UserDocument> = new Schema(
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
    subjects: {
      type: [String],
      required: function () {
        return this.role === "teacher";
      },
    },
    qualification: {
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
    class: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    rollNumber: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    guardian: {
      type: guardianSchema,
      required: function () {
        return this.role === "student";
      },
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

userSchema.pre<UserDocument>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

const AdminModel = UserModel.discriminator("admin", new Schema({}));
const TeacherModel = UserModel.discriminator(
  "teacher",
  new Schema({
    subjects: { type: [String], required: true },
    qualification: { type: String, required: true },
  })
);
const StudentModel = UserModel.discriminator(
  "student",
  new Schema({
    class: { type: String, required: true },
    rollNumber: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
  })
);

export { UserModel, AdminModel, TeacherModel, StudentModel };
