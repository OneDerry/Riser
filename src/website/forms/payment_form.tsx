import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "../../shared/common";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import background from "../../assets/new/main_building.png";
import { formSchema, type FormValues } from "./validations";
import { usePaystackCheckout } from "../../paystack/use_paystack_checkout";
import { useSubmitEnrollmentMutation } from "../../app/features/payments.api";
import { EnrollmentData } from "../../app/services/sheet_db_service";
import { toast } from "sonner";
import { getStates, getLGAsByState } from "../../data/nigeria-states-lgas";
import StudentFeesSection from "./studentFeesSection";
import { RelationshipToChild } from "../../lib/types";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function SchoolPaymentForm() {
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

  const { control, handleSubmit, reset, watch, setValue } = form;
  const [submitEnrollment] = useSubmitEnrollmentMutation();

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

  const feeTypes = [
    { name: "Tuition Fee" },
    { name: "Registration Fee" },
    { name: "Library & Books Fee" },
    { name: "Full Package" },
  ];

  const parentEmail = watch("parentEmail") || "";
  const parentPrefix = watch("parentPrefix");
  const parentFirstName = watch("parentFirstName");
  const parentLastName = watch("parentLastName");
  const students = watch("students") || [];

  const feeTypeSummary = Array.from(
    new Set(
      students
        .flatMap((s) => s.fees || [])
        .map((f) => f.type)
        .filter(Boolean)
    )
  ).join(", ");

  // Calculate total amount from all fees of all students
  const totalAmount = students.reduce((total, student) => {
    const studentFees =
      student.fees?.reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0;
    return total + studentFees;
  }, 0);

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
      parent_name:
        `${parentPrefix} ${parentFirstName} ${parentLastName}`.trim(),
      student_count: students.length,
      fee_type: feeTypeSummary,
      amount: totalAmount,
      students_data: JSON.stringify(
        students.map((s) => ({
          name: `${s.firstName} ${s.middleName ? s.middleName + " " : ""}${
            s.lastName
          }`.trim(),
          grade: s.gradeLevel,
          gender: s.gender,
        }))
      ),
    },
  });

  const calculateTotalFees = (students: FormValues["students"]) => {
    return students.reduce((total, student) => {
      const studentFees =
        student.fees?.reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0;
      return total + studentFees;
    }, 0);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!PAYSTACK_PUBLIC_KEY) {
      setErrorMessage("Paystack public key is missing.");
      setIsSubmitting(false);
      return;
    }

    // Calculate total amount from all fees of all students
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

    const amountInKobo = Math.round(totalAmount * 100); // Convert to kobo for Paystack

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
                    <FormField
                      name="parentPrefix"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Prefix</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                              <option value="">Select prefix</option>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                              <option value="Ms">Ms</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="parentFirstName"
                      control={control}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel required>First Name</FormLabel>
                          <FormControl>
                            <Input
                              className="col-span-2"
                              placeholder="Enter first name"
                              aria-required="true"
                              aria-invalid={
                                !!form.formState.errors.parentFirstName
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="parentLastName"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            aria-required="true"
                            aria-invalid={
                              !!form.formState.errors.parentLastName
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="parentEmail"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            aria-required="true"
                            aria-invalid={!!form.formState.errors.parentEmail}
                            inputMode="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="parentPhone"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
                            aria-required="true"
                            aria-invalid={!!form.formState.errors.parentPhone}
                            inputMode="tel"
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="relationship_to_child"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Relationship to Child</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            aria-required="true"
                            aria-invalid={
                              !!form.formState.errors.relationship_to_child
                            }
                          >
                            <option value="">Select relationship</option>
                            {RelationshipToChild.map((relationship) => (
                              <option
                                key={relationship.name}
                                value={relationship.name}
                              >
                                {relationship.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="state_of_origin"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>State of Origin</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            aria-required="true"
                            aria-invalid={
                              !!form.formState.errors.state_of_origin
                            }
                          >
                            <option value="">Select state</option>
                            {states.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="lga"
                    control={control}
                    render={({ field }) => {
                      const selectedState = watch("state_of_origin");

                      return (
                        <FormItem>
                          <FormLabel required>LGA</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              aria-required="true"
                              aria-invalid={!!form.formState.errors.lga}
                              disabled={!selectedState}
                            >
                              <option value="">
                                {!selectedState
                                  ? "Select state first"
                                  : "Select LGA"}
                              </option>
                              {lgas.map((lga) => (
                                <option key={lga} value={lga}>
                                  {lga}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <FormField
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="mt-4">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your home address"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.address}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  <div key={student.id} className="mb-8 rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Student {index + 1}</h4>
                      {studentFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveStudent(index)}
                          aria-label={`Remove student ${index + 1}`}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={control}
                        name={`students.${index}.firstName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                aria-required="true"
                                aria-invalid={
                                  !!form.formState.errors.students?.[index]
                                    ?.firstName
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                aria-required="true"
                                aria-invalid={
                                  !!form.formState.errors.students?.[index]
                                    ?.lastName
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.middleName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter middle name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.dob`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Date of Birth</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  readOnly
                                  value={
                                    field.value ? format(field.value, "PP") : ""
                                  }
                                  onClick={() =>
                                    setShowCalendar(`${index}-dob`)
                                  }
                                  placeholder="Select date"
                                  className="cursor-pointer"
                                />

                                {showCalendar === `${index}-dob` && (
                                  <div className="absolute z-10 mt-1">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={(val) => {
                                        field.onChange(val);
                                        setShowCalendar("");
                                      }}
                                      className="rounded-md border p-4 w-60 sm:w-72 bg-white shadow-sm"
                                      captionLayout="dropdown"
                                    />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`students.${index}.studentState`}
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State of Origin</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              >
                                <option value="">Select state</option>
                                {states.map((state) => (
                                  <option key={state} value={state}>
                                    {state}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`students.${index}.studentLga`}
                        control={control}
                        render={({ field }) => {
                          const selectedStudentState = watch(
                            `students.${index}.studentState`
                          );
                          const studentLgas = selectedStudentState
                            ? getLGAsByState(selectedStudentState)
                            : [];

                          return (
                            <FormItem>
                              <FormLabel>LGA</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                  disabled={!selectedStudentState}
                                >
                                  <option value="">
                                    {!selectedStudentState
                                      ? "Select state first"
                                      : "Select LGA"}
                                  </option>
                                  {studentLgas.map((lga) => (
                                    <option key={lga} value={lga}>
                                      {lga}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Gender</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.gradeLevel`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Grade Level</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                value={field.value || ""}
                                className="w-full rounded-md border px-3 py-2 text-sm"
                              >
                                <option value="">Select grade</option>
                                {[
                                  "Kindergarten",
                                  "Nursery 1",
                                  "Nursery 2",
                                  "Nursery 3",
                                  "Primary 1",
                                  "Primary 2",
                                  "Primary 3",
                                  "Primary 4",
                                  "Primary 5",
                                  "Primary 6",
                                  "JSS1",
                                  "JSS2",
                                  "JSS3",
                                  "SS1",
                                  "SS2",
                                  "SS3",
                                ].map((g) => (
                                  <option key={g} value={g}>
                                    {g}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.studentType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Student Type</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                aria-required="true"
                              >
                                <option value="">Select student type</option>
                                <option value="returning">
                                  Returning Student
                                </option>
                                <option value="new">New Student</option>
                                <option value="transfer">
                                  Transfer Student
                                </option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watch(`students.${index}.studentType`) !==
                        "returning" && (
                        <>
                          <FormField
                            control={control}
                            name={`students.${index}.previousSchool`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Previous School Attended</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter previous school name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`students.${index}.transferReason`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason for Transfer</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Please provide reason for transfer"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={control}
                          name={`students.${index}.studentAddress`}
                          render={({ field }) => {
                            const sameAsParent = watch(
                              `students.${index}.sameAsParent`
                            );
                            const parentAddress = watch("address");

                            return (
                              <FormItem className="col-span-2">
                                <FormLabel>Student Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter student's home address"
                                    value={
                                      sameAsParent
                                        ? parentAddress
                                        : field.value || ""
                                    }
                                    onChange={field.onChange}
                                    disabled={sameAsParent}
                                    className={
                                      sameAsParent ? "bg-gray-100" : ""
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={control}
                          name={`students.${index}.sameAsParent`}
                          render={({ field }) => (
                            <FormItem className="flex mt-4 items-center space-x-3 space-y-0 rounded-md p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Same as Parent Address</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={control}
                        name={`students.${index}.allergies`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="List any known allergies"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.medicalConditions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Conditions (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="List any medical conditions"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.emergencyContactName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter emergency contact name (if different from parent)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`students.${index}.emergencyContactPhone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="Enter emergency contact phone (if different from parent)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
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
                  <FormField
                    name="academicYear"
                    control={control}
                    render={({ field }) => {
                      // Generate academic years (current year to current year + 5)
                      const currentYear = new Date().getFullYear();
                      const academicYears = Array.from(
                        { length: 5 },
                        (_, i) => {
                          const startYear = currentYear + i;
                          return `${startYear}-${startYear + 1}`;
                        }
                      );

                      return (
                        <FormItem>
                          <FormLabel required>Academic Year</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border px-3 py-2 text-sm"
                            >
                              <option value="">Select year</option>
                              {academicYears.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    name="term"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Term</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                          >
                            <option value="">Select term</option>
                            {["First term", "Second term", "Third Term"].map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              )
                            )}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {studentFields.map((student, studentIndex) => (
                <div key={student.id} className="mb-8 rounded-lg border p-4">
                  {/* ... other student fields ... */}

                  <h4 className="mb-2 font-medium">
                    Fees for {students?.[studentIndex]?.firstName || "Student"}
                  </h4>
                  <StudentFeesSection
                    studentIndex={studentIndex}
                    control={control}
                    feeTypes={feeTypes}
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
                <FormField
                  name="additionalInfo"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional information..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
