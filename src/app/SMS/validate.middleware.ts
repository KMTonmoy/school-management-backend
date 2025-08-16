import { Request, Response, NextFunction } from "express";

type ValidationRule = {
  type: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  enum?: string[];
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
};

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule;
};

export function validate<T extends Record<string, any>>(
  schema: ValidationSchema<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string[]> = {};
    const data = req.body;

    (Object.entries(schema) as [keyof T, ValidationRule][]).forEach(
      ([field, rule]) => {
        const value = data[field as string];
        const fieldErrors: string[] = [];

        if (
          rule.required &&
          (value === undefined || value === null || value === "")
        ) {
          fieldErrors.push("is required");
          errors[field as string] = fieldErrors;
          return;
        }

        if (value === undefined || value === null || value === "") {
          return;
        }

        if (typeof value !== rule.type) {
          fieldErrors.push(`must be a ${rule.type}`);
        }

        if (rule.enum && !rule.enum.includes(value)) {
          fieldErrors.push(`must be one of: ${rule.enum.join(", ")}`);
        }

        if (typeof value === "string") {
          if (rule.minLength && value.length < rule.minLength) {
            fieldErrors.push(`must be at least ${rule.minLength} characters`);
          }
          if (rule.maxLength && value.length > rule.maxLength) {
            fieldErrors.push(`must be at most ${rule.maxLength} characters`);
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            fieldErrors.push("has invalid format");
          }
        }

        if (typeof value === "number") {
          if (rule.min && value < rule.min) {
            fieldErrors.push(`must be at least ${rule.min}`);
          }
          if (rule.max && value > rule.max) {
            fieldErrors.push(`must be at most ${rule.max}`);
          }
        }

        if (fieldErrors.length > 0) {
          errors[field as string] = fieldErrors;
        }
      }
    );

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
}
