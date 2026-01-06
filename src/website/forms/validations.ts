import { z } from "zod";

const studentSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  dob: z.date({ required_error: "Please select a date of birth" }),
  gender: z.string({ required_error: "Please select a gender" }),
  gradeLevel: z.string({ required_error: "Please select a grade level" }),
});

// Define grade levels as a constant to ensure type safety
export const GRADE_LEVELS = [
  { value: "nursery", label: "Nursery" },
  { value: "pre-kg", label: "Pre-KG" },
  { value: "kg1", label: "KG 1" },
  { value: "kg2", label: "KG 2" },
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
  { value: "grade4", label: "Grade 4" },
  { value: "grade5", label: "Grade 5" },
  { value: "grade6", label: "Grade 6" },
] as const;

export const formSchema = z.object({
  // Parent Information
  parentFirstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  parentLastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  parentEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  parentPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),

  // Students Information
  students: z
    .array(studentSchema)
    .min(1, { message: "At least one student is required" }),
  dob: z.date({ required_error: "Please select a date of birth" }),
  gender: z.string({ required_error: "Please select a gender" }),
  grade_level: z.string({ required_error: "Please select a grade level" }),

  // Enrollment Information
  academicYear: z.string({ required_error: "Please select an academic year" }),
  term: z.string({ required_error: "Please select a term" }),

  // Payment Information
  feeType: z.string({ required_error: "Please select a fee type" }),
  amount: z
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .min(1, { message: "Amount must be greater than 0" }),

  // Additional Information
  additionalInfo: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
