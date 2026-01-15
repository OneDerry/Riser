import { Control, useWatch } from "react-hook-form";
import { FormValues } from "../validations";

export function useFormCalculations(control: Control<FormValues>) {
  const students = useWatch({ control, name: "students" }) || [];
  const parentEmail = useWatch({ control, name: "parentEmail" }) || "";
  const parentPrefix = useWatch({ control, name: "parentPrefix" });
  const parentFirstName = useWatch({ control, name: "parentFirstName" });
  const parentLastName = useWatch({ control, name: "parentLastName" });

  // Calculate total amount from all fees of all students
  const totalAmount = students.reduce(
    (total: number, student: FormValues["students"][0]) => {
      const studentFees =
        student.fees?.reduce(
          (sum: number, fee: { amount?: number }) => sum + (fee.amount || 0),
          0
        ) || 0;
      return total + studentFees;
    },
    0
  );

  // Get unique fee types
  const feeTypeSummary = Array.from(
    new Set(
      students
        .flatMap((s: FormValues["students"][0]) => s.fees || [])
        .map((f: { type?: string }) => f.type)
        .filter(Boolean)
    )
  ).join(", ");

  // Calculate total fees for a given set of students
  const calculateTotalFees = (studentsData: FormValues["students"]) => {
    return studentsData.reduce((total, student) => {
      const studentFees =
        student.fees?.reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0;
      return total + studentFees;
    }, 0);
  };

  // Get parent name
  const getParentName = () => {
    return `${parentPrefix} ${parentFirstName} ${parentLastName}`.trim();
  };

  // Get students data for metadata
  const getStudentsMetadata = () => {
    return JSON.stringify(
      students.map((s: FormValues["students"][0]) => ({
        name: `${s.firstName} ${s.middleName ? s.middleName + " " : ""}${
          s.lastName
        }`.trim(),
        grade: s.gradeLevel,
        gender: s.gender,
      }))
    );
  };

  return {
    totalAmount,
    feeTypeSummary,
    calculateTotalFees,
    getParentName,
    getStudentsMetadata,
    parentEmail,
    students,
  };
}
