import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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

import background from "../../assets/school_building.jpg";
import { formSchema, type FormValues } from "./validations";
import { usePaystackCheckout } from "../../paystack/use_paystack_checkout";
import { useSubmitEnrollmentMutation } from "../../app/features/payments.api";
import { EnrollmentData } from "../../app/services/sheet_db_service";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function SchoolPaymentForm() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      studentFirstName: "",
      studentLastName: "",
      studentDob: undefined,
      studentGender: "",
      gradeLevel: "",
      academicYear: "",
      term: "",
      feeType: "",
      additionalInfo: "",
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const [submitEnrollment] = useSubmitEnrollmentMutation();

  const feeTypes = [
    { name: "Tuition Fee", amount: 5000 },
    { name: "Registration Fee", amount: 500 },
    { name: "Technology Fee", amount: 300 },
    { name: "Library Fee", amount: 200 },
    { name: "Activity Fee", amount: 250 },
    { name: "Full Package", amount: 6000 },
  ];

  const feeType = watch("feeType");
  const selectedFee = feeTypes.find((fee) => fee.name === feeType);
  const paymentAmount = selectedFee?.amount || 0;

  const parentEmail = watch("parentEmail") || "";
  const parentFirstName = watch("parentFirstName");
  const parentLastName = watch("parentLastName");
  const studentFirstName = watch("studentFirstName");
  const studentLastName = watch("studentLastName");

  const {
    reference: paystackReference,
    initializePayment: launchPaystack,
    regenerateReference,
    isReady: isPaystackReady,
  } = usePaystackCheckout({
    email: parentEmail,
    amount: paymentAmount,
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      parent_name: `${parentFirstName} ${parentLastName}`.trim(),
      student_name: `${studentFirstName} ${studentLastName}`.trim(),
      fee_type: feeType,
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

    if (!isPaystackReady) {
      setErrorMessage("Please provide email and select fee type.");
      setIsSubmitting(false);
      return;
    }

    const enrollmentData: EnrollmentData = {
      parentFirstName: data.parentFirstName,
      parentLastName: data.parentLastName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      studentFirstName: data.studentFirstName,
      studentLastName: data.studentLastName,
      studentDob: data.studentDob.toISOString(),
      studentGender: data.studentGender,
      gradeLevel: data.gradeLevel,
      academicYear: data.academicYear,
      term: data.term,
      feeType: data.feeType,
      amount: paymentAmount,
      paymentMethod: "paystack",
      additionalInfo: data.additionalInfo || "",
    };

    const pendingReference = paystackReference;

    launchPaystack({
      onSuccess: async (response) => {
        const finalReference = response.reference || pendingReference;

        try {
          await submitEnrollment({
            ...enrollmentData,
            paymentReference: finalReference,
            paymentStatus: "completed",
          }).unwrap();

          setPaymentReference(finalReference);
          setIsSuccess(true);
          reset();
          regenerateReference();
        } catch {
          setErrorMessage(
            "Payment succeeded, but saving enrollment failed. Contact support."
          );
        } finally {
          setIsSubmitting(false);
        }
      },

      onClose: () => {
        setIsSubmitting(false);
        setErrorMessage("Payment cancelled. Please try again.");
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6">
        <div className="max-w-xl rounded-lg border border-green-200 bg-green-50 p-6">
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
        >
          Make Another Payment
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="min-h-screen bg-cover bg-center bg-no-repeat px-6 py-12"
    >
      <Link
        to="/enroll"
        className="flex items-center gap-2 font-bold transition hover:-translate-x-2"
      >
        <ArrowLeft /> Back to Enroll
      </Link>

      <div className="mx-auto mt-6 w-[90%] rounded-lg bg-white shadow-lg sm:w-[60%]">
        <div className="border-b bg-slate-50 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            School Fee Payment & Enrollment
          </h2>
          <p className="mt-1 text-gray-600">
            Complete this form to enroll your child and pay school fees
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* error */}
            {errorMessage && (
              <div className="mx-6 mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <div className="space-y-8 p-6">
              {/* Parent Info */}
              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Parent/Guardian Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
                    name="parentFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="parentLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
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
                <h3 className="mb-4 text-lg font-medium">
                  Student Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
                    name="studentFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="studentLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* DOB */}
                  <FormField
                    control={control}
                    name="studentDob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              readOnly
                              value={
                                field.value ? format(field.value, "PP") : ""
                              }
                              onClick={() => setShowCalendar(!showCalendar)}
                              placeholder="Select date"
                              className="cursor-pointer"
                            />

                            {showCalendar && (
                              <div className="absolute z-10 mt-1">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(val) => {
                                    field.onChange(val);
                                    setShowCalendar(false);
                                  }}
                                  className="rounded-md border shadow-sm"
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
                    name="studentGender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
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
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Enrollment */}
              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Enrollment Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
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
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                          >
                            <option value="">Select year</option>
                            {["2025-2026", "2026-2027"].map((y) => (
                              <option key={y} value={y}>
                                {y}
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
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Term <small className="text-background">*</small>
                        </FormLabel>
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

                {selectedFee && (
                  <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Selected Fee:</strong> {selectedFee.name}
                    </p>
                    <p className="mt-1 text-lg font-bold text-blue-900">
                      ₦{selectedFee.amount.toLocaleString()}
                    </p>
                  </div>
                )}

                <FormField
                  control={control}
                  name="feeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Type *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border px-3 py-2 text-sm"
                        >
                          <option value="">Select fee type</option>
                          {feeTypes.map((fee) => (
                            <option key={fee.name} value={fee.name}>
                              {fee.name} - ₦{fee.amount.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <hr className="border-gray-200" />

              {/* Additional Info */}
              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Additional Information
                </h3>
                <FormField
                  control={control}
                  name="additionalInfo"
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
                  setShowCalendar(false);
                  setErrorMessage(null);
                }}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Pay with Paystack"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
