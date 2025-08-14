export type BaseUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Admin Interface
export type Admin = BaseUser & {
  role: "admin";
  accessLevel: "full" | "limited";
};

// Teacher Interface
export type Teacher = BaseUser & {
  role: "teacher";
  subjects: string[];
  joiningDate: Date;
  qualification: string;
};

// Student Interface
export type Student = BaseUser & {
  role: "student";
  class: string;
  rollNumber: string;
  guardian: {
    name: string;
    relation: string;
    primaryContact: string;
    secondaryContact?: string;
  };
  address?: string;
};

export type User = Admin | Teacher | Student;
