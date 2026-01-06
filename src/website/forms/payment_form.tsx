import { useState } from "react";
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
import { formatCurrency, parseCurrency } from "../../lib/helpers";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function SchoolPaymentForm() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formattedAmount, setFormattedAmount] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      students: [
        {
          firstName: "",
          lastName: "",
          dob: new Date(),
          gender: "",
          gradeLevel: "",
        },
      ],
      academicYear: "",
      term: "",
      feeType: "",
      amount: 0,
      additionalInfo: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "students",
  });

  const addStudent = () => {
    append({
      firstName: "",
      lastName: "",
      dob: new Date(),
      gender: "",
      gradeLevel: "",
    });
  };

  const removeStudent = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const { control, handleSubmit, reset, watch } = form;
  const [submitEnrollment] = useSubmitEnrollmentMutation();

  const feeTypes = [
    { name: "Tuition Fee" },
    { name: "Registration Fee" },
    { name: "Library & Books Fee" },
    { name: "Full Package" },
  ];

  const feeType = watch("feeType");
  const amount = Number(watch("amount") || 0);
  // const selectedFee = feeTypes.find((fee) => fee.name === feeType);

  const parentEmail = watch("parentEmail") || "";
  const parentFirstName = watch("parentFirstName");
  const parentLastName = watch("parentLastName");
  const students = watch("students") || [];

  const amountInKobo = Math.round(amount * 100); // Convert to kobo for Paystack

  const {
    reference: paystackReference,
    initializePayment: launchPaystack,
    regenerateReference,
    isReady: isPaystackReady,
  } = usePaystackCheckout({
    email: parentEmail,
    publicKey: PAYSTACK_PUBLIC_KEY,
    amount: amountInKobo,
    metadata: {
      parent_name: `${parentFirstName} ${parentLastName}`.trim(),
      student_count: students.length,
      fee_type: feeType,
      amount: amount,
      students_data: JSON.stringify(
        students.map((s) => ({
          name: `${s.firstName} ${s.lastName}`.trim(),
          grade: s.gradeLevel,
          gender: s.gender,
        }))
      ),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!PAYSTACK_PUBLIC_KEY) {
      setErrorMessage("Paystack public key is missing.");
      setIsSubmitting(false);
      return;
    }

    if (!parentEmail || !amount || amount <= 0) {
      setErrorMessage("Please provide a valid email and amount.");
      setIsSubmitting(false);
      return;
    }

    if (!isPaystackReady) {
      setErrorMessage("Payment initialization failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const enrollmentData: EnrollmentData = {
      parentFirstName: data.parentFirstName,
      parentLastName: data.parentLastName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      studentFirstName: students[0]?.firstName || "",
      studentLastName: students[0]?.lastName || "",
      studentDob: students[0]?.dob
        ? new Date(students[0].dob).toISOString()
        : "",
      studentGender: students[0]?.gender || "",
      gradeLevel: students[0]?.gradeLevel || "",
      academicYear: data.academicYear,
      term: data.term,
      feeType: data.feeType,
      amount: amountInKobo,
      paymentMethod: "paystack",
      additionalInfo: data.additionalInfo || "",
    };

    const pendingReference = paystackReference;

    const callbackFailSafe = setTimeout(() => {
      setIsSubmitting(false);
    }, 60000); // 60 seconds

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
        <Button
          className="mt-6"
          onClick={() => {
            setIsSuccess(false);
            setPaymentReference(null);
            setErrorMessage(null);
          }}
          aria-label="Make another payment"
        >
          Make Another Payment
        </Button>
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
            onSubmit={handleSubmit(onSubmit)}
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
                  <FormField
                    name="parentFirstName"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>First Name</FormLabel>
                        <FormControl>
                          <Input
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
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Student Info */}
              <section>
                <div className="mb-4 flex items-center justify-between">
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
                  >
                    + Add Another Student
                  </Button>
                </div>

                {fields.map((student, index) => (
                  <div key={student.id} className="mb-8 rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Student {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => removeStudent(index)}
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
                                      className="rounded-md border bg-white shadow-sm"
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

              {/* Fee */}
              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Payment Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="feeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Fee Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select fee type</option>
                            {feeTypes.map((fee) => (
                              <option key={fee.name} value={fee.name}>
                                {fee.name}
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₦)</FormLabel>
                        <FormControl>
                          {/* <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter amount"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          /> */}

                          <Input
                            type="text"
                            placeholder="Enter amount (e.g., N1,000)"
                            value={formattedAmount}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              setFormattedAmount(inputValue);
                              const numericValue = parseCurrency(inputValue);
                              field.onChange(numericValue);
                            }}
                            onBlur={() => {
                              const numericValue =
                                parseCurrency(formattedAmount);
                              if (numericValue > 0) {
                                const formatted = formatCurrency(numericValue);
                                setFormattedAmount(formatted);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Additional Info */}
              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Additional Information
                </h3>
                <FormField
                  name="additionalInfo"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any special information?</FormLabel>
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

            <div className="flex justify-between border-t bg-slate-50 p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setShowCalendar(null);
                  setErrorMessage(null);
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                aria-live="polite"
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
