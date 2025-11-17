import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "../ui/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import background from "../assets/schoolbuilding.jpg";
import { Textarea } from "../app/userint/textarea";
import { formSchema, type FormValues } from "../app/components/validations";
import { generatePaymentReference } from "../app/services/paystackService";
import { usePaystackCheckout } from "../paystack/usePaystackCheckout";
import { useSubmitEnrollmentMutation } from "../app/features/paymentsapi";
import { EnrollmentData } from "../app/services/sheetDBService";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function SchoolPaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [lastPaymentMethod, setLastPaymentMethod] = useState<string | null>(
    null
  );
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

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
      semester: "",
      feeType: "",
      paymentMethod: "",
      additionalInfo: "",
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    } as Partial<FormValues>,
  });

  const { control, handleSubmit, reset, watch } = form;
  const [submitEnrollment] = useSubmitEnrollmentMutation();

  const feeType = watch("feeType");
  const paymentMethod = watch("paymentMethod");
  const parentFirstName = watch("parentFirstName");
  const parentLastName = watch("parentLastName");
  const parentEmail = watch("parentEmail");
  const studentFirstName = watch("studentFirstName");
  const studentLastName = watch("studentLastName");

  const feeTypes = [
    { name: "Tuition Fee", amount: 5000 },
    { name: "Registration Fee", amount: 500 },
    { name: "Technology Fee", amount: 300 },
    { name: "Library Fee", amount: 200 },
    { name: "Activity Fee", amount: 250 },
    { name: "Full Package", amount: 6000 },
  ];

  const selectedFee = feeTypes.find((fee) => fee.name === feeType);
  const paymentAmount = selectedFee?.amount || 0;

  const gradeLevels = [
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const academicYears = ["2023-2024", "2024-2025", "2025-2026"];
  const semesters = ["First Semester", "Second Semester", "Summer Term"];

  const {
    reference: paystackReference,
    initializePayment: launchPaystack,
    regenerateReference,
    isReady: isPaystackReady,
  } = usePaystackCheckout({
    email: parentEmail,
    amount: paymentAmount,
    metadata: {
      parent_name: `${parentFirstName} ${parentLastName}`.trim(),
      student_name: `${studentFirstName} ${studentLastName}`.trim(),
      fee_type: feeType,
    },
    publicKey: PAYSTACK_PUBLIC_KEY,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

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
      semester: data.semester,
      feeType: data.feeType,
      paymentMethod: data.paymentMethod,
      amount: paymentAmount,
      additionalInfo: data.additionalInfo || "",
    };

    if (data.paymentMethod === "credit-card") {
      if (!PAYSTACK_PUBLIC_KEY) {
        setIsSubmitting(false);
        setErrorMessage(
          "Paystack public key is not configured. Please set VITE_PAYSTACK_PUBLIC_KEY."
        );
        return;
      }

      if (!isPaystackReady) {
        setIsSubmitting(false);
        setErrorMessage(
          "Please provide a valid email and select a fee type before paying with card."
        );
        return;
      }

      const pendingReference = paystackReference || generatePaymentReference();

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
            setLastPaymentMethod("credit-card");
            setIsSuccess(true);
            reset();
            regenerateReference();
            setShowCalendar(false);
            setErrorMessage(null);
          } catch (mutationError) {
            console.error("Error saving enrollment:", mutationError);
            setErrorMessage(
              "Payment succeeded but saving enrollment failed. Please contact support with your reference."
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        onClose: () => {
          setIsSubmitting(false);
          setErrorMessage("Payment was cancelled. Please try again.");
        },
      });

      return;
    }

    if (data.paymentMethod === "bank-transfer") {
      const pendingReference = generatePaymentReference();
      try {
        await submitEnrollment({
          ...enrollmentData,
          paymentReference: pendingReference,
          paymentStatus: "pending",
        }).unwrap();
        setPaymentReference(pendingReference);
        setLastPaymentMethod("bank-transfer");
        setIsSuccess(true);
        reset();
        setShowCalendar(false);
        setErrorMessage(null);
      } catch (mutationError) {
        console.error("Error saving bank transfer enrollment:", mutationError);
        setErrorMessage(
          mutationError instanceof Error
            ? mutationError.message
            : "Failed to save enrollment data. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setErrorMessage("Please select a payment method.");
    setIsSubmitting(false);
  };

  const SimpleCalendar = ({
    onSelectDate,
  }: {
    onSelectDate: (date: Date) => void;
  }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) =>
      new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (year: number, month: number) =>
      new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(
        <button
          key={i}
          type="button"
          onClick={() => onSelectDate(date)}
          className="h-8 w-8 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {i}
        </button>
      );
    }

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    return (
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded p-1 hover:bg-gray-200"
          >
            &lt;
          </button>
          <div>{format(currentMonth, "MMMM yyyy")}</div>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded p-1 hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="flex h-8 items-center justify-center">Su</div>
          <div className="flex h-8 items-center justify-center">Mo</div>
          <div className="flex h-8 items-center justify-center">Tu</div>
          <div className="flex h-8 items-center justify-center">We</div>
          <div className="flex h-8 items-center justify-center">Th</div>
          <div className="flex h-8 items-center justify-center">Fr</div>
          <div className="flex h-8 items-center justify-center">Sa</div>
          {days}
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6">
        <div className="max-w-2xl rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-medium text-green-800">
              {lastPaymentMethod === "credit-card"
                ? "Payment Successful!"
                : "Enrollment Submitted!"}
            </h3>
          </div>
          <p className="mt-2 text-green-700">
            {lastPaymentMethod === "credit-card"
              ? "Thank you for your payment. Your child has been successfully enrolled."
              : "Thank you for your enrollment submission. Please complete your bank transfer and upload the receipt. We will process your enrollment once payment is confirmed."}
          </p>
          {paymentReference && (
            <p className="mt-2 text-sm text-green-600">
              Reference: <strong>{paymentReference}</strong>
            </p>
          )}
        </div>
        <div className="mt-6 text-center">
          <Button
            onClick={() => {
              setIsSuccess(false);
              setPaymentReference(null);
              setErrorMessage(null);
              setLastPaymentMethod(null);
            }}
          >
            Make Another Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="min-h-screen bg-cover bg-center bg-no-repeat px-6 py-12"
    >
      <div>
        <Link
          to="/enroll"
          className="flex items-center gap-2 font-bold transition hover:-translate-x-2"
        >
          <ArrowLeft /> Back to Enroll
        </Link>
      </div>
      <div className="mx-auto w-[90%] rounded-lg bg-white shadow-lg sm:w-[60%]">
        <div className="border-b bg-slate-50 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            School Fee Payment & Enrollment
          </h2>
          <p className="mt-1 text-gray-600">
            Complete this form to pay school fees and enroll your child
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && (
              <div className="mx-6 mt-6 rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            )}
            <div className="space-y-8 p-6">
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
                        <FormLabel>
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
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
                        <FormLabel>
                          Phone Number <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="studentDob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Date of Birth <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              readOnly
                              value={
                                field.value ? format(field.value, "PP") : ""
                              }
                              onClick={() => setShowCalendar(!showCalendar)}
                              placeholder="Select date of birth"
                              className="cursor-pointer"
                            />
                            {showCalendar && (
                              <div className="absolute z-10 mt-1">
                                <SimpleCalendar
                                  onSelectDate={(date) => {
                                    field.onChange(date);
                                    setShowCalendar(false);
                                  }}
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
                        <FormLabel>
                          Gender <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                        <FormLabel>
                          Grade Level <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="">Select grade</option>
                            {gradeLevels.map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
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
                        <FormLabel>
                          Academic Year <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                    )}
                  />
                  <FormField
                    control={control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Semester <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="">Select semester</option>
                            {semesters.map((semester) => (
                              <option key={semester} value={semester}>
                                {semester}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Payment Information
                </h3>
                {feeType && selectedFee && (
                  <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Selected Fee:</span>{" "}
                      {selectedFee.name}
                    </p>
                    <p className="mt-1 text-lg font-bold text-blue-900">
                      Amount: ₦{selectedFee.amount.toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="feeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Fee Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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

                  <FormField
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Payment Method <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="">Select payment method</option>
                            <option value="credit-card">
                              Credit/Debit Card
                            </option>
                            <option value="bank-transfer">Bank Transfer</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentMethod === "credit-card" && (
                    <div className="mt-4 rounded-md border border-gray-200 p-4">
                      <h4 className="mb-4 font-medium">
                        Credit/Debit Card Details
                      </h4>
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Cardholder Name{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter cardholder name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Card Number{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Expiry Date{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  CVV <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    maxLength={4}
                                    placeholder="123"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank-transfer" && (
                    <div className="mt-4 rounded-md border border-gray-200 bg-slate-50 p-4">
                      <h4 className="mb-2 font-medium">
                        Bank Transfer Instructions
                      </h4>
                      <p className="mb-4 text-sm text-slate-600">
                        Please transfer the payment to the following bank
                        account and upload the receipt below:
                      </p>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Bank Name:</span> School
                          National Bank
                        </p>
                        <p>
                          <span className="font-medium">Account Name:</span>{" "}
                          School Education Fund
                        </p>
                        <p>
                          <span className="font-medium">Account Number:</span>{" "}
                          1234567890
                        </p>
                        <p>
                          <span className="font-medium">Routing Number:</span>{" "}
                          987654321
                        </p>
                        <p>
                          <span className="font-medium">Reference:</span>{" "}
                          Student&apos;s Full Name
                        </p>
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="receipt"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Upload Payment Receipt
                        </label>
                        <input
                          id="receipt"
                          type="file"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <hr className="border-gray-200" />

              <section>
                <h3 className="mb-4 text-lg font-medium">
                  Additional Information
                </h3>
                <FormField
                  control={control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Any special requirements or information
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional information here..."
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
                {isSubmitting ? "Processing..." : "Complete Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
