import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, Form } from "../../shared/common";

import { zodResolver } from "@hookform/resolvers/zod";

import background from "../../assets/new/main_building.png";
import { formSchema, type FormValues } from "./validations";
import { usePaystackCheckout } from "../../paystack/use_paystack_checkout";
import { useSubmitEnrollmentMutation } from "../../app/features/payments.api";
import { EnrollmentData } from "../../app/services/sheet_db_service";
import { toast } from "sonner";
import { getStates, getLGAsByState } from "../../data/nigeria-states-lgas";
import StudentFeesSection from "./studentFeesSection";
import { RelationshipToChild } from "../../lib/types";

// Import new optimized components
import { FormInput, FormSelect, FormTextarea } from "./components/FormFields";
import StudentFormSection from "./components/StudentFormSection";
import { useFormCalculations } from "./hooks/useFormCalculations";
import {
  PREFIX_OPTIONS,
  TERM_OPTIONS,
  FEE_TYPES,
  generateAcademicYears,
} from "./constants/formOptions";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function SchoolPaymentFormSimplified() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formattedAmounts, setFormattedAmounts] = useState<
    Record<string, string>
  >({});

  const riser = {
    email: "riserschool@gmail.com",
  };

  const defaultValues: FormValues = {
    parentPrefix: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    relationship_to_child: "",
    address: "",
    state_of_origin: "",
    lga: "",
    students: [
      {
        firstName: "",
        middleName: "",
        lastName: "",
        dob: new Date(),
        gender: "",
        gradeLevel: "",
        studentType: "",
        studentState: "",
        studentLga: "",
        studentAddress: "",
        sameAsParent: false,
        previousSchool: "",
        transferReason: "",
        allergies: "",
        medicalConditions: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        fees: [{ type: "", amount: 0 }],
      },
    ],
    academicYear: "",
    term: "",
    additionalInfo: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    fields: studentFields,
    append: appendStudent,
    remove: removeStudent,
  } = useFieldArray({
    control: form.control,
    name: "students",
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const [submitEnrollment] = useSubmitEnrollmentMutation();

  // Use custom hook for calculations
  const {
    totalAmount,
    feeTypeSummary,
    calculateTotalFees,
    getParentName,
    getStudentsMetadata,
    parentEmail,
    students,
  } = useFormCalculations(control);

  // Use static Nigeria states data
  const states = getStates();
  const [lgas, setLgas] = useState<string[]>([]);

  // Watch state of origin to fetch LGAs when it changes
  const selectedState = watch("state_of_origin");

  useEffect(() => {
    if (selectedState) {
      setValue("lga", "");
      setLgas(getLGAsByState(selectedState));
    } else {
      setValue("lga", "");
      setLgas([]);
    }
  }, [selectedState, setValue]);

  const {
    reference: paystackReference,
    initializePayment: launchPaystack,
    regenerateReference,
    isReady: isPaystackReady,
  } = usePaystackCheckout({
    email: parentEmail,
    publicKey: PAYSTACK_PUBLIC_KEY,
    amount: totalAmount,
    metadata: {
      parent_name: getParentName(),
      student_count: students.length,
      fee_type: feeTypeSummary,
      amount: totalAmount,
      students_data: getStudentsMetadata(),
    },
  });

  const addStudent = () => {
    appendStudent({
      firstName: "",
      middleName: "",
      lastName: "",
      dob: new Date(),
      gender: "",
      gradeLevel: "",
      studentType: "",
      studentState: "",
      studentLga: "",
      studentAddress: "",
      sameAsParent: false,
      previousSchool: "",
      transferReason: "",
      allergies: "",
      medicalConditions: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      fees: [{ type: "", amount: 0 }],
    });
  };

  const onInvalid = () => {
    setErrorMessage("Please correct the highlighted fields and try again.");
  };

  const handleRemoveStudent = (index: number) => {
    if (studentFields.length > 1) {
      removeStudent(index);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!PAYSTACK_PUBLIC_KEY) {
      setErrorMessage("Paystack public key is missing.");
      setIsSubmitting(false);
      return;
    }

    const totalAmount = calculateTotalFees(data.students);

    if (totalAmount <= 0) {
      setErrorMessage("Please add at least one fee with a valid amount.");
      setIsSubmitting(false);
      return;
    }

    if (!data.parentEmail || !data.parentFirstName || !data.parentLastName) {
      setErrorMessage("Please fill in all required parent information.");
      setIsSubmitting(false);
      return;
    }

    const amountInKobo = Math.round(totalAmount * 100);

    if (!isPaystackReady) {
      setErrorMessage("Payment initialization failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Prepare students data with their fees
    const studentsData = data.students.map((student) => ({
      firstName: student.firstName,
      middleName: student.middleName || "",
      lastName: student.lastName,
      dob: student.dob ? new Date(student.dob).toISOString() : "",
      gender: student.gender,
      gradeLevel: student.gradeLevel,
      studentType: student.studentType,
      studentState: student.studentState || "",
      studentLga: student.studentLga || "",
      studentAddress: student.sameAsParent
        ? data.address
        : student.studentAddress || "",
      sameAsParent: student.sameAsParent || false,
      previousSchool: student.previousSchool || "",
      transferReason: student.transferReason || "",
      allergies: student.allergies || "",
      medicalConditions: student.medicalConditions || "",
      emergencyContactName: student.emergencyContactName || "",
      emergencyContactPhone: student.emergencyContactPhone || "",
      fees: student.fees || [],
    }));

    // Simplified data structure with JSON for students/fees
    const enrollmentData: EnrollmentData = {
      parentPrefix: data.parentPrefix,
      parentFirstName: data.parentFirstName,
      parentLastName: data.parentLastName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      relationship_to_child: data.relationship_to_child,
      address: data.address,
      State: data.state_of_origin,
      Lga: data.lga,
      academicYear: data.academicYear,
      term: data.term,
      feeType: Array.from(
        new Set(
          data.students
            .flatMap((s) => s.fees || [])
            .map((f) => f.type)
            .filter(Boolean)
        )
      ).join(", "),
      amount: totalAmount,
      amountInKobo,
      paymentMethod: "paystack",
      additionalInfo: data.additionalInfo || "",
      students: studentsData,
      fees: studentsData.flatMap((student) =>
        student.fees.map((fee) => ({
          type: fee.type,
          amount: fee.amount,
          studentName: `${student.firstName} ${
            student.middleName ? student.middleName + " " : ""
          }${student.lastName}`.trim(),
        }))
      ),
    };

    const pendingReference = paystackReference;
    const callbackFailSafe = setTimeout(() => {
      setIsSubmitting(false);
    }, 60000);

    launchPaystack({
      onSuccess: async (response) => {
        clearTimeout(callbackFailSafe);
        const finalReference = response.reference || pendingReference;

        try {
          const apiResult = await submitEnrollment({
            ...enrollmentData,
            paymentReference: finalReference,
            paymentStatus: "completed",
          }).unwrap();
          if (apiResult) {
            toast.success("Successful!");
          }
          setPaymentReference(finalReference);
          setIsSuccess(true);
          reset();
          regenerateReference();
        } catch (err) {
          setErrorMessage(
            "Payment succeeded, but saving enrollment failed. Contact support."
          );
          console.error("Error saving to SheetDB:", err);
        } finally {
          setIsSubmitting(false);
        }
      },
      onClose: () => {
        clearTimeout(callbackFailSafe);
        setIsSubmitting(false);
        setErrorMessage("Payment cancelled. Please try again.");
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6">
        <div
          className="sm:max-w-xl rounded-lg border border-green-200 bg-green-50 p-6"
          role="alert"
          aria-live="polite"
        >
          <h3 className="text-lg font-semibold text-green-800">
            Payment Successful!
          </h3>
          <p className="mt-2 text-green-700">
            Thank you! Your payment and enrollment have been successfully
            submitted.
          </p>

          {paymentReference && (
            <p className="mt-2 text-sm text-green-600">
              Reference: <strong>{paymentReference}</strong>
            </p>
          )}
        </div>
        <div className="flex items-center mt-6 justify-between">
          <Button
            onClick={() => {
              setIsSuccess(false);
              setPaymentReference(null);
              setErrorMessage(null);
            }}
            aria-label="Make another payment"
          >
            Make Another Payment
          </Button>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setPaymentReference(null);
              setErrorMessage(null);
            }}
            aria-label="Back to Riser"
          >
            Back to Riser
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="relative min-h-screen bg-cover bg-center bg-no-repeat px-6 py-12"
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-10 text-white">
        <Button
          onClick={() => navigate("/")}
          variant="link"
          className="font-bold text-white fixed mt-5 flex items-center gap-2 hover:scale-105 hover:text-blue-500"
          aria-label="Go back to home page"
        >
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
      </div>

      <div className="relative z-10 mx-auto mt-14 w-full p-2 rounded-lg bg-slate-50 shadow-lg sm:w-[90%]">
        <div className="border-b bg-slate-50 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            School Fee Payment & Enrollment
          </h1>
          <p id="form-description" className="mt-1 text-gray-600">
            Complete this form to enroll your child and pay school fees
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            aria-labelledby="form-title"
            aria-describedby="form-description"
          >
            {/* error */}
            {errorMessage && (
              <div
                className="mx-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                role="alert"
                aria-live="assertive"
              >
                {errorMessage}
              </div>
            )}

            <div className="space-y-8 p-6">
              {/* Parent Info */}
              <section>
                <div className="mb-4">
                  <h2 id="parent-info-heading" className="text-lg font-bold">
                    Parent/Guardian Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Please provide your parent/guardian details.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormSelect
                      control={control}
                      name="parentPrefix"
                      label="Prefix"
                      options={PREFIX_OPTIONS}
                      required
                    />

                    <FormInput
                      control={control}
                      name="parentFirstName"
                      label="First Name"
                      placeholder="Enter first name"
                      required
                      className="col-span-2"
                    />
                  </div>

                  <FormInput
                    control={control}
                    name="parentLastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                  />

                  <FormInput
                    control={control}
                    name="parentEmail"
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    required
                    inputMode="email"
                    autoComplete="email"
                  />

                  <FormInput
                    control={control}
                    name="parentPhone"
                    label="Phone"
                    type="tel"
                    placeholder="Enter phone number"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                  />

                  <FormSelect
                    control={control}
                    name="relationship_to_child"
                    label="Relationship to Child"
                    options={RelationshipToChild.map((rel) => ({
                      value: rel.name,
                      label: rel.name,
                    }))}
                    required
                  />

                  <FormSelect
                    control={control}
                    name="state_of_origin"
                    label="State of Origin"
                    options={states.map((state) => ({
                      value: state,
                      label: state,
                    }))}
                    required
                  />

                  <FormSelect
                    control={control}
                    name="lga"
                    label="LGA"
                    options={lgas.map((lga) => ({ value: lga, label: lga }))}
                    required
                    disabled={!selectedState}
                    placeholder={
                      !selectedState ? "Select state first" : "Select LGA"
                    }
                  />
                </div>

                <FormTextarea
                  control={control}
                  name="address"
                  label="Address"
                  placeholder="Enter your home address"
                  required
                />
              </section>

              <hr className="border-gray-200" />

              {/* Student Info */}
              <section>
                <div className="mb-4 sm:flex items-center justify-between">
                  <div>
                    <h2 id="student-info-heading" className="text-lg font-bold">
                      Student Information
                    </h2>
                    <p className="text-sm text-gray-600">
                      Please provide your child's details, you can add multiple
                      students if you have more than one child.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addStudent}
                    aria-label="Add another student"
                    className="bg-blue-800 text-white mt-4 sm:mt-0"
                  >
                    + Add Another Student
                  </Button>
                </div>

                {studentFields.map((student, index) => (
                  <StudentFormSection
                    key={student.id}
                    control={control}
                    index={index}
                    onRemove={handleRemoveStudent}
                    canRemove={studentFields.length > 1}
                    showCalendar={showCalendar}
                    setShowCalendar={setShowCalendar}
                  />
                ))}
              </section>

              <hr className="border-gray-200" />

              {/* Enrollment */}
              <section>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Enrollment Information</h3>
                  <p className="text-sm text-gray-600">
                    Please provide the details of the student(s) you are
                    enrolling.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormSelect
                    control={control}
                    name="academicYear"
                    label="Academic Year"
                    options={generateAcademicYears()}
                    required
                  />

                  <FormSelect
                    control={control}
                    name="term"
                    label="Term"
                    options={TERM_OPTIONS}
                    required
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {studentFields.map((student, studentIndex) => (
                <div key={student.id} className="mb-8 rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">
                    Fees for {students?.[studentIndex]?.firstName || "Student"}
                  </h4>
                  <StudentFeesSection
                    studentIndex={studentIndex}
                    control={control}
                    feeTypes={FEE_TYPES}
                    formattedAmounts={formattedAmounts}
                    setFormattedAmounts={setFormattedAmounts}
                  />
                </div>
              ))}

              <hr className="border-gray-200" />

              {/* Additional Info */}
              <section>
                <div className="mb-4">
                  <h3 className="text-lg font-medium">
                    Additional Information
                  </h3>
                  <p>Any other information the school should be aware of</p>
                </div>
                <FormTextarea
                  control={control}
                  name="additionalInfo"
                  label="Additional Information"
                  placeholder="Enter any additional information..."
                />
              </section>
            </div>

            {/* Total Amount Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mx-6 my-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Summary
              </h3>
              <div className="space-y-2">
                {students.map((student, index) => {
                  const studentTotal =
                    student.fees?.reduce(
                      (sum, fee) => sum + (fee.amount || 0),
                      0
                    ) || 0;
                  const studentName =
                    `${student.firstName || ""} ${
                      student.middleName ? student.middleName + " " : ""
                    }${student.lastName || ""}`.trim() ||
                    `Student ${index + 1}`;

                  return (
                    <div
                      key={student.firstName || index}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span className="text-gray-600">{studentName}</span>
                      <span className="font-medium text-gray-800">
                        ₦{studentTotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gray-300">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {feeTypeSummary && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fee Types:</span>{" "}
                    {feeTypeSummary}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-6 my-6 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Need help with payment? Contact our support team at{" "}
                    <a
                      href={`mailto:${riser.email}?subject=Payment%20Inquiry`}
                      className="font-medium text-blue-800 underline hover:text-blue-600 transition-colors"
                    >
                      {riser.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between border-t bg-slate-50 p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setShowCalendar(null);
                  setErrorMessage(null);
                }}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-800 text-white hover:bg-blue-600"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
