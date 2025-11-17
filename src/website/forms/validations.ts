import { z } from "zod";

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

  // Student Information
  studentFirstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  studentLastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  studentDob: z.date({ required_error: "Please select a date of birth" }),
  studentGender: z.string({ required_error: "Please select a gender" }),

  // Enrollment Information
  gradeLevel: z.string({ required_error: "Please select a grade level" }),
  academicYear: z.string({ required_error: "Please select an academic year" }),
  term: z.string({ required_error: "Please select a term" }),

  // Payment Information
  feeType: z.string({ required_error: "Please select a fee type" }),
  paymentMethod: z.string({ required_error: "Please select a payment method" }),

  // Credit Card Information (conditionally required)
  cardholderName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),

  // Additional Information
  additionalInfo: z.string().optional(),
});

// Infer the TypeScript type from the schema
export type FormValues = z.infer<typeof formSchema>;
